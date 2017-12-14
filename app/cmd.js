#!/usr/bin/env node

/* eslint-disable no-use-before-define */

// Core dependencies
let path = require('path');
let _    = require('lodash');

// NPM dependencies
let sortJson = require('./');

// JSON rcfile regexp
let rc_regexp = /\..*.[rc]$/g;

// Get all the files
let files = process.argv.slice(0).filter(arg => arg.endsWith('.json') || arg.endsWith('.rc') || arg === 'tiddlywiki.info' || arg.match(rc_regexp));

// CLI arguments
let ignoreCase = _.includes(process.argv, '--ignore-case') || _.includes(process.argv, '-i');
let reverse    = _.includes(process.argv, '--reverse')     || _.includes(process.argv, '-r');

if (files.length === 0) {
	console.log('Error : No files to process, cannot continue');
	process.exit(1);
}

sortJson.overwrite(
	files.map((f) => {
		return path.resolve(f);
	}),
	{ ignoreCase, reverse }
);
