/* eslint-disable */

const fs        = require('fs');
const path      = require('path');
const cp        = require('child_process');
const chai      = require('chai');
const dirtyChai = require('dirty-chai');
const visit     = require('../');

const expect = chai.expect;
chai.use(dirtyChai);

const tempFile = path.resolve(__dirname, './temp_file_test.json');

describe('visit', () => {
	it('returns undefined for undefined', () => {
		expect(visit(undefined)).to.be.undefined();
	});

	it('does not change array order', () => {
		const givenData = [1, 5, 2, -1, 3];

		expect(JSON.stringify(visit(givenData))).to.equal(JSON.stringify(givenData));
	});

	it('sorts object by keys', () => {
		const expectedData = { bar: 456, baz: 789, foo: 123 };
		const givenData    = { foo: 123, bar: 456, baz: 789 };

		expect(JSON.stringify(visit(givenData))).to.equal(JSON.stringify(expectedData));
	});

	it('sorts object in reverse by keys if reverse enabled', () => {
		const expectedData = { hij: 789, def: 456, abc: 123 };
		const givenData    = { abc: 123, def: 456, hij: 789 };
		const opts         = { reverse: true };

		expect(JSON.stringify(visit(givenData, opts))).to.equal(JSON.stringify(expectedData));
	});

	it('sorts object by keys and ignores case if ignoreCase enabled', () => {
		const expectedData = { bar: 456, baz: 789, foo: 123, Foo2: 123, Quax: 999 };
		const givenData    = { foo: 123, bar: 456, baz: 789, Quax: 999, Foo2: 123 };
		const opts         = { ignoreCase: true };

		expect(JSON.stringify(visit(givenData, opts))).to.equal(JSON.stringify(expectedData));
	});

	it('sorts nested object', () => {
		const givenData = {
			foo: [1, 2, 5, 2],

			bar: {
				foo: 3,
				bar: 'lorem ipsum',
				baz: [1, { foo2: 444 }]
			},

			foo2: '',
			bar2: null
		};

		const expectedData = {
			bar: {
				bar: 'lorem ipsum',
				baz: [1, { foo2: 444 }],
				foo: 3
			},

			bar2: null,
			foo: [1, 2, 5, 2],
			foo2: ''
		};

		expect(JSON.stringify(visit(givenData))).to.equal(JSON.stringify(expectedData));
	});

	it('returns empty object for empty object', () => {
		const expectedData = {};
		const givenData    = {};

		expect(JSON.stringify(visit(givenData))).to.equal(JSON.stringify(expectedData));
	});

	it('returns empty array for empty array', () => {
		const expectedData = [];
		const givenData    = [];

		expect(JSON.stringify(visit(givenData))).to.equal(JSON.stringify(expectedData));
	});

	it('returns null for null', () => {
		const expectedData = null;
		const givenData    = null;

		expect(JSON.stringify(visit(givenData))).to.equal(JSON.stringify(expectedData));
	});

	it('returns true for true', () => {
		const expectedData = true;
		const givenData    = true;

		expect(JSON.stringify(visit(givenData))).to.equal(JSON.stringify(expectedData));
	});

	it('returns false for false', () => {
		const expectedData = false;
		const givenData    = false;

		expect(JSON.stringify(visit(givenData))).to.equal(JSON.stringify(expectedData));
	});

	it('returns number for number', () => {
		const expectedData = 123;
		const givenData    = 123;

		expect(JSON.stringify(visit(givenData))).to.equal(JSON.stringify(expectedData));
	});

	it('returns string for string', () => {
		const expectedData = 'foo';
		const givenData    = 'foo';

		expect(JSON.stringify(visit(givenData))).to.equal(JSON.stringify(expectedData));
	});
});
