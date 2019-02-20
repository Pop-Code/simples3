import AWS from 'aws-sdk';
import { Progress } from 'aws-sdk/lib/request';
import Joi from 'joi';
import { List } from 'immutable';

export const authSchema = Joi.object().keys({
    accessKeyId: Joi.string().required(),
    secretAccessKey: Joi.string().required(),
    region: Joi.string().required(),
    bucketName: Joi.string().required()
});

export async function list(request: any) {
    try {
        const validation = Joi.validate(request, authSchema, {
            abortEarly: false,
            allowUnknown: true
        });
        if (validation.error) {
            throw validation.error;
        }

        const s3 = new AWS.S3({
            accessKeyId: request.accessKeyId,
            secretAccessKey: request.secretAccessKey,
            region: request.region
        });

        const paginator = async (accumulator: List<any>, data: any): Promise<List<any>> => {
            const query: any = {
                Bucket: data.bucketName
            };
            const token: string = data.token;
            if (token) {
                query.ContinuationToken = token;
            }
            const s3Response = await s3.listObjectsV2(query).promise();
            const listconcat = List(s3Response.Contents as any);
            accumulator = accumulator.concat(listconcat);

            if (s3Response.IsTruncated) {
                data.token = s3Response.NextContinuationToken;
                accumulator = await paginator(accumulator, data);
            }

            return accumulator;
        };

        const resultsSet = await paginator(List(), request);
        const response = {
            data: resultsSet,
            count: resultsSet.size
        };
        return response;
    } catch (e) {
        throw new Error('Can not list files: ' + e.message);
    }
}

export async function login(request: any) {
    const validation = Joi.validate(request, authSchema, {
        abortEarly: false,
        allowUnknown: true
    });
    if (validation.error) {
        throw validation.error;
    }

    const sts = new AWS.STS({
        accessKeyId: request.accessKeyId,
        secretAccessKey: request.secretAccessKey,
        region: request.region
    });

    const identity = await sts.getCallerIdentity().promise();

    return identity;
}

export function getFile(request: any) {
    try {
        const fileSchema = authSchema.keys({
            filename: Joi.string().required()
        });
        const validation = Joi.validate(request, fileSchema, {
            abortEarly: false,
            allowUnknown: true
        });
        if (validation.error) {
            throw validation.error;
        }
        const s3 = new AWS.S3({
            accessKeyId: request.accessKeyId,
            secretAccessKey: request.secretAccessKey,
            region: request.region
        });
        const query: any = {
            Key: request.filename,
            Bucket: request.bucketName
        };
        if (!request.download) {
            return s3.headObject(query).promise();
        } else {
            return s3.getObject(query).promise();
        }
    } catch (e) {
        throw new Error('Can not get file: ' + e.message);
    }
}

export function upload(request: any, onUploadProgress: (progress: Progress, file: File) => void) {
    const uploadSchema = authSchema.keys({
        file: Joi.object()
            .type(File)
            .required()
    });

    const validation = Joi.validate(request, uploadSchema, {
        abortEarly: false,
        allowUnknown: true
    });

    if (validation.error) {
        throw validation.error;
    }

    try {
        const s3 = new AWS.S3({
            accessKeyId: request.accessKeyId,
            secretAccessKey: request.secretAccessKey,
            region: request.region
        });
        const query: any = {
            Body: request.file,
            Key: request.file.name,
            Bucket: request.bucketName
        };
        return s3
            .upload(query)
            .on('httpUploadProgress', progress => {
                onUploadProgress(progress, request.file);
            })
            .promise();
    } catch (e) {
        throw new Error('Can not upload files: ' + e.message);
    }
}
