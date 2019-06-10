let gallery, popup ;

function clicked(e) {
  if (!gallery) {
    gallery = document.getElementById("gallery");
    popup = document.getElementById('popup');
    popup_img = popup.getElementsByTagName('img')[0];
  }

  
  popup_img.src = e.target.src;
  popup.classList.add('show');
  popup.style.display = '';
}

function close() {
    console.log('close');
}