const log = [
	{"type":"testStart","total":27},
	{"type":"caseStart","path":[0,0,0],"title":"normaly string"},
	{"type":"caseAssert","method":"schemas","args":[{"type":"string","pattern":{}},"1"]},
	{"type":"casePassed","path":[0,0,0],"title":"normaly string"},
	{"type":"caseEnd","path":[0,0,0],"title":"normaly string"},
	{"type":"caseStart","path":[2,0,0],"title":"data is number"},
	{"type":"caseAssert","method":"schemas","args":[{"type":"string","pattern":{}},1]},
	{"type":"caseAssert","method":"equal","args":["A string value expected.","A string value expecte."]},
	{"type":"caseFailed","path":[2,0,0],"title":"data is number","error":"AssertionError [ERR_ASSERTION]: 'A string value expected.' == 'A string value expecte.'\n    at Function.tdkAssert.<computed> [as equal] (C:\\Users\\12652\\Documents\\code\\DOING_PROJECT\\TESTING\\api-tdk\\src\\assert.js:29:29)\n    at Context.<anonymous> (C:\\Users\\12652\\Documents\\code\\DOING_PROJECT\\TESTING\\api-tdk\\test\\schema-spec.js:27:15"},
	{"type":"caseEnd","path":[2,0,0],"title":"data is number"},
	{"type":"caseStart","path":[0,1,0],"title":"normaly number"},
	{"type":"caseAssert","method":"schemas","args":[{"type":"number","range":[{"gt":{"value":4}}]},5]},
	{"type":"casePassed","path":[0,1,0],"title":"normaly number"},
	{"type":"caseEnd","path":[0,1,0],"title":"normaly number"}
].map(item => JSON.stringify(item));
const tdkAssert = require('../src/assert');
const Parser = require('../parser');

describe.only('Parser', function() {
	describe('create a parser', function() {
		it('options.on is not an object', function () {
			try {
				Parser({
					on: ''
				});
			} catch (e) {
				tdkAssert.equal(
					e.message,
					'Invalid `options.on` MUST be an object.')
			}
		});

		it('options.on.message is not a function', function () {
			try {
				Parser({
					on: {
						message: ''
					}
				});
			} catch (e) {
				tdkAssert.equal(
					e.message,
					'Invalid `options.on.message` MUST be an function.')
			}
		});

		it('options.on.success is not a function', function () {
			try {
				Parser({
					on: {
						success: ''
					}
				});
			} catch (e) {
				tdkAssert.equal(
					e.message,
					'Invalid `options.on.success` MUST be an function.')
			}
		});

		it('options.on.fail is not a function', function () {
			try {
				Parser({
					on: {
						fail: ''
					}
				});
			} catch (e) {
				tdkAssert.equal(
					e.message,
					'Invalid `options.on.fail` MUST be an function.')
			}
		});

		it('options.on.casestart is not a function', function () {
			try {
				Parser({
					on: {
						casestart: ''
					}
				});
			} catch (e) {
				tdkAssert.equal(
					e.message,
					'Invalid `options.on.casestart` MUST be an function.')
			}
		});

		it('options.on.caseend is not a function', function () {
			try {
				Parser({
					on: {
						caseend: ''
					}
				});
			} catch (e) {
				tdkAssert.equal(
					e.message,
					'Invalid `options.on.caseend` MUST be an function.')
			}
		});
	});

	describe('parser log', function () {
		const success = [];
		const fail = [];
		const msg = {};

		let currentCase = null;

		const parser = Parser({
			on: {
				success(path) {
					success.push(path.join('-'));
				},
				fail(path) {
					fail.push(path.join('-'));
				},
				casestart(path) {
					msg[path.join('-')] = [];
					currentCase = path.join('-');
				},
				caseend() {
					currentCase = null;
				}
			}
		});

		log.forEach((item) => {
			parser.write(item);
			if (currentCase) {
				msg[currentCase].push(item);
			}
		});


		it('success reuslt', function () {
			tdkAssert.deepEqual(success, [
				"0-0-0","0-1-0"
			]);
		});

		it('fail reuslt', function () {
			tdkAssert.deepEqual(fail, [
				"2-0-0"
			]);
		});

		it('structure reuslt', function () {
			tdkAssert.deepEqual(msg, {
				'0-0-0': [
					"{\"type\":\"caseStart\",\"path\":[0,0,0],\"title\":\"normaly string\"}",
					"{\"type\":\"caseAssert\",\"method\":\"schemas\",\"args\":[{\"type\":\"string\",\"pattern\":{}},\"1\"]}",
					"{\"type\":\"casePassed\",\"path\":[0,0,0],\"title\":\"normaly string\"}"
				],
				'2-0-0': [
					"{\"type\":\"caseStart\",\"path\":[2,0,0],\"title\":\"data is number\"}",
					"{\"type\":\"caseAssert\",\"method\":\"schemas\",\"args\":[{\"type\":\"string\",\"pattern\":{}},1]}",
					"{\"type\":\"caseAssert\",\"method\":\"equal\",\"args\":[\"A string value expected.\",\"A string value expecte.\"]}",
					"{\"type\":\"caseFailed\",\"path\":[2,0,0],\"title\":\"data is number\",\"error\":\"AssertionError [ERR_ASSERTION]: 'A string value expected.' == 'A string value expecte.'\\n    at Function.tdkAssert.<computed> [as equal] (C:\\\\Users\\\\12652\\\\Documents\\\\code\\\\DOING_PROJECT\\\\TESTING\\\\api-tdk\\\\src\\\\assert.js:29:29)\\n    at Context.<anonymous> (C:\\\\Users\\\\12652\\\\Documents\\\\code\\\\DOING_PROJECT\\\\TESTING\\\\api-tdk\\\\test\\\\schema-spec.js:27:15\"}"
				],
				'0-1-0': [
					'{"type":"caseStart","path":[0,1,0],"title":"normaly number"}',
					'{"type":"caseAssert","method":"schemas","args":[{"type":"number","range":[{"gt":{"value":4}}]},5]}',
					'{"type":"casePassed","path":[0,1,0],"title":"normaly number"}'
				]
			});
		});

	});
});