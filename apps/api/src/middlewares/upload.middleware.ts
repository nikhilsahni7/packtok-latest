import multer from "multer";

const storage = multer.memoryStorage();

export const productMediaUpload = multer({
  storage,
  limits: { fileSize: 40 * 1024 * 1024 }, // 40MB
}).fields([
  { name: "images", maxCount: 5 },
  { name: "video", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
  { name: "videoThumbnail", maxCount: 1 },
]);

export const cvUpload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB CV size limit
}).single("cv");

export const profileImageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB profile image limit
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
}).single("profile_image");

export const podcastMediaUpload = multer({
  storage,
  limits: { fileSize: 800 * 1024 * 1024 }, // 800MB for video
}).fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

export const seriesCoverUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for cover image
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
}).single("coverImage");

export const machineryInstallerUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter: (req, file, cb) => {
    if (
      file.fieldname === "machineImages" &&
      !file.mimetype.startsWith("image/")
    ) {
      return cb(new Error("machineImages must be image files"));
    }
    if (
      file.fieldname === "machineVideos" &&
      !file.mimetype.startsWith("video/")
    ) {
      return cb(new Error("machineVideos must be video files"));
    }
    cb(null, true);
  },
}).fields([
  { name: "machineImages", maxCount: 3 },
  { name: "machineVideos", maxCount: 2 },
]);

export const articleCoverUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for cover image
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
}).single("coverImageFile");

declare global {
  namespace Express {
    interface Request {
      files?:
        | {
            [fieldname: string]: Express.Multer.File[];
          }
        | Express.Multer.File[];
    }
  }
}
