"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
const promises_1 = __importDefault(require("readline/promises"));
const process_1 = require("process");
dotenv_1.default.config();
const client = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const rl = promises_1.default.createInterface({
    input: process_1.stdin,
    output: process_1.stdout,
});
// This is our conversation memory
const messages = [
    {
        role: "system",
        content: "You are a helpful AI assistant. Remember the conversation context and answer naturally.",
    },
];
async function chat(userMessage) {
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
        }
        catch (error) {
            console.error("Error:", error);
        }
    }
    rl.close();
}
run();
//# sourceMappingURL=index.js.map