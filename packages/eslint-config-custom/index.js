module.exports = {
    env: { node: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'turbo',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
    },
    rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unused-vars': 'off', // temporarily
        '@typescript-eslint/no-explicit-any': 'off', // temporarily
    },
}
