const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

class CustomHmrPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('CustomHmrPlugin', (stats) => {
      if (stats.compilation.errors.length === 0) {
        console.log("Testing testing testing");
        // alert("Here");
        console.log(' Compilation succeeded! Dispatching custom event for HMR.');
        // Dispatch custom event here
        // For Node.js environment
        process.emit('customHmrSuccess', { status: 'success' });

        // If you want to communicate with other parts of your application,
        // consider using WebSockets, files, or another IPC mechanism.
      }
    });
  }
}

module.exports = {
  mode: 'development',
  devtool: "source-map",
  entry: {
    iframe: './src/iframe/index.tsx', // Path to your popup script
    popup: './src/popup/index.tsx'
    // options: './src/options/index.js', // Path to your options page script
    // background: './src/background.js', // Path to your background script
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  devServer: {
    static: './dist',
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'iframe.html',
      template: 'public/iframe.html',
      chunks: ['iframe'],
    }),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: 'public/popup.html',
      chunks: ['popup'],
    }),
    new CustomHmrPlugin(),
    new Dotenv()
    // new CopyWebpackPlugin({
    //     patterns: [
    //       { from: 'public/manifest.json', to: 'manifest.json' },
    //       // Copy other assets like icons
    //     ],
    //   })
    // new HtmlWebpackPlugin({
    //   filename: 'options.html',
    //   template: 'public/options.html',
    //   chunks: ['options'],
    // }),
    // Add more HtmlWebpackPlugin instances if you have more HTML files
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  devtool: 'inline-source-map',
};