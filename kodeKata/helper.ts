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

/**
 * @param startWord The first word we start with
 * @param endWord the target word
 * @returns Return same length words from dictionary object
 * according distances from start word and end word
 */
export const getDictionaryObject = async (
  startWord: string,
  endWord: string,
): Promise<
  {
    startWordDictionary: Map<number, string[]>;
    endWordDictionary: Map<number, string[]>;
    fullWordDictionary: Map<string, string[]>;
  }
> => {
  // ERROR HANDLER
  if (!DIC_URL) {
    throw new Error(
      "Please set up a dictionary url in the .env  {DICTIONARY_URL='A valid url'}",
    );
  }
  try {
    // Fetch the dictionary
    const dictionary = (await (await fetch(DIC_URL)).text()).split("\n");

    const startWordDictionary = new Map();
    const endWordDictionary = new Map();
    const fullWordDictionary = new Map();

    let startWordFound = false;
    let endWordFound = false;

    for (let i = 0; i <= startWord.length; i++) {
      startWordDictionary.set(i, []);
      endWordDictionary.set(i, []);
      for (let j = 0; j <= startWord.length; j++) {
        fullWordDictionary.set(`${i}_${j}`, []);
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

      startWordDictionary.get(startWordDistance).push(word);
      endWordDictionary.get(endWordDistance).push(word);
      fullWordDictionary.get(`${startWordDistance}_${endWordDistance}`).push(
        word,
      );
    });

    // Validation
    if (!(startWordFound && endWordFound)) {
      throw new Error("Request data is no valid !!!");
    }

    return {
      startWordDictionary,
      endWordDictionary,
      fullWordDictionary,
    };
  } catch (error) {
    throw error;
  }
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

export const getPaths = (
  root: string,
  dictionary: string[],
  target: string,
): Map<string, string[]> => {
  let paths = [[root]];
  let run = true;
  let explored = [root];
  let len = 1;
  const pathMap = new Map<string, string[]>();
  let solved = false;
  let solvedPath: string[] = [];
  while (run) {
    // Get the new paths from the longest paths
    const newPaths = paths.filter((path) => path.length === len).reduce(
      (acc, path) => {
        // Get the last word of each path.
        const lastWord = path[path.length - 1];
        // Find the possible next words
        const nextWords = getFollowingWords(
          lastWord,
          dictionary.filter((w) => !explored.some((ex) => ex === w)),
        );
        // If next words exists push them to the new paths
        if (nextWords.length > 0) {
          explored.push(...nextWords);
          nextWords.forEach((w) => {
            if (w === target) {
              solved = true;
              run = false;
              solvedPath = [...path, target];
              return acc;
            }
            acc.push([...path, w]);
            paths.push([...path, w]);
          });
          pathMap.set(lastWord, path);
        } else {
          pathMap.set(lastWord, path);
        }
        return acc;
      },
      [] as string[][],
    );

    // Check if new paths found
    if (newPaths.length === 0) {
      run = false;
    }

    // Find new words further
    len++;
  }
  if (solved) {
    const solvedPathMap = new Map();
    solvedPathMap.set(target, solvedPath);
    return solvedPathMap;
  }
  return pathMap;
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
            solutions.push([...path, ...solution]);
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
