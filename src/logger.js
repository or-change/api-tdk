let tested = 0;

function isExist(type) {
	return global._TDK_ && global._TDK_[type];
}

const log = exports.log = isExist('log') ? global._TDK_.log : function (type, message) {
	console.log(type, message);
}

exports.progress = isExist('progress') ? global._TDK_.progress : function () {
	tested++;
	console.log(tested);
}

exports.structure = isExist('structure') ? global._TDK_.structure : function (structure) {
	console.log('structure', structure);
}

exports.end = isExist('end') ? global._TDK_.end : function () {
	console.log('end');
}

exports.tdkLog = function (message) {
	log('tdk', JSON.stringify(message));
}