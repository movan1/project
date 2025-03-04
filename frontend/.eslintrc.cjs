module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended",
		"airbnb",
		"airbnb-typescript/base",
		"plugin:perfectionist/recommended-natural",
	],
	parserOptions: {
		"project": ["./tsconfig.app.json"]
	},
	ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'tailwind.config.js', 'postcss.config.js'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh', 'perfectionist'],
	rules: {
		"no-useless-escape": 0,
		"no-underscore-dangle": 0,
		"no-param-reassign": 0,
		"no-console": ["error", { allow: ["warn", "error"] }],
		"no-restricted-syntax": 0,
		"object-curly-newline": ["error", { "multiline": true, "minProperties": 3 }],
		"react/react-in-jsx-scope": "off",
		"react-refresh/only-export-components": [
			'warn',
			{ allowConstantExport: true },
		],
		"react/jsx-filename-extension": [1, { "extensions": [".ts", ".tsx"] }],
		"react/function-component-definition": 0,
		"react/jsx-props-no-spreading": 0,
		"@typescript-eslint/comma-dangle": ["error", {
			"generics": "always",
			"arrays": "never",
			"enums": "never",
			"tuples": "never",
			"objects": "never",
			"imports": "never",
			"exports": "never",
			"functions": "never"
		}],
		"import/no-extraneous-dependencies": 0,
		"import/prefer-default-export": 0,
		"import/extensions": [
			"error",
			"ignorePackages",
			{
				"": "never",
				"js": "never",
				"jsx": "never",
				"ts": "never",
				"tsx": "never"
			}
		],
		"perfectionist/sort-imports": [
			"error",
			{
				"type": "natural",
				"order": "asc",
				"groups": [
					"react",
					["builtin", "external"],
					"type",
					"internal-type",
					"app",
					"pages",
					"widgets",
					"features",
					"entities",
					"ui",
					"shared",
					"icons",
					"internal",
					"styled",
					["parent-type", "sibling-type", "index-type"],
					["parent", "sibling", "index"],
					"side-effect",
					"style",
					"object",
					"unknown"
				],
				"custom-groups": {
					"value": {
						"react": ["react", "react-*", "styled-*", 'framer-motion'],
						"styled": "**/*styled*",
						"ui": "@shared/ui/**",
						"icons": "@icons",
						"app": "@app/**",
						"pages": "@pages/**",
						"widgets": "@widgets/**",
						"features": "@features/**",
						"entities": "@entities/**",
						"shared": "@shared/**",
					},
					"type": {
						"react": "react",
						"styled": "**/*styled*",
						"ui": "@shared/ui/**",
						"app": "@app/**",
						"pages": "@pages/**",
						"widgets": "@widgets/**",
						"features": "@features/**",
						"entities": "@entities/**",
						"shared": "@shared/**",
					}
				},
				"newlines-between": "always",
			}
		],
		"perfectionist/sort-jsx-props": [
			"error",
			{
				"groups": ["multiline", "unknown", "shorthand"],
			}
		],
		"perfectionist/sort-objects": [2, {
			"ignore-pattern": [
				'sig*'
			]
		}]
	},
}
