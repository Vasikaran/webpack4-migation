let originalChunkFileName;

class ChunkManifestReplacePlugin {
	constructor(options) {
		this.replacer = options.replacer;
	}

	apply(compiler) {
		compiler.hooks.thisCompilation.tap(
			'ChunkManifestReplacePlugin',
			compilation => {
				let { mainTemplate } = compilation;
				let { output } = compilation.compiler.options;
				mainTemplate.hooks.requireEnsure.tap(
					'ChunkManifestReplacePlugin',
					(source, chunk) => {
						originalChunkFileName = output.chunkFilename;
						output.chunkFilename = '__CHUNK_MANIFEST__';
						return source;
					}
				);
			}
		);

		compiler.hooks.compilation.tap(
			'ChunkManifestReplacePlugin',
			compilation => {
				let { mainTemplate } = compilation;
				let { output } = compilation.compiler.options;
				mainTemplate.hooks.requireEnsure.tap(
					'ChunkManifestReplacePlugin',
					(source, chunk, hash, chunkIdVar) => {
						let { output } = compilation.compiler.options;
						output.chunkFilename = originalChunkFileName;
						let regex = new RegExp('"__CHUNK_MANIFEST__"', 'g');
						return source.replace(
							regex,
							this.replacer + '[' + chunkIdVar + ']'
						);
					}
				);
			}
		);
	}
}

module.exports = ChunkManifestReplacePlugin;
