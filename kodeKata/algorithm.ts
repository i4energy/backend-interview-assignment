import {
  getDictionaryObject,
  getDistance,
  getIndexList,
  logState,
  mutateMap,
} from "./helper.ts";

import { dictionary } from "../index.ts";

export const getKataPath = async (
  startWord: string,
  endWord: string,
): Promise<string[]> => {
  logState("Function has called");

  const dictionaryObject = getDictionaryObject(
    startWord,
    endWord,
    dictionary,
  );

  const startMap = new Map<string, string[]>();
  const endMap = new Map<string, string[]>();

  startMap.set(startWord, [startWord]);
  endMap.set(endWord, [endWord]);

  let solved = false;
  let step = 0;

  const startDictionary: Set<string> = new Set();
  const endDictionary: Set<string> = new Set();

  const indexes = getIndexList(
    getDistance(startWord, endWord),
    startWord.length,
  );

  while (!solved) {
    logState(`Loop number ${step + 1} started`);
    // Get then next node words
    indexes[step].forEach((indexKey) => {
      dictionaryObject.get(indexKey)?.forEach((word) => {
        startDictionary.add(word);
        endDictionary.add(word);
      });
    });

    const startSolution = mutateMap(
      startMap,
      startDictionary,
      endMap,
    );
    const endSolution = mutateMap(endMap, endDictionary, startMap);

    step++;

    if (
      step > startWord.length || startSolution.length > 0 ||
      endSolution.length > 0
    ) {
      // TODO check if there is possibility for a better solution
      solved = true;
      const allSolutions = [...startSolution, ...endSolution];
      const bestSolution = allSolutions.reduce((acc, sol) => {
        acc = acc.length > sol.length || acc.length === 0 ? sol : acc;
        return acc;
      }, []);
      logState("SOLVED");
      return bestSolution;
    }
  }
  return [];
};
