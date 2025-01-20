import { word_neighbors } from "./get_neighbors.ts";

/**
 * Implementation of the {@link https://en.wikipedia.org/wiki/Breadth-first_search | Breadth-First Search (BFS)}
 * algorithm to get the shortest path from the start word to the end word, by changing one letter at
 * a time. All intermediate words must be valid.
 *
 * Neighbors can be calculated using either the {@link neighbors.fromLetters } or
 * the {@link neighbors.getNeighborsFromDictionary} methods.
 *
 * @param start_word The starting word.
 * @param end_word The target word.
 * @param dictionary A set of all valid words.

 * @returns The shortest path as an array of words, or `undefined` if no path exists.
 */
const _getWordsChain = (
  start_word: string,
  end_word: string,
  dictionary: Set<string>,
) => {
  // Validations
  if (start_word.length !== end_word.length) {
    console.error(`The start & end words have different length.`);
    return;
  }
  if (!dictionary.has(start_word) || !dictionary.has(end_word)) {
    console.error(`Both start & end words must exist in the dictionary.`);
    return;
  }

  // Use a FIFO Queue for BFS, starting with the initial word.
  const queue = [start_word];

  // Tracks the shortest path to each word found
  const found_words: Record<string, string[]> = {
    [start_word]: [start_word],
  };

  while (queue.length > 0) {
    // Dequeue the next word to process
    const word = queue.shift();
    if (!word) continue;

    // Get all valid neighbors with a one-letter difference
    // This function can change to word_neighbors.getNeighborsUsingLetters
    const neighbors = word_neighbors.fromLetters(
      word,
      dictionary,
    );
    for (const new_word of neighbors) {
      // Skip words already processed
      if (found_words[new_word]) continue;

      // Add neighbor word to the queue
      queue.push(new_word);

      // Record the shortest path for this word
      found_words[new_word] = [...found_words[word], new_word];

      // If the target word is found, return the path
      if (new_word === end_word) {
        return found_words[new_word];
      }
    }
  }
};

export const words_chain = {
  get: _getWordsChain,
};
