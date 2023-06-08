import express from 'express';
// import interfaces

async function getAllProjects (req: express.Request, res: express.Response) {
  try {
    // const response = await fetch('http://cw-api.eu-west-3.elasticbeanstalk.com/music/artists');
    // const bands = await response.json() as Band[];
    const userSub = req.auth?.payload.sub || '';
    console.log(userSub)
    console.log(req.auth)
    // console.log(req)

    res.status(200);
    res.send([]);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
}; 

async function getProject (req: express.Request, res: express.Response) {
  try {
    // const response = await fetch('http://cw-api.eu-west-3.elasticbeanstalk.com/music/artists');
    // const bands = await response.json() as Band[];
  
    // res.status(200);
    // res.send(bands);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
}; 

export {
  getAllProjects,
  getProject,
};
