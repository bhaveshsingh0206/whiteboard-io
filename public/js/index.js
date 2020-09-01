let globals = {
   dashboard: false,
   notification: false,
   firstLoad: true,
   container: document.querySelector('.posts-container'),
   selector: document.querySelector('.selector'),
   selectorText: '',
};

const user = {
   id: document.querySelector('#userid').textContent.trim(),
   name: document.getElementById('name').textContent.trim(),
   username: document.getElementById('username').textContent.trim(),
   designation: document
      .getElementById('designation')
      .textContent.toLowerCase()
      .trim(),
};

// Get and set information
window.addEventListener('DOMContentLoaded', (event) => {
   console.log('Document loaded');
   if (user.designation == 'student') {
      getClassInformation();
      getStatisticsForStudent();
   } else {
      getClasses();
      getStatisticsForTeacher();

      document.getElementById('class-info').style.display = 'none';
   }
   showPosts();
   globals.firstLoad = false;
   endProgress();
});

// Functions
// Progress Bar
function startProgress() {
   const progressBar = document.querySelector('#progress-bar');
   if (!progressBar.classList.contains('progress-infinite')) {
      document
         .querySelector('#progress-bar')
         .classList.add('progress-infinite');
   }
}

function endProgress() {
   const progressBar = document.querySelector('#progress-bar');
   if (progressBar.classList.contains('progress-infinite')) {
      document
         .querySelector('#progress-bar')
         .classList.remove('progress-infinite');
   }
}

function showPosts() {
   if (!globals.dashboard) {
      startProgress();
      globals.dashboard = true;
      globals.notification = false;
      document.querySelector('#dashboard').classList.add('nav-selected');
      document.querySelector('#notifications').classList.remove('nav-selected');
      if (user.designation == 'teacher') {
         globals.selector.style.display = 'block';
      }
      globals.container.innerHTML = '';
      getPosts();
      endProgress();
   }
}

function showNotifications() {
   if (!globals.notification) {
      startProgress();
      globals.notification = true;
      globals.dashboard = false;
      document.querySelector('#notifications').classList.add('nav-selected');
      document.querySelector('#dashboard').classList.remove('nav-selected');
      if (user.designation == 'teacher') {
         globals.selector.style.display = 'none';
      }
      globals.container.innerHTML = '';
      getNotifications();
      endProgress();
   }
}

document.getElementById('dashboard').addEventListener('click', () => {
   showPosts();
});

document.getElementById('notifications').addEventListener('click', () => {
   showNotifications();
});

// Display posts filter by class
if (!(user.designation == 'student')) {
   document.getElementById('class-selector').addEventListener('change', () => {
      const classid = document.getElementById('class-selector').value;
      if (classid == 'all') {
         globals.container.innerHTML = '';
         getPosts();
      } else {
         globals.container.innerHTML = '';
         getPostsByClass(classid);
      }
   });
}

// Get class information from user
async function getClassInformation() {
   const classId = document
      .querySelector('#username')
      .getAttribute('data-classid');
   try {
      const response = await fetch(`/api/dashboard/class/${classId}`);
      const data = await response.json();
      const classObject = data.class;
      let classInfo = `${classObject.year}-${classObject.department} ${classObject.batch_name}`;
      document.querySelector('#class-info').innerHTML = classInfo;
   } catch (err) {
      console.log(err);
   }
}

// Get classes for dropdown for teacher
async function getClasses() {
   try {
      const response = await fetch(`/api/dashboard/classes/${user.id}`);
      const data = await response.json();
      const classesArray = data.classes;
      const idsArray = data.ids;
      // Set Classes Information
      const selector = document.querySelector('#class-selector');
      for (let i = 0; i < classesArray.length; i++) {
         selector.innerHTML += `<option value="${idsArray[i]}">${classesArray[i]}</option>`;
      }
   } catch (err) {
      console.log(err);
   }
}

// Get Posts by class for teacher
async function getPostsByClass(classid) {
   try {
      const response = await fetch(
         `/post/api/dashboard/filter/${classid}/${user.id}`
      );
      const data = await response.json();
      const posts = data.posts;
      if (posts.length == 0) {
         globals.container.innerHTML += `<div class="no-posts">No posts found</div>`;
      } else {
         setPosts(posts);
      }
   } catch (err) {
      console.log(err);
   }
}

// Get Statistics
async function getStatisticsForStudent() {
   const classId = document
      .querySelector('#username')
      .getAttribute('data-classid');
   try {
      const response = await fetch(
         `/post/api/dashboard/statistics/student/${classId}/${user.username}`
      );
      const data = await response.json();
      document.querySelector('#my-posts-header').innerHTML = 'Batch Posts';
      document.querySelector('#my-posts').innerHTML = data.batchPosts;
      document.querySelector('#community-posts-header').innerHTML = 'All Posts';
      document.querySelector('#community-posts').innerHTML = data.allPosts;
      document.querySelector('.red-dot').innerHTML = data.myNotifications;
   } catch (err) {
      console.log(err);
   }
}

async function getStatisticsForTeacher() {
   try {
      const response = await fetch(
         `/post/api/dashboard/statistics/teacher/${user.id}/${user.username}`
      );
      const data = await response.json();
      document.querySelector('#my-posts-header').innerHTML = 'My Posts';
      document.querySelector('#my-posts').innerHTML = data.yourPosts;
      document.querySelector('#community-posts-header').innerHTML = 'All Posts';
      document.querySelector('#community-posts').innerHTML = data.allPosts;
      document.querySelector('.red-dot').innerHTML = data.myNotifications;
   } catch (err) {
      console.log(err);
   }
}

// Get Posts
async function getPosts() {
   try {
      const response = await fetch(
         `/post/api/dashboard/${user.designation}/${user.id}`
      );
      const data = await response.json();
      const posts = data.posts;
      if (posts.length == 0) {
         globals.container.innerHTML += `<div class="no-posts">No posts found</div>`;
      } else {
         setPosts(posts);
      }
   } catch (err) {
      console.log(err);
   }
}

async function getNotifications() {
   try {
      const response = await fetch(
         `/notification/api/get/all/${user.username}`
      );
      const data = await response.json();
      const notifications = data.notifications;
      if (notifications.length == 0) {
         globals.container.innerHTML += `<div class="no-posts">You have no notifications</div>`;
      } else {
         setNotifications(notifications);
      }
   } catch (err) {
      console.log(err);
   }
}

function setPosts(posts) {
   console.log(`Posts: ${posts.length}`);
   let padding = '';
   if (user.designation == 'teacher') {
      padding = 'padding';
   }

   for (i = 0; i < posts.length; i++) {
      const post = posts[i];
      const today = new Date();
      let postHTML = `<div class="post-container ${padding}" data-id="${
         post._id
      }">
					<div class="post">
						<div class="post-header">
							<div class="post-header-left">
								<div class="post-image header-1">${post.teacher[0].toUpperCase()}</div>
								<div class="post-header-info">
									<p class="header-2">${post.teacher}</p>
									<p class="header-3">${post.student}</p>
								</div>
							</div>
							<div class="post-download" id="${
                        post._id
                     }" onclick="getId(this.id)"><p class="header-3">Download</p></div>
						</div>
						<div class="post-body">
							<p class="header-2">${post.description}</p>
							<div class="code-editor" id="editor${i}"></div>
						</div>
						<div class="post-footer">
							<p class="header-3">${post.class}</p>
							<p class="header-3">${formatDate(post.date, today)}</p>
						</div>
					</div>`;
      if (user.designation == 'teacher') {
         postHTML += `<div onclick="deletePost(this.id)" id="delete-post-${i}" class="delete-post">
					<img src="img/cross.png" alt="" />
					</div>
					</div>`;
      } else {
         postHTML += `</div>`;
      }
      globals.container.innerHTML += postHTML;
   }
   for (var i = 0; i < posts.length; i++) {
      const post = posts[i];
      window.editor = ace.edit(`editor${i}`);
      editor.session.setValue(
         formatCode(post.code, post.input, post.output, post.extension)
      );
      if (post.extension == 'c') {
         editor.getSession().setMode('ace/mode/c_cpp');
      } else if (post.extension == 'java') {
         editor.getSession().setMode('ace/mode/java');
      } else if (post.extension == 'python') {
         editor.getSession().setMode('ace/mode/python');
      }
      editor.setOptions({
         mode: 'ace/mode/c_cpp',
         theme: 'ace/theme/monokai',
         readOnly: true,
         fontSize: '16px',
         fontFamily: 'Consolas',
      });
   }
}

function setNotifications(notifications) {
   let padding = '';
   if (user.designation == 'teacher') {
      padding = 'padding';
   }

   for (let i = 0; i < notifications.length; i++) {
      const notification = notifications[i];
      const today = new Date();
      let notificationHTML = `<div class="post-container ${padding} data-id="${
         notification._id
      }">
					<div class="post">
						<div class="post-header">
							<div class="post-header-left">
								<div class="post-image header-1">${notification.fromusername[0].toUpperCase()}</div>
								<div class="post-header-info">
									<p class="header-2">${notification.fromusername}</p>
								</div>
							</div>
							<div class="post-reply" id="${
                        notification._id
                     }" onclick="getNotificationId(this.id)">
								<p class="header-3">Reply</p>
							</div>
						</div>
						<div class="post-body">
							<p class="header-2">${notification.comment}</p>
							<div class="code-editor" id="notification-editor-${i}"></div>
						</div>
						<div class="post-footer">
							<p class="header-3">${formatDate(notification.date, today)}</p>
						</div>
					</div>`;
      if (user.designation == 'teacher') {
         notificationHTML += `<div onclick="deleteNotification(this.id)" id="delete-notification-${i}" class="delete-post">
					<img src="img/cross.png" alt="" />
					</div>
					</div>`;
      } else {
         notificationHTML += `</div>`;
      }

      globals.container.innerHTML += notificationHTML;
   }

   for (let i = 0; i < notifications.length; i++) {
      const notification = notifications[i];
      // Set editor
      window.editor = ace.edit(`notification-editor-${i}`);
      editor.setValue(notification.code);
      editor.clearSelection();
      editor.setOptions({
         mode: 'ace/mode/c_cpp',
         theme: 'ace/theme/monokai',
         readOnly: true,
         fontSize: '16px',
         fontFamily: 'Consolas',
      });
   }
}

// Format code adding inputs and outputs
function formatCode(code, input, output, language) {
   let final = code;
   if (language == 'c' || language == 'java') {
      // C or java
      if (input != '') {
         final += '\n\n/*\nInput:\n' + input + '\n*/';
      }
      if (output != '') {
         final += '\n\n/*\nOutput:\n' + output + '\n*/';
      }
   } else {
      // Python
   }
   return final;
}

// Format Date
function formatDate(ISODate, today) {
   const date = new Date(ISODate);
   const diffMs = today - date; // Difference in milliseconds
   const diffDays = Math.floor(diffMs / 86400000); // Difference in days
   const diffMin = Math.round(((diffMs % 86400000) % 3600000) / 60000); // Difference in minutes
   const time = `${formatTime(date.getHours())}:${formatTime(
      date.getMinutes()
   )}`; // Structuring the time HH:mm and adding leading zeros
   const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
   ];
   if (
      today.getYear() + 1900 == date.getYear() + 1900 &&
      today.getMonth() == date.getMonth() &&
      today.getDate() == date.getDate()
   ) {
      if (diffMin <= 2) {
         // Less than 2 minutes
         return 'Just now';
      } else {
         // Same Day
         return `Today at ${time}`;
      }
   } else if (
      today.getYear() + 1900 == date.getYear() + 1900 &&
      today.getMonth() == date.getMonth() &&
      today.getDate() - 1 == date.getDate()
   ) {
      // Next Day
      return `Yesterday at ${time}`;
   } else {
      return `${months[date.getMonth()]} ${date.getDate()} at ${time}`;
   }
}

function formatTime(time) {
   if (time < 9) {
      return '0' + time;
   } else {
      return time;
   }
}

async function deletePost(buttonId) {
   const deleteButton = document.querySelector(`#${buttonId}`);
   const postToBeDeleted = deleteButton.parentElement;
   const postId = deleteButton.parentElement.getAttribute('data-id');

   if (confirm('Are you sure you want to delete?')) {
      try {
         const response = await fetch(`/post/api/dashboard/delete/${postId}`, {
            method: 'DELETE',
         });
         const data = await response.json();
         alert(data.message);
         postToBeDeleted.remove();
         const myPosts = document.querySelector('#my-posts');
         const communityPosts = document.querySelector('#community-posts');
         myPosts.innerHTML = parseInt(myPosts.textContent, 10) - 1;
         communityPosts.innerHTML =
            parseInt(communityPosts.textContent, 10) - 1;

         if (communityPosts.textContent == '0') {
            document.getElementById('no-posts').style.display = 'block';
         } else {
            document.getElementById('no-posts').style.display = 'none';
         }
      } catch (err) {
         console.log(err);
      }
   }
}

async function deleteNotification(buttonId) {
   const deleteButton = document.querySelector(`#${buttonId}`);
   const notificationToBeDeleted = deleteButton.parentElement;
   const notificationId = deleteButton.parentElement.getAttribute('data-id');

   console.log(notificationId);

   if (confirm('Are you sure you want to delete?')) {
      try {
         const response = await fetch(
            `/notification/api/dashboard/delete/${notificationId}`,
            { method: 'DELETE' }
         );
         const data = await response.json();
         alert(data.message);
         notificationToBeDeleted.remove();
         const notificationDot = document.querySelector('.red-dot');
         notificationDot.textContent = notificationDot.textContent - 1;
      } catch (err) {
         console.log(err);
      }
   }
}

const sendButton = document.getElementById('send');
sendButton.addEventListener('click', () => {
   console.log('clicked send');
   notif();
});

function notif() {
   var teacher = document.getElementById('notif-to-address').value;
   var inpop = document.getElementById('notif-code').value;
   var comment = document.getElementById('notif-comments').value;
   console.log(user.designation);
   if (user.designation == 'student') {
      if (isNaN(teacher)) {
         $.ajax({
            url: '/notification/api/post',
            method: 'POST',
            data: {
               designation: user.designation,
               tousername: teacher,
               fromusername: user.username,
               code: inpop,
               comment: comment,
               email: user.email,
            },
            success: function (msg) {
               console.log(msg);
               alert('Succesfully Sent');
               $('#notif-to-address').val('');
               $('#notif-code').val('');
               $('#notif-comments').val('');
               teacher = '';
               inpop = '';
               comment = '';
            },
            error: function (result) {
               console.log(result);
               alert('Failed!');
            },
            timeout: 2000,
         });
      } else alert('Messages can be sent to teachers only.');
   } else {
      // Teacher
      $.ajax({
         url: '/notification/api/post',
         method: 'POST',
         data: {
            designation: user.designation,
            tousername: teacher,
            fromusername: user.username,
            code: inpop,
            comment: comment,
            email: user.email,
         },
         success: function (msg) {
            alert('Succesfully Sent');
            $('#notif-to-address').val('');
            $('#notif-code').val('');
            $('#notif-comments').val('');
            teacher = '';
            inpop = '';
            comment = '';
         },
         error: function (result) {
            alert('Failed!');
         },
         timeout: 2000,
      });
   }
}

function makeFile(code, input, output, exptension, question) {
   data = formatCode(code, input, output);
   $.ajax({
      url: '/download',
      method: 'POST',
      data: {
         data: data,
         extension: extension,
         name: question,
      },
      success: function (msg) {
         console.log('Downloaded successfully');
      },
      error: function (result) {
         console.log('Error occurred');
      },
   });
}

// Download function
function download(filename, text) {
   var element = document.createElement('a');
   element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
   );
   element.setAttribute('download', filename);

   element.style.display = 'none';
   document.body.appendChild(element);

   element.click();

   document.body.removeChild(element);
}

function getId(postId) {
   $.ajax({
      url: `/download/${postId}`,
      method: 'GET',
      success: function (post) {
         console.log(post);
         text = formatCode(post.code, post['input'], post['output']);

         var fileExtension;
         switch (post.extension) {
            case 'c':
               fileExtension = '.c';
               break;
            case 'java':
               fileExtension = '.java';
               break;
            case 'python':
               fileExtension = '.py';
               break;
            default:
               fileExtension = '.txt';
         }

         console.log(fileExtension);

         download(post.description + fileExtension, text);

         console.log('Post Received successful');
      },
      error: function (result) {
         console.log('Error occurred');
      },
   });

   // // console.log(editor);
   // // 	text = editor.getValue();
   // console.log(text);
   // filename = document.getElementById(`question${id}`).innerText;
   // download(filename, text);
}

// Clear Button
document.getElementById('clear').addEventListener('click', () => {
   document.querySelector('#notif-to-address').value = '';
   document.querySelector('#notif-code').value = '';
   document.querySelector('#notif-comments').value = '';
});

async function getNotificationId(notificationId) {
   try {
      const response = await fetch(
         `/notification/api/get/specific/${notificationId}`
      );
      const data = await response.json();
      const notification = data.notification;
      document.querySelector('#notif-to-address').value =
         notification.fromusername;
      document.querySelector('#notif-code').value = notification.code;
      document.querySelector(
         '#notif-comments'
      ).value = `RE: ${notification.comment}\n`;
   } catch (err) {
      console.log(err);
   }
}
