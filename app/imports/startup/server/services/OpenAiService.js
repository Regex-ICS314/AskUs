import openai from '../utils/OpenAiClient';
import { MAX_TOKENS_PER_MESSAGE } from '../utils/Constants';
import throwError from '../utils/errors';

/**
 * Fetches the embedding from OpenAI for a given text.
 * @param {string} text - The text to get the embedding for.
 * @returns {Promise<number[]>} The embedding vector.
 * @throws {Meteor.Error} Throws an error if the OpenAI API call fails or the response format is unexpected.
 */
const getEmbeddingFromOpenAI = async (text) => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    if (response && response.data) {
      return response.data[0].embedding;
    }
    return throwError('embedding-error', 'Unexpected OpenAI API response format');

  } catch (error) {
    return throwError('embedding-error', `Failed to fetch embedding from OpenAI: ${error.message}`);
  }
};

/**
 * Creates a completion using OpenAI based on the provided messages.
 * @param {Object[]} messages - An array of message objects to provide context.
 * @returns {Promise<string>} The response content from the chatbot.
 * @throws {Meteor.Error} Throws an error if the OpenAI API call fails or the response format is unexpected.
 */
const createOpenAICompletion = async (messages) => {
  try {
    // Remove any properties from the messages that are not expected by the OpenAI API
    const filteredMessages = messages.map(({ role, content }) => ({ role, content }));

    // Estimate the number of tokens in the messages
    // const tokenCount = estimateTokenCount(filteredMessages); // uncomment this line to use the token counting logic
    // const chosenModel = chooseModelForTokenCount(tokenCount); // uncomment this line to use the token counting logic

    const response = await openai.chat.completions.create({
      // model: chosenModel,
      model: 'gpt-3.5-turbo-1106',
      messages: filteredMessages,
      temperature: 0.2,
      max_tokens: MAX_TOKENS_PER_MESSAGE,
    });

    // console.log('OpenAI API Response:', response);

    if (response && response.choices && response.choices[0]) {
      return response.choices[0].message.content;
    }
    return throwError('api-error', 'Unexpected OpenAI API response format');

  } catch (error) {
    return throwError('api-error', `Failed to get a response from the chatbot: ${error.message}`);
  }
};

export { getEmbeddingFromOpenAI, createOpenAICompletion };
