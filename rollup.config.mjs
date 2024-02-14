import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from 'rollup-plugin-replace';

export default {
	input: 'content-script.mjs',
	output: {
		file: 'build/content-script.js',
		format: 'iife',
	},
	plugins: [
		commonjs(),
		resolve(),
		replace({
			'process.env.NODE_ENV': JSON.stringify( 'production' )
		})
	]
};