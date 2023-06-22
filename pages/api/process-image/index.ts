// /api/process-image/index.ts
import fetch from 'node-fetch';
import sharp from 'sharp';

export default async function handler(req, res) {
  const { url } = req.query;

  // Fetch the image
  const response = await fetch(url);
  const buffer = await response.buffer();

  // Convert the image to a suitable format using sharp
  const processedImage = await sharp(buffer).toBuffer();

  // Send the processed image as a base64 string
  res.status(200).send(processedImage.toString('base64'));
}
