#!/usr/bin/env node

// Core dependencies
const path = require('path');

// NPM dependencies
const sortJson = require('./');

const mmm   = require('mmmagic');
const Magic = mmm.Magic;
const magic = new Magic(mmm.MAGIC_MIME_TYPE);

// JSON rcfile regexp
const rcRegexp = /\..*.[rc]$/g;


async function asyncRun() {
	const args = process.argv.slice(0);

	// Get all the files
	const asyncFileFilter = async (fileArray, filterFunction) => {
		const results = await Promise.all(fileArray.map(filterFunction));
		return fileArray.filter((_v, index) => results[index]);
	};

	const files = await asyncFileFilter(args, async (arg) => {
		try {
			const argSkip0 = arg === '--ignore-case' || arg === '-i';
			const argSkip1 = arg === '--reverse'     || arg === '-r';

			const argSkipAnyPt1 = (argSkip0 || argSkip1);

			// console.log({
			// 	argInfo0 : {
			// 		arg,
			// 		argSkip0,
			// 		argSkip1,
			// 		argSkipAnyPt1,
			// 	},
			// });

			if (argSkipAnyPt1) return false;


			const argNormalized = path.normalize(arg);

			const pathParse = path.parse(argNormalized);

			const argSkip2 = (pathParse.root === '/' && pathParse.base === 'node');
			const argSkip3 = (pathParse.root === '/' && pathParse.base === 'sort-json');
			const argSkip4 = (pathParse.root === '/' && pathParse.base === 'cmd.js');

			const argSkipAnyPt2 = (argSkip2 || argSkip3 || argSkip4);

			// console.log({
			// 	argInfo1 : {
			// 		arg,
			// 		argNormalized,
			// 		pathParse,
			// 		argSkip2,
			// 		argSkip3,
			// 		argSkip4,
			// 		argSkipAnyPt2,
			// 	},
			// });

			if (argSkipAnyPt2) return false;


			// This has really gotten wasteful........
			const argCheck0 = (pathParse.base.match(rcRegexp) !== null);

			const argCheck1 = pathParse.ext === '.json';
			const argCheck2 = pathParse.ext === '.rc';

			const argCheck3 = pathParse.base === 'composer.lock';
			const argCheck4 = pathParse.base === 'tiddlywiki.info';
			const argCheck5 = pathParse.base === 'lovelace';

			const argCheck6 = pathParse.base.startsWith('core.');
			const argCheck7 = pathParse.base.startsWith('esphome.');
			const argCheck8 = pathParse.base.startsWith('lovelace.');

			const mimeType = await new Promise((resolve, reject) => {
				magic.detectFile(argNormalized, (detectError, detectResult) => {
					if (detectError !== null) return reject(detectError);
					resolve(detectResult);
				});
			});

			const argCheck9 = (mimeType === 'application/json');

			const argCheckAny = (argCheck0 || argCheck1 || argCheck2 || argCheck3 || argCheck4 || argCheck5 || argCheck6 || argCheck7 || argCheck8 || argCheck9);

			// console.log({
			// 	argInfo2 : {
			// 		arg,
			// 		argNormalized,

			// 		mimeType,
			// 		pathParse,

			// 		argChecks : [
			// 			argCheck0,
			// 			argCheck1,
			// 			argCheck2,
			// 			argCheck3,
			// 			argCheck4,
			// 			argCheck5,
			// 			argCheck6,
			// 			argCheck7,
			// 			argCheck8,
			// 			argCheck9,
			// 		],

			// 		argCheckAny,
			// 	},
			// });

			return argCheckAny;
		}
		catch (error) {
			if (error === null) return false;
			console.log('Error: Failure during file type/MIME type check, cannot continue');
			throw error;
		}
	});


	// CLI arguments
	const options = {
		ignoreCase : args.includes('--ignore-case') || args.includes('-i'),
		reverse    : args.includes('--reverse')     || args.includes('-r'),
	};

	if (files.length === 0) {
		console.log('Error: No files to process, cannot continue');
		process.exit(1);
	}

	// console.log({ files });

	sortJson.overwrite(files.map(f => path.resolve(f)), options);
}


asyncRun();
