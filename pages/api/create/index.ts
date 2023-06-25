// /api/main/index.ts
import axios from 'axios';
import fetch from 'node-fetch';
import { Logger, ILogObj } from "tslog"

const log: Logger<ILogObj> = new Logger({ type: "json", hideLogPositionForProduction: true })

export default async function handler(req, res) {
  log.debug(`STARTING FX`)

  const collectorProfilePic = "https://nftstorage.link/ipfs/Qmecvfw8J8eRNwDNhtsqr7dGSKJVa31JPbvx8hBm3dWidh";
  const musicianProfilePic = "https://nftstorage.link/ipfs/QmXDDZtRrKgbncad8wqRYM73o8PX58ABxiWAJkJGxEuENx";

  // Include the full URL of your application
  const vercel = process.env.VERCEL_URL
  const appUrl = vercel ?`https://${vercel}` : 'http://localhost:3000';

  // Call the /api/process-image endpoint to fetch and process the image
  let processImgResponse = await fetch(`${appUrl}/api/process-image?url=${encodeURIComponent(collectorProfilePic)}`);
  const collectorImageBase64 = await processImgResponse.text();
  processImgResponse = await fetch(`${appUrl}/api/process-image?url=${encodeURIComponent(musicianProfilePic)}`);
  const musicianImageBase64 = await processImgResponse.text();

  // Call the /api/create-gif endpoint to create the GIF and upload it to nft.storage
  try {
    const response2 = await axios.post(`${appUrl}/api/create-image`, { imageBase64: collectorImageBase64, text: '#1 Top Collector', musicianImageBase64 });
    const { cid } = response2.data;
    console.log('Handler function finished', cid);
    res.status(200).json({ cid });
  } catch (error) {
    console.error('Failed to create gif', error);
    return res.status(200).json({ message: 'Failed to create gif', error });
  }
}
