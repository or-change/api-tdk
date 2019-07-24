function getNodeInfo(node) {
	const baseInfo = {
		title: node.title,
		filePath: node.file,
		titlePath: node.titlePath(),
		only: node.parent._onlySuites.indexOf(node) !== -1 || node.parent._onlyTests.indexOf(node) !== -1,
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

const getPath = exports.getPath = function (node) {
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

const getCaseTree = exports.getCaseTree = function (node, caseTree = {
	root: true,
	children: []
}) {
	const { suites, tests } = node;

	tests.forEach((test) => {
		const info = getNodeInfo(test);

		caseTree.children.push(info);
	});

	suites.forEach((suite) => {
		const info = getNodeInfo(suite); 
		
		caseTree.children.push(info);

		getCaseTree(suite, info);
	});

	return caseTree;
};