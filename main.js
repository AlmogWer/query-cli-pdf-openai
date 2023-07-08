import { PineconeClient } from "@pinecone-database/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import * as dotenv from "dotenv";
import { updatePinecone } from "./updatePinecone.js";
import { queryPineconeGpt } from "./queryPineconeGpt.js";
dotenv.config();
const [filePath, question] = process.argv.slice(2);
const loader = new PDFLoader(`./${filePath}`);
const docs = await loader.load();
const indexName = process.env.PINECONE_INDEX;
const client = new PineconeClient();
await client.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});
(async () => {
  await updatePinecone(client, indexName, docs);
  await queryPineconeGpt(client, indexName, question);
})();
