const imagemin = require('imagemin');

const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const sharp = require('sharp');


/**
 * Function to resize an image
 * 
 * @param {Buffer} buffer - The buffer of the image which needs to be resized
 * @param {Number} width - The width you wish to resize to
 * @param {Number} height - The height you wish to resize to
 * 
 * @returns {Promise} - A promise which rejects if resize fails and resolves with the resized image buffer
 */
const resize = (buffer, width, height) => {
    return new Promise((resolve, reject) => {
        sharp(buffer)
            .rotate()
            .resize(width, height)
            .toBuffer()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            })
    });
}

/**
 * Function to compress an image
 * 
 * @param {Buffer} buffer - The buffer of the image which needs to be resized
 * 
 * @returns {Promise} - A promise which rejects if compression fails and resolves with the compressed image
 */
const compress = (buffer) => {
    return new Promise((resolve, reject) => {
        imagemin.buffer(buffer, {
            plugins: [
                imageminJpegtran(),
                imageminPngquant(),
            ]
        })
            .then((compressedFile) => {
                resolve(compressedFile);
            })
            .catch((error) => {
                reject(error)
            })
    });
}


module.exports = {
    resize,
    compress
}