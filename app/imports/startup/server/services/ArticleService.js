import { AskUs } from '../../../api/askus/AskUs.js'; // Adjust the import path as necessary
import { MAX_TOKENS_PER_ARTICLE, MAX_ARTICLES, MAX_SIMILAR_ARTICLES } from '../utils/Constants';
import { computeCosineSimilarity } from '../utils/MathUtils';

/**
 * Finds the most similar articles to the user's embedding.
 * This function calculates the cosine similarity between the user's embedding and the embedding of each article,
 * sorts the articles by similarity, and returns the top articles.
 * @param {number[]} userEmbedding - The embedding of the user's query.
 * @returns {Object[]} An array of the most similar articles.
 */
function findMostSimilarArticles(userEmbedding) {
  const articles = AskUs.collection.find({}).fetch();

  const similarities = articles.map(article => ({
    article: article,
    similarity: computeCosineSimilarity(userEmbedding, article.embedding),
  }));

  const sortedArticles = similarities.sort((a, b) => b.similarity - a.similarity).slice(0, MAX_ARTICLES);

  return sortedArticles.map(item => item.article);
}

/**
 * Gets the relevant context from the database based on the user's embedding.
 * This function finds articles similar to the user's query, truncates them to a specified length,
 * and prepares the context for the chatbot and the articles for the component.
 * @param {number[]} userEmbedding - The embedding of the user's query.
 * @returns {Object} An object containing two properties:
 * - messagesForChatbot: An array of objects with 'role' and 'content' representing system messages.
 * - articlesForComponent: An array of articles, each containing 'filename', 'question', and 'article_text'.
 */
function getRelevantContextFromDB(userEmbedding) {
  console.log('User Embedding:', userEmbedding);
  const similarArticles = findMostSimilarArticles(userEmbedding).slice(0, MAX_SIMILAR_ARTICLES);

  console.log('Similar articles found:', similarArticles);

  // Truncate each article to maxTokensPerArticle tokens
  const truncatedArticles = similarArticles.map(article => {
    const tokens = article.article_text.split(' '); // naive tokenization by spaces
    const truncatedText = tokens.slice(0, MAX_TOKENS_PER_ARTICLE).join(' ');
    return {
      ...article,
      article_text: truncatedText,
    };
  });

  // Return messages for the chatbot
  const messages = truncatedArticles.map((article) => ({
    role: 'system',
    content: `From ${article.filename}: ${article.article_text}`,
  }));

  // Return articles in the expected format
  const articlesForComponent = truncatedArticles.map((article) => ({
    _id: article._id,
    filename: article.filename,
    question: article.question,
    article_text: article.article_text,
    freq: article.freq,
  }));

  return {
    messagesForChatbot: messages,
    articlesForComponent: articlesForComponent,
  };
}

export { findMostSimilarArticles, getRelevantContextFromDB };
