module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules:  {
    'react/jsx-filename-extension': [2, { 'extensions': ['.js', '.jsx',] }],
    'skipBlankLines': 0,
    'ignoreComments': 0, 
    'react/prop-types': 0,
    'no-param-reassign': 0,
    'no-lonely-if' : 0,
    'no-extraneous-dependencies': 0,
    'no-named-as-default': 0,
    'no-console': 0,
    "react/function-component-definition": [0 , {
      "namedComponents": "function-declaration" | "function-expression" | "arrow-function",
      "unnamedComponents": "function-expression" | "arrow-function"
    }],
    "react/jsx-no-useless-fragment": 0,
    "function-paren-newline": 0,
    "prefer-regex-literals": 0,
  },
  settings: {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
};