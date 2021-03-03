// Coding challenge for 1upHealth.
// Below is the definition for a Node server to fetch electronic health record (EHR)
// information for a patient that has been authorized for use by 1upHealth.

const http = require('http');
const querystring = require('querystring');
const config = require("./config")();
const routes = require("./server_routes");

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
    redirectToRoute(path, data, response);
  });
});

/*
  Listing on port 3500 i.e http://localhost:3500
*/
const PORT = process.env.PORT || config.port || 3500
server.listen(PORT, () => {
  console.log("listening on port {port}".replace("{port}", PORT));
})

function redirectToRoute(path, data, response) {
  // route to endpoint
  let route = routes["notFound"];
  if (typeof routes[path] !== "undefined") {
    route = routes[path];
  } else if (/\bpatient\/([^\/]+$)/.test(path)) {
    route = routes["patient/everything"]; // for now, only checking for /patient/everything
  }
  route(data, response);
}