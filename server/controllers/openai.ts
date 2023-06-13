import express from 'express';
import { getProjectPublicFromDB } from '../models/projects';
import * as dotenv from "dotenv";

dotenv.config();

const PROMPT_INTRO = process.env.PROMPT || '';

export const getProjectRating = async function (
  req: express.Request,
  res: express.Response
) {
  try {
    const projectId = Number(req.params.projectId);
    const projectData = await getProjectPublicFromDB(projectId);
    if (!projectData) throw new Error('Project not found.');

    const prompt = PROMPT_INTRO + JSON.stringify(projectData);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'assistant',
            content: prompt
          }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0,
        top_p: 1,
        n: 1,
        stream: false,
      }),
    });

    const responseData = await response.json();
    if (!responseData.error) {
      const rating = Number(responseData.choices[0].message.content);
      res.status(201);
      res.send({ rating });
    } else res.sendStatus(400);

  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
};