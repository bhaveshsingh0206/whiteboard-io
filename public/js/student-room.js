const socket = io('https://callback-vtzhu.run-us-west2.goorm.io');
// const AceCollabExt = require('@convergence/ace-collab-ext');

function selectQuestion() {
   document.querySelector('.question-panel').style.display = 'block';
   document.querySelector('.code-panel').style.display = 'none';
   document.querySelector('.io-panel').style.display = 'none';
}

function selectCode() {
   document.querySelector('.question-panel').style.display = 'none';
   document.querySelector('.code-panel').style.display = 'flex';
   document.querySelector('.io-panel').style.display = 'none';
}

function selectIO() {
   document.querySelector('.question-panel').style.display = 'none';
   document.querySelector('.code-panel').style.display = 'none';
   document.querySelector('.io-panel').style.display = 'flex';
}

window.editor = ace.edit('editor');
// const curMgr = new AceCollabExt.AceMultiCursorManager(editor.getSession());
// curMgr.addCursor("uid1", "Teacher", "orange", {row: 0, column: 10});
// editor.setTheme('ace/theme/terminal');
editor.setTheme('ace/theme/monokai');

editor.setFontSize('14px');
editor.setShowPrintMargin(false);
// editor.getSession().setUseWrapMode(true); //To wrap content

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

const roomId = $('#room-id').text();
const username = $('#room-username').text();
const language = $('#room-language').text();

joinToRoom = (roomId, socket) => {
   $.ajax({
      url: '/room/join',
      method: 'POST',
      data: {
         roomId: roomId,
         classId: $('#classId').text(),
         studentId: $('#studentId').text(),
      },
      success: function (msg) {
         console.log('Room join Successfull');
         socket.emit('join-room', {
            roomId: roomId,
            username: username,
            designation: 'Student',
         });
         socket.on('get-question', (data) => {
            $('#question').text(data.question);
         });
      },
      error: function (result) {
         console.log('Error occurred');
      },
   });
};
joinToRoom(roomId, socket);

languageOfRoom = (language, editor) => {
   console.log(language);
   if (language == 'c') {
      editor.getSession().setMode('ace/mode/c_cpp');
      editor.setValue(
         `#include<stdio.h>
int main(){

	/* Write your code here */
	printf("Hello World");
	return 0;
}`,
         4
      );
   } else if (language == 'java') {
      editor.getSession().setMode('ace/mode/java');
      editor.setValue(
         `public class Main
{
	public static void main(String[] args) {
		System.out.println("Hello World");
	}
}`,
         4
      );
   } else {
      editor.getSession().setMode('ace/mode/python');
      editor.setValue(
         `# Hello World program in Python
    
print "Hello World!"`,
         4
      );
   }
};
languageOfRoom(language, editor);

let isActive = false;
editor.textInput.getElement().addEventListener('keyup', function () {
   if (!isActive) {
      // 		NOT ACTIVE SCREEN HENCE NOT SENDING TO SERVER
   } else {
      socket.emit('send-data-to-teacher', {
         code: editor.getValue(),
         roomId: roomId,
      });
      // 	editable = setInterval(()=>{
      // 	socket.emit('enable-editable-teacher', {
      // 	roomId: roomId,
      // 	});
      // },1000)
      // });
   }
});

// socket.on('clear-editable',()=>{
// 	clearTimeout(editable);
// });

var Range = ace.require('ace/range').Range;
socket.on('teacher-changes', (data) => {
   $('.teacher-typing').show();
   editor.setReadOnly(true);
   // console.log(editor.selection.getCursor())
   editor.setReadOnly(true);
   window.editor.setValue(data.code);
   editor.clearSelection();
   console.log(data);
   // console.log(editor.getCursorPosition())
   // editor.session.addMarker(new Range(editor.getCursorPosition().row, editor.getCursorPosition().column, 		editor.getCursorPosition().row, editor.getCursorPosition().column+2), "ace_selected_word","text");
   // console.log(editor.getCursorPosition())
   console.log(data.cursorPosition.row);
   // curMgr.setCursor("uid1", 10);
});

socket.on('disenable-editable', () => {
   $('.teacher-typing').hide();
   editor.setReadOnly(false);
});

socket.on('isActive', (data) => {
   $('.teacher-typing').hide();
   $('.teacher-watching').hide();
   isActive = false;
});
socket.on('receive-question', (data) => {
   console.log(data);
   $('#question').text(data.question);
});
socket.on('teacher-requesting-code', (data) => {
   isActive = true;
   $('.teacher-watching').show();
   $('.teacher-typing').hide();
   console.log('Yes i did receive a request');
   socket.emit('acknowledge-with-code', {
      code: window.editor.getValue(),
      roomId: roomId,
      username: username,
   });
});

let focus = true;
$(window).blur(() => {
   focus = false;
   socket.emit('focus-lost', {
      roomId: roomId,
      username: username,
   });
});
$(window).focus(() => {
   if (!focus) {
      socket.emit('focus-gain', {
         roomId: roomId,
         username: username,
      });
      focus = false;
   }
});
socket.on('disconnect-all-user', (data) => {
   socket.emit('disconnect-user', {
      roomId: roomId,
      username: username,
      designation: 'Student',
   });
   alert('Room has been closed by the teacher');
   var loc = '/dashboard';
   window.location.href = loc;
});

$('#finish').on('click', () => {
   const finishBtn = document.getElementById('finish');
   if (finishBtn.classList.contains('button-3-click')) {
      finishBtn.classList.remove('button-3-click');
      finishBtn.innerHTML = 'Finish';
   } else {
      finishBtn.classList.add('button-3-click');
      finishBtn.innerHTML = 'Cancel';
   }

   socket.emit('student-requesting-check', {
      roomId: roomId,
      username: username,
   });
});
window.onbeforeunload = () => {
   socket.emit('disconnect-user', {
      roomId: roomId,
      username: username,
      designation: 'Student',
   });

   // var loc = '/room'
   // window.location.href = loc;
};

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
            $('#output').html(result['output']);
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

function getId() {
   var question = document.getElementById('question').textContent.trim();
   if (question === 'Some question which has to be solved') question = 'code';
   console.log(question);
   const code = editor.getValue();
   const input = document.getElementById('input').value;
   const output = document.getElementById('output').value;
   const extension = $('#room-language').text();
   console.log(input);

   let fileExtension, language;
   switch (extension) {
      case 'c':
         fileExtension = '.c';
         language = 'c';
         break;
      case 'java':
         fileExtension = '.java';
         language = 'java';
         break;
      case 'python':
         fileExtension = '.py';
         language = 'python';
         break;
      default:
         fileExtension = '.txt';
   }

   console.log(fileExtension);
   let text = formatCode(code, input, output, language);

   download(question + fileExtension, text);
}

function formatCode(code, input, output, language) {
   let final = code;
   console.log(input, output);
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
   console.log('Final', final);
   return final;
}
