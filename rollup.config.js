import uglify from 'rollup-plugin-uglify'
import buble from 'rollup-plugin-buble'
import multiEntry from 'rollup-plugin-multi-entry'

const {
  name,
  author,
  license
} = require('./package.json')

const lPadZero = num => (num < 10 ? '0' : '') + num

const getDate = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = lPadZero(d.getMonth() + 1)
  const day = lPadZero(d.getDate())
  return `${year}-${month}-${day}`
}

const isWatching = process.env.ROLLUP_WATCH
const banner = `// ${name} - created by ${author} - ${license} licence - last built on ${getDate()}`

export default [{
  banner: banner,
  entry: [
    'src/raphael.group.js'
  ].concat(isWatching ? 'src/load-reload.js': []),
  dest: 'dist/raphael.group.js',
  format: 'iife',
  moduleName: 'RaphaelGroup',
  sourceMap: false,
  plugins: [
    multiEntry(),
    buble()
  ]
}, {
  entry: [
    'src/raphael.group.js'
  ].concat(isWatching ? 'src/load-reload.js': []),
  dest: 'dist/raphael.group.min.js',
  format: 'iife',
  moduleName: 'RaphaelGroup',
  sourceMap: true,
  plugins: [
    multiEntry(),
    buble(),
    uglify({
     output: {
       preamble: banner
     }
    })
  ]
}, {
  banner: banner,
  entry: [
    'src/raphael.grid.js'
  ].concat(isWatching ? 'src/load-reload.js': []),
  dest: 'dist/raphael.grid.js',
  format: 'iife',
  moduleName: 'RaphaelGrid',
  sourceMap: false,
  plugins: [
    multiEntry(),
    buble()
  ]
}, {
  entry: [
    'src/raphael.grid.js'
  ].concat(isWatching ? 'src/load-reload.js': []),
  dest: 'dist/raphael.grid.min.js',
  format: 'iife',
  moduleName: 'RaphaelGrid',
  sourceMap: true,
  plugins: [
    multiEntry(),
    buble(),
    uglify({
     output: {
       preamble: banner
     }
    })
  ]
}, {
  banner: banner,
  entry: [
    'src/polyfills.js'
  ].concat(isWatching ? 'src/load-reload.js': []),
  dest: 'dist/polyfills.js',
  format: 'es',
  sourceMap: false,
  plugins: [
    multiEntry(),
    buble()
  ]
}, {
  entry: [
    'src/polyfills.js'
  ].concat(isWatching ? 'src/load-reload.js': []),
  dest: 'dist/polyfills.min.js',
  format: 'es',
  sourceMap: true,
  plugins: [
    multiEntry(),
    buble(),
    uglify({
     output: {
       preamble: banner
     }
    })
  ]
}]
