import AWS from 'aws-sdk';
import { Progress } from 'aws-sdk/lib/request';
import { List } from 'immutable';
import Joi from 'joi';

export interface APIRequest {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
}

export interface BucketSelector {
    bucketName: string;
}

export const authSchema = Joi.object().keys({
    accessKeyId: Joi.string().required(),
    secretAccessKey: Joi.string().required(),
    region: Joi.string().required(),
    bucketName: Joi.string().required()
});

export async function login(request: APIRequest) {
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

export interface ListRequest {}

export async function list(request: APIRequest & BucketSelector) {
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

export interface GetRequest {
    filename: string;
}
export function getFile(request: GetRequest & BucketSelector & APIRequest) {
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
        const query: AWS.S3.Types.GetObjectRequest = {
            Key: request.filename,
            Bucket: request.bucketName
        };
        return s3.headObject(query).promise();
    } catch (e) {
        throw new Error('Can not get file: ' + e.message);
    }
}

export function getSignedUrl(request: GetRequest & BucketSelector & APIRequest) {
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
        const query: AWS.S3.Types.GetObjectRequest = {
            Key: request.filename,
            Bucket: request.bucketName
        };
        return s3.getSignedUrl('getObject', query);
    } catch (e) {
        throw new Error('Can not get file: ' + e.message);
    }
}

export interface UploadRequest {
    file: File;
}
export function upload(
    request: UploadRequest & BucketSelector & APIRequest,
    onUploadProgress: (progress: Progress, file: File) => void
) {
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
        const query: AWS.S3.Types.PutObjectRequest = {
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

export interface DeleteRequest {
    files: string[];
}
export function deleteFile(request: DeleteRequest & BucketSelector & APIRequest) {
    try {
        const fileSchema = authSchema.keys({
            files: Joi.array().items(Joi.string().required())
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
        const query: AWS.S3.Types.DeleteObjectsRequest = {
            Delete: {
                Objects: request.files.map(f => ({ Key: f }))
            },
            Bucket: request.bucketName
        };
        return s3.deleteObjects(query).promise();
    } catch (e) {
        throw new Error('Can not delete file: ' + e.message);
    }
}
