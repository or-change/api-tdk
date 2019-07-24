const {
	log, progress
} = global;

let tested = 0;

exports.log = log ? log : function (type, message) {
	console.log(type, message);
}

exports.progress = progress ? progress : function () {
	tested++;

	console.log(tested);
}