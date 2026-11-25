# Contributing

**English** · [Deutsch](CONTRIBUTING.de.md)

Bug reports and improvements are welcome, as an issue or a pull request.

## License of contributions

OpenWerkstatt is licensed entirely under the GNU AGPL 3.0.

By opening a pull request you confirm that you wrote the contribution yourself or are allowed
to pass it on, and that it will be published under the AGPL 3.0.

If this English text and the German version differ, the German version applies.

## Rules

- No customer, company or register data in the repository, not even in tests. Test data is made up.
- No npm dependencies without prior agreement. OpenWerkstatt only needs Node.js.
- Run `npm test` before opening a pull request.
- Write code comments and commit messages in English.
- Write new user interface texts in German and translate them in `public/js/lang/en.js` and `es.js`. `node tools/i18n/missing.js` shows what is still missing. Values inside a text become `{0}`, `{1}` …, and the translation needs the same placeholders.
