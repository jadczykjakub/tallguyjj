// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
  printWidth: 100,
  singleQuote: true,
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
