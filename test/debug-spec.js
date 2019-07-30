const tdkAssert = require('../src/assert')
const assert = require('assert')

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

		it('number', function() {
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

		it('number', function() {
			try {
				tdkAssert.schemas(schema, '1');
			} catch (e) {
				tdkAssert.equal(
					e.message,
					'A number expected.')
			}
		});
	});

	describe.only('booleant validate', function() {
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

		it('number', function() {
			try {
				tdkAssert.schemas(schema, '1');
			} catch (e) {
				tdkAssert.equal(
					e.message,
					'A number expected.')
			}
		});
	});

	describe('#indexOf()3', function() {
		it('should return -3 when the value is not present', function() {
			assert.equal([1, 2, 3].indexOf(4), -1);
		});
		it('should return -1 when the value is not present', function() {
			assert.equal([1, 2, 3].indexOf(4), -1);
		});
	});

	it('should return -1 when the value is not present', function() {
		assert.equal([1, 2, 3].indexOf(4), -1);
	});
});