import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 3001,
  jwt: {
    secret: process.env.JWT_SECRET!,
    accessExpiration: "15m",
    refreshExpiration: "7d",
  },
  supabase: {
    url: process.env.SUPABASE_URL!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    jwtSecret: process.env.SUPABASE_JWT_SECRET!,
    image_bucket: process.env.SUPABASE_IMAGE_BUCKET!,
    video_bucket: process.env.SUPABASE_VIDEO_BUCKET!,
    doc_bucket: process.env.SUPABASE_DOC_BUCKET!,
    privateBuckets: process.env.SUPABASE_BUCKET_PRIVATE === "true",
  },
  s3: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    region: process.env.AWS_REGION || "",
    podcastBucket: process.env.AWS_PODCAST_BUCKET || "",
    publicBaseUrl: process.env.AWS_PODCAST_PUBLIC_BASE_URL || "",
    endpoint: process.env.AWS_S3_ENDPOINT || "",
    forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === "true",
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY!,
    fromEmail: process.env.RESEND_FROM_EMAIL!,
  },
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV || "development",
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || "",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "",
  },
  // Domain to scope the refresh cookie to (e.g., .nikhilsahni.xyz)
  cookieDomain: process.env.COOKIE_DOMAIN,
};

export default config;
