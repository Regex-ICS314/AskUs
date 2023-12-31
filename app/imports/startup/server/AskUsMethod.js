import { Meteor } from 'meteor/meteor';
import crypto from 'crypto';
import { Roles } from 'meteor/alanning:roles';
import { AskUs } from '../../api/askus/AskUs.js';
import openai from './utils/OpenAiClient';
import { MAX_TOKENS } from './utils/Constants';

/* eslint-disable no-console */

// Helper function to split text into chunks
function splitIntoChunks(text, maxTokens) {
  const chunks = [];
  let startIndex = 0;
  while (startIndex < text.length) {
    let endIndex = startIndex + maxTokens;
    if (endIndex > text.length) {
      endIndex = text.length;
    }
    chunks.push(text.substring(startIndex, endIndex));
    startIndex = endIndex;
  }
  return chunks;
}

// Helper function to average embeddings
function averageEmbeddings(embeddings) {
  const summedEmbedding = embeddings.reduce((acc, embedding) => acc.map((value, idx) => value + embedding[idx]), new Array(embeddings[0].length).fill(0));
  return summedEmbedding.map(value => value / embeddings.length);
}

Meteor.methods({
  generateAndStoreEmbeddings: async function () {
    // Fetch all articles that either don't have an embedding or might need an update
    const articles = AskUs.collection.find({}).fetch();
    const updatePromises = articles.map(async (article) => {
      console.log(`Processing article with Filename: ${article.filename}`); // Log when processing starts
      const articleText = article.article_text;
      const currentTextHash = crypto.createHash('md5').update(articleText).digest('hex');

      // Check if embedding exists and if the text has changed
      const needsUpdate = !article.embedding || article.textHash !== currentTextHash;

      if (!needsUpdate) {
        // If the article doesn't need an update, skip to the next one
        return Promise.resolve();
      }

      // If the article text is too long, split into chunks and get embeddings for each chunk
      const chunks = splitIntoChunks(articleText, MAX_TOKENS);
      const embeddingsPromises = chunks.map(async (chunk, index) => {
        console.log(`Generating embedding for chunk ${index + 1}/${chunks.length} of article with ID: ${article._id}`); // Log for each chunk

        try {
          const response = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: chunk,
          });
          if (!response.data || !response.data[0] || !response.data[0].embedding) {
            console.log('Unexpected response format from OpenAI for article:', article._id);
            return null;
          }
          return response.data[0].embedding;
        } catch (error) {
          console.log('Error generating embedding for article chunk:', article._id, error);
          return null;
        }
      });

      try {
        const chunkEmbeddings = await Promise.all(embeddingsPromises);
        const filteredEmbeddings = chunkEmbeddings.filter(e => e !== null);
        if (filteredEmbeddings.length === 0) {
          throw new Error('No embeddings were generated.');
        }
        const combinedEmbedding = averageEmbeddings(filteredEmbeddings);
        console.log(`Updating embedding for article with Filename: ${article.filename} and ID: ${article._id}`);

        // Update the article with the new embedding and hash
        return AskUs.collection.update(article._id, {
          $set: {
            embedding: combinedEmbedding,
            textHash: currentTextHash,
          },
        });

      } catch (error) {
        console.log('Error generating or combining embeddings for article:', article._id, error);
        return null;
      }
    });

    // Wait for all the update operations to complete
    await Promise.all(updatePromises);
    console.log('All embeddings have been processed.'); // Log when all articles have been processed
  },

  /** If user is logged in as admin, returns the total number of documents in AskUs (used for admin table).
   * @returns number - Number of documents in AskUs collection. */
  getItemsCount() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      const count = AskUs.collection.find().count();
      return count;
    }
    return ('');
  },

  /** Checks if the embeddings of the first 10 items in the AskUs collection exist.
   * @returns boolean - true if all embeddings exist, otherwise false. */
  embedExist() {
    const stuff = AskUs.collection.find(
      {},
      { fields: { embedding: 1 }, limit: 10 },
    ).fetch();
    let val = true;
    for (let i = 0; i < 10; i++) {
      if (!stuff[i].embedding) {
        val = false;
      }
    }
    return val;
  },

  /** Checks if the embeddings of the new data exists, via FERPA.
   * @returns boolean - true if all embeddings exist, otherwise false. */
  otherDbExist() {
    const stuff = AskUs.collection.find(
      { filename: 'An Eligible Student Guide to FERPA_0.pdf' },
    ).fetch();
    // Check if there are any results in the stuff array
    if (stuff.length === 0 || !stuff[0].embedding) {
      return false;
    }
    return true;
  },
});
