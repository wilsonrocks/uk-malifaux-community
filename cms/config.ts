import * as env from "env-var";

export const cloudinaryConfig = {
  cloudinary: {
    cloudName: env.get("CLOUDINARY_CLOUD_NAME").asString(),
    apiKey: env.get("CLOUDINARY_API_KEY").asString(),
    apiSecret: env.get("CLOUDINARY_API_SECRET").asString(),
    folder: env.get("CLOUDINARY_API_FOLDER").asString(),
  },
} as {
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    folder: string;
  };
};
