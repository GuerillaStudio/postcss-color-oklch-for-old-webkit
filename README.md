# postcss-color-oklch-for-old-webkit

[PostCSS](https://github.com/postcss/postcss) plugin to convert lightness and chroma values of oklch() into units compatible with old versions of webkit.

> [!NOTE]
> *Why this plugin?*\
> Webkit on versions of Safari < 16.2 requires `oklch()` lightness values to be in percent and chroma in decimal.


```css
.foo {
	--hue: 120deg;
	--color-1: oklch(75% 5% 42deg);
	--color-2: oklch(98% 0.666666666666666% 42);
	--color-3: oklch(.92 2% 42deg);
	--color-4: oklch(0.95 1.5% var(--hue));
}

/* becomes */

.foo {
	--hue: 120deg;
	--color-1: oklch(75% 0.02 42deg);
	--color-2: oklch(98% 0.002667 42);
	--color-3: oklch(92% 0.008 42deg);
	--color-4: oklch(95% 0.006 var(--hue));
}
```

### Limitations

1. Since PostCSS operates at build time, this plugin will ignores unprocessable values that could change on runtime:
    - custom properties (aka CSS variables)
    - relative colors
2. To limit differences between the input and output the plugin will *replace* the initial oklch values with the new ones. There is no fallback system in place keeping the original values on compatible browsers since no simple and bulletproof systems would work
3. Requires NodeJS >= 22.0.0 for now

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-color-oklch-for-old-webkit
```

**Step 2:** Check your project for existing PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs](https://github.com/postcss/postcss#usage)
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-color-oklch-for-old-webkit'),
    require('autoprefixer')
  ]
}
```


## Contributing

### Release steps

```
vim CHANGELOG.md # update the version and its content in this file
vim package.json # update the version in this file
npm install # update the version in the lock file and check security audit
npm run test # check it behave as expected and no eslint issue
git commit -a -m 'set version 0.1.0' # commit your change
git push # send update
git tag -m 'v0.1.0' v0.1.0 # create associated tag
git push --tags # push tag
npm publish # build and push the package
```
