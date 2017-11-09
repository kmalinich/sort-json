let fs    = require('fs');
let visit = require('./visit');

function validateJSON(jsonFile) {
	try {
		let jsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
		// Data is valid JSON
		return jsonData;
	}
	catch (e) {
		// Data is NOT valid JSON
		return false;
	}
}

/**
 * Sorts the files json with the visit function and then overwrites the file with sorted json
 * @see visit
 * @param {String|Array} absolutePaths   - String: Absolute path to json file to sort and overwrite
 *                                         Array: Absolute paths to json files to sort and overwrite
 * @param {Object} [options = {}]        - Optional parameters object, see visit for details
 * @returns {*}                          - Whatever is returned by visit
 */
function overwrite(absolutePaths, options) {
	absolutePaths = arrIfNot(absolutePaths);

	let results = absolutePaths.map(p => overwriteFile(p, options));

	return results.length > 1 ? results : results[0];
}

/**
 * Overwrite file with sorted json
 * @param {String} p                     - absolutePath
 * @param {Object} [options = {}]        - optional params
 * @returns {*}
 */
function overwriteFile(p, options) {
	let jsonData = validateJSON(p);

	if (jsonData === false) {
		console.error('Error: File \'%s\' does not appear to be a valid JSON file, cannot continue', p);
		return false;
	}

	let newData = null;

	try {
		newData = visit(jsonData, options);
	}
	catch (e) {
		console.error('Error: Failed to retrieve JSON object from file, cannot continue');
		throw e;
	}

	let newJson = JSON.stringify(newData, null, 2);

	// Append new line at EOF
	let content = newJson[newJson.length - 1] === '\n' ? newJson : newJson + '\n';

	fs.writeFileSync(p, content, 'utf8');

	console.log('Wrote sorted JSON data to file \'%s\'', p);
	return newData;
}

function arrIfNot(x) {
	if (Array.isArray(x)) return x;

	return [ x ];
}

module.exports = overwrite;
