const noUnusedVarsConfig = {
  argsIgnorePattern: '^_',
  varsIgnorePattern: '^_',
  ignoreRestSiblings: true,
}

module.exports = {
  extends: [
    'plugin:prettier/recommended',
    'prettier',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  plugins: ['prettier'],
  root: true,
  reportUnusedDisableDirectives: true,
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  settings: {},
  rules: {
    'quotes': ['error', 'single', {avoidEscape: true, allowTemplateLiterals: true}],
    'no-constant-condition': ['error', {checkLoops: false}],
    'no-unused-vars': ['error', noUnusedVarsConfig],
    'no-eval': 'error',
    'no-loop-func': 'error',
    'no-empty-function': ['error', {allow: ['constructors']}],
    'prefer-const': 'error',
    'space-infix-ops': 'error',
    'prefer-template': 'error',
    'no-useless-concat': 'error',
    'eqeqeq': ['error', 'smart'],
    'camelcase': ['error', {properties: 'never', ignoreDestructuring: true, ignoreImports: false}],
    'no-use-before-define': 0,
    'max-len': 0,
    'no-console': 'warn',
    'comma-dangle': 0,
    'guard-for-in': 0,
    'indent': 0,
    'curly': 0,
    // prettier
    'prettier/prettier': 'error',
    // import
    'import/order': [
      'error',
      {
        'newlines-between': 'never',
        'groups': ['builtin', 'external', ['parent', 'sibling'], 'index'],
      },
    ],
    'import/no-named-as-default': 0,
    'import/no-cycle': 'warn',
  },
  overrides: [
    {
      // TS-only
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
      files: ['**/*.ts?(x)'],
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', noUnusedVarsConfig],
        '@typescript-eslint/array-type': ['error', {default: 'array-simple'}],
        '@typescript-eslint/no-use-before-define': ['error', {functions: false}],
        '@typescript-eslint/camelcase': 0,
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true,
          },
        ],
        '@typescript-eslint/ban-ts-comment': 0,
        '@typescript-eslint/ban-types': 0, // FIXME: Enable this rule and fix the problems
      },
    },
  ],
}
