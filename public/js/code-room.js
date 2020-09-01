function selectCode() {
   document.querySelector('.code-panel').style.display = 'flex';
   document.querySelector('.io-panel').style.display = 'none';
}

function selectIO() {
   document.querySelector('.code-panel').style.display = 'none';
   document.querySelector('.io-panel').style.display = 'flex';
}

function clearInput() {
   document.querySelector('#input').value = '';
}

window.onload = () => {
   window.editor = ace.edit('editor');
   // editor.setTheme('ace/theme/terminal');
   editor.setTheme('ace/theme/monokai');
   editor.getSession().setMode('ace/mode/c_cpp');
   editor.setFontSize('14px');
   editor.setShowPrintMargin(false);
   // editor.getSession().setUseWrapMode(true); //To wrap content
   editor.session.setUseSoftTabs(true);
};
// const curMgr = new AceCollabExt.AceMultiCursorManager(editor.getSession());
var languages = document.querySelector('#language');
var language;

languages.addEventListener('change', () => {
   language = languages.value;
});

//compilex
const runButton = document.getElementById('run');
runButton.addEventListener('click', () => run(language));

editor.textInput.getElement().addEventListener('keyup', () => {
   // 	radarView.addView("uid1", "user1", "orange", 0, 20, 0);
   // // Set the viewport range of the indicator to span rows 10 through 40.
   // radarView.setViewRows("uid1", editor.editor.getCursorPosition().row, 10);
});

function run(language) {
   $('.animation').css({
      display: 'block',
   });
   const code = editor.getValue();
   const input = document.getElementById('input').value;
   console.log(code);
   console.log(input);
   console.log(language);
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
            $('.animation').css({
               display: 'none',
            });
            $('#output').html(msg['output']);
         },
         error: function (result) {
            console.log('Error Occured');
            $('.animation').css({
               display: 'none',
            });
         },
      });
   } else if (language == 'java') {
      var currentUser = document.querySelector('#userid').textConent;
      console.log('name of user:' + currentUser);
      if (currentUser == '') {
         alert('Feature available after login');
      } else {
         $.ajax({
            url: '/compile/java',
            method: 'POST',
            data: {
               code: code,
               input: input,
               language: language,
            },
            success: function (msg) {
               $('.animation').css({
                  display: 'none',
               });
               $('#output').html(msg['output']);
            },
            error: function (result) {
               console.log('Error Occured');
               $('.animation').css({
                  display: 'none',
               });
               $('#output').html(result['output']);
            },
         });
      }
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
            $('.animation').css({
               display: 'none',
            });
            $('#output').html(msg['output']);
         },
         error: function (result) {
            console.log('Error Occured');
            $('.animation').css({
               display: 'none',
            });
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
   const code = editor.getValue();
   const input = document.getElementById('input').value;
   const output = document.getElementById('output').value;
   const extension = $('#language').val().toLowerCase();
   console.log(input);
   var fileExtension = '.' + extension;
   console.log(fileExtension);
   let text = formatCode(code, input, output, extension);

   download('myFile' + fileExtension, text);
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
