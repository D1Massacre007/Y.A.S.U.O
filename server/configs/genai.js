import { genai } from "google-genai";

// The client automatically reads the GEMINI_API_KEY from environment variables
const client = new genai.Client();

export default client;
