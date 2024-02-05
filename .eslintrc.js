module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		'plugin:vue/vue3-recommended',
		'eslint:recommended',
		'@vue/prettier',
	],
	parserOptions: {
		parser: 'babel-eslint',
	},
	rules: {
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto',
				printWidth: 80,
				trailingComma: 'es5',
				singleQuote: true,
				semi: true,
				useTabs: true,
				tabWidth: 2,
			},
		],
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'vue/component-tags-order': [
			'error',
			{
				order: ['template', 'script', 'style'],
			},
		],
	},
};
