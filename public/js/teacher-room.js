const socket = io('https://callback-vtzhu.run-us-west2.goorm.io');
let selectedStudent;
let selectedStudentClassId;
let selectedStudentId;
function selectStudent(selectedElement) {
   document.querySelectorAll('.student-list li').forEach((element) => {
      element.classList.remove('selected');
   });
   selectedElement.classList.add('selected');
   $('.code-panel').show();
   console.log(selectedElement.textContent);
   let username_of_student = selectedElement.textContent;
   selectedStudentClassId = selectedElement.getAttribute('classId');
   selectedStudentId = selectedElement.getAttribute('studentId');
   selectedStudent = username_of_student;
   socket.emit('get-code-from-student', {
      roomId: roomId,
      student_username: selectedElement.textContent,
   });
   console.log('get_name is called');
   get_name(selectedElement.textContent);
}

function selectQuestion() {
   document.querySelector('.question-panel').style.display = 'block';
   document.querySelector('.code-panel').style.display = 'none';
   document.querySelector('.io-panel').style.display = 'none';
}

function selectCode() {
   document.querySelector('.question-panel').style.display = 'none';
   document.querySelector('.code-panel').style.display = 'none';
   document.querySelector('.io-panel').style.display = 'none';
}

function selectIO() {
   document.querySelector('.question-panel').style.display = 'none';
   document.querySelector('.code-panel').style.display = 'none';
   document.querySelector('.io-panel').style.display = 'flex';
}

window.editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.getSession().setMode('ace/mode/c_cpp');
editor.setFontSize('14px');
editor.setShowPrintMargin(false);
editor.session.setUseSoftTabs(true);

// For changing themes
const themeSelector = document.querySelector('#theme-selector');
themeSelector.addEventListener('change', () => {
   window.editor = ace.edit('editor');
   theme = themeSelector.value;
   console.log(theme);
   if (theme == 'light') {
      editor.setTheme('ace/theme/clouds');
   } else if (theme == 'black') {
      editor.setTheme('ace/theme/terminal');
   } else {
      editor.setTheme('ace/theme/monokai');
   }
});

var roomId = $('#room-id').text();
var username = $('#room-username').text();

editor.textInput.getElement().addEventListener('keyup', () => {
   // console.log(editor.getCursorPosition());
   socket.emit('transfer-teacher-data', {
      code: editor.getValue(),
      student_username: selectedStudent,
      roomId: roomId,
      cursorPosition: editor.getCursorPosition(),
   });
});
console.log('Rooom');
console.log(roomId);
socket.emit('create-room', {
   roomId: roomId,
   username: username,
   designation: 'Teacher',
});
socket.on('teacher-requesting-code', (data) => {
   window.editor.setValue(data.code);
   editor.clearSelection();
});
var count = 1;

window.onbeforeunload = () => {
   socket.emit('disconnect-user', {
      roomId: roomId,
      username: username,
      designation: 'Teacher',
   });
   var loc = '/dashboard';
   window.location.href = loc;
};

// $(document).on("keydown", function (e) {
//        if (e.key == "F5" || e.key == "F11" ||
//            (e.ctrlKey == true && (e.key == 'r' || e.key == 'R')) ||
//            e.keyCode == 116 || e.keyCode == 82) {

//                   e.preventDefault();
//        }
//    });

window.setInterval(() => {
   socket.emit('get-students', {
      roomId: roomId,
   });
   socket.on('send-student', (data) => {
      var ul = $('.student-list');
      ul.html('');
      $('.header-3').text(data.students.length);
      data.students.forEach((student) => {
         var id = student;
         if (student.isActive) {
            if (student.didComplete) {
               ul.append(
                  '<li id="student" classId ="' +
                     student.classId +
                     '" studentId ="' +
                     student.studentId +
                     '" onclick="selectStudent(this)">' +
                     student.username +
                     '<div class="student-icons"><img src="../img/completed.png" class="" alt="Completed"/><div 										class="green-dot" id="' +
                     student.username +
                     '"></div></li>'
               );
            } else {
               ul.append(
                  '<li id="student" classId ="' +
                     student.classId +
                     '" studentId ="' +
                     student.studentId +
                     '"  onclick="selectStudent(this)">' +
                     student.username +
                     '<div class="student-icons"><img src="../img/completed.png" class="hidden" alt="Completed"/><div 										class="green-dot" id="' +
                     student.username +
                     '"></div></li>'
               );
            }
         } else {
            if (student.didComplete) {
               ul.append(
                  '<li id="student" classId ="' +
                     student.classId +
                     '" studentId ="' +
                     student.studentId +
                     '" onclick="selectStudent(this)">' +
                     student.username +
                     '<div class="student-icons"><img src="../img/completed.png" class="" alt="Completed"/><div 										class="offline-circle" id="' +
                     student.username +
                     '"></div></li>'
               );
            } else {
               ul.append(
                  '<li id="student" classId ="' +
                     student.classId +
                     '" studentId ="' +
                     student.studentId +
                     '" onclick="selectStudent(this)">' +
                     student.username +
                     '<div class="student-icons"><img src="../img/completed.png" class="hidden" alt="Completed"/><div 										class="offline-circle" id="' +
                     student.username +
                     '"></div></li>'
               );
            }
         }
      });
   });
}, 1000);

socket.on('teacher-focus-gain', (data) => {
   console.log('student gain focus');
   id = data.student_username;
   document.getElementById(id).classList.remove('offline-circle');
   document.getElementById(id).classList.add('green-dot');
});

socket.on('teacher-focus-lost', (data) => {
   console.log('student lost focus');
   id = data.student_username;
   console.log(id);
   document.getElementById(id).classList.remove('green-dot');
   document.getElementById(id).classList.add('offline-circle');
});

$('.header-2').on('keyup', () => {
   socket.emit('set-question', {
      question: $('#question').text(),
      roomId: roomId,
   });
});

$('#disconnect').on('click', () => {
   if (confirm('Are you sure you want to close the room')) {
      socket.emit('disconnect-user', {
         roomId: roomId,
         username: username,
         designation: 'Teacher',
      });
      var loc = '/dashboard';
      window.location.href = loc;
   }
});

$('#end-typing').on('click', () => {
   socket.emit('disenable-editable', {
      roomId: roomId,
      student_username: selectedStudent,
      designation: 'Teacher',
   });
});
socket.on('remove-the-editor', (data) => {
   console.log(data.selectedStudent);
   editor.setValue('');
   if (selectedStudent === data.username) {
      $('.code-panel').hide();
   }
});
//post ajax
$('#post-button').on('click', () => {
   if (confirm('Are you sure you want to post this code?')) {
      const question = document.getElementById('question').textContent;
      const code = editor.getValue();
      const input = document.getElementById('input').value;
      const output = document.getElementById('output').value;
      const username = $('#room-username').text();
      const teacherid = $('#room-teacherid').text();
      const email = $('#room-email').text();
      const designation = $('#room-designation').text();
      const extension = $('#room-language').text();

      console.log(question);
      console.log($('#room-designation').text());
      console.log(username);

      $.ajax({
         url: '/post/api/code',
         method: 'POST',
         data: {
            username: username,
            teacherid: teacherid,
            studentid: selectedStudentId,
            classid: selectedStudentClassId,
            email: email,
            designation: designation,
            description: question,
            code: code,
            input: input,
            output: output,
            classId: selectedStudentClassId,
            studentId: selectedStudentId,
            extension: extension,
         },
         success: function (msg) {
            if (msg['status']) {
               console.log(msg);
               if (msg['status'] == true) alert('Code posted successfully');
            }
         },
         error: function (result) {
            console.log('Error occurred');
            alert('Code could not be posted');
         },
      });
   }
});

const language = $('#room-language').text();

//compilex
const runButton = document.getElementById('run');
runButton.addEventListener('click', () => run(language));

function run(language) {
   $('.loading-animation').css({
      display: 'block',
   });
   const code = editor.getValue();
   const input = document.getElementById('input').value;
   console.log(code);
   console.log(input);

   if (language == 'c') {
      $.ajax({
         url: '/compile/c',
         method: 'POST',
         data: {
            code: code,
            input: input,
            language: language,
         },
         success: function (msg) {
            $('.loading-animation').css({
               display: 'none',
            });
            console.log(msg);
            $('#output').html(msg['output']);
         },
         error: function (result) {
            console.log('Error Occured');
            $('.loading-animation').css({
               display: 'none',
            });
         },
      });
   } else if (language == 'java') {
      $.ajax({
         url: '/compile/java',
         method: 'POST',
         data: {
            code: code,
            input: input,
            language: language,
         },
         success: function (msg) {
            $('.loading-animation').css({
               display: 'none',
            });
            $('#output').html(msg['output']);
         },
         error: function (result) {
            console.log('Error Occured');
            $('.loading-animation').css({
               display: 'none',
            });
         },
      });
   } else {
      $.ajax({
         url: '/compile/py',
         method: 'POST',
         data: {
            code: code,
            input: input,
            language: language,
         },
         success: function (msg) {
            $('.loading-animation').css({
               display: 'none',
            });
            $('#output').html(msg['output']);
         },
         error: function (result) {
            console.log('Error Occured');
            $('.loading-animation').css({
               display: 'none',
            });
            $('#output').html(result['output']);
         },
      });
   }
}
function get_name(sap) {
   console.log(sap);
   $.ajax({
      url: '/name/' + sap,
      method: 'GET',

      success: function (msg) {
         console.log(msg);
         $('#header').html('Editor. ' + msg.name);
      },
      error: function (result) {
         console.log('Error Occured');
      },
   });
}
