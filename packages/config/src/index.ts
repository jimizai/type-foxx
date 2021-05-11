import { Module } from "@jimizai/decorators";
import { resolve } from "path";

export * from "./service";

@Module({ srcDir: resolve(__dirname, "./") })
export class ConfigModule {}
