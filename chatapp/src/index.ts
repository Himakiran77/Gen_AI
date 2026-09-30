import OpenAI from "openai";
import dotenv from "dotenv";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const rl = readline.createInterface({
  input,
  output,
});

// This is our conversation memory
const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "system",
    content:
      "You are a helpful AI assistant. Remember the conversation context and answer naturally.",
  },
];

async function chat(userMessage: string) {
  // Add user's message to conversation
  messages.push({
    role: "user",
    content: userMessage,
  });

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  const assistantMessage = response.choices[0]?.message;

  if (!assistantMessage) {
    throw new Error("No response received from OpenAI");
  }

  // Add AI response to conversation
  messages.push(assistantMessage);

  return assistantMessage.content;
}

async function run() {
  console.log("🤖 ChatGPT Clone");
  console.log("Type 'exit' to quit.\n");

  while (true) {
    const userMessage = await rl.question("You: ");

    if (userMessage.toLowerCase() === "exit") {
      break;
    }

    if (!userMessage.trim()) {
      continue;
    }

    try {
      const answer = await chat(userMessage);

      console.log(`AI: ${answer}\n`);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  rl.close();
}

run();