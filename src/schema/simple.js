module.exports = function install(type) {
	type.define('number', {
		Normalizer() {
			return function normalize(options) {
				const finalOptions = {
					type: 'number',
					range: [{
						lt: { value: Infinity, equal: false },
						gt: { value: -Infinity, equal: false }
					}]
				};

				const {
					range = finalOptions.range
				} = options;

				if (!Array.isArray(range)) {
					throw new Error('Number range MUST be an array.');
				}

				finalOptions.range = range.map(options => {
					if (typeof options === 'number') {
						return {
							lt: { value: options, equal: true },
							gt: { value: options, equal: true }
						};
					}

					if (typeof options === 'object') {
						const finalOptions = {
							lt: { value: Infinity, equal: false },
							gt: { value: -Infinity, equal: false }
						};

						const {
							lt = finalOptions.lt,
							gt = finalOptions.gt
						} = options;

						if (lt) {
							const {
								value = finalOptions.lt.value,
								equal = finalOptions.lt.equal
							} = lt;

							if (typeof value !== 'number') {
								throw new Error('Number range[].lt.value MUST be a number.');
							}

							finalOptions.lt.value = value;

							if (typeof equal !== 'boolean') {
								throw new Error('Number range[].lt.equal MUST be a boolean.');
							}

							finalOptions.lt.equal = equal;
						}

						if (gt) {
							const {
								value = finalOptions.lt.value,
								equal = finalOptions.lt.equal
							} = gt;

							if (typeof value !== 'number') {
								throw new Error('Number range[].gt.value MUST be a number.');
							}

							finalOptions.gt.value = value;

							if (typeof equal !== 'boolean') {
								throw new Error('Number range[].gt.equal MUST be a boolean.');
							}

							finalOptions.lt.equal = equal;
						}

						if (finalOptions.lt.value < finalOptions.gt.value) {
							throw new Error('It should range[].gt.value < range[].lt.value.');
						}

						return finalOptions;
					}
				});

				return finalOptions;
			};
		},
		Validator(options) {
			return function validate(data) {
				if (typeof data !== 'number') {
					throw new Error('A number expected.');
				}
	
				const hit = options.range.find(options => {
					const { lt, gt } = options;

					if (gt.equal ? data < gt.value : data <= gt.value) {
						return false;
					}

					if (lt.equal ? data > lt.value : data >= lt.value) {
						return false;
					}

					return true;
				});
	
				if (!hit) {
					throw new Error('The value does not hit the range.');
				}
			};
		}
	});

	type.define('string', {
		Normalizer() {
			return function normalize(options) {
				const finalOptions = {
					type: 'string',
					pattern: /.*/
				};
	
				const {
					pattern = finalOptions.pattern
				} = options;

				if (!(pattern instanceof RegExp)) {
					throw new Error('Pattern MUST be a RegExp.');
				}
				
				finalOptions.pattern = pattern;
	
				return finalOptions;
			};
		},
		Validator(options) {
			return function (data) {
				if (typeof data !== 'string') {
					throw new Error('A string value expected.');
				}

				if (!options.pattern.test(data)) {
					throw new Error(`The string is NOT match the pattern ${options.pattern}.`);
				}
			};
		}
	});

	type.define('boolean', {
		Normalizer() {
			return function normalize() {
				return { type: 'boolean' };
			};
		},
		Validator() {
			return function (data) {
				if (typeof data !== 'boolean') {
					throw new Error('A boolean value expected.');
				}
			};
		}
	});
};