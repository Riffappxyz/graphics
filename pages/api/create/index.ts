// /api/main/index.ts
import axios from 'axios';
import fetch from 'node-fetch';
import { Logger, ILogObj } from "tslog"

const log: Logger<ILogObj> = new Logger({ type: "json", hideLogPositionForProduction: true })

export default async function handler(req, res) {
  log.debug(`STARTING FX`)

  const profilePic = "https://nftstorage.link/ipfs/Qmecvfw8J8eRNwDNhtsqr7dGSKJVa31JPbvx8hBm3dWidh";

  // Include the full URL of your application
  const vercel = process.env.VERCEL_URL
  const appUrl = vercel ?`https://${vercel}` : 'http://localhost:3000';

  // Call the /api/process-image endpoint to fetch and process the image
  const response1 = await fetch(`${appUrl}/api/process-image?url=${encodeURIComponent(profilePic)}`);
  console.log("response1", response1)
  const imageBase64 = await response1.text();
  console.log("imageBase64", imageBase64)

  // Call the /api/create-gif endpoint to create the GIF and upload it to nft.storage
  try {
    const response2 = await axios.post(`${appUrl}/api/create-gif`, { imageBase64, text: 'Top Collector' });
    const { cid } = response2.data;
    console.log('Handler function finished', cid);
    res.status(200).json({ cid });
  } catch (error) {
    console.error('Failed to create gif', error);
    return res.status(200).json({ message: 'Failed to create gif', error });
  }
}
