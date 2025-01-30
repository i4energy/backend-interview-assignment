import { Context, HttpError, Middleware } from "oak/mod.ts";

export const errorHandler: Middleware = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  try {
    await next();
  } catch (err) {
    console.error("Error caught in middleware:", err);

    let status = 500;
    let message = "Internal Server Error";

    if (err instanceof HttpError) {
      status = err.status;
      message = err.message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    ctx.response.status = status;
    ctx.response.body = {
      error: message,
    };
  }
};
