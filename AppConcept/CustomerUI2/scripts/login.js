// export async function login() 
// {
//     const loginBody = JSON.stringify({
//         "username": "barbora",
//         "password": "goodpw123"
//     });

//     const response = await fetch("http://localhost:3000/loginCustomer", {
//         method: "POST",
//         body: loginBody,
//         header: {
//             "Content-Type": "application/json"
//         }
//     });

//     const loginResponse = await response.json();
//     console.log(loginResponse);

    // const request = http.request({
    // method: 'POST',
    // protocol: 'http://',
    // hostname: 'localhost',
    // port: 3000,
    // path: '/loginCustomer',
    // headers: {
    //     'Content-Type': 'application/json'
    // }
    // })

    // const loginBody = JSON.stringify({
    // "username": "barbora",
    // "password": "goodpw123"
    // });

    // request.on('response', (response) => {
    // response.on('data', (chunk) => {
    //     var json = JSON.parse(chunk);
    //     console.log(json);
    //     let token = { url: "http://localhost", name: "accessToken", value: json.accessToken }
    //     ses.cookies.set(token).then(() => {
    //     console.log(token);
    //     });
    //     let userid = { url: "http://localhost", name: "userid", value: json.id }
    //     ses.cookies.set(userid).then(() => {
    //     console.log(userid);
    //     });
    // });
    // });

    // request.write(loginBody);
    // request.end()
}
