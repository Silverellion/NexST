document.addEventListener('DOMContentLoaded', function() {
  const placeholderElement = document.querySelector('.placeholder-text');
  const searchInput = document.querySelector('.search-input');
  const searchToggle = document.querySelector('.search-toggle');
  const searchContainer = document.querySelector('.search-container');
  
  if (searchToggle) {
    searchToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      searchContainer.classList.toggle('active');
      if (searchContainer.classList.contains('active')) {
        setTimeout(() => searchInput.focus(), 300); 
      }
    });
  }
  
  document.addEventListener('click', function(event) {
    const isClickInside = searchContainer.contains(event.target) || searchToggle.contains(event.target);
    if (!isClickInside && searchContainer.classList.contains('active')) {
      searchContainer.classList.remove('active');
    }
  });
  
  searchContainer.addEventListener('click', function(e) {
    e.stopPropagation();
  });
  
  const phrases = [
    'gaming laptop',
    'pc',
    'lenovo legion',
    '4k screen',
    'msi laptop',
    'rtx 5080'
  ];
  
  let phraseIndex = 0;
  let letterIndex = 0;
  let currentPhrase = '';
  let isDeleting = false;
  let typingSpeed = 150;
  let typingInterval = null;
  
  function typeEffect() {
    const fullPhrase = phrases[phraseIndex];
    
    // If deleting
    if (isDeleting) {
      currentPhrase = fullPhrase.substring(0, letterIndex - 1);
      letterIndex--;
      typingSpeed = 75;
    } else {
      // If typing
      currentPhrase = fullPhrase.substring(0, letterIndex + 1);
      letterIndex++;
      typingSpeed = 150; 
    }
    
    placeholderElement.textContent = currentPhrase;
    if (!isDeleting && letterIndex === fullPhrase.length) {
      isDeleting = true;
      typingSpeed = 1500; 
    } 
    else if (isDeleting && letterIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length; 
      typingSpeed = 500; 
    }
    
    typingInterval = setTimeout(typeEffect, typingSpeed);
  }
  
  setTimeout(typeEffect, 1000);
  searchInput.addEventListener('focus', function() {
    placeholderElement.style.display = 'none'; // If the useris typing, hide the placeholder text
  });
  
  searchInput.addEventListener('blur', function() {
    if (searchInput.value === '') {
      placeholderElement.style.display = 'block'; // Show again if input is empty
    }
  });
});