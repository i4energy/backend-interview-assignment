import { general_utils } from "./utils/general.ts";
import { words_chain } from "./utils/get_words_chain.ts";

export const getWordsChain = async (
  start_word: string,
  end_word: string,
) => {
  /**
   * Get dictionary
   */
  const dictionary = await general_utils.getDictionary(
    start_word.length,
  );

  /**
   * Get shortest chain between the words given
   */
  const chain = words_chain.get(
    start_word,
    end_word,
    dictionary,
  );

  if (!chain) {
    console.log(
      `There is no chain between the words ${start_word} and ${end_word}`,
    );
  } else {
    console.log(`The minimum chain from "${start_word}" to "${end_word}" is:\n
      - ${chain.length} steps \n
      - ${chain}`);
  }
};
