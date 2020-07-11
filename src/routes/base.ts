import { controller, get } from "../decorators";

@controller("/test")
export class HelloController {
  @get("/hello")
  index(req: Foxx.Request, res: Foxx.Response) {
    res.send({
      code: 200,
      data: [],
      message: "success",
      time: Date.now(),
    });
  }

  @get("/list")
  list(req: Foxx.Request, res: Foxx.Response) {
    res.send({
      code: 200,
      data: [],
      message: "success",
      time: Date.now(),
    });
  }

  @get("/ttt")
  ddd(req: Foxx.Request, res: Foxx.Response) {
    res.send({
      code: 200,
      data: "ddd",
      message: "success",
      time: Date.now(),
    });
  }

  @get("/ddd")
  ttt(req: Foxx.Request, res: Foxx.Response) {
    res.send({
      code: 200,
      data: "ddd",
      message: "success",
      time: Date.now(),
    });
  }

  @get("/order")
  order(req: Foxx.Request, res: Foxx.Response) {
    res.send({
      code: 200,
      data: "ddd",
      message: "success",
      time: Date.now(),
    });
  }
}
