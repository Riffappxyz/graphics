// /api/create-gif/index.ts
import { createCanvas, Image } from 'canvas';
import GIFEncoder from 'gifencoder';
import { NFTStorage, File } from 'nft.storage';

const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY });

export default async function handler(req, res) {
    const { imageBase64, text } = req.body;

    // Convert the base64 string back to a buffer
    const imageBuffer = Buffer.from(imageBase64, 'base64');

    // Create a canvas and a context
    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext('2d');

    // Load the image onto the canvas
    const img = new Image();
    img.src = imageBuffer;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Create a GIFEncoder
    const encoder = new GIFEncoder(500, 500);
    const stream = encoder.createReadStream();
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(500);
    encoder.setQuality(10);

    // Draw the animated text onto the canvas and add the frames to the GIF
    for (let i = 0; i < 10; i++) {
        ctx.fillStyle = 'white';
        ctx.fillText(text, 50, 50 + i * 10);
        encoder.addFrame(ctx);
    }

    encoder.finish();

    // Convert the stream to a buffer
    const gifBuffer = await new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    }) as any;

    // Upload to nft.storage
    const cid = await client.storeBlob(new File([gifBuffer], 'nft.gif', { type: 'image/gif' }))

    res.status(200).json({ cid: "placeholder" });
}
