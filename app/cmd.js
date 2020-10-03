#!/usr/bin/env node

/* eslint-disable no-use-before-define */

// Core dependencies
let path = require('path');
let _    = require('lodash');

// NPM dependencies
let sortJson = require('./');

// JSON rcfile regexp
let rcRegexp = /\..*.[rc]$/g;

// Get all the files
let files = process.argv.slice(0).filter(arg => {
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
	const argCheck2 = pathParse.base.startsWith('esphome.');
	const argCheck3 = pathParse.base === 'tiddlywiki.info';
	const argCheck4 = (pathParse.base.match(rcRegexp) !== null);

	const argCheckAny = (argCheck0 || argCheck1 || argCheck2 || argCheck3 || argCheck4);

	// console.log({
	// 	argInfo : {
	// 		arg, argNormalized,

	// 		pathParse,

	// 		argCheck0, argCheck1, argCheck2, argCheck3, argCheck4, argCheckAny,
	// 	},
	// });

	return argCheckAny;
});


// CLI arguments
let ignoreCase = _.includes(process.argv, '--ignore-case') || _.includes(process.argv, '-i');
let reverse    = _.includes(process.argv, '--reverse')     || _.includes(process.argv, '-r');

if (files.length === 0) {
	console.log('Error : No files to process, cannot continue');
	process.exit(1);
}


sortJson.overwrite(files.map(f => path.resolve(f)), { ignoreCase, reverse });
