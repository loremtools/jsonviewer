module.exports = {
  apps : [
    {
      "name": "jsonviewer",
      "script": "app.js",
      "instances": process.env["JSONVIEWER__INSTANCES"] || 1,
      "out_file": "/dev/null",
      "error_file": "/dev/null",
      "env": {
        "NODE_ENV": "development"
      },
      "env_production" : {
        "NODE_ENV": "production"
      }
    }
  ]
}
