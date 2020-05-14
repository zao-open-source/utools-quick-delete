const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
let fileList = []
let tempList = []
let curUrl = ''


function getCurFileList() {
  let dir = []
  let file = []
  const dirList = fs.readdirSync(curUrl)
  dirList.forEach(item => {
    const location = path.join(curUrl, item)
    const info = fs.statSync(location)
    if (info.isDirectory()) {
      if (item === 'node_modules') {
        dir.unshift({
          title: item,
          description: location,
          url: location,
          icon: './assets/image/node.png',
          type: 'dir'
        })
      } else {
        dir.push({
          title: item,
          description: location,
          url: location,
          icon: './assets/image/folder.png',
          type: 'dir'
        })
      }
    } else {
      file.push({
        title: item,
        description: location,
        url: location,
        icon: './assets/image/file.png',
        type: 'file'
      })
    }
  })
  return [...dir, ...file]
}

window.exports = {
  "delete file&directory": {
    mode: "list",
    args: {
      enter: (action, callbackSetList) => {
        curUrl = utools.getCurrentFolderPath()
        fileList = getCurFileList()
        tempList = [...fileList]
        callbackSetList(tempList)
      },
      search: (action, searchWord, callbackSetList) => {
        if (!searchWord) return callbackSetList(fileList)
        searchWord = searchWord.toLowerCase()
        tempList = fileList.filter(x => x.title.toLowerCase().includes(searchWord))
        callbackSetList(tempList)
      },
      select: (action, itemData, callbackSetList) => {
        rimraf(itemData.url, err => {
          console.log('delete start')
          
          if (err) {
            console.log('delete faild')
            let errItem = {
              title: itemData.title,
              description: err.message,
              url: itemData.url,
              icon: itemData.type === 'dir' ? './assets/image/error.png' : './assets/image/error_file.png',
              type: itemData.type
            }
            tempList[tempList.findIndex(item=>item.title===itemData.title)]=errItem
            fileList[fileList.findIndex(item=>item.title===itemData.title)]=errItem
            callbackSetList(tempList)
          } else {
            console.log('delete sucess')
            tempList.splice(tempList.findIndex(item=>item.title===itemData.title),1)
            fileList.splice(fileList.findIndex(item => item.title === itemData.title), 1)
            callbackSetList(tempList)
          }
        })
        callbackSetList(tempList)
      },
      placeholder: ""
    }
  }
}
