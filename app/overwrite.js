let fs     = require('fs');
let indent = require('detect-indent');
let visit  = require('./visit');


function arrIfNot(x) {
	if (Array.isArray(x)) return x;

	return [ x ];
}


function validateJSON(jsonFile) {
	try {
		// Data is valid JSON
		let fileData = fs.readFileSync(jsonFile, 'utf8');
		let jsonData = JSON.parse(fileData);

		// Try to detect the indentation method, fall back to tab if indent style not detected
		let fileIndent = indent(fileData).indent || '\t';

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
 * Sorts JSON with the visit function and then overwrites the file with sorted JSON
 * @see visit
 * @param {String|Array} absolutePaths - String : Absolute path to JSON file to sort and overwrite
 *                                       Array  : Absolute paths to JSON files to sort and overwrite
 * @param {Object} [ options = {} ]    - Optional parameters object, see visit for details
 * @returns {*}                        - Whatever is returned by visit
 */
function overwrite(absolutePaths, options) {
	absolutePaths = arrIfNot(absolutePaths);

	let results = absolutePaths.map(p => overwriteFile(p, options));

	return results.length > 1 ? results : results[0];
}

/**
 * Overwrite file with sorted JSON
 * @param {String} filePath         - absolutePath
 * @param {Object} [ options = {} ] - optional params
 * @returns {*}
 */
function overwriteFile(filePath, options) {
	let jsonData = validateJSON(filePath);

	if (jsonData.valid !== true) {
		console.error('Error: File \'%s\' does not appear to be a valid JSON file, cannot continue', filePath);
		return false;
	}

	// console.dir({ jsonData });

	let newData = null;

	try {
		newData = visit(jsonData.data, options);
	}
	catch (e) {
		console.error('Error: Failed to retrieve JSON object from file, cannot continue');
		throw e;
	}

	// return newData;

	// Write sorted JSON string with original indentation
	let newJson = JSON.stringify(newData, null, jsonData.indent);

	// Append new line at EOF
	let content = newJson[newJson.length - 1] === '\n' ? newJson : newJson + '\n';

	fs.writeFileSync(filePath, content, 'utf8');

	console.log('Wrote sorted JSON data to file \'%s\'', filePath);
	return newData;
}


module.exports = overwrite;
