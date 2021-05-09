export async function errorHandler(ctx, next) {
  try {
    await next();
    if (!ctx.body) {
      throw new Error("err");
    }
  } catch {
    ctx.body = {
      code: 500,
      data: null,
      msg: "server error",
      timestamp: Date.now(),
    };
  }
}
