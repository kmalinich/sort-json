let fs     = require('fs');
let indent = require('detect-indent');
let visit  = require('./visit');

function validateJSON(jsonFile) {
	try {
		// Data is valid JSON
		let fileData = fs.readFileSync(jsonFile, 'utf8');
		let jsonData = JSON.parse(fileData);

		// Try to detect the indentation method, fall back to two spaces if not possible
		let fileIndent = indent(fileData).indent || '  ';

		return {
			data   : jsonData,
			indent : fileIndent,
			valid  : true,
		};
	}
	catch (e) {
		// Data is NOT valid JSON
		return { valid : false };
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

	if (jsonData.valid === false) {
		console.error('Error: File \'%s\' does not appear to be a valid JSON file, cannot continue', p);
		return false;
	}

	let newData = null;

	try {
		newData = visit(jsonData.data, options);
	}
	catch (e) {
		console.error('Error: Failed to retrieve JSON object from file, cannot continue');
		throw e;
	}

	// Write sorted JSON string with original indentation
	let newJson = JSON.stringify(newData, null, jsonData.indent);

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
