import { assertEquals } from "@std/assert";
import { getIndexList, getPaths } from "./helper.ts";

Deno.test("GetPaths", async (t) => {
  await t.step("aaaa", () => {
    const root = "AAAA";
    const dictionary = ["AAAA", "AAAB", "AABB", "CDBB", "DDDD"];
    const target = "CDBB";
    const expected_results = ["AAAA", "AAAB", "AABB"];
    const response = getPaths(root, dictionary, target);
    const original_results = response.get("AABB");
    assertEquals(original_results, expected_results);
  });
});

Deno.test("Get index list", async (t) => {
  await t.step("aaa", () => {
    const distance = 3;
    const maxDistance = 6;
    const response = getIndexList(distance, maxDistance);
    assertEquals(response, [["a"]]);
  });
});
