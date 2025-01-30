import "jsr:@std/dotenv/load";
import * as http from "node:http";
import { Node } from "router";
import { getKataPath } from "./kodeKata/algorithm.ts";
import { fetchDictionary } from "./kodeKata/helper.ts";

export let dictionary: string[] = [];

const root = new Node();
const PORT = Number(Deno.env.get("PORT"));

if (!isNaN(PORT)) {
  root.add("/codeKata/:startWord/:endWord", async (p: any) => {
    const solution = await getKataPath(p.get("startWord"), p.get("endWord"));
    return solution;
  });

  http.createServer(async (req: any, res: any) => {
    const [h, p] = root.find(req.url);

    if (h) {
      const result = await h(p);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(result));
    } else {
      res.end("Not Found");
    }
  }).listen(PORT);

  console.log(`Server is listening on port: ${PORT}`);

  dictionary = await fetchDictionary();
} else {
  console.log("Please set up a valid PORT in the .env");
  console.log("The server terminated!");
}
