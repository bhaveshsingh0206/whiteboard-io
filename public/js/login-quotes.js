const quotes = [
   {
      quote:
         'Programs must be written for people to read, and only incidentally for machines to execute.',
      author: 'Harold Abelson',
   },
   {
      quote:
         'Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live',
      author: 'John Woods',
   },
   {
      quote:
         'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
      author: 'Martin Fowler',
   },
   {
      quote:
         'Give a man a program, frustrate him for a day. Teach a man to program, frustrate him for a lifetime.',
      author: 'Muhammed Waseem',
   },
   {
      quote:
         "You've baked a really lovely cake, but then you've used dog shit for frosting.",
      author: 'Steve Jobs',
   },
   {
      quote:
         'Walking on water and developing software from a specification are easy if both are frozen.',
      author: 'Edward V. Berard',
   },
   {
      quote:
         'There are only two kinds of programming languages: those people always bitch about and those nobody uses.',
      author: 'Bjarne Stroustrup',
   },
   {
      quote:
         'There are two ways to write error-free programs; only the third one works.',
      author: 'Alan J. Perlis',
   },
   {
      quote:
         'Without requirements and design, programming is the art of adding bugs to an empty text file.',
      author: 'Louis Srygley',
   },
   {
      quote:
         'The trouble with programmers is that you can never tell what a programmer is doing until it’s too late.',
      author: 'Seymour Cray',
   },
   {
      quote:
         'If debugging is the process of removing software bugs, then programming must be the process of putting them in.',
      author: 'Edsger Dijkstra',
   },
   {
      quote: 'Before software can be reusable it first has to be usable.',
      author: 'Ralph Johnson',
   },
   {
      quote:
         'I’ve finally learned what ‘upward compatible’ means.  It means we get to keep all our old mistakes.',
      author: 'Dennie van Tassel',
   },
   {
      quote: 'Any fool can use a computer. Many do.',
      author: 'Ted Nelson',
   },
   {
      quote: 'To iterate is human, to recurse divine.',
      author: 'L. Peter Deutsch',
   },
   {
      quote: 'C++ : Where friends have access to your private members.',
      author: 'Gavin Russell Baker',
   },
   {
      quote:
         'In order to understand recursion, one must first understand recursion.',
      author: 'Anonymous',
   },
];

// Landing Animation
let animationTimeOut;
function animateLanding() {
   const topDiv = document.getElementById('cover-top');
   const bottomDiv = document.getElementById('cover-bottom');
   topDiv.classList.add('activate-top-animation');
   bottomDiv.classList.add('activate-bottom-animation');
   clearTimeout(animationTimeOut);
}

window.onload = () => {
   animationTimeOut = setTimeout(animateLanding, 1200);
   const random = Math.floor(Math.random() * quotes.length);
   // Display quote
   document.querySelector('#quote').innerHTML = `"${quotes[random].quote}"`;
   // TODO: Give credit
};
