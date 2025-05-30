const js = require('@eslint/js')
const prettier = require('eslint-plugin-prettier')

module.exports = [
  js.configs.recommended,
  {
    ignores: ['node_modules/', 'dist/', '.git/', 'lib/', 'evaluation/', 'TEMP/', 'query/'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs' // Préciser qu'on est en CommonJS
    },
    plugins: {
      prettier
    },
    rules: {
      'prettier/prettier': 'error'
    }
  }
]
