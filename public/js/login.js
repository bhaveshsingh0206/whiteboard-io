// Login
form = document.querySelector('#form');
select = form.querySelector('#designation');
select.addEventListener('change', () => {
   console.log(form.action);
   const designation = select.value;
   if (designation == 'student') {
      form.action = '/login-student';
      document.querySelector('#username').placeholder = 'Enter your sap id';
   } else if (designation == 'teacher') {
      form.action = '/login-teacher';
      document.querySelector('#username').placeholder = 'Enter your username';
   }
   console.log(form.action);
});
let username;

function myFunction() {
   var username = prompt('Enter your Username', '');
   console.log(username);
   $.ajax({
      url: '/getuserdetails',
      method: 'POST',
      data: {
         username: username,
      },
      success: function (msg) {
         passwordRequest(msg.user);
      },
      error: function (result) {
         console.log('Error occurred');
      },
   });
}

function passwordRequest(useremail) {
   $.ajax({
      url: '/getforgetpasswordlink',
      method: 'POST',
      data: {
         useremail: useremail,
      },
      success: function (msg) {
         passwordchange(useremail);
      },
      error: function (result) {
         console.log('Error occurred');
      },
   });
}

function passwordchange(useremail) {
   $.ajax({
      url: '/forgetpassword',
      method: '',
   });
}

function signIn() {
   form.preventDefault();
   console.log('It is here');

   const designation = document.querySelector('#designation').value;
   if (designation != '') {
      console.log(form.action);
      console.log('designation is selected');
      if (designation == 'student') {
         form.action = '/login-student';
      } else if (designation == 'teacher') {
         form.action = '/login-teacher';
      }
      console.log(form.action);
   } else {
      // TODO: Error message
      console.log('Select designation');
   }
}
