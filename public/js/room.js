const socket = io('https://callback-vtzhu.run-us-west2.goorm.io');
const designation = $('.designation').text();
window.rooms = [];
selectRoom = (selectedElement) => {
   document.querySelectorAll('.room-list li').forEach((element) => {
      element.classList.remove('selected');
   });
   console.log(selectedElement);
   window.rooms.forEach((room) => {
      if (room.roomName === selectedElement.textContent) {
         $('.room-language').html(
            '<img src="../img/' + room.language + '.png" alt="" srcset="" />'
         );
         $('#room-header').text(room.roomName);
         $('#room-description').text('Created By : ' + room.username);
         $('#room-description').attr({
            roomId: room.roomId,
            username: room.username,
         });
         console.log('Language is ', room.language);

         // $('.header-2').attr({'':room.roomId,'username':room.username});
         $('#room-join').attr('password', room.password);
      }
   });
   selectedElement.classList.add('selected');
   if (designation == 'Student') {
      $('#room-join').show();
      console.log('Button shown');
   } else {
      $('#room-join').hide();
   }
};

showCreateRoomDialog = (selectedElement) => {
   const dialog = document.querySelector('.create-room-dialog');
   if (dialog.style.display == 'flex') {
      dialog.style.display = 'none';
      selectedElement.innerHTML = 'Create Room';
   } else {
      dialog.style.display = 'flex';
      selectedElement.innerHTML = 'Cancel';
   }
};

$('.createRoom').on('click', () => {
   console.log($('#room-name').val());
   console.log($('#room-password').val());
   console.log($('#room-language').val());
   createRoom(
      generateRoomId(),
      $('#room-name').val(),
      $('#room-password').val(),
      $('#room-language').val()
   );
   document.querySelector('.create-room-dialog').style.display = 'none';
});

createRoom = (roomId, roomName, password, language) => {
   $.ajax({
      url: '/room/create',
      method: 'POST',
      data: {
         roomId: roomId,
         roomName: roomName,
         password: password,
         language: language,
      },
      success: function (msg) {
         console.log('Room created acche se');
         if (msg) {
            var loc = '/room/' + roomId;
            window.location.href = loc;
         }
      },
      error: function (result) {
         console.log('Error occurred');
      },
   });
};

$('#room-join').on('click', () => {
   var password = $('#room-join').attr('password');
   var userEnteredPassword = prompt('Enter the password to join the room');
   if (userEnteredPassword === password) {
      var loc = '/room/' + $('.header-2').attr('roomId');
      window.location.href = loc;
      // joinToRoom($('.header-2').attr('roomId'), $('.header-2').attr('username'));
   } else {
      alert('Password entered was wrong');
   }
});

window.setInterval(() => {
   socket.emit('get-rooms', {});
   socket.on('send-rooms', (data) => {
      let ul = $('.room-list');
      ul.html('');
      window.rooms = data['rooms'];
      $('.header-3').text(window.rooms.length);
      data['rooms'].forEach((room) => {
         // console.log(room)
         ul.append(
            '<li onclick="selectRoom(this)">' +
               room.roomName +
               '<div class="green-dot"></div></li>'
         );
      });
   });
}, 1500);

$(document).ready(function () {
   history.pushState(null, document.title, location.href);
});

generateRoomId = () => {
   return (
      Math.floor(Math.random() * 100000) +
      generateId(20) +
      Math.floor(Math.random() * 10000)
   );
};
dec2hex = (dec) => {
   return ('0' + dec.toString(16)).substr(-2);
};

generateId = (len) => {
   var arr = new Uint8Array((len || 40) / 2);
   window.crypto.getRandomValues(arr);
   return Array.from(arr, dec2hex).join('');
};
