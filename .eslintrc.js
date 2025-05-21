module.exports = {
  parser: '@babel/eslint-parser', // or '@typescript-eslint/parser' if TS
  parserOptions: {
    ecmaVersion: 2020, // or higher
    sourceType: 'module', // enables ES modules
    ecmaFeatures: {
      jsx: true // enables JSX parsing
    }
  },
  extends: [
    'plugin:react/recommended',
    'next/core-web-vitals', // if Next.js
    'prettier'
  ],
  rules: {
    // your rules here
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
