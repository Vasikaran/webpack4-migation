class ChunkStatsPlugin {
	apply(compiler) {
		compiler.hooks.emit.tap('ChunkStatsPlugin', compilation => {
			compilation.chunkGroups.forEach(group => {
				let { chunks } = group;
				console.log(chunks[0].name, chunks[0].renderedHash);
			});
		});
	}
}

module.exports = ChunkStatsPlugin;
