import express from 'express';

type Song = {
  title: string,
  durationSeconds: number
}

type Band = {
  name: string,
  genre: string,
  formed: number,
  members: number,
  songs: Song[]
}

async function getBands (req: express.Request, res: express.Response) {
  try {
    const response = await fetch('http://cw-api.eu-west-3.elasticbeanstalk.com/music/artists');
    const bands = await response.json() as Band[];
  
    res.status(200);
    res.send(bands);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
}; 

export {
  getBands,
};
