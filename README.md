# 1upHealth_CodeChallenge
Code challenge using React and Node.

**Intro:**

This is a very basic Node application that makes use of the 1upHealth API to display
a patient's information obtained via the $everything query against the
FHIR API. The application makes use of React to render the
data elements and Node to establish a session with 1upHealth API to ultimately serve the requested patient data.



**Pre-Configuration:**

This app assumes the user has already created a 1upHealth account to get an access_token using
the Client ID and Client Secret (See https://1up.health/dev/doc/user-management).

Once you obtain a value for client_id and client_secret, ensure to fill up the following config files:

     1uphealth_react_server/config/config.development.json
        - Note: the app_user_id was created when registering your app

     1uphealth_react_client/src/config/config.development.json
        - Note: the system_id represents the Health System to connect to i.e System id for Cerner Test is 4707


**To execute:**

This repository contains two directories, one for the React client-side application and one for the Node server application.
Implementation note: The right approach should be to have the Node server "serve" the React application.

   1- Run the 1uphealth_react_server:

    $ cd 1uphealth_react_server
    $ node 1uphealth_react_server


   2- Run 1uphealth_react_client:

    $ cd 1uphealth_react_client
    $ npm install
    $ npm start


   3- Using the browser, navigate to http://localhost:3200 (React app)

      - Verify a button displays "Connect to Health System"
      - Click the button, the application should redirect you to the URL:
          - "https://api.1up.health/connect/system/clinical/{system_id}?client_id={client_id}&access_token={access_token}"

      - Submit the prompted credentials for the test user
          - The page should load and then redirect you back to localhost:3200
          - The patient details (from $everything query) should display

