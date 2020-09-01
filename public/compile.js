const runButton = document.getElementById('run');
runButton.addEventListener('click', () => {
   alert('clicking');
   if (language == 'c') run(language);
   else if (language == 'java') runjava(language);
   else runpy(language);
});

function run(language) {
   $('.animation').css({
      display: 'block',
   });
   const code = editor.getValue();
   const input = document.getElementById('input').value;
   console.log(code);
   console.log(input);
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
}

function runpy(language) {
   $('.animation').css({
      display: 'block',
   });
   const code = editor.getValue();
   const input = document.getElementById('input').value;
   console.log(code);
   console.log(input);
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

function runjava(language) {
   $('.animation').css({
      display: 'block',
   });
   const code = editor.getValue();
   const input = document.getElementById('input').value;
   console.log(code);
   console.log(input);
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
      },
   });
}
