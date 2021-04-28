# Online JSONViewer

![Architecture](https://raw.github.com/loremtools/jsonviewer/master/docs/images/jsonviewer-workflow.png)

## Getting started

* Checkout source code from the github repository (https://github.com/loremtools/jsonviewer);
* Changes project home folder into current working directory;
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

## Running with PM2

Environment variables:

* `JSONVIEWER__SERVER__HOST`: The host name of the server (default: 0.0.0.0);
* `JSONVIEWER__SERVER__PORT`: The port of the server (default: 3000);
* `JSONVIEWER__PM2__INSTANCES`: Number of PM2 workers (default: 1);

Start app with pm2:

```shell
pm2 start pm2.config.js
```

## References

* [Nodejs - Express documentation](https://expressjs.com/en/4x/api.html)
* [Nodejs - socket.io documentation](https://socket.io/docs/v2)
* [JSON Editor github repository](https://github.com/josdejong/jsoneditor)
