import multer from 'multer';

// Create a multer storage engine that stores files in memory
const storage = multer.memoryStorage();
// Create a multer middleware for file upload using the memory storage engine
export const upload = multer({ storage });

// Function to read a single image file and convert it to an object
export const readImage = (file) => {
    let image = {};
    image.data = Buffer.from(file.buffer); // Store the file data as a buffer
    image.contentType = file.mimetype; // Store the file content type
    return image;
};

// Function to read multiple image files and convert them to an array of objects
export const readImages = (files) => {
    let images = [];
    files.forEach((file) => {
        images.push(readImage(file)); // Convert each file to an image object and add it to the array
    });
    return images;
};
