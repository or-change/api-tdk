const mocha = require('mocha');
const IS_SCAN = process.env.TDK_MODE === 'scan';

const {
	getCaseTree, getPath
} = require('./builder');
const {
	log, progress
} = require('./collector.js');

function useLog(message) {
	log('tdk', JSON.stringify(message));
}

module.exports = function (runner) {
  mocha.reporters.Base.call(this, runner);

  runner.on('start', function() {
		const caseTree = getCaseTree(this.suite);

		useLog({
			type: 'testStart',
			caseTree,
			total: this.total
		});

		if (IS_SCAN) {
			runner.abort();
		}
	});

  runner.on('test', function(test) {
		useLog({
			type: 'caseTest',
			path: getPath(test),
			title: test.title
		});
	});

  runner.on('test end', function() {
		progress();
	});
	
  runner.on('pass', function(test) {
		useLog({
			type: 'casePassed',
			path: getPath(test),
			title: test.title
		});
  });

  runner.on('fail', function(test, err) {
		const { 
			stack
		} = err;

		useLog({
			type: 'caseFailed',
			path: getPath(test),
			title: test.title,
			error: stack
		});
  });

  runner.on('end', function() {
		useLog({
			type: 'testEnd'
		});
  });
}