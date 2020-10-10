import { Controller, Get, Post, Delete, Put, All, Options, Patch } from '../src/decorators'

describe("Request mappings", () => {
  @Controller("/test")
  // @ts-ignore
  class Test {
    @Get()
    index() {}

    @Post()
    store() {}

    @Put()
    update() {}

    @Delete()
    del() {}

    @All()
    all() {}

    @Options()
    options() {}

    @Patch()
    patch() {}
  }

  it("controller", () => {
    // Reflect.
  })
})


