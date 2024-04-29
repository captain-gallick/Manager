const {ipcRenderer} = require('electron')

const newWindowBtn = document.getElementById('home-btn')

newWindowBtn.addEventListener('click', (event) => {
    ipcRenderer.send('synchronous-message', 'html/home.html')
})
