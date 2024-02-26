import multer from 'multer';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const readImage = (file) => {
  let image = {};
  image.data = Buffer.from(file.buffer);
  image.contentType = file.mimetype;
  return image;
};

export const readImages = (files) => {
  let images = [];
  files.forEach((file) => {
    images.push(readImage(file));
  });
  return images;
};
