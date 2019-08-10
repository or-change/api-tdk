const tdkAssert = require('../src/assert')
const { definition } = require('../src/schema');

describe('tdkAssert.schemas', function(runner) {
	describe('string validate', function() {
		const schema = {
			type: 'string',
			pattern: /^[0-9]+$/
		};

		it('normaly string', function() {
			tdkAssert.schemas(schema, '1');
		});

		it('unexpect string', function() {
			try {
				tdkAssert.schemas(schema, '1abc');
			} catch (e) {
				tdkAssert.equal(e.message, 'The string is NOT match the pattern /^[0-9]+$/.');
			}
		});

		it('data is number', function() {
			try {
				tdkAssert.schemas(schema, 1);
			} catch (e) {
				tdkAssert.equal(
					e.message,
					'A string value expected.')
			}
		});
	});

	describe('number validate', function() {
		const schema = {
			type: 'number',
			range: [{
				gt: {
					value: 4
				}
			}]
		};

		it('normaly number', function() {
			tdkAssert.schemas(schema, 5);
		});

		it('unexpect number', function() {
			try {
				tdkAssert.schemas(schema, 3);
			} catch (e) {
				tdkAssert.equal(e.message, 'The value does not hit the range.');
			}
		});

		it('data is string', function() {
			try {
				tdkAssert.schemas(schema, '1');
			} catch (e) {
				tdkAssert.equal(
					e.message,
					'A number expected.')
			}
		});
	});

	describe('boolean validate', function() {
		const schema = {
			type: 'boolean'
		};

		it('normaly number', function() {
			tdkAssert.schemas(schema, true);
		});

		it('data is string', function() {
			try {
				tdkAssert.schemas(schema, '1');
			} catch (e) {
				tdkAssert.equal(e.message, 'A boolean value expected.');
			}
		});

		it('data is number', function() {
			try {
				tdkAssert.schemas(schema, 1);
			} catch (e) {
				tdkAssert.equal(
					e.message,
					'A boolean value expected.')
			}
		});
	});

	describe('array validate', function() {
		const schema = {
			type: 'array',
			items: {
				type: 'number',
				range: [{
					gt: {
						value: 4
					}
				}]
			},
			length: {
				min: 1,
				max: 2
			}
		};

		it('normaly array', function() {
			tdkAssert.schemas(schema, [
				5, 6
			]);
		});

		it('unexpect array', function() {
			try {
				tdkAssert.schemas(schema, []);
			} catch (e) {
				tdkAssert.equal(e.message, 'Array length is out of range.');
			}
		});

		it('data is number', function() {
			try {
				tdkAssert.schemas(schema, 1);
			} catch (e) {
				tdkAssert.equal(
					e.message,
					'An array expected.')
			}
		});
	});
	
	describe('object validate', function() {
		const schema = {
			type: 'object',
			properties: {
				name: {
					type: 'string'
				},
				age: {
					type: 'number'
				},
				email: {
					type: 'string'
				}
			},
			allowNull: ['email'],
			additional: false
		};

		it('normaly object', function() {
			tdkAssert.schemas(schema, {
				name: 'test1',
				age: 10,
				email: null
			});
		});

		it('allowNull attribute is undefined', function() {
			try {
				tdkAssert.schemas(schema, {
					name: 'test1',
					age: 10
				});
			} catch (e) {
				tdkAssert.equal(e.message, '_.email could not be undefined.');
			}
		});

		it('has additional attribute', function() {
			try {
				tdkAssert.schemas(schema, {
					name: 'test1',
					age: 10,
					email: null,
					id: '1234567'
				});
			} catch (e) {
				tdkAssert.equal(
					e.message,
					'Object has addtional attribute.')
			}
		});

		it('Unexpected property', function() {
			try {
				tdkAssert.schemas(schema, {
					name: 'test1',
					age: '10',
					email: null,
				});
			} catch (e) {
				tdkAssert.equal(
					e.message,
					'A number expected.')
			}
		});

		it('Unexpected data', function() {
			try {
				tdkAssert.schemas(schema, 1);
			} catch (e) {
				tdkAssert.equal(
					e.message,
					'An object expected.')
			}
		});
	});

	describe('definition validate', function() {
		definition('Person', {
			type: 'object',
			properties: {
				name: {
					type: 'string'
				},
				age: {
					type: 'number'
				},
				email: {
					type: 'string'
				}
			},
			allowNull: ['email'],
			additional: false
		});

		const schema = {
			type: 'object',
			properties: {
				children: {
					type: 'array',
					items: {
						type: 'definition',
						symbol: 'Person'
					}
				}
			}
		};

		it('normaly object', function() {
			tdkAssert.schemas(schema, {
				children: [
					{
						name: 'test1',
						age: 10,
						email: null
					}
				]
			});
		});

		it('Symbol is not a string', function() {
			try {
				definition(1, {
					type: 'object'
				});

				tdkAssert.schemas({
					type: 'object',
					properties: {
						children: {
							type: 'array',
							items: {
								type: 'definition',
								symbol: 1
							}
						}
					}
				}, {
					children: [
						{
							name: 'test1',
							age: 10,
							email: null
						}
					]
				});
			} catch (e) {
				tdkAssert.equal(e.message, 'Definition symbol must be a string.');
			}
		});

		it('sschema root is definition', function() {
			try {
				definition('person2', {
					type: 'object'
				});

				tdkAssert.schemas({
					type: 'definition',
					symbol: 'person2'
				}, {
					name: 'test1',
					age: 10,
					email: null,
					id: '1234567'
				});
			} catch (e) {
				tdkAssert.equal(
					e.message,
					'Schemas root must NOT be a definition.')
			}
		});

		it('Unexpected property', function() {
			try {
				tdkAssert.schemas(schema, {
					name: 'test1',
					age: '10',
					email: null,
				});
			} catch (e) {
				tdkAssert.equal(
					e.message,
					'_.children could not be undefined.')
			}
		});
	});
});