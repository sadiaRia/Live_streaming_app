
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

//new peer connection
//here goes id which is undefines because this id will automatically generated by peer
const peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/', //whaterver host 
  port: '3030' //as node js server on 3030
});


let myVideoStream;

//access permission for own video
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream);

  //amswer the call form x & add the stream of x
  peer.on('call', call => {//when another user call us we answer it 
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', (userId) => {//now listen that userd after emit
    connectToNewUser(userId, stream);
  })

  //chat
  let text = $("input");

  // when press enter send message
  $('html').keydown((e) => {
    if (e.which == 13 && text.val().length !== 0) {
      console.log(text.val());
      socket.emit('message', text.val()); //emit=>send on=>receive
      text.val('')
    }
  });

  //by emiting we send the msg & now we have to receve it from server then server will send to frontend and now we will pop it up on chat.

  socket.on('createMessage', message => {
    // console.log("I am from server",message);
    $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom()
  })

})

//as we type msg always goes to the buttom because of this function 
const scrollToBottom = () => {
  let d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}

//here user video we call it stream

peer.on('open', id => {
  // console.log(id);
  socket.emit('join-room', ROOM_ID, id);//now we know which specic person join the room by that id using peer js & that it automatically generated
})

// socket.emit('join-room', ROOM_ID);


const connectToNewUser = (userId, stream) => {
  // console.log("new user", userId);
  const call = peer.call(userId, stream) //when someone connected I call her & send my stream
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)//we send it our own stream throgh here
  })
}

//append  video
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  videoGrid.append(video);
}

//mute video
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}



