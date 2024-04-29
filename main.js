const {app, BrowserWindow} = require('electron')
const {ipcMain} = require('electron')
const mysql = require('mysql')  

require('electron-reload')(__dirname);
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win
  
  var con

  function createWindow () {
    // Create the browser window.
    win = new BrowserWindow()
    //win.setFullScreenable(false)
    // win.maximize(true)
    // win.setResizable(false)
    win.setFullScreen(true)
    win.setFullScreenable(false)

    // load the index.html of the app.
    win.loadFile('html/home.html')

    win.setMenuBarVisibility(false)

    // Open the DevTools.
    //win.webContents.openDevTools()
  
    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })

    createDBConnection()

  }
  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)
  
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })

  ipcMain.on('synchronous-message', (event, arg) => {
    win.loadFile(arg)
  })

  ipcMain.on('close-app', (event, arg) => {
    app.quit()
  })

  ipcMain.on('fetch-inventory',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-special-price',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-saleby-buyer',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-sale-dates',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-sale-qty',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('next-page-setter',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('next-page-getter',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('check-special-price',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('insert-special-price',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('update-special-price',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-buyers',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-all-sales',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-one-sale',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('update-sale',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('delete-sale',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-price',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-one-article',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('delete-article',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('update-article',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('update-buyer',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-one-buyer',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('delete-buyer',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('update-special-price',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('delete-special-price',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('save-sale',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('save-from-cart',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('empty-cart',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('add-to-cart',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-cart',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('save-new-article',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('save-new-buyer',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-buyer-details',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-sales',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-total-sum',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-buyer-sales',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-onebuyer-amount',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-onebuyer-total',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('fetch-onebuyer-monthtotal',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('sales-till-now',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })
  
  ipcMain.on('delete-from-cart',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  ipcMain.on('article-buyer-list',(event,arg)=>{
    con.query(arg, function (err, result, fields) {
      if (err) throw err
      event.returnValue = result
    })
  })

  function createDBConnection(){
    
    con = mysql.createConnection({
      host: "127.0.0.1",
      user: "root",
      password: "nirvana.admin",
      database: "factorymanager",
      port: 3308
    })
    
    con.connect(function(err) {
      if (err) throw err;
    })
  }

  // ipcMain.on('print-to-pdf',(event) => {
  //   const pdfPath = path.join(os.tmpdir(),'sample-report.pdf')
  //   const win = BrowserWindow.fromWebContents(event.sender)

  //   win.webContents.printToPDF({},(error,data)=>{
  //     if(error) return console.log(error.message)

  //     fs.writeFile(pdfPath,data,err =>{
  //       if(err) return console.log(err.message)
  //       shell.openExternal('file://'+pdfPath)
  //       event.sender.send('wrote-pdf',pdfPath)
  //     })
  //   })
  // })


  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.