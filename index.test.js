const postcss = require('postcss')
const { equal } = require('node:assert')
const { test } = require('node:test')
const fs = require('node:fs/promises')

const plugin = require('./')

async function run(input, output) {
		return postcss([plugin()])
			.process(input, { from: undefined})
			.then(result => {
				equal(result.css, output) // check if result is same as expected
				equal(result.warnings().length, 0) // check for warning logs
			})
}

/* Write tests here */

test("check with default test files", async () => {
	const inputTest = await fs.readFile('./test-files/input.css', 'utf8');
	const outputTest = await fs.readFile('./test-files/output.css', 'utf8');
	return run(inputTest, outputTest)
})


