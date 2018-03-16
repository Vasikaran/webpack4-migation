const optimizeJS = require('optimize-js');
const fs = require('fs');
const path = require('path');
const { RawSource } = require('webpack-sources');
var { Readable } = require('stream');

let writeFile = (outputPath, src) => {
	return new Promise((resolve, reject) => {
		let inStr = new Readable();
		inStr._read = () => {};
		inStr.push(src);
		inStr.push(null);
		let outStr = fs.createWriteStream(outputPath);
		outStr.on('finish', () => {
			resolve();
		});
		inStr.pipe(outStr);
	});
};

class OptimizeJSPlugin {
	apply(compiler) {
		compiler.hooks.afterEmit.tap('OptimizeJSPlugin', stats => {
			let outputPath = stats.compilation.options.output.path;

			let jsPath = path.join(outputPath, 'js');
			let smapJsPath = path.join(outputPath, 'js-sm');
			if (!fs.existsSync(smapJsPath)) {
				fs.mkdirSync(smapJsPath);
			}

			let promises = [];
			let files = fs.readdirSync(jsPath);
			files.forEach(file => {
				let src = fs.readFileSync(path.join(jsPath, file)).toString();
				let optimizedSrc = optimizeJS(src);
				src += `\n//# sourceMappingURL=../smap/${file}.map`;
				promises.push(writeFile(path.join(jsPath, file), optimizedSrc));
				promises.push(writeFile(path.join(smapJsPath, file), src));
			});

			Promise.all(promises).then(() => {
				console.log('Optimized completed');
			});
		});
	}
}

module.exports = OptimizeJSPlugin;
