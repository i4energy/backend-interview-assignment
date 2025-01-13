import { assertEquals } from "@std/assert";
import { stub } from "@std/testing/mock";
import { general_utils } from "./general.ts";
import { word_neighbors } from "./get_neighbors.ts";

Deno.test("get neighbors utility functions", async (t) => {
  await t.step("fromLetters - Unit tests", async (t1) => {
    using from_letters_mock = stub(
      general_utils,
      "getAllLetters",
      () => ["a", "b", "c", "d", "e", "t", "p", "o"],
    );
    await t1.step("No neighbors found", (_) => {
      const dictionary = new Set(["cat", "dap", "cep", "pop"]);
      const neighbors = word_neighbors.fromLetters(
        "cat",
        dictionary,
      );
      assertEquals(neighbors, []);
    });
    await t1.step("Neighbors found", (_) => {
      const dictionary = new Set(["cat", "dat", "cet", "pop"]);
      const neighbors = word_neighbors.fromLetters(
        "cat",
        dictionary,
      );
      assertEquals(neighbors, ["dat", "cet"]);
    });
  });

  await t.step("fromDictionary - Unit tests", async (t1) => {
    await t1.step("No neighbors found", (_) => {
      const dictionary = new Set(["cat", "dap", "cep", "pop"]);
      const are_neighbors = word_neighbors.fromDictionary(
        "cat",
        dictionary,
      );
      assertEquals(are_neighbors, []);
    });
    await t1.step("Neighbors found", (_) => {
      const dictionary = new Set(["cat", "dat", "cet", "pop"]);
      const are_neighbors = word_neighbors.fromDictionary(
        "cat",
        dictionary,
      );
      assertEquals(are_neighbors, ["dat", "cet"]);
    });
  });

  await t.step("validate - Unit tests", async (t1) => {
    await t1.step("All chars are different", (_) => {
      const are_neighbors = word_neighbors.validate("cat", "dog");
      assertEquals(are_neighbors, false);
    });
    await t1.step("Same words", (_) => {
      const are_neighbors = word_neighbors.validate("cat", "cat");
      assertEquals(are_neighbors, false);
    });
    await t1.step("Exact 2 different chars", (_) => {
      const are_neighbors = word_neighbors.validate("cat", "cev");
      assertEquals(are_neighbors, false);
    });
  });
});
