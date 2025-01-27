import {
  getDictionaryObject,
  getDistance,
  getIndexList,
  mutateMap,
} from "./helper.ts";

export const getKataPath = async (
  startWord: string,
  endWord: string,
): Promise<string[]> => {
  const MAX_DISTANCE = 3;

  const { startWordDictionary, endWordDictionary, fullWordDictionary } =
    await getDictionaryObject(startWord, endWord);

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
    // Check if the problem has solved
    if (startMap.get(endWord) || endMap.get(startWord)) {
      console.log("Solved");
      console.log(startMap.get(endWord));
      console.log(startMap.get(startWord));
      solved = true;
    }

    // Get then next node words
    indexes[step].forEach((indexKey) => {
      fullWordDictionary.get(indexKey)?.forEach((word) => {
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
      solved = true;
      console.log("SOLVED");
      const allSolutions = [...startSolution, ...endSolution];
      const bestSolution = allSolutions.reduce((acc, sol) => {
        acc = acc.length > sol.length || acc.length === 0 ? sol : acc;
        return acc;
      }, []);
      return bestSolution;
    }
  }

  return startMap.get(endWord) || [];
};

/**
 * 0,2  --> 3,0
 */

//
//  | 0	  1	  2	  3	  4	  5
//--+-------------------------
// 0|	0	  0	  1	  0	  0	  0
// 1|	0	  0	  1	  0	  0	  0
// 2|	1	  1	  4	  21	11	0
// 3|	0	  0	  10	66	141	50
// 4|	0	  0	  11	97	812	735
// 5|	0	  0	  0	  14	571	6391

///0_3  --- 3_0
///  + 1_2 + 2_1 ===> 0_3 3_0   0_3 -> 1_2 -> 2_1 -> 3_0  ---> new Targets
///

///0_4 --- 4_0
// 0_4 -> 1_3 -> 2_2 -> 3_1 -> 4_0
