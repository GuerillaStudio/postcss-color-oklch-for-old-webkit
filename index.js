const { nodeToString, parse:parseValues } = require('postcss-values-parser')
const { getPercent } = require('string-percent')
const Big = require('big.js')

function convertLightness (val) {
	return `${val * 100}%`
}


function convertChroma (val) {
	const percent = getPercent(val)
	const decimal = new Big(0.4 * (percent / 100))
	const decimalVal = decimal.round(6)
	return decimalVal.toString()
}



/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = () => {
	return {
		postcssPlugin: 'postcss-color-oklch-for-old-webkit',

		Declaration (decl) {
			if (decl.value.includes('oklch')) {
				const parsedDecl = parseValues(decl.value);
				let declModified = false

				parsedDecl.nodes.forEach(n => {
					if (n.type !== 'func' || n.name !== 'oklch' || !n.isColor) return
					const nLightness = n.nodes[0]
					const nChroma = n.nodes[1]

					if ([nLightness, nChroma].some(v => v.type !== 'numeric')) return // skip unprocessable values

					const lightnessNeedConversion = nLightness.unit !== '%'
					const chromaNeedConversion = nChroma.unit !== ''
					const needConversion = lightnessNeedConversion || chromaNeedConversion

					const newLightnessVal = lightnessNeedConversion ? convertLightness(nLightness.value) : null
					const newChromaVal = chromaNeedConversion ? convertChroma(nChroma.value) : null

					if (needConversion) {
						if (lightnessNeedConversion && newLightnessVal != null) {
							nLightness.value = newLightnessVal
							nLightness.unit = '%'
						}
						if (chromaNeedConversion && newChromaVal != null) {
							nChroma.value = newChromaVal
							nChroma.unit = ''
						}
						declModified = true
					}
				})

				if (declModified === true) {
					decl.value = parsedDecl.nodes.map(n => nodeToString(n)).join('')
				}
			}
		}
	}
}

module.exports.postcss = true
