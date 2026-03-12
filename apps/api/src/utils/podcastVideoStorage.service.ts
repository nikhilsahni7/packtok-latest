import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

const buildStorageReference = (bucket: string, key: string) => {
  return `s3://${bucket}/${key}`;
};

const parseS3Reference = (
  reference: string
): { bucket: string; key: string } | null => {
  if (!reference) return null;

  if (reference.startsWith("s3://")) {
    const withoutProtocol = reference.replace("s3://", "");
    const slashIndex = withoutProtocol.indexOf("/");
    if (slashIndex <= 0) return null;
    const bucket = withoutProtocol.slice(0, slashIndex);
    const key = withoutProtocol.slice(slashIndex + 1);
    if (!bucket || !key) return null;
    return { bucket, key };
  }

  try {
    const parsed = new URL(reference);
    const pathname = parsed.pathname.replace(/^\/+/, "");
    if (!pathname) return null;

    // Path-style format: https://host/bucket/key
    if (pathname.startsWith(`${config.s3.podcastBucket}/`)) {
      return {
        bucket: config.s3.podcastBucket,
        key: pathname.slice(config.s3.podcastBucket.length + 1),
      };
    }

    // Virtual-hosted/custom-domain format where path is already key.
    return { bucket: config.s3.podcastBucket, key: pathname };
  } catch {
    return null;
  }
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

  return buildStorageReference(config.s3.podcastBucket, key);
};

export const getSignedPodcastPlaybackUrl = async (reference: string) => {
  const parsed = parseS3Reference(reference);
  if (!parsed) return reference;

  const client = getS3Client();
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: parsed.bucket,
      Key: parsed.key,
    }),
    { expiresIn: config.s3.signedUrlExpiresSeconds }
  );
};
