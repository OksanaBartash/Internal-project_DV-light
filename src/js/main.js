"use strict"
let showMoreBtn = document.querySelector('.show-more-btn a');
let blockContainer = document.querySelector('.conteiner-border');

showMoreBtn.addEventListener('click', function(event) {
   event.preventDefault();
   showMoreBtn.parentNode.classList.toggle('open');
 
});

