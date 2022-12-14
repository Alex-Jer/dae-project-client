module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended'],
  plugins: [],
  rules: {
    'vue/multi-word-component-names': 0,
    'vue/html-self-closing': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/require-v-for-key': 0,
    'space-before-function-paren': 0,
    'comma-dangle': 0,
    'no-return-assign': 0,
    'no-console': 0,
  },
}
