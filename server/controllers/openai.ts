import { Configuration, OpenAIApi } from 'openai';
import * as dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const dmAi = new OpenAIApi(configuration);
const assistantAi = new OpenAIApi(configuration);

export {
  dmAi,
  assistantAi,
}

const initialPrompt = process.env.INITIAL_PROMPT;

async function sendAiPrompt(req, res) {

  let userPrompt = await req.body.prompt;
  console.log('userPrompt: ', userPrompt);
  try {
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
            // This will be replaced by initialPrompt, to give the AI a starting point.
            // For testing purposes, we'll just use a simple prompt.
            content: 'Respond ONLY with a single random word, no matter what.'
            // content: initialPrompt,
          },
          {
            // This is what the user types in:
            role: 'user',
            content: userPrompt,
          }
        ],
        // max_tokens: 64,
        model: 'gpt-3.5-turbo',
        temperature: 0,
        top_p: 1,
        n: 1,
        // Streaming to frontend is not working yet, so I'll just send the response as JSON for now.
        // stream: true,
        stream: false,
      }),
    });
    const responseData = await response.json();
    console.log('data: ', responseData.choices[0].message.content);
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

// Player ${player.id}: ${prompt}`;
