### Installation

```shell
$ npm install @jimizai/core
```

### Hello foxx

```typescript
// app.ts
import { boostrap } from "@jimizai/core";

boostrap();

// src/controller.ts
import { Injectable } from "@jimizai/injectable"
import { Get, Controller } from "@jimizai/decorators"

@Injectable()
@Controller()
export class HomeController {
  @Get()
  home() {
    return "hello foxx"
  }
}
```

### Getting started
- [simple](https://github.com/jimizai/type-foxx/tree/main/packages/playground/modules) - A simple example to quick start use foxx
- [modules](https://github.com/jimizai/type-foxx/tree/main/packages/playground/modules) - A complex example to show how to use foxx modules