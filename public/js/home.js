function formatCode(code, input, output) {
   if (input == '') {
      return code + '\n\n/*\nOutput:\n' + output + '\n*/';
   } else {
      return (
         code + '\n\n/*\nInput:\n' + input + '\n\nOutput:\n' + output + '\n*/'
      );
   }
}

function makeFile(code, input, output, question) {
   data = formatCode(code, input, output);
   $.ajax({
      url: '/download',
      method: 'POST',
      data: {
         data: data,
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
