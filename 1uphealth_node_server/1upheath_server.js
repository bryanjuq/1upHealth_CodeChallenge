// Coding challenge for 1upHealth.
// Below is the definition for a Node server to fetch electronic health record (EHR)
// information for a patient that has been authorized for use by 1upHealth.

const http = require('http');
const https = require('https');
const querystring = require('querystring');
const config = require("./config")();

const CLIENT_ID = config.client_id;
const CLIENT_SECRET = config.client_secret;
let ACCESS_TOKEN = '';
let REFRESH_TOKEN = '';

/*
  Creating server
*/
const server = http.createServer((request, response) => {
  const parsedURL = new URL("http://" + request.headers.host + request.url);
  let path = parsedURL.pathname;
  path = path.replace(/^\/+|\/+$/g, ""); // JS is case-sesitive i.e cares if starts or ends with "/"
  const queryString = parsedURL.search;
  const headers = request.headers;
  const method = request.method.toLowerCase();
  const data = {
    path,
    queryString,
    headers,
    method
  };
  request.on('data', () => {
    console.log("Got some data");
  });
  request.on('end', () => {
    establishSession()
      .then((authorization_code) => {
        return exchangeAuthorizationCode(authorization_code);
      })
      .then((access_token) => {
        ACCESS_TOKEN = access_token;
        redirectToRoute(path, data, response);
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

/*
  Listing on port 3200 i.e http://localhost:3200
*/
const PORT = process.env.PORT || config.port || 3200
server.listen(PORT, () => {
  console.log("listening on port {port}".replace("{port}", PORT));
})

/*
  Setting up routes/endpoints
*/
const routes = {
  test: (data, response) => {
    getAllConnectedHealthSystems(response);
  },
  patient: (data, response) => {
    getPatient(response);
  },
  "patient/patientId": (data, response) => {
    const patientId = data.path.split('/')[1];
    getPatientById(patientId, response);
  },
  notFound: (data, response) => {
    const payload = {
      message: "Resource Not Found",
      code: 404
    };
    const payloadStr = JSON.stringify(payload);
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.writeHead(404);
    response.write(payloadStr);
    response.end("\n");
  }
}

function redirectToRoute(path, data, response) {
  // route to endpoint
  let route = routes["notFound"];
  if (typeof routes[path] !== "undefined") {
    route = routes[path];
  } else if (/\bpatient\/([^\/]+$)/.test(path)) {
    route = routes["patient/patientId"]; // for now, only supporting /patient/patientId
  }
  route(data, response)
}

function getPatient(response) {
  const options = {
    hostname: 'api.1up.health',
    path: '/dstu2/patient',
    method: 'GET',
    headers: {
      "Authorization": " Bearer " + ACCESS_TOKEN
    }
  }

  let patientData = '';
  const request = https.request(options, res => {
    console.log("1upHealth API status " + res.statusCode)
    res.on('data', data => {
      patientData += data;
    });
    res.on('end', () => {
      response.setHeader("Content-Type", "application/json");
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.writeHead(200);
      response.write(patientData);
      response.end();
    });
  })
  request.on('error', error => { console.log(error) })
  request.end();
}

function getPatientById(patientId, response) {
  const options = {
    hostname: 'api.1up.health',
    path: '/dstu2/patient/{patientId}'.replace('{patientId}', patientId),
    method: 'GET',
    headers: {
      "Authorization": " Bearer " + ACCESS_TOKEN
    }
  }
  let patientData = '';
  const request = https.request(options, res => {
    console.log("1upHealth API status " + res.statusCode)
    res.on('data', data => {
      patientData += data;
    });
    res.on('end', () => {
      response.setHeader("Content-Type", "application/json");
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.writeHead(200);
      response.write(patientData);
      response.end();
    });
  })
  request.on('error', error => { console.log(error) })
  request.end();
}

function establishSession() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.1up.health',
      path: "/user-management/v1/user/auth-code?app_user_id=us3r0n3&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "",
      method: 'POST'
    };
    let authorization_code = '';
    const request = https.request(options, response => {
      response.on('data', data => {
        console.log("Obtained authorization_code");
        authorization_code += JSON.parse(data).code;
      });
      response.on('end', () => {
        resolve(authorization_code);
      });
    });
    request.on('error', (error) => {
      reject("Error getting authorization_code: " + error);
    });
    request.end();
  });
}

function exchangeAuthorizationCode(AUTHORIZATION_CODE) {
  return new Promise((resolve, reject) => {
    const formData = querystring.stringify({
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
      'code': AUTHORIZATION_CODE,
      'grant_type': 'authorization_code'
    });
    const options = {
      hostname: 'auth.1up.health',
      path: '/oauth2/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    }
    let access_token = '';
    const request = https.request(options, response => {
      response.on('data', data => {
        access_token += JSON.parse(data).access_token;
        REFRESH_TOKEN = JSON.parse(data).refresh_token;
        console.log("Obtained access_token");
      });
      response.on('end', () => {
        resolve(access_token);
      });
    });
    request.on('error', error => { reject(error) });
    request.write(formData);
    request.end();
  });
}

function getAllConnectedHealthSystems(response) {
  let getdata = '';
  const request = https.get("https://api.1up.health/connect/system/clinical?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "", res => {
    res.on('data', data => { getdata += data });
    res.on('end', () => {
      response.setHeader("Content-Type", "application/json");
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.writeHead(200);
      response.write(getdata);
      response.end();
    });
  });
  request.on('error', error => { console.log(error) })
  request.end();
}