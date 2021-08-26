module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react', 'jsx-a11y', 'import', 'react-hooks', 'prettier'],
    extends: ['plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    rules: {
        'no-console': 1,
        'prettier/prettier': 2,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/no-explicit-any': 0,
    },
};
