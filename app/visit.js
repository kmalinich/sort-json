/**
 * Sorts the keys on objects
 *
 * @param {*} old                 - An object to sort the keys of, if not object just returns whatever was given
 * @param {Object} [options = {}] - Optional parameters
 *   @param [ options.ignoreCase = false ] - When sorting keys, convert all keys to lowercase so case doesn't interfere with sort order
 *   @param [ options.reverse    = false ] - When sorting keys, do so in reverse order
 *
 * @returns {*} - Object with sorted keys, if old wasn't an object returns whatever was passed
 */
function visit(old, options) {
	// console.log('');
	// console.log('= START ===============================================');

	options = options || {};

	if (typeof (old) !== 'object' || old === null) return old;

	let copy = Array.isArray(old) ? [] : {};

	let keys;
	const oldKeys = Object.keys(old);

	switch (options.ignoreCase) {
		case true : {
			keys = oldKeys.sort((a, b) => {
				// console.log('        visit oldKeys.sort(%s, %s) (%s, %s) =>', a, b, a.toLowerCase(), b.toLowerCase(), a.toLowerCase().localeCompare(b.toLowerCase()));
				return a.toLowerCase().localeCompare(b.toLowerCase());
			});

			break;
		}

		case false : {
			keys = oldKeys.sort();
		}
	}

	if (options.reverse) keys = keys.reverse();

	// console.log({
	// 	copy,
	// 	oldKeys,
	// 	newKeys : keys,
	// });


	keys.forEach((key) => {
		// console.log('        visit keys.forEach(%s)', key);
		copy[key] = visit(old[key], options);
	});

	// console.log('= FINAL ===============================================');
	// console.log('');
	// console.dir({ copy });

	return copy;
}


module.exports = visit;
