
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

const response = fetch("http://localhost:3000/transactions", {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  }
}).then(res => res.json()).then(response => {
  for (let i = 0; i < response.length; i++) {
    let app = document.createElement("OPTION");
    document.getElementById("appList").appendChild(app);

    app.innerHTML += response[i].appname;
    sessionStorage.setItem(response[i].appname, response[i].id);
  }
})
