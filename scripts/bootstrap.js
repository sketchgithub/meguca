/*
Copies configuration files from examples on `npm install`, if none exist
 */
'use strict';

const cp = require('child_process'),
	fs = require('fs-extra'),
	path = require('path');

const examplePath = path.join('config', 'examples');

function copy(file) {
	const target = path.join('config', file);
	try {
		// Throws error on no file found
		fs.statSync(target);
	}
	catch (e) {
		fs.copySync(path.join(examplePath, file), target);
	}
}

for (let file of fs.readdirSync(examplePath)) {
	copy(file);
}

// Fucking Windows
let gulpPath = path.join('node_modules', '.bin', 'gulp');
if (process.platform === 'win32')
	gulpPath += '.cmd';
const gulp = cp.spawn(gulpPath, ['client', 'vendor', 'css', 'mod', 'lang',
	'legacy']);
gulp.stdout.pipe(process.stdout);
gulp.stderr.pipe(process.stderr);
