var config = {};

config.host = process.env["JSONVIEWER__SERVER__HOST"] || "0.0.0.0";
config.port = process.env["JSONVIEWER__SERVER__PORT"] || 3000;

module.exports = config;
