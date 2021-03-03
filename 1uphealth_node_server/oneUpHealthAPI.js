
const https = require('https');
const config = require("./config")();
const querystring = require('querystring');
let ACCESS_TOKEN = '';
module.exports = {
  getAccessToken: (response) => {
    getAuthorizationCode()
      .then((authorization_code) => {
        return exchangeAuthorizationCode(authorization_code);
      })
      .then((access_token) => {
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
  },

  getPatient: (response) => {
    const options = {
      hostname: 'api.1up.health',
      path: '/dstu2/patient',
      method: 'GET',
      headers: {
        "Authorization": ` Bearer ${ACCESS_TOKEN}`
      }
    }

    let patientData = '';
    const request = https.request(options, res => {
      console.log("Patient status " + res.statusCode)
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
  },

  getPatientEverything: (patientId, response) => {
    const options = {
      hostname: 'api.1up.health',
      path: `/dstu2/Patient/${patientId}/$everything`,
      method: 'GET',
      headers: {
        "Authorization": ` Bearer ${ACCESS_TOKEN}`
      }
    }
    let patientData = '';
    const request = https.request(options, res => {
      console.log("$everthing status " + res.statusCode)
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
}


function  getAuthorizationCode() {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.1up.health',
        path: `/user-management/v1/user/auth-code?app_user_id=${config.app_user_id}&client_id=${config.client_id}&client_secret=${config.client_secret}`,
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

  function exchangeAuthorizationCode(authorization_code) {
    return new Promise((resolve, reject) => {
      const formData = querystring.stringify({
        'client_id': config.client_id,
        'client_secret': config.client_secret,
        'code': authorization_code,
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
      const request = https.request(options, response => {
        response.on('data', data => {
          ACCESS_TOKEN = JSON.parse(data).access_token;
          resolve(ACCESS_TOKEN);
        });
      });
      request.on('error', error => { reject(error) });
      request.write(formData);
      request.end();
    });
  }