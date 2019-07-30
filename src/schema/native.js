module.exports = function install(Type) {
	Type.define('date', {
		Normalizer() {
			return function normalize(options) {
				const finalOptions = {
					type: 'date'
				};
				
				return {
					type: 'date'
				};
			};
		},
		Validator() {
			return function validator(options) {

			};
		}
	});
};