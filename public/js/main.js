let userName = localStorage.getItem('userName')
let socket

if (!userName) 
    $('#exampleModalCenter').modal({backdrop: 'static', keyboard: false}) 
else {
    startChat()
    document.getElementById('message').focus()
}
    

const saveNameBtn = document.getElementById('save-name')
const recipientNameInput = document.getElementById('recipient-name')
recipientNameInput.addEventListener('input', (e) => {
    const val = e.target.value
    if (val && val.length >= 3)
        saveNameBtn.disabled = false
    else
        saveNameBtn.disabled = true

    userName = val
})

saveNameBtn.addEventListener('click', (e) => {
    if (!e.target.disabled) {
        localStorage.setItem('userName', userName)
        startChat()
    }
})

document.getElementById('btn-send-msg').addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()
    const messageEl = document.getElementById('message')
    socket.send(messageEl.value)
    messageEl.value = ''
})

document.getElementById('message').addEventListener('keypress', e => {
    if (e.key == 'Enter') {
        document.getElementById('btn-send-msg').dispatchEvent(new Event('click'))
    }
})

function startChat() {
    socket = io();
    socket.on('connect', (data) => {
        socket.emit('init', userName)
    })

    
    socket.on('init', (users, messages) => {
        for (let message of messages)
            displayMessage(message)
            

        for (let user in users)
            displayActiveUser(users[user])

        $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'slow');
    })

    socket.on('message', message => {
        displayMessage(message)
        $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'slow');
    })

    socket.on('newUser', displayActiveUser) 
    socket.on('userDisconnected', removeActiveUser)
}

function displayMessage(message) {
    const messages = document.getElementsByClassName('messages')[0]
    const name = message.user.name == userName ? 'Me' : message.user.name
    const time = new Date(message.timestamp)


    const messageContainer = document.createElement('div')
    messageContainer.classList.add('message-container')
    messageContainer.innerHTML = `
        <img src="${message.user.imgUrl}" alt="Avatar" style="width:100%;">
        <p>${message.message}</p>
        <span class="time-right">${name} at ${time.toLocaleTimeString()} on ${time.toLocaleDateString()}</span>
    `
    messages.append(messageContainer)
}

function displayActiveUser(user) {
    const activeUsersContainer = document.getElementsByClassName('friend-list')[0]
    activeUsersContainer.innerHTML += `
        <li>
            <a href="#" class="clearfix">
                <img src="${user.imgUrl}" alt="" class="img-circle">
                <div class="friend-name">
                    <strong>${user.name}</strong>
                </div>
                <div class="last-message text-muted">Lorem ipsum dolor sit amet.</div>
                <small class="time text-muted">5 mins ago</small>
                <small class="chat-alert text-muted"><i class="fa fa-check"></i></small>
            </a>
        </li>`
}

function removeActiveUser(user) {
  const activeUsersContainer = document.getElementsByClassName('friend-list')[0]
  for (let userEl of activeUsersContainer.children) {
      if (userEl.firstElementChild.children[1].firstElementChild.innerText == user.name) {
        userEl.remove()
        return
      }
  }  
}