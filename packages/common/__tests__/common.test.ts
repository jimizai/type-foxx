import { BadRequestException, BaseExceptions } from "../src";

test("test exceptions", () => {
  try {
    throw new BadRequestException();
  } catch (error) {
    expect(error instanceof BaseExceptions).toBe(true);
    expect(error instanceof Error).toBe(true);
  }
});
