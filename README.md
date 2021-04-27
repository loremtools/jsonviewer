# Online JSONViewer

## Getting started

* Checkout source code from the github repository (https://github.com/loremtools/jsonviewer);
* Changes current working directory to project folder;
* Installs the dependencies:
  ```shell
  npm install
  ```
* Starts server using `node`:
  ```shell
  node app.js
  ```
* Opens the browser, and type the default webpage (http://localhost:3000) into the Location box;
* Connects to the server with some channel ID, for example "mychannel";
* Posts the JSON object through REST API:
  ```shell
  curl --request PUT \
    --url http://localhost:3000/api/update/mychannel \
    --header 'Content-Type: application/json' \
    --data '{
      "name": "jsonviewer",
      "text": "Hello world"
    }'
  ```
* Enjoy!

