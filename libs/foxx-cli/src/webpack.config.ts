import TsConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
// eslint-disable-next-line
const nodeExternals = require('webpack-node-externals');
// eslint-disable-next-line
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

interface Options {
  entry: string;
  outputPath: string;
  filename: string;
  tsconfig: string;
}

const extensions = ['.ts', '.tsx', '.mjs', '.js', '.jsx'];
const mainFields = ['es2015', 'module', 'main'];

export function generateWebpackConfig(opts: Options) {
  return {
    entry: {
      main: [opts.entry],
    },
    devtool: 'source-map',
    mode: process.env.NODE_ENV || 'development',
    output: {
      path: opts.outputPath,
      filename: opts.filename,
      libraryTarget: 'commonjs',
    },
    module: {
      rules: [
        {
          test: /\.([jt])sx?$/,
          loader: require.resolve(`ts-loader`),
          exclude: /node_modules/,
          options: {
            configFile: opts.tsconfig,
            transpileOnly: true,
            // https://github.com/TypeStrong/ts-loader/pull/685
            experimentalWatchApi: true,
          },
        },
      ],
    },
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()],
    resolve: {
      extensions,
      alias: {},
      plugins: [
        new TsConfigPathsPlugin({
          configFile: opts.tsconfig,
          extensions,
          mainFields,
        }),
      ],
      mainFields,
    },
    performance: {
      hints: false,
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          enabled: true,
          configFile: opts.tsconfig,
          memoryLimit: 2018,
        },
      }),
    ],
    watch: true,
    target: 'node',
    node: false,
  };
}
