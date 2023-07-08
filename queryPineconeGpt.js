import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";

export const queryPineconeGpt = async (client, indexName, question) => {
  console.log("Querying Pinecone vector store");
  const index = client.Index(indexName);
  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);
  const queryRequest = {
    topK: 10,
    vector: queryEmbedding,
    includeMetadata: true,
    includeValues: true,
  };

  let queryResponse = await index.query({ queryRequest });
  console.log(`Found ${queryResponse.matches.length} matches`);
  console.log(`Asking OpenAI - " ${question} "`);

  if (queryResponse.matches.length) {
    const llm = new OpenAI({});
    const chain = loadQAStuffChain(llm);

    const concatenatedPageContent = queryResponse.matches
      .map((match) => match.metadata.pageContent)
      .join(" ");

    const inputDocuments = [
      new Document({ pageContent: concatenatedPageContent }),
    ];
    const result = await chain.call({
      input_documents: inputDocuments,
      question,
    });

    console.log(`Answer: ${result.text}`);
    await index.delete1({ deleteAll: true });
  } else {
    console.log("Since there are no matches, GPT-3.5 will not be queried.");
  }
};
