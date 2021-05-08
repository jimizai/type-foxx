import { boostrap } from "../core";
import { errorHandler } from "./src/middlewares/errorHandler";

boostrap({
  middlewares: [errorHandler],
});
