import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  upload_preset: "w8jdjkag",
  secure: true,
});

// console.log(cloudinary.config());

export const uploadImage = async (imagePath: string) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath);
    // console.log(result);
    return result.secure_url;
    // return result.public_id;
  } catch (error) {
    // console.error(error);
    return error;
  }
};

// export const getAssetInfo = async (publicId: string) => {
//   // Return colors in the response
//   const options = {
//     colors: true,
//   };

//   try {
//     // Get details about the asset
//     const result = await cloudinary.api.resource(publicId, options);
//     console.log(result);
//     return result;
//     // return result.colors;
//   } catch (error) {
//     console.error(error);
//     return error;
//   }
// };
