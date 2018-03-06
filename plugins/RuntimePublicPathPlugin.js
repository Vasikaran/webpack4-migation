
class RuntimePublicPathPlgin {
	constructor(options) {
		this.publicPathCallback = options.publicPathCallback;
	}

	apply(compiler) {

        let { publicPathCallback } = this;

		compiler.hooks.thisCompilation.tap(
			'RuntimePublicPathPlgin',
			compilation => {
				compilation.mainTemplate.hooks.requireExtensions.tap(
					'RuntimePublicPathPlgin',
					function(source, chunkm, hash) {
						let buf = [];
                        let wrapperName = 'requireEnsureWrapper';
						buf.push(source);
						buf.push('');
						buf.push('// Dynamic assets path override ');
						buf.push(`var ${wrapperName} = ${this.requireFn}.e;`);
						buf.push(`${this.requireFn}.e = function requireEnsure(chunkId) {`)
                        buf.push(`\t${publicPathCallback}(${this.requireFn}, chunkId);`);
                        buf.push(`\treturn ${wrapperName}(chunkId);`);
                        buf.push(`}`);

						return buf.join('\n');
					}.bind(compilation.mainTemplate)
				);
			}
		);
	}
}

module.exports = RuntimePublicPathPlgin;
