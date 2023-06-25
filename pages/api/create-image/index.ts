// /api/create-image/index.ts
import { createCanvas, Image } from 'canvas';
import { NFTStorage, File } from 'nft.storage';

const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY });

export default async function handler(req, res) {
    const { imageBase64, text } = req.body;

    // Convert the base64 string back to a buffer
    const imageBuffer = Buffer.from(imageBase64, 'base64');

    // Create a canvas and a context
    const canvas = createCanvas(1600, 900);
    const ctx = canvas.getContext('2d');

    // Fill the background with the specified green color
    ctx.fillStyle = '#3d7267';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load the image onto the canvas, centered vertically on the left side
    const img = new Image();
    img.src = imageBuffer;
    const imgWidth = 400; // update if needed
    const imgHeight = 400; // update if needed
    const imgX = (canvas.width - imgWidth) / 3;  // center image in the first third
    const imgY = (canvas.height - imgHeight) / 2;

    // Save the current state
    ctx.save();

    // Clip the image as a circle
    ctx.beginPath();
    ctx.arc(imgX + imgWidth / 2, imgY + imgHeight / 2, imgWidth / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    // Draw the image
    ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

    // Reset clipping region
    ctx.restore();

    // Draw the text onto the canvas on the right side, vertically centered
    ctx.fillStyle = 'white';
    ctx.font = '50px sans-serif'; // change as needed
    const textX = imgX + imgWidth + 50; // start text a little right from the image
    const textY = (canvas.height / 2); // approx center, adjust as needed
    ctx.textBaseline = 'middle'; // ensure text is centered vertically
    ctx.fillText(text, textX, textY);

    // Convert the canvas to a PNG buffer
    const pngBuffer = canvas.toBuffer('image/png');

    // Upload to nft.storage
    const cid = await client.storeBlob(new File([pngBuffer], 'nft.png', { type: 'image/png' }))

    res.status(200).json({ cid });
}
