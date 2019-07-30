const assert = require('assert');
const {
	tdkLog
} = require('./logger');
const {
	schemas
} = require('./schema');

function tdkAssert(...args) {
	tdkLog({
		type: 'caseAssert',
		method: 'ok',
		args
	});

	return assert(...args);
}

Object.keys(assert)
	.filter(key => typeof assert[key] === 'function')
	.reduce((tdkAssert, methodName) => {
		tdkAssert[methodName] = function (...args) {
			tdkLog({
				type: 'caseAssert',
				method: methodName,
				args
			});

			return assert[methodName](...args);
		}

		return tdkAssert;
	}, tdkAssert);

tdkAssert.schemas = function (...args) {
	tdkLog({
		type: 'caseAssert',
		method: 'schemas',
		args
	});

	schemas(...args);
};

module.exports = tdkAssert;
