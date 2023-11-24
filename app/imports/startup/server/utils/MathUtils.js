/**
 * Computes the cosine similarity between two vectors.
 * @param {number[]} embedding1 - The first vector.
 * @param {number[]} embedding2 - The second vector.
 * @returns {number} The cosine similarity.
 * @throws {Error} Throws an error if the inputs are not arrays or if their lengths do not match.
 */
function computeCosineSimilarity(embedding1, embedding2) {
  if (!Array.isArray(embedding1) || !Array.isArray(embedding2)) {
    throw new Error('Both embeddings must be arrays.');
  }

  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have the same length.');
  }

  const dotProduct = embedding1.reduce((sum, value, i) => sum + value * embedding2[i], 0);
  const magnitude1 = Math.sqrt(embedding1.reduce((sum, value) => sum + value * value, 0));
  const magnitude2 = Math.sqrt(embedding2.reduce((sum, value) => sum + value * value, 0));

  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Calculates the average embedding of the messages in a session.
 * @param {Object[]} messages - An array of message objects.
 * @returns {number[]} The average embedding.
 */
function getAverageEmbedding(messages) {
  const embeddings = messages.map(msg => msg.embedding).filter(embedding => embedding);
  if (embeddings.length === 0) {
    console.error('No embeddings provided to calculate the average.');
    // Handle the case where no embeddings are available (e.g., by returning a default embedding or null)
    return null; // Example fallback
  }

  const sumEmbedding = embeddings.reduce((acc, embedding) => acc.map((value, index) => value + embedding[index]), new Array(embeddings[0].length).fill(0));

  return sumEmbedding.map(value => value / embeddings.length);
}

export { computeCosineSimilarity, getAverageEmbedding };
