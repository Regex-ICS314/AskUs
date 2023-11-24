import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { getEmbeddingFromOpenAI, createOpenAICompletion } from './services/OpenAiService';
import { getRelevantContextFromDB } from './services/ArticleService';
import { getAverageEmbedding, computeCosineSimilarity } from './utils/MathUtils';
import { MAX_SESSION } from './utils/Constants';
import { getSession, updateSession } from './services/SessionManager';

// turn off console globally for eslint
/* eslint-disable no-console */

/**
//#################################################################################
// The following code is for the token counting logic
//#################################################################################

// Function to estimate the number of tokens in the messages
function estimateTokenCount(messages) {
  // Implement token counting logic here
}

// Function to choose the appropriate model based on token count
function chooseModelForTokenCount(tokenCount) {
  if (tokenCount <= 16000) {
    return 'gpt-3.5-turbo-1106'; // Your default model
  }
  return 'alternative-model'; // A different model that handles larger requests

}
//#################################################################################
 */

/** Meteor method to get the chatbot's response for a given user message.
 * This method fetches the user's embedding, retrieves relevant context from the database,
 * prepares messages for the OpenAI chatbot, and fetches a completion response.
 * @param {string} userMessage - The user's message/query.
 * @returns {Promise<Object>} An object containing the chatbot's response and similar articles.
 *
 */
// Define a global or persistent object to store session data

Meteor.methods({
  async getChatbotResponse(userId, userMessage, userLanguage) {
    check(userId, String);
    check(userMessage, String);
    check(userLanguage, String);

    // Retrieve or initialize the user's session
    const userSession = getSession(userId);

    console.log('Current Session State after retrieval for user', userId, ':', userSession);

    // Fetch and store the embedding for the user's message
    const userEmbedding = await getEmbeddingFromOpenAI(userMessage);
    // console.log('Fetched user embedding:', userEmbedding); // Log to confirm embedding is fetched
    userSession.messages.push({ role: 'user', content: userMessage, embedding: userEmbedding });
    console.log('Session State after adding user message for user', userId, ':', userSession);
    // Ensure the session does not exceed the maximum length
    if (userSession.messages.length > MAX_SESSION) {
      userSession.messages = userSession.messages.slice(-MAX_SESSION);
    }

    const greetings = ['hello', 'hi', 'how do you do', 'good day'];
    let chatbotResponse;
    let similarArticles;

    if (greetings.includes(userMessage.toLowerCase())) {
      chatbotResponse = 'Hello! How can I assist you today?';
      similarArticles = [];
      userSession.currentTopicEmbedding = null; // Reset the topic when greeting
    } else {
      // Check if the user's message is similar to the previous topic
      const previousTopicEmbedding = userSession.currentTopicEmbedding;
      let similarity = 1; // Default to 1 (max similarity) if no previous topic

      if (previousTopicEmbedding) {
        similarity = computeCosineSimilarity(userEmbedding, previousTopicEmbedding);
      }

      const TOPIC_SHIFT_THRESHOLD = 0.7; // Define a threshold for topic shift detection
      if (similarity < TOPIC_SHIFT_THRESHOLD || !userSession.currentTopicEmbedding) {
        // Topic has shifted significantly, or no topic yet determined
        const { messagesForChatbot, articlesForComponent } = getRelevantContextFromDB(userEmbedding);
        userSession.currentArticles = articlesForComponent;

        // Check if messagesForChatbot have embeddings before calculating the average
        if (messagesForChatbot.some(msg => msg.embedding)) {
          userSession.currentTopicEmbedding = getAverageEmbedding(messagesForChatbot);
          console.log('Session State after context update for user', userId, ':', userSession);
        } else {
          console.error('No embeddings found in messages for chatbot. Cannot calculate average embedding.');
          // Handle the case where no embeddings are available (e.g., by setting a default embedding or throwing an error)
        }
      }

      // Adjust initial context based on user's language preference
      let initialContext;

      switch (userLanguage) {
      case 'japanese':
        initialContext = [{ role: 'system', content: 'You are a Japanese translator and will respond in Japanese only.' }];
        break;
      case 'spanish':
        initialContext = [{ role: 'system', content: 'You are a Spanish translator and will respond in Spanish only.' }];
        break;
      case 'chinese':
        initialContext = [{ role: 'system', content: 'You are a Chinese translator and will respond in Chinese only.' }];
        break;
      case 'korean':
        initialContext = [{ role: 'system', content: 'You are a Korean translator and will respond in Korean only.' }];
        break;
        // Add cases for other languages
      default:
        initialContext = [
          { role: 'system', content: 'You are a helpful chatbot that can answer questions based on the following articles provided.' },
          { role: 'system', content: 'You can engage in friendly conversation, but your main purpose is to provide information from our knowledge base.' },
          { role: 'assistant', content: 'Hello! How can I assist you today?' },
        ];
      }

      console.log('Session History:', userSession.messages);

      const messages = [
        ...initialContext,
        ...userSession.messages,
        ...(userSession.currentArticles ? userSession.currentArticles.map(article => ({
          role: 'system',
          _id: article._id,
          freq: article.freq,
          content: `From ${article.filename}: ${article.article_text}` })) : []),
        { role: 'user', content: userMessage },
      ];

      chatbotResponse = await createOpenAICompletion(messages);
      similarArticles = userSession.currentArticles;
    }

    // Update the session in the database
    userSession.messages.push({ role: 'assistant', content: chatbotResponse });
    updateSession(userId, {
      messages: userSession.messages,
      currentTopicEmbedding: userSession.currentTopicEmbedding,
      currentArticles: userSession.currentArticles,
    });

    console.log('Final Session State before response for user', userId, ':', userSession);

    return {
      chatbotResponse,
      similarArticles,
    };
  },
});
