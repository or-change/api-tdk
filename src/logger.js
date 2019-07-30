let tested = 0;

const log = exports.log = global.log ?  global.log : function (type, message) {
	console.log(type, message);
}

exports.tdkLog = function (message) {
	log('tdk', JSON.stringify(message));
}

exports.progress = global.progress ? global.progress : function () {
	tested++;
	console.log(tested);
}