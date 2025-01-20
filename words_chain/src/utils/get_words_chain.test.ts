import { assertEquals } from "@std/assert";
import { words_chain } from "./get_words_chain.ts";

Deno.test("words_chain.get - Unit tests", async (t) => {
  await t.step("Different length of words", (_) => {
    const dictionary = new Set(["cat", "dat"]);
    const path = words_chain.get("catty", "dog", dictionary);
    assertEquals(path, undefined);
  });
  await t.step("End word not exists", (_) => {
    const dictionary = new Set(["cat", "dat"]);
    const path = words_chain.get("cat", "dog", dictionary);
    assertEquals(path, undefined);
  });

  await t.step("Invalid case", (_) => {
    const dictionary = new Set(["cat", "dat", "dog"]);
    const path = words_chain.get("cat", "dog", dictionary);
    assertEquals(path, undefined);
  });

  await t.step("Simple valid case", (_) => {
    const dictionary = new Set(["cat", "dat", "dog"]);
    const path = words_chain.get("cat", "dat", dictionary);
    assertEquals(path, ["cat", "dat"]);
  });

  await t.step("More complex valid case", (_) => {
    const dictionary = new Set(["cat", "let", "rat", "ret"]);
    const path = words_chain.get("cat", "let", dictionary);
    assertEquals(path, ["cat", "rat", "ret", "let"]);
  });
});
