module.exports = {
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	parserOptions: {
		project: "./tsconfig.json"
	},
	rules: {
		"no-var": "error",
		"@typescript-eslint/consistent-type-definitions": ["error", "interface"],
		"import/no-unresolved": 0,
		semi: "off",
		"@typescript-eslint/brace-style": 0,
		"@typescript-eslint/interface-name-prefix": [0, "error", "always"],
		"@typescript-eslint/semi": [0, "error", "always"],
		"array-bracket-newline": [
			"error",
			{
				multiline: true
			}
		],
		"padded-blocks": ["error", "never"],
		"no-extra-parens": 0,
		"import/no-cycle": 0,
		"array-bracket-spacing": ["error", "never"],
		"no-negated-condition": 0,
		"@typescript-eslint/no-floating-promises": 0,
		"@typescript-eslint/no-extra-parens": 0,
		"@typescript-eslint/no-empty-interface": 0,
		"@typescript-eslint/no-explicit-any": 2,
		"@typescript-eslint/member-ordering": [
			"error",
			{
				classes: ["public-static-field", "public-instance-method"]
			}
		],
		"@typescript-eslint/unbound-method": [
			"error",
			{
				ignoreStatic: true
			}
		],
		"@typescript-eslint/explicit-member-accessibility": [
			2,
			{
				accessibility: "no-public",
				overrides: {
					accessors: "no-public",
					constructors: "no-public",
					methods: "no-public",
					properties: "off",
					parameterProperties: "explicit"
				}
			}
		],
		"@typescript-eslint/member-delimiter-style": [
			2,
			{
				multiline: {
					delimiter: "comma",
					requireLast: true
				},
				singleline: {
					delimiter: "comma",
					requireLast: true
				},
				overrides: {
					interface: {
						multiline: {
							delimiter: "semi",
							requireLast: true
						}
					}
				}
			}
		],
		"brace-style": [
			"error",
			"1tbs",
			{
				allowSingleLine: true
			}
		]
	}
};
