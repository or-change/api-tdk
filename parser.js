const register = {
	testStart({
		total
	}) {
		return `项目测试开始，待测用例${total}条`;
	},
	caseTest({
		title
	}) {
		return `用例${title}，开始测试`;
	},
	casePassed({
		title
	}) {
		return `用例${title}，通过测试`;
	},
	caseFailed({
		title, error
	}) {
		return `用例${title}，测试失败\n详细信息：${error}`;
	},
	testEnd() {
		return '项目测试结束';
	}
};

module.export = function (parser) {
	if (parser.tdk) {
		return;
	}

	parser.tdk = function (message) {
		const info = JSON.parse(message);

		if (register[info.type]) {
			return register[info.type](message);
		}
	}
};