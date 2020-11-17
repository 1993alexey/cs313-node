let userName = localStorage.getItem('userName')
if (!userName) 
    $('#exampleModalCenter').modal({backdrop: 'static', keyboard: false})  

const saveNameBtn = document.getElementById('save-name')
document.getElementById('recipient-name').addEventListener('input', (e) => {
    const val = e.target.value
    if (val && val.length >= 3)
        saveNameBtn.disabled = false
    else
        saveNameBtn.disabled = true

    userName = val
})

saveNameBtn.addEventListener('click', (e) => {
    localStorage.setItem('userName', userName)
    alert('connection established')
})