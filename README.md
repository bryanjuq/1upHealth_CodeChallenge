# 1upHealth_CodeChallenge
Code challenge using React and Node.

**Intro:**

This is a very basic Node application that makes use of the 1upHealth API to display 
a patient's information via the browser. The application makes use of React to render the 
data elements and Node to stablish a session with 1upHealth API to ultimately serve the requested patient data.



**Pre-Configuration:**

This app assumes the user has already created a 1upHealth user-account create to get an access token using
the Client ID and Client Secret (See https://1up.health/dev/doc/user-management). 

Note: Ensure to register a new application with the port to be used for the Node server (i.e 1uphealth_react_server), which is 3200 by default.

  Once you obtain a client id and a client secret, add these to the following config files:
  
     1uphealth_react_server/config/config.development.json
     1uphealth_react_client/src/config/config.development.json


**To execute:**

This repositiry contains two folders, one for the React client-side application and one for the Node server application.
   
   1- Run the 1uphealth_react_server:
   
    $ cd 1uphealth_react_server
    $ node 1uphealth_react_server   
    
    
   2- Run 1uphealth_react_client:
   
    $ cd 1uphealth_react_client
    $ npm install
    $ npm start
 
 
   3- Using the browser, navigate to http://localhost:3500 (React app)
   
      - Verify a button displays "Connect to Health System"
      - Click the button, the application should redirect you to the URL:
          - "https://api.1up.health/connect/system/clinical/4707?client_id={client_id}&access_token={access_token}"
          
      - Submit the prompted credentials for the test user
          - The page should load and attempt to redirect back to localhost:3500 but you must navigate yourself back to localhost:3200
          - The apps use two separate ports (for now).
        
      - Navigate back to the 1uphealth_react_client via localhost:3200
          - You should see the patient details associated with the credentials submitted during the test above.


       
   

