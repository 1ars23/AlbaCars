const sharp = require('sharp');
const fs = require('fs');

const compressAndSaveImage = async (image, refNumber) => {
  const compressedImage = await sharp(image.path)
    .resize({ width: 800 })
    .toBuffer();

  const imagePath = `./images/${refNumber}-${image.originalname}`;
  fs.writeFileSync(imagePath, compressedImage);

  return imagePath;
};


module.exports = {
  compressAndSaveImage,
};
