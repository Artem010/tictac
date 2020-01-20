let socket = io.connect()

let users = []

if ($('#main-container').val() != null) {
  socket.emit('new-user', roomName)
  $('.roomName').html("Room's name: " + roomName)
}

socket.on('room-created', room => {
  $('#room-container').append('<div>' + room + '</div><a href=/' + room + '>Join</a>')
})

socket.on('user-connected', name => {
  $('.players').html(() =>{
    let i =1;
    let str = '';
    for(item in name.users) {
        users[i-1]=(name.users[item])
        str += "<p>player "+ i + ': '+name.users[item]+"</p>"
        i++;
    }
    return str
  })
})

socket.on('user-disconnected', name => {
  delete users[users.indexOf(name)]
  $('.players').html(() =>{
    let str = '';
    let i = 1;
    for(item in users) {
      str += "<p>player "+ i + ': '+users[item]+"</p>"
      i++;
    }
    return str
  })
})
