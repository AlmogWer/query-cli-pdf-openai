# Query CLI PDF OpenAI Readme

This project includes code files for updating a Pinecone index with PDF document data and querying the Pinecone vector store using GPT-3.5 for question answering.

## Prerequisites

Before running the project, make sure you have the following:

- Node.js installed on your machine
- Pinecone API credentials (API key, environment, and index name)
- OpenAI API credentials

## Installation

1. Clone the project repository to your local machine.

2. Install the required dependencies by running the following command in the project directory:

```
npm install
```

3. Create a .env file in the project directory and add the following environment variables:

```
OPENAI_API_KEY=<your-openai-api-key>
PINECONE_API_KEY=<your-pinecone-api-key>
PINECONE_ENVIRONMENT=<your-pinecone-environment>
PINECONE_INDEX=<your-pinecone-index-name>
```

## Usage

To use the code files in this project, follow the instructions below:

```
npm run query <pdf-file-path> <question>
```

1. Replace <pdf-file-path> with the path to the PDF file you want to update the Pinecone index with. The code will split the PDF into chunks, embed the chunks using OpenAI's Embedding endpoint, and update the Pinecone index with the generated vectors.

### Note: You can find sample PDFs in the "docs" folder of this project.

2. Replace <question> with the question you want to ask. The code will query the Pinecone vector store using the provided question, retrieve the top matches, and if matches are found, ask GPT-3.5 for the answer.

## Sample Queries

Here are some sample queries you can run with the provided PDFs:

- This query will search for the author(s) of the study in the "quantom-computation.pdf" PDF.

```
npm run query /docs/quantom-computation.pdf "who wrote this study?"
```

- This query will provide an explanation of quantum computation suitable for a beginner, based on the "quantom-computation.pdf" PDF.

```
npm run query /docs/quantom-computation.pdf "Explain quantum computation to a first timer"

```

- This query will provide information about the definition of YouTube based on the "youtube.pdf" PDF.

```
npm run query /docs/youtube.pdf "what is YouTube?"

```

- This query will retrieve the references listed in the "socialmedia.pdf" PDF.

```
npm run query /docs/socialmedia.pdf "what is the definition of social media?"
```

- This query will provide the definition of social media based on the content of the "socialmedia.pdf" PDF.

```
npm run query /docs/socialmedia.pdf "What is the definition of social media?"
```

- This query will retrieve the names of the authors of the paper mentioned in the "Towards_Data_Science.pdf" PDF.

```
npm run query /docs/Towards_Data_Science.pdf "Who are the authors for this paper?"
```
