const struct = require('./struct');
const simple = require('./simple');
const native = require('./native');
const model = require('./definition');

const context = {};

const type = {
	registry: {},
	Schemas: {
		assert(options) {
			if (typeof options !== 'object') {
				throw new Error('`options` items MUST be an object');
			}
		
			const typeSymbol = options.type;
		
			if (typeof typeSymbol !== 'string') {
				throw new Error('`options.type` MUST be a string');
			}
		
			if (!type.registry[typeSymbol]) {
				throw new Error('type named `options.type` is NOT defined.');
			}
		},
		compiler() {
			const normalizer = {};
			const compiler = {
				parse(schemas, root = true) {
					return normalizer[schemas.type](schemas, root);
				},
				build(schemas) {
					return type.registry[schemas.type].Validator(compiler.parse(schemas));
				}
			};

			for (const symbol in type.registry) {
				const _normalize = type.registry[symbol].Normalizer(compiler);

				normalizer[symbol] = function normalize(options, root) {
					type.Schemas.assert(options);

					return _normalize(options, root);
				};
			}

			return compiler;
		},
	},
	define(typeSymbol, options) {
		type.registry[typeSymbol] = options;
	}
};

[struct, simple, native, model].forEach(install => install(type, context));

exports.schemas = function (schemas, data) {
	const { build } = type.Schemas.compiler();
	const validator = build(schemas);

	return validator(data);
};

exports.definition = function (symbol, schemas) {
	const validate = type.Schemas.compiler().build(schemas);

	context[symbol] = validate;
};