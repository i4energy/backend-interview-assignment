type Dictionary = Set<string>;
type Path = string[];

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

    let currentSet: Set<string> = new Set([start]);

    const visited: Set<string> = new Set();
    // The parentMap tracks the parent-child relationship between words, preserving the sequence of steps needed to reach each word.
    const parentMap: Map<string, string[]> = new Map();

    while (currentSet.size > 0) {
        const nextSet: Set<string> = new Set();

        for (const word of currentSet) {
            const neighbors = getNeighbors(word, dictionary);

            console.log({ word, neighbors });

            for (const neighbor of neighbors) {
                // When the target is found, the reconstructPath function traces back through the parentMap to recreate the exact sequence from start to end.
                if (neighbor === end) {
                    updateParentMap(parentMap, neighbor, word);
                    return reconstructPath(parentMap, start, end);
                }

                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    nextSet.add(neighbor);
                    updateParentMap(parentMap, neighbor, word);
                }
            }
        }

        currentSet = nextSet;
    }

    return [];
};

/**
 * Preprocesses the dictionary to filter out words of the correct length and convert them to lowercase.
 * @param wordList - The list of words to preprocess
 * @param start - The starting word
 * @returns A set of valid words
 */
const preprocessDictionary = (wordList: string[], start: string): Dictionary => {
    return new Set(
        wordList.filter((word) => word.length === start.length + 1).map((word) =>
            word.toLowerCase().replace(/\r/g, "")
        ),
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

        for (let c = 97; c <= 122; c++) { // a-z
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
const updateParentMap = (parentMap: Map<string, string[]>, word: string, parent: string) => {
    if (!parentMap.has(word)) parentMap.set(word, []);
    parentMap.get(word)!.push(parent);
};

/**
 * Reconstructs the shortest path from the start word to the end word using the parent map.
 * @param parentMap - The map of parent relationships
 * @param start - The starting word
 * @param end - The ending word
 * @returns The shortest path as an array of strings
 */
function reconstructPath(parentMap: Map<string, string[]>, start: string, end: string): Path {
    const queue: string[][] = [[end]];

    while (queue.length > 0) {
        const currentPath = queue.shift()!;
        const lastWord = currentPath[currentPath.length - 1];

        if (lastWord === start) {
            return currentPath.reverse();
        }

        for (const parent of parentMap.get(lastWord) || []) {
            queue.push([...currentPath, parent]);
        }
    }

    return [];
}
const fileContent = await Deno.readTextFile("./tournament_words.txt");
const wordList = fileContent.split("\n");
const start = "aback";
const end = "abbey";

/**
 * Input dictionary: [cat, cot, cog, dog]
Intermediate states:
  *at -> [cat]
  c*t -> [cat, cot]
  co* -> [cot, cog]
  *og -> [cog, dog]
  d*g -> [dog]
 *
 *
 */

// const wordList = ["cat", "cot", "cog", "dog"];
// const start = "cat";
// const end = "dog";

const startTime = performance.now();

const chain = wordChain(start, end, wordList);
console.log(chain);

const endTime = performance.now();

console.log(endTime - startTime);