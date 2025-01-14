type Dictionary = Set<string>;
type Path = string[];

type BFSState = {
  currentSet: Set<string>;
  visited: Set<string>;
  parentMap: Map<string, string[]>;
};

/**
 * Finds the shortest word chain from `start` to `end` using a Bidirectional BFS approach.
 * @param start - The starting word
 * @param end - The ending word
 * @param wordList - The dictionary of valid words
 * @returns The shortest word chain as an array of strings, or an empty array if no chain exists
 */
const wordChain = (start: string, end: string, wordList: string[]): Path => {
  if (start === end) return [start];

  const dictionary = preprocessDictionary(wordList, start);

  // Validate start and end words
  if (!dictionary.has(start)) return []; // Start word must exist in the dictionary
  if (!dictionary.has(end)) return []; // End word must exist in the dictionary

  // Sets for forward and backward search
  const forward: BFSState = {
    currentSet: new Set([start]),
    visited: new Set(),
    parentMap: new Map()
  };

  const backward: BFSState = {
    currentSet: new Set([end]),
    visited: new Set(),
    parentMap: new Map()
  };

  // BFS level tracker
  while (forward.currentSet.size > 0 && backward.currentSet.size > 0) {
    // Expand the smaller set for efficiency
    let [current, opposite] = forward.currentSet.size > backward.currentSet.size
    ? [backward, forward]
    : [forward, backward];
    const nextSet: Set<string> = new Set();

    for (const word of current.currentSet) {
      const neighbors = getNeighbors(word, dictionary);

      for (const neighbor of neighbors) {
        if (opposite.visited.has(neighbor)) {
          updateParentMap(current.parentMap, neighbor, word);
          return reconstructBidirectionalPath(
            current.parentMap,
            opposite.parentMap,
            start,
            end,
            neighbor!
          );
        }
        if (!current.visited.has(neighbor)) {
          current.visited.add(neighbor);
          nextSet.add(neighbor);
          updateParentMap(current.parentMap, neighbor, word);
        }
      }
    }

    current.currentSet = nextSet!;
  }

  return [];
};
/**
 * Preprocesses the dictionary to filter out words of the correct length and convert them to lowercase.
 * @param wordList - The list of words to preprocess
 * @param start - The starting word
 * @returns A set of valid words
 */
const preprocessDictionary = (
  wordList: string[],
  start: string
): Dictionary => {
  return new Set(
    wordList
      .filter((word) => word.length === start.length + 1)
      .map((word) => word.toLowerCase().replace(/\r/g, ""))
  );
};

/**
 * Generates all valid neighboring words by changing one letter at a time.
 * @param word - The input word
 * @param dictionary - The set of valid words
 * @returns An array of neighboring words
 */
function getNeighbors(word: string, dictionary: Dictionary): string[] {
  const neighbors: string[] = [];
  const wordArr = word.split("");

  for (let i = 0; i < wordArr.length; i++) {
    const originalChar = wordArr[i];

    for (let c = 97; c <= 122; c++) {
      // a-z
      const char = String.fromCharCode(c);
      if (char === originalChar) continue;

      wordArr[i] = char;
      const newWord = wordArr.join("");
      if (dictionary.has(newWord)) {
        neighbors.push(newWord);
      }
    }

    wordArr[i] = originalChar;
  }

  return neighbors;
}

/**
 * Updates the parent map with the new parent-child relationship.
 * @param parentMap - The map of parent relationships
 * @param word - The current word
 * @param parent - The parent word
 */
const updateParentMap = (
  parentMap: Map<string, string[]>,
  word: string,
  parent: string
) => {
  if (!parentMap.has(word)) parentMap.set(word, []);
  parentMap.get(word)!.push(parent);
};

/**
 * Reconstructs the shortest path from the start word to the end word using the parent maps.
 * @param firstMap - The parent map from the first BFS search
 * @param secondMap - The parent map from the second BFS search
 * @param start - The starting word
 * @param end - The ending word
 * @param meetingWord - The word where the two BFS searches meet
 * @returns The shortest path as an array of strings
 */
const reconstructBidirectionalPath = (
  firstMap: Map<string, string[]>,
  secondMap: Map<string, string[]>,
  start: string,
  end: string,
  meetingWord: string
): string[] => {
  // Determine which map corresponds to which direction
  const [forwardMap, backwardMap] = firstMap.has(start)
    ? [firstMap, secondMap]
    : [secondMap, firstMap];

  const pathFromStart: string[] = [];
  const pathFromEnd: string[] = [];

  // Traverse from the meeting word back to the start
  let current = meetingWord;
  while (current && current !== start) {
    pathFromStart.unshift(current);
    current = forwardMap.get(current)?.[0];
  }
  pathFromStart.unshift(start);

  // Traverse from the meeting word to the end
  current = backwardMap.get(meetingWord)?.[0];
  while (current && current !== end) {
    pathFromEnd.push(current);
    current = backwardMap.get(current)?.[0];
  }
  pathFromEnd.push(end);

  return [...pathFromStart, ...pathFromEnd];
};

const fileContent = await Deno.readTextFile("./tournament_words.txt");
const wordList = fileContent.split("\n");
const start = "aback";
const end = "abbey";

// const start = "cat";
// const end = "dog";
const startTime = performance.now();

const chain = wordChain(start, end, wordList);
console.log(chain);

const endTime = performance.now();

console.log(endTime - startTime);

// Results:
// From "cat" to "dog"
// [ "cat", "cot", "cog", "dog" ]
// 4.185399999999994

// From "aback" to "abbey"
// [
//   "aback", "alack",
//   "flack", "flock",
//   "flocs", "floes",
//   "aloes", "almes",
//   "almas", "albas",
//   "abbas", "abbes",
//   "abbey"
// ]
// 15.8795
