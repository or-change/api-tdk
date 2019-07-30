module.exports = function install(type) {
	type.define('object', {
		Normalizer(compiler) {
			return function normalize(options) {
				const finalOptions = {
					type: 'object',
					properties: {},
					allowNull: [],
					additional: true
				};
	
				const {
					properties = finalOptions.properties,
					allowNull = finalOptions.allowNull,
					additional = finalOptions.additional
				} = options;
	
				if (typeof additional !== 'boolean') {
					throw new Error('Type object schemas `options.additional` MUST be a boolean.');
				}
	
				finalOptions.additional = additional;
	
				if (!Array.isArray(allowNull)) {
					throw new Error('Type object schemas `options.allowNull` MUST be array.');
				}
	
				if (typeof properties !== 'object') {
					throw new Error('Type object schemas `options.properties` MUST be object.');
				}
	
				for (const propertyName in properties) {
					finalOptions.properties[propertyName] =
						compiler.parse(properties[propertyName], false);
				}
	
				allowNull.forEach(propertyName => {
					if (!properties[propertyName]) {
						throw new Error('This property is NOT defined when set allowNull.');
					}
	
					finalOptions.allowNull.push(propertyName);
				});
	
				return finalOptions;
			};
		},
		Validator(options) {
			const validateMapping = {};
			const allowNull = options.allowNull.reduce((mapping, propertyName) => {
				mapping[propertyName] = true;

				return mapping;
			}, {});

			for(const propertyName in options.properties) {
				const propertyOptions = options.properties[propertyName];
				const _validate = type.registry[propertyOptions.type].Validator(propertyOptions);

				validateMapping[propertyName] = function validateWrap(propertyDataNode) {
					if (propertyDataNode === undefined) {
						throw new Error(`_.${propertyName} could not be undefined.`);
					}

					if (!allowNull[propertyName] && propertyDataNode === null) {
						throw new Error(`_.${propertyName} could NOT be null.`);
					} else if (propertyDataNode !== null) {
						_validate(propertyDataNode);
					}
				};
			}

			return function validate(dataNode) {
				if (typeof dataNode !== 'object') {
					throw new Error('An object expected.');
				}

				if (!options.additional) {
					const addtionalAttribute = 
						Object.keys(dataNode).find(property => !validateMapping[property]);

					if (addtionalAttribute) {
						throw new Error('Object has addtional attribute.');
					}
				}
				
				for (const propertyName in validateMapping) {
					validateMapping[propertyName](dataNode[propertyName]);
				}
			};
		}
	});

	type.define('array', {
		Normalizer(compiler) {
			return function normalize(options) {
				const finalOptions = {
					type: 'array',
					items: null,
					length: {
						min: 0,
						max: Infinity
					}
				};
	
				const {
					items = finalOptions.items,
					length = finalOptions.length
				} = options;
	
				if (items) {
					if (typeof items !== 'object') {
						throw new Error('Invalid array items.');
					}
	
					finalOptions.items = compiler.parse(items, false);
				}
	
				if (length) {
					if (typeof length !== 'object') {
						throw new Error('Invalid array length.');
					}

					finalOptions.length = length;
				}
	
				return finalOptions;
			};
		},
		Validator(options) {
			const { items, length} = options;
			const itemValidate = type.registry[items.type].Validator(items);

			return function validate(dataNode) {
				if (!Array.isArray(dataNode)) {
					throw new Error('An array expected.');
				}

				if (dataNode.length < length.min || dataNode.length > length.max) {
					throw new Error('Array length is out of range.');
				}

				dataNode.forEach(item => itemValidate(item));
			};
		}
	});
};