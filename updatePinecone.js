import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const updatePinecone = async (client, indexName, docs) => {
  console.log("Retrieving Pinecone index...");
  const index = client.Index(indexName);
  console.log(`Pinecone index retrieved: ${indexName}`);

  const { metadata, pageContent } = docs[0];
  const { source: txtPath } = metadata;
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1500,
    chunkOverlap: 100,
  });
  console.log("Splitting PDF into chunks");
  const chunks = await textSplitter.createDocuments([pageContent]);
  console.log(`Text split into ${chunks.length} chunks`);

  console.log(
    `Calling OpenAI's Embedding endpoint with ${chunks.length} text chunks...`
  );
  const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
    chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
  );
  console.log("Finished embedding documents");

  console.log(`Creating ${chunks.length} vectors`);
  const batchSize = 100;
  const vectors = [];

  for (let idx = 0; idx < chunks.length; idx++) {
    const chunk = chunks[idx];
    const vector = {
      id: `${txtPath}_${idx}`,
      values: embeddingsArrays[idx],
      metadata: {
        ...chunk.metadata,
        loc: JSON.stringify(chunk.metadata.loc),
        pageContent: chunk.pageContent,
        txtPath: txtPath,
      },
    };
    vectors.push(vector);

    if (vectors.length === batchSize || idx === chunks.length - 1) {
      await index.upsert({
        upsertRequest: {
          vectors: vectors,
        },
      });
      vectors.length = 0;
    }
  }

  console.log(`Pinecone index updated with ${chunks.length} vectors`);
};
