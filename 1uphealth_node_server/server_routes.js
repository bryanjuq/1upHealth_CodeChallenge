
const https = require('https');
const querystring = require('querystring');
const oneUpHealthAPI = require('./oneUpHealthAPI');
const config = require("./config")();
const CLIENT_ID = config.client_id;
const CLIENT_SECRET = config.client_secret;
let ACCESS_TOKEN = '';
let REFRESH_TOKEN = '';

/*
  Setting up routes/endpoints
*/
module.exports = routes = {
  access_token: (data, response) => {
    console.log("getting access token");
    oneUpHealthAPI.getAccessToken(response);
  },
  patient: (data, response) => {
    oneUpHealthAPI.getPatient(response);
  },
  "patient/everything": (data, response) => {
    const patientId = data.path.split('/')[1];
    oneUpHealthAPI.getPatientEverything(patientId, response);
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

function getAuthorizationCode() {
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
        console.log("Obtained access_token: " + access_token);
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

function getPatientEverything(patientId, response) {
  const options = {
    hostname: 'api.1up.health',
    path: '/dstu2/Patient/{patientId}/$everything'.replace('{patientId}', patientId),
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

function getAccessToken(response) {
  getAuthorizationCode()
    .then((authorization_code) => {
      return exchangeAuthorizationCode(authorization_code);
    })
    .then((access_token) => {
      ACCESS_TOKEN = access_token;
      const json = JSON.stringify({ token: access_token });
      response.setHeader("Content-Type", "application/json");
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.writeHead(200);
      response.write(json);
      response.end();
    })
    .catch((error) => {
      console.log(error);
    });
}