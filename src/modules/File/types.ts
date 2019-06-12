import AWS from 'aws-sdk';

export type AWSFile = AWS.S3.Types.GetObjectOutput & { Key: string; url?: string };

export interface AWSFileCollection {
    [key: string]: AWSFile;
}
