module.exports = function install(type) {
	const symbolReg = type.DefinitionSymbolReg = /^[A-Z][A-Za-z0-9]*/;

	type.define('definition', {
		Normalizer() {
			return function normalize(options, root) {
				if (root) {
					throw new Error('Schemas root must NOT be a definition.');
				}
	
				const finalOptions = {
					type: 'definition',
				};
	
				const { symbol } = options;
	
				if (typeof symbol !== 'string') {
					throw new Error('Definition symbol must be a string.');
				}
				
				if (!symbolReg.test(symbol)) {
					throw new Error('Invalid Definition symbol.');
				}
	
				return finalOptions;
			};
		},
		Validator(options) {
			return function validate(data) {
				return context[options.symbol](data);
			};
		}
	});
};