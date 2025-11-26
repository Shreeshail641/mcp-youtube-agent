import OpenAI from "openai";
import { youtubeAPI } from "./youtube.js";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function handleMcpRequest(body) {
  const { tool, input } = body || {};

  console.log("MCP request tool:", tool);

  if (!global.ACCESS_TOKEN) {
    return { error: "User must authenticate via /auth/login first." };
  }

  try {
    switch (tool) {
      case "youtube.search": {
        if (!input || !input.query) {
          return { error: "Missing 'query' for youtube.search." };
        }
        return await youtubeAPI.search(global.ACCESS_TOKEN, input.query);
      }

      case "youtube.getHistory": {
        return await youtubeAPI.history(global.ACCESS_TOKEN);
      }

      case "youtube.recommendFromHistory": {
        const history = await youtubeAPI.history(global.ACCESS_TOKEN);

        const titles = history.items
          ?.map((item) => item.snippet?.title)
          .filter(Boolean)
          .slice(0, 15)
          .join("\n");

        if (!titles) {
          return { error: "No history found to generate recommendations." };
        }

        const completion = await client.chat.completions.create({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "user",
              content:
                `Here is the user's recent YouTube activity (one title per line):\n` +
                titles +
                `\n\nBased on this history, recommend 5 new YouTube videos or topics they might like. ` +
                `For each, give a short title and one-line reason.`
            }
          ]
        });

        return { recommendations: completion.choices[0].message.content };
      }

      default:
        return { error: `Unknown MCP tool: ${tool}` };
    }
  } catch (err) {
    console.error("MCP error:", err);
    // 🔥 send the real error message back to the frontend
    return { error: err.message || String(err) };
  }
}
