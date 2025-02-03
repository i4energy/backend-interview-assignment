import {
  getDictionaryObject,
  getDistance,
  getIndexList,
  logState,
  mutateMap,
} from "./helper.ts";

import { Client } from "https://deno.land/x/mysql/mod.ts";

import { dictionary } from "../index.ts";

export const getKataPath = async (
  _startWord: string,
  _endWord: string,
): Promise<string[]> => {
  logState("Function has called");

  const startTime = new Date().getTime();
  const startWord = _startWord.toUpperCase();
  const endWord = _endWord.toUpperCase();

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
      logState("SOLVED\n");

      const milliseconds = new Date().getTime() - startTime;

      logState("Write results to the database");
      try {
        const sqlClient = await new Client().connect({
          hostname: "mysql",
          port: 3306,
          username: "root",
          password: "pass",
          db: "KATA_DB",
        });

        await sqlClient.execute(
          `
            INSERT INTO requests (start_word, end_word, solution, milliseconds, run_at)
            VALUES (?, ?, ?, ?, ?)
          `,
          [
            startWord,
            endWord,
            JSON.stringify(bestSolution),
            milliseconds,
            new Date(),
          ],
        );

        sqlClient.close();
      } catch (error) {
        console.log("Oups");
        console.log(`${error}`);
      }
      return bestSolution[0] === startWord
        ? bestSolution
        : bestSolution.reverse();
    }
  }
  return [];
};
