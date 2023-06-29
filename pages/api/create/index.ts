// /api/main/index.ts
import axios from 'axios';
import fetch from 'node-fetch';
import { Logger, ILogObj } from "tslog"
import getAppUrl from 'utils/getAppUrl';

const log: Logger<ILogObj> = new Logger({ type: "json", hideLogPositionForProduction: true })

export default async function handler(req, res) {
  log.debug(`STARTING FX`)

  const imgBase = "https://nftstorage.link/ipfs/"
  const collectorProfilePic = imgBase + "Qmecvfw8J8eRNwDNhtsqr7dGSKJVa31JPbvx8hBm3dWidh";
  const musicianProfilePic = imgBase + "QmXDDZtRrKgbncad8wqRYM73o8PX58ABxiWAJkJGxEuENx";
  const albumArt1 = imgBase + "bafybeib6bbupneqpw2jz7q7u7ej7h6yxbbzow35swbf2pn4y6lucj4ay4y"
  const albumArt2 = imgBase + "bafybeicuwmhzp5wlopcnqm4vyjbpff5rgv4ujugy7ew5dv7v6j2ggbwaki"
  const albumArt3 = imgBase + "bafybeidbtbmgoj4n4q56fjcxuxsp3bhjtl3w6bvvzbzhrjtv6qoativ3ou"

  // Include the full URL of your application
  const appUrl = getAppUrl();

  // Call the /api/process-image endpoint to fetch and process the image
  let processImgResponse = await fetch(`${appUrl}/api/process-image?url=${encodeURIComponent(collectorProfilePic)}`);
  const collectorImageBase64 = await processImgResponse.text();
  processImgResponse = await fetch(`${appUrl}/api/process-image?url=${encodeURIComponent(musicianProfilePic)}`);
  const musicianImageBase64 = await processImgResponse.text();

  // Call the /api/create-gif endpoint to create the GIF and upload it to nft.storage
  try {
    const response2 = await axios.post(`${appUrl}/api/create-image`, { 
      collectorImage: collectorImageBase64, 
      text: '#1 Top Collector', 
      musicianImage: musicianImageBase64,
      collectorName: "@sweetman.lens", 
      musicianName: "@nena1992.lens", 
      albumImageStrings: [albumArt1,albumArt2,albumArt3]
    });
    const { cid } = response2.data;
    console.log('Handler function finished', cid);
    res.status(200).json({ cid, imageUrl: imgBase + cid });
  } catch (error) {
    console.error('Failed to create gif', error);
    return res.status(200).json({ message: 'Failed to create gif', error });
  }
}
