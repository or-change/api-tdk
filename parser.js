const NOOP = () => {};

function normalize(options) {
	const finalOptions = {
		on: {
			message: NOOP,
			success: NOOP,
			fail: NOOP,
			casestart: NOOP,
			caseend: NOOP
		}
	};

	const {
		on: _on = finalOptions.on
	} = options;

	if (typeof _on !== 'object') {
		throw new Error('Invalid `options.on` MUST be an object.');
	}
	const {
		message: _message = finalOptions.on.message,
		success: _success = finalOptions.on.success,
		fail: _fail = finalOptions.on.fail,
		casestart: _casestart = finalOptions.on.casestart,
		caseend: _caseend = finalOptions.on.caseend
	} = _on;

	if (typeof _message !== 'function') {
		throw new Error('Invalid `options.on.message` MUST be an function.');
	}

	finalOptions.on.message = _message;

	if (typeof _success !== 'function') {
		throw new Error('Invalid `options.on.success` MUST be an function.');
	}

	finalOptions.on.success = _success;

	if (typeof _fail !== 'function') {
		throw new Error('Invalid `options.on.fail` MUST be an function.');
	}

	finalOptions.on.fail = _fail;

	if (typeof _casestart !== 'function') {
		throw new Error('Invalid `options.on.casestart` MUST be an function.');
	}

	finalOptions.on.casestart = _casestart;

	if (typeof _caseend !== 'function') {
		throw new Error('Invalid `options.on.caseend` MUST be an function.');
	}

	finalOptions.on.caseend = _caseend;

	return finalOptions;
}

module.exports = function Parser(options) {
	const {
		on
	} = normalize(options);

	return {
		write(logMsg) {
			const info = JSON.parse(logMsg);

			if (info.type === 'casePassed') {
				on.success(info.path);
			}

			if (info.type === 'caseFailed') {
				on.fail(info.path, info.error );
			}

			if (info.type === 'caseStart') {
				on.casestart(info.path);
			}

			if (info.type === 'caseEnd') {
				on.caseend(info.path);
			}
		
			// on.message(info);
		}
	}
}