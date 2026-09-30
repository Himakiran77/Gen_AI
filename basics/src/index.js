import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI();

async function run() {
  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: "How are You?"}]
  });
  console.log(response);
}

run();

