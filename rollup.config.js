import uglify from 'rollup-plugin-uglify'
import buble from 'rollup-plugin-buble'
import fs from 'fs'

const getDate = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = (d.getMonth() + 1 < 10 ? '0' : '') + (d.getMonth() + 1)
  const day = (d.getDate() < 10 ? '0' : '') + d.getDate()
  return `${year}-${month}-${day}`
}

const config = JSON.parse(fs.readFileSync('package.json'))

const banner = `// ${config.name} - created by ${config.author} - ${config.license} licence - last built on ${getDate()}`

export default [{
  banner: banner,
  entry: 'src/raphael.group.js',
  dest: 'dist/raphael.group.js',
  format: 'iife',
  sourceMap: false,
  plugins: [
    buble()
  ]
}, {
  entry: 'src/raphael.group.js',
  dest: 'dist/raphael.group.min.js',
  format: 'iife',
  sourceMap: true,
  plugins: [
    buble(),
    uglify({
     output: {
       preamble: banner
     }
    })
  ]
}, {
  banner: banner,
  entry: 'src/raphael.grid.js',
  dest: 'dist/raphael.grid.js',
  format: 'iife',
  sourceMap: false,
  plugins: [
    buble()
  ]
}, {
  entry: 'src/raphael.grid.js',
  dest: 'dist/raphael.grid.min.js',
  format: 'iife',
  sourceMap: true,
  plugins: [
    buble(),
    uglify({
     output: {
       preamble: banner
     }
    })
  ]
}, {
  banner: banner,
  entry: 'src/polyfills.js',
  dest: 'dist/polyfills.js',
  format: 'iife',
  sourceMap: false,
  plugins: [
    buble()
  ]
}, {
  entry: 'src/polyfills.js',
  dest: 'dist/polyfills.min.js',
  format: 'iife',
  sourceMap: true,
  plugins: [
    buble(),
    uglify({
     output: {
       preamble: banner
     }
    })
  ]
}]
