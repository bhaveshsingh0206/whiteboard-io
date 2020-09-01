$('#getNotif').on('click', () => {
   const username = $('#username').text();
   console.log('notif ' + username);

   $.ajax({
      url: '/notif',
      method: 'GET',
      data: {
         username: username,
      },
      success: function (msg) {
         if (msg['status']) {
            //window.location.href = '/dashboard';
            console.log(msg);
         }
      },
      error: function (result) {
         console.log('Error occurred');
         alert('Code could not be posted');
      },
   });
});
