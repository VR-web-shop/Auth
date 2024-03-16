

export default {
	input: 'contract_api.js',
	output: {
		file: './dist_contract_api/bundle.js',
		format: 'cjs'
	},
	external: ['jsonwebtoken']
};
