export async function errorHandler(ctx, next) {
  try {
    await next();
    if (!ctx.body) {
      throw new Error("err");
    }
  } catch (err) {
    console.log(err);
    ctx.body = {
      code: 500,
      data: null,
      msg: "server error",
      timestamp: Date.now(),
    };
  }
}
