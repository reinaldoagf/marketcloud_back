module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // usa el parser de TS
  parserOptions: {
    project: './tsconfig.json', // apunta a tu tsconfig
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // reglas de TS
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // evita unsafe
    'plugin:prettier/recommended', // integra Prettier
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // Reglas de Prettier
    'prettier/prettier': 'error',

    // Reglas TS específicas
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      { allowExpressions: true },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    // ESLint generales
    'no-console': 'warn',
    'no-unused-vars': 'off', // gestionado por TS
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
