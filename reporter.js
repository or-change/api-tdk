const mocha = require('mocha');
const {
	tdkLog, progress, structure, end
} = require('./src/logger');
const IS_SCAN = process.env.TDK_MODE === 'scan';

function getNodeInfo(node) {
	const baseInfo = {
		title: node.title,
		filePath: node.file,
		titlePath: node.titlePath(),
		only: node.parent._onlySuites.indexOf(node) !== -1 || node.parent._onlyTests.indexOf(node) !== -1, //filterOnly的话结果和定义不符，但是和执行相同
		skip: node.isPending() ? true : false
	};

	if (node.type === 'test') {
		baseInfo.type = 'test';
		baseInfo.path = getPath(node);
	} else {
		baseInfo.type = 'suit';
		baseInfo.children = [];
		baseInfo.total = node.total();
	}

	return baseInfo;
}

const getPath = function (node) {
	if (node.type !== 'test') {
		return;
	}

	const path = [];

	while (node.parent) {
		const { tests, suites } = node.parent;

		const index = node.type === 'test' ? tests.indexOf(node) : suites.indexOf(node);

		path.push(index);

		node = node.parent;
	}

	return path;
}

const getStructure = function (node, structure) {
	const { suites, tests } = node;

	tests.forEach((test) => {
		const info = getNodeInfo(test);

		structure.children.push(info);
	});

	suites.forEach((suite) => {
		const info = getNodeInfo(suite); 
		
		structure.children.push(info);

		getStructure(suite, info);
	});

	return structure;
};

module.exports = function (runner) {
	mocha.reporters.Base.call(this, runner);
	
	structure(getStructure(runner.suite, {
		root: true,
		children: [],
		total: runner.total
	}));

	if (IS_SCAN) {
		runner.abort();
	}

  runner.on('start', function() {
		tdkLog({
			type: 'testStart',
			total: this.total
		});
	});

  runner.on('test', function(test) {
		progress();
		
		tdkLog({
			type: 'caseStart',
			path: getPath(test),
			title: test.title
		});
	});

  runner.on('test end', function(test) {
		tdkLog({
			type: 'caseEnd',
			path: getPath(test),
			title: test.title
		});
	});
	
  runner.on('pass', function(test) {
		tdkLog({
			type: 'casePassed',
			path: getPath(test),
			title: test.title
		});
  });

  runner.on('fail', function(test, err) {
		const { 
			stack
		} = err;

		tdkLog({
			type: 'caseFailed',
			path: getPath(test),
			title: test.title,
			error: stack
		});
  });

  runner.on('end', function() {
		tdkLog({
			type: 'testEnd'
		});

		end();
  });
}