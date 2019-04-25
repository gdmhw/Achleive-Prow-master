function openTab(evt, tabName) {
  // initially state all variables used
  var i, tabcontent, tablinks;

  // get all elements with class tabcontent & hide their content
  tabcontent = document.getElementsByClassName("tabcontent");

  for (i = 0; i < tabcontent.length; i++){tabcontent[i].style.display = "none";}

  // make all elements with class tablinks & remove the class active from them.
  tablinks = document.getElementsByClassName("tablinks");


  //increment
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show selected tab & add active class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";

  ///////
  evt.currentTarget.className += " active";
}