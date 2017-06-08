const express = require('express')
const reload = require('reload')
const fs = require('fs')
const http = require('http')
const path = require('path')

const app = express()
const server = http.createServer(app)

let projectName = ''

fs.readFile(path.join(__dirname, '../package.json'), 'utf8', (err, rawData) => {
  try{
    const data = JSON.parse(rawData)
    projectName = data.name
  }catch(e){}
})

reload(server, app)

const fetchExampleFolders = () => new Promise((resolve, reject) => {
  fs.readdir(__dirname, (err, files) => {
    if(err){
      reject(err)
    }else{
      const folders = []
      let tasksToGo = files.length
      
      files
        .forEach(file => fs.lstat(path.join(__dirname, file), (err, stats) => {
          if(stats && stats.isDirectory()){
            folders.push(file)
          }
          if(--tasksToGo === 0){
            resolve(folders)
          }
        }))
    }
  })
})

app.get('/reload.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../node_modules/reload/lib/reload-client.js'))
})

app.get('/', (req, res) => fetchExampleFolders()
  .then(folders => {
    let pages = folders.map(folder => `<li><a href="/${folder}/">${folder}</a></li>`);
    if(pages.length){
      pages = '<ul>' + pages.join('\n') + '</ul>'
    }
    
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write(`<!DOCTYPE html>
<html>
<head>
  <title>Example uses of "${projectName}"</title>
  <meta charset="utf-8" />
</head>
<body>
  <h1>Example uses of "${projectName}"</h1>
  ${pages}
  <script src="/reload.js"></script>
</body>
</html>`)
    res.end()
  })
  .catch(err => {
    console.error(err)
    
    res.writeHead(500, {'Content-Type': 'text/plain'})
    res.write('500 Error')
    res.end()
  })
)

app.use(/^\/\w+\/$/, (req, res, next) => {
  const folder = req.originalUrl.replace('/', '')
  
  fs.lstat(path.join(__dirname, folder), (err, stats) => {
    if(stats && stats.isDirectory()){
      fs.readFile(path.join(__dirname, folder, 'index.html'), 'utf8', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(data
          .replace(/"\.\.\/\.\.\/dist\//g, '"/')
          .replace('<!-- script:live-reload -->', '<script src="/reload.js"></script>')
        )
        res.end()
      })
    }else{
      next()
    }
  })
})

app.use(express.static(path.join(__dirname, '../dist')))
app.use(express.static(path.join(__dirname)))

server.listen(3000, '0.0.0.0', () => {
  console.log('server started @ 0.0.0.0:3000');
})
