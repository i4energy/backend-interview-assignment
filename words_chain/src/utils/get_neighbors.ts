import { general_utils } from "./general.ts";

/**
 * Retrieves the neighbors of a word by modifying one letter at a time
 * and checking if the resulting words are valid.
 *
 * @param word The word for which to find neighbors.
 * @param dictionary A set of all valid words.
 *
 * @returns An array of valid neighboring words derived from the given word.
 */
const _fromLetters = (
  word: string,
  dictionary: Set<string>,
) => {
  const letters = general_utils.getAllLetters();
  const chars_of_word = [...word];
  const neighbors = [];
  for (const [index, _] of chars_of_word.entries()) {
    // Change 1 letter at a time, check validity & add as neighbor
    for (const letter of letters) {
      const new_word = word.substring(0, index) + letter +
        word.substring(index + 1);

      if (new_word !== word && dictionary.has(new_word)) {
        // Valid neighbor
        neighbors.push(new_word);
      }
    }
  }
  return neighbors;
};

/**
 * Retrieves the neighbors of a word by comparing it against all valid words
 * in the dictionary and identifying those that differ by exactly one letter.
 *
 * @param word The word for which to find neighbors.
 * @param dictionary A set of all valid words.
 * @returns An array of valid neighboring words derived from the given word.
 */
const _fromDictionary = (word: string, dictionary: Set<string>) => {
  const valid_words = Array.from(dictionary);
  const neighbors = valid_words.filter((valid_word) =>
    _validate(word, valid_word)
  );
  return neighbors;
};

/**
 * Determines if two words are neighbors, meaning they differ by exactly one character.
 *
 * @param word1 The first word to compare.
 * @param word2 The second word to compare.
 * @returns `true` if the words are negibors, otherwise `false`.
 */
const _validate = (word1: string, word2: string) => {
  if (word1.length !== word2.length) return false;

  const word1_chars = [...word1];
  let differences = 0;
  for (const [index, word1_char] of word1_chars.entries()) {
    if (word1_char === word2[index]) continue;
    differences++;
    if (differences > 1) return false;
  }
  return differences === 1;
};

export const word_neighbors = {
  fromLetters: _fromLetters,
  fromDictionary: _fromDictionary,
  validate: _validate,
};
