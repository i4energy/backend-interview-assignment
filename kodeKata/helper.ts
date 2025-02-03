const DIC_URL = Deno.env.get("DICTIONARY_URL");

export interface Path {
  path: string[];
  distance: number;
}
export type Dictionary = Map<number, string[]>;
export type PathDictionary = Map<string, Path>;

export const getDistance = (word1: string, word2: string): number => {
  return Array.from(word1).reduce((acc, char, index) => {
    acc = char === word2[index] ? acc : acc + 1;
    return acc;
  }, 0);
};

export const fetchDictionary = async (): Promise<string[]> => {
  if (!DIC_URL) {
    throw new Error(
      "Please set up a dictionary url in the .env  {DICTIONARY_URL='A valid url'}",
    );
  }

  logState("Start Fetching data");
  const dictionary = (await (await fetch(DIC_URL)).text()).split("\n");
  logState("Data have been fetched");

  return dictionary;
};

/**
 * @param startWord The first word we start with
 * @param endWord the target word
 * @returns Return same length words from dictionary object
 * according distances from start word and end word
 */
export const getDictionaryObject = (
  startWord: string,
  endWord: string,
  dictionary: string[],
): Map<string, string[]> => {
  logState("dictionary object building starting");

  const dictionaryObject: Map<string, string[]> = new Map();

  let startWordFound = false;
  let endWordFound = false;

  for (let i = 0; i <= startWord.length; i++) {
    for (let j = 0; j <= startWord.length; j++) {
      dictionaryObject.set(`${i}_${j}`, []);
    }
  }

  dictionary.filter((w) => w.length === startWord.length).forEach((word) => {
    let startWordDistance = 0;
    let endWordDistance = 0;

    for (let i = 0; i < startWord.length; i++) {
      if (startWord[i] !== word[i]) {
        startWordDistance++;
      }

      if (endWord[i] !== word[i]) {
        endWordDistance++;
      }
    }

    startWordFound = startWordFound || startWordDistance === 0;
    endWordFound = endWordFound || endWordDistance === 0;

    dictionaryObject.get(`${startWordDistance}_${endWordDistance}`)?.push(
      word.toUpperCase(),
    );
  });

  // Validation
  if (!(startWordFound && endWordFound)) {
    throw new Error("Request data is no valid !!!");
  }

  logState("Dictionary Object has been builded");
  return dictionaryObject;
};

export const isFollowingWord = (word: string, nextWord: string): boolean => {
  const different_chars = Array.from(word).reduce((acc, char, index) => {
    acc = char === nextWord[index] ? acc : acc + 1;
    return acc;
  }, 0);
  return different_chars === 1;
};

export const getFollowingWords = (
  word: string,
  dictionary: Set<string>,
): string[] => {
  return Array.from(dictionary).filter((w) => isFollowingWord(w, word));
};

export const getIndexList = (
  distance: number,
  maxDistance: number,
): string[][] => {
  const indexList: string[][] = [];

  let accumulatorList = [];

  for (let step = distance; step <= 2 * maxDistance; step++) {
    for (let i = 0; i <= step; i++) {
      const isTheFirstStep = step === distance;
      const isOverSizedPoint = i > maxDistance || step - i > maxDistance;
      const isZeroIndex = i === 0 || i === step;
      if ((isTheFirstStep || !isZeroIndex) && !isOverSizedPoint) {
        accumulatorList.push(`${i}_${step - i}`);
      }
    }
    indexList.push([...accumulatorList]);
    accumulatorList = [];
  }

  return indexList;
};

export const mutateMap = (
  rootMap: Map<string, string[]>,
  dictionary: Set<string>,
  targetMap: Map<string, string[]>,
): string[][] => {
  let paths: string[][] = Array.from(rootMap.values()) || [];

  let run = true;
  let firstLoop = true;
  const solutions: string[][] = [];

  while (run) {
    paths = paths.reduce((acc, path) => {
      const lastWord = path[path.length - 1];
      const nextWords = getFollowingWords(lastWord, dictionary);

      if (nextWords.length > 0) {
        nextWords.forEach((w) => {
          acc.push([...path, w]);
          rootMap.set(w, [...path, w]);
          const solution = targetMap.get(w);
          dictionary.delete(w);
          if (solution) {
            solutions.push([...path, ...solution.reverse()]);
          }
        });
      } else {
        if (!firstLoop) {
          paths.push(path);
          rootMap.set(lastWord, path);
        }
      }
      return acc;
    }, [] as string[][]);

    firstLoop = false;

    if (paths.length === 0) {
      run = false;
    }
  }

  return solutions;
};

export const logState = (msg: string): void => {
  const date = new Date();
  console.log(
    `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}: ${msg}`,
  );
};
