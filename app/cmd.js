#!/usr/bin/env node

// Core dependencies
const path = require('path');

// NPM dependencies
const sortJson = require('./');


// JSON rcfile regexp
const rcRegexp = /\..*.[rc]$/g;

const args = process.argv.slice(0);

// Get all the files
const files = args.filter(arg => {
	const argSkip0 = arg === '--ignore-case' || arg === '-i';
	const argSkip1 = arg === '--reverse'     || arg === '-r';

	const argSkipAnyPt1 = (argSkip0 || argSkip1);

	if (argSkipAnyPt1) return false;


	const argNormalized = path.normalize(arg);


	const pathParse = path.parse(argNormalized);

	const argSkip2 = (pathParse.root === '/' && pathParse.base === 'node');
	const argSkip3 = (pathParse.root === '/' && pathParse.base === 'sort-json');
	const argSkip4 = (pathParse.root === '/' && pathParse.base === 'cmd.js');

	const argSkipAnyPt2 = (argSkip2 || argSkip3 || argSkip4);

	if (argSkipAnyPt2) return false;


	const argCheck0 = pathParse.ext === '.json';
	const argCheck1 = pathParse.ext === '.rc';
	const argCheck2 = pathParse.base === 'tiddlywiki.info';
	const argCheck3 = pathParse.base === 'lovelace';
	const argCheck4 = pathParse.base.startsWith('core.');
	const argCheck5 = pathParse.base.startsWith('esphome.');
	const argCheck6 = (pathParse.base.match(rcRegexp) !== null);

	const argCheckAny = (argCheck0 || argCheck1 || argCheck2 || argCheck3 || argCheck4 || argCheck5 || argCheck6);

	// console.log({
	// 	argInfo : {
	// 		arg, argNormalized,

	// 		pathParse,

	// 		argCheck0, argCheck1, argCheck2, argCheck3, argCheck4, argCheck5, argCheck6, argCheckAny,
	// 	},
	// });

	return argCheckAny;
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


sortJson.overwrite(files.map(f => path.resolve(f)), options);
