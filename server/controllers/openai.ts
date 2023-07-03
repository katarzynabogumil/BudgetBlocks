import express from 'express';
import { getProjectPublicFromDB } from '../models/projects';
import * as dotenv from "dotenv";

dotenv.config();

const env = process.env.NODE_ENV;
const isDevelopment = env === 'development';

const CONTEXT = `
  Context:
  We are a budgeting app that helps you keep your budget for a specific goal in check, for example: a trip, an event or a home renovation. It allows you to set up new projects with a set budget goal with other users, add different expenses or even different options for each expense and compare their effect on the overall cost.
`;

const RATING_PROMPT = CONTEXT + `
  Please answer with a number from 1 to 4 which should represent a rating for the budget for the project with the following information. Number 1 means that the budget for this project is small and number 4 means that it is big.  Return only a single number.
  If you don't have enough information to provide a rating, answer with 0.
  Project information: 
`;

const CATEGORY_PROMPT = CONTEXT + `
  Please answer with 1-3 category names which might be missing in the budget for the project with the following information. Return only max. three words, separated with commas.
  Project information: 
`;

const URL = 'https://api.openai.com/v1/chat/completions';
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
};
const CONF = {
  model: 'gpt-3.5-turbo',
  temperature: 0,
  top_p: 1,
  n: 1,
  stream: false,
};

async function getProjectRating
  (
    req: express.Request,
    res: express.Response
  ): Promise<void> {
  try {
    const projectId = Number(req.params.projectId);
    const projectData = await getProjectPublicFromDB(projectId);
    if (!projectData) throw new Error('Project not found.');

    const prompt = RATING_PROMPT + JSON.stringify(projectData);

    let rating = 0;
    if (isDevelopment) {
      const response = await fetch(URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          messages: [
            {
              role: 'assistant',
              content: prompt
            }
          ],
          ...CONF
        }),
      });

      const responseData = await response.json();
      if (!responseData.error) {
        rating = Number(responseData.choices[0].message.content);
        res.status(200);
        res.send({ rating });
      } else {
        console.log(responseData);
        res.sendStatus(400);
        return;
      }
    } else {
      res.status(200);
      res.send({ rating });
    }

  } catch (e) {
    console.log('Error: ', e)
    res.sendStatus(500);
  }
}

async function getMissingCategories
  (
    req: express.Request,
    res: express.Response
  ): Promise<void> {
  try {
    const projectId = Number(req.params.projectId);
    const projectData = await getProjectPublicFromDB(projectId);
    if (!projectData) throw new Error('Project not found.');

    const prompt = CATEGORY_PROMPT + JSON.stringify(projectData);

    let categories = '';
    if (isDevelopment) {
      const response = await fetch(URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          messages: [
            {
              role: 'assistant',
              content: prompt
            }
          ],
          ...CONF
        }),
      });

      const responseData = await response.json();
      if (!responseData.error) {
        categories = responseData.choices[0].message.content;
      } else {
        console.log(responseData);
        res.sendStatus(400);
        return;
      }
    }
    res.status(200);
    res.send({ categories });

  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
}

export {
  getProjectRating,
  getMissingCategories,
};
