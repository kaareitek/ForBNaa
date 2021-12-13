const response = fetch("http://localhost:3000/apps", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + getCookie("token")
  }
}).then(res => res.json()).then(response => {
  for (let i = 0; i < response.length; i++) {
    let app = document.createElement("OPTION");
    document.getElementById("appList").appendChild(app);

    app.innerHTML += response[i].appname;
    sessionStorage.setItem(response[i].appname, response[i].id);
    sessionStorage.setItem("url " + response[i].appname, response[i].appurl);
  }
})
