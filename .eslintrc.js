module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: require.resolve('./node_modules/@vue/cli-service/webpack.config.js'),
      },
    },
    'import/extensions': [
      '.js',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
    ],
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'import/extensions': 'off',

    'vue/no-v-html': 0, // 'v-html' directive can lead to XSS attack
    'vue/html-self-closing': 0,

    // 'max-len': ['error', { 'code': 150 }],
    'no-shadow': 0,
    'func-names': 0,
    'max-len': 0,

    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    'no-restricted-properties': 'off',
    'array-callback-return': 'off',
    'prefer-destructuring': 'off',
    'consistent-return': 'off',

    'import/named': 0,
    'import/no-named-as-default': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'no-plusplus': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,

    'class-methods-use-this': 0,

    // allow global require
    'linebreak-style': 0,
    'indent': 0,
    'global-require': 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    'no-prototype-builtins': 0,
    'no-underscore-dangle': 0,
    'implicit-arrow-linebreak': 0,
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  globals: {},
};
