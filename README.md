### Quick start

```shell
$ npm install -g @jimizai/foxx-cli
$ foxx init <project-name>
```

### Hello foxx

```typescript
// main.ts
import { boostrap } from '@jimizai/core';
import { KoaFoxxDriver } from '@jimizai/driver-koa';
import './app/home.controller';

boostrap({
  Driver: KoaFoxxDriver,
  srcDirs: [],
});

// app/home.controller.ts
import { Get, Controller } from '@jimizai/decorators';

@Controller()
export class HomeController {
  @Get()
  home() {
    return 'hello foxx';
  }
}
```

### Quick started

- [simple](https://github.com/jimizai/type-foxx/tree/2.x/apps/simple) - A simple example to quick start use foxx
