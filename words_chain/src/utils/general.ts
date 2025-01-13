/**
 * Assumes that all available words are sourced from the
 * {@link https://norvig.com/ngrams/TWL06.txt | provided link}.
 *
 * @param word_length The desired length of the words. This parameter is critical,
 * as filtering by word length reduces memory usage and processing time.
 * @returns A Set containing all available words with the specified number of characters.
 * @throws An error if the dictionary fails to load.
 */
const getDictionary = async (word_length: number) => {
  const response = await fetch("https://norvig.com/ngrams/TWL06.txt");
  if (response.status !== 200) {
    throw new Error("Dictionary failed to load");
  }
  const text = await response.text();
  const words = text.split("\n").filter((word) => word.length === word_length)
    .map((
      word,
    ) => word.toLowerCase());
  return new Set(words);
};

/**
 * This is an assumption that we refer to the English alphabet, so we do know the valid letters.
 * @returns an array of all valid letters
 */
const getAllLetters = () => {
  const letters = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((x) =>
    x.toLocaleLowerCase()
  );
  return letters;
};

export const general_utils = {
  getDictionary,
  getAllLetters,
};
