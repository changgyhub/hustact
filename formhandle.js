function guestReg() {
  username = document.getElementById("guestname").value;
  loadDraw();
}

function updateScore() {
  document.getElementById('myScore').innerHTML = "<h4>My Score: "+ sumScore +"</h4>";
}

  function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
     document.getElementById("demo").innerHTML = xhttp.responseText;
    }
  };
  xhttp.open("GET", "http://i.cs.hku.hk/~sjhu/hackust2016/scoreboard.php", true);
  xhttp.send();
}

function submitScore() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
     // alert(xhttp.responseText);
     document.getElementById("demo").innerHTML = xhttp.responseText;
    }
  };
  var d = new Date();
  if (username == "") {
    document.getElementById("demo").innerHTML = "<h3>You haven't told us your name</h3>";
    return;
  }
  xhttp.open("GET", "http://i.cs.hku.hk/~sjhu/hackust2016/add.php?name="+ username +"&scoretime="+ d.getHours() + "%3A" + d.getMinutes() + "%3A" + d.getSeconds() +"&score=" + sumScore, true);
  xhttp.send();
}