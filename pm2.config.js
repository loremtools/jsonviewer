module.exports = {
  apps : [
    {
      "name": "jsonviewer",
      "script": "lib/app.js",
      "instances": process.env["JSONVIEWER__PM2__INSTANCES"] || 1,
      "env": {
        "NODE_ENV": "development",
        "JSONVIEWER__PM2__ENABLED": "true"
      },
      "env_production" : {
        "NODE_ENV": "production"
      }
    }
  ]
}
