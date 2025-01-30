// middlewares/validateWordChain.ts
import { RouterContext } from "oak/mod.ts";
import { z } from "https://deno.land/x/zod/mod.ts";

const wordChainSchema = z.object({
  start: z.string().min(1, "'start' cannot be empty"),
  end: z.string().min(1, "'end' cannot be empty"),
}).refine((data) => data.start.length === data.end.length, {
  message: "'start' and 'end' words must be of the same length.",
});

export const validateInput = async (
  ctx: RouterContext<
    "/word-chain",
    Record<string, never>,
    Record<string, any>
  >,
  next: () => Promise<unknown>,
) => {
  if (!ctx.request.hasBody) {
    ctx.throw(400, "Request body is missing.");
  }

  const body = ctx.request.body({ type: "json" });

  let input;
  try {
    input = await body.value;
  } catch {
    ctx.throw(400, "Invalid JSON format.");
  }

  const parsed = wordChainSchema.safeParse(input);

  if (!parsed.success) {
    const errorMessages = parsed.error.errors.map((err) => err.message).join(
      ", ",
    );
    ctx.throw(400, errorMessages);
  }

  await next();
};
