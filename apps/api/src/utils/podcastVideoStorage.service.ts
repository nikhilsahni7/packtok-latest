import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import config from "../config";

const getS3Client = () => {
  if (
    !config.s3.accessKeyId ||
    !config.s3.secretAccessKey ||
    !config.s3.region ||
    !config.s3.podcastBucket
  ) {
    throw new Error(
      "S3 config missing. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_PODCAST_BUCKET"
    );
  }

  return new S3Client({
    region: config.s3.region,
    credentials: {
      accessKeyId: config.s3.accessKeyId,
      secretAccessKey: config.s3.secretAccessKey,
    },
    ...(config.s3.endpoint ? { endpoint: config.s3.endpoint } : {}),
    forcePathStyle: config.s3.forcePathStyle,
  });
};

const buildPublicUrl = (key: string) => {
  if (config.s3.publicBaseUrl) {
    const base = config.s3.publicBaseUrl.replace(/\/+$/, "");
    return `${base}/${key}`;
  }

  if (config.s3.endpoint && config.s3.forcePathStyle) {
    const endpoint = config.s3.endpoint.replace(/\/+$/, "");
    return `${endpoint}/${config.s3.podcastBucket}/${key}`;
  }

  return `https://${config.s3.podcastBucket}.s3.${config.s3.region}.amazonaws.com/${key}`;
};

export const uploadPodcastVideoToS3 = async (
  fileBuffer: Buffer,
  mimeType: string,
  folder: string = "podcasts"
) => {
  const client = getS3Client();
  const key = `${folder}/${uuid()}`;

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: config.s3.podcastBucket,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
      })
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown S3 error";
    throw new Error(`S3 podcast video upload failed: ${message}`);
  }

  return buildPublicUrl(key);
};
