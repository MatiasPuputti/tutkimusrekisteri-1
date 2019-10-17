window.onload = function() {
  dragElement(document.getElementById("mydiv"));
  document.getElementById("Back").addEventListener("click", BackPage);

  Tab_Selected = document.getElementById("tab_Sel");
  Tab_Selected.addEventListener("change", Buttongreen);
};

function Buttongreen() {
  var selected = document.getElementById("tab_Sel").value;
  var submit = document.getElementById("Submit");

  switch (selected) {
    case "Default":
      submit.style.background = "white";
      submit.style.color = "black";
      break;

    case "Person":
      submit.style.background = "#4caf50";
      submit.style.color = "white";
      break;

    case "ResearchId":
      submit.style.background = "#4caf50";
      submit.style.color = "white";
      break;
  }
}

function BackPage() {
  location.replace("../index.html");
}

function ViewPage() {
  location.replace("View/View.html");
}

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
