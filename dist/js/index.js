let gallery, popup ;

function clicked(e) {
  if (!gallery) {
    gallery = document.getElementById("gallery");
    popup = document.getElementById('popup');
    popup_img = popup.getElementsByTagName('img')[0];
    popup_caption = popup.getElementsByTagName('figcaption')[0];
  }
  
  popup_img.src = e.target.src;
  popup_caption.innerHTML = e.target.parentElement.getElementsByTagName('figcaption')[0].innerHTML;
  gallery.classList.add('pop');
  popup.classList.add('show');
  popup.style.display = '';
}

function close() {
  gallery.classList.remove('pop');
  popup.classList.remove('show');
}