module.exports = {
  root: true,
  extends: [
    require.resolve('eslint-config-react-app')
  ],
  rules: {
    // Add any custom rules here
    'no-unused-vars': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}; 