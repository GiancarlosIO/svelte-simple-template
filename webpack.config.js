const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
	devtool: 'source-map',
	entry: {
		app: path.join(__dirname, './src/index.js'),
	},
	output: {
		path: path.join(__dirname, './dist'),
		filename: '[name].min.js',
		chunkFilename: `[name].chunk.js`,
		// tell to webpack to server the files (index.hmtl) from the root localhost:3000
		publicPath: '/',
		pathinfo: false,
	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte')
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true,
						// preprocess: require('svelte-preprocess')()
					}
				}
			},
			{
				test: /\.css/,
				use: [
					isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader'
				]
			}
		]
	},
	plugins: [],
};

if (!isProduction) {
	config.mode = 'development';
	config.devServer = {
		publicPath: '/',
	}

	const htmlWebpackPlugin = new HtmlWebpackPlugin({
		template: './src/index.html',
		// it is used to server the html file in dev mode too!!.
		// So, with this config the html file will be serverd here: localhost:3000/dist/index.html
		// filename: './dist/index.html',
	});
	config.plugins.push(htmlWebpackPlugin);
}

if (isProduction) {
	config.devtool = 'none';
	config.mode = 'production';
	config.output.filename = '[name].[hash:8].min.js';
	config.output.chunkFilename = `[name].[hash:8].chunk.js`,

	config.module.rules.push({
		test: /\.css$/,
		use: MiniCssExtractPlugin.loader,
	});

	const miniCssExtractPlugin = new MiniCssExtractPlugin({
		filename: '[name].[hash:8].min.css',
		chunkFilename: '[id].min.css'
	})
	config.plugins.push(miniCssExtractPlugin);
}

module.exports = config;