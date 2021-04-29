# Online JSONViewer

![Architecture](https://raw.github.com/loremtools/jsonviewer/master/docs/images/jsonviewer-workflow.png)

## Getting started

* Checkout source code from the github repository (https://github.com/loremtools/jsonviewer):
  ```shell
  git clone https://github.com/loremtools/jsonviewer.git
  ```
* Changes project home folder into current working directory:
  ```shell
  cd jsonviewer
  ```
* Installs the dependencies:
  ```shell
  npm install
  ```
* Starts server using `node`:
  ```shell
  node lib/app.js
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

## Environment variables

* `JSONVIEWER__SERVER__HOST`: The host name of the server (default: 0.0.0.0);
* `JSONVIEWER__SERVER__PORT`: The port of the server (default: 3000);
* `JSONVIEWER__SERVER__BODY_MAXSIZE`: The limit size of HTTP request body (default: 100KB);
* `JSONVIEWER__PM2__INSTANCES`: Number of PM2 workers (default: 1);

## Running with PM2

Start app with pm2:

```shell
pm2 start pm2.config.js
```

Show the console log messages from the pm2:

```shell
pm2 log jsonviewer
```

Stop the `jsonviewer` service:

```shell
pm2 stop jsonviewer
```

Delete the `jsonviewer` service:

```shell
pm2 delete jsonviewer
```

## References

* [Nodejs - Express documentation](https://expressjs.com/en/4x/api.html)
* [Nodejs - socket.io documentation](https://socket.io/docs/v2)
* [JSON Editor github repository](https://github.com/josdejong/jsoneditor)
