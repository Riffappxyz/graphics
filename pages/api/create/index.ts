// /api/main/index.ts
import axios from 'axios';
import fetch from 'node-fetch';
import { Logger, ILogObj } from "tslog"
import getAppUrl from 'utils/getAppUrl';

const log: Logger<ILogObj> = new Logger({ type: "json", hideLogPositionForProduction: true })

export default async function handler(req, res) {
  console.log("SWEETS GET QUERY PARAMS", req.query)
  const {collectorProfilePic, musicianProfilePic, albumArtArray, collectorHandle, musicianHandle} = req.query

  const imgBase = "https://nftstorage.link/ipfs/"
  const albumArt1 = imgBase + "bafybeib6bbupneqpw2jz7q7u7ej7h6yxbbzow35swbf2pn4y6lucj4ay4y"
  const albumArt2 = imgBase + "bafybeicuwmhzp5wlopcnqm4vyjbpff5rgv4ujugy7ew5dv7v6j2ggbwaki"
  const albumArt3 = imgBase + "bafybeidbtbmgoj4n4q56fjcxuxsp3bhjtl3w6bvvzbzhrjtv6qoativ3ou"
  const albumArt = albumArtArray.split(',');

  // Include the full URL of your application
  const appUrl = getAppUrl();

  // Call the /api/create-gif endpoint to create the GIF and upload it to nft.storage
  try {
    const response2 = await axios.post(`${appUrl}/api/create-image`, { 
      collectorSrc: collectorProfilePic, 
      text: 'Top Collector', 
      musicianSrc: musicianProfilePic,
      collectorName: collectorHandle ? "@" + collectorHandle : "", 
      musicianName: musicianHandle ? "@" + musicianHandle : "", 
      albumImageStrings: albumArt || [albumArt1, albumArt2, albumArt3]
    });
    const { cid } = response2.data;
    console.log('Handler function finished', cid);
    res.status(200).json({ cid, imageUrl: imgBase + cid });
  } catch (error) {
    console.error('Failed to create gif', error);
    return res.status(200).json({ message: 'Failed to create gif', error });
  }
}
