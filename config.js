'use strict';

const config = {};

config.host = process.env["JSONVIEWER__SERVER__HOST"] || "0.0.0.0";
config.port = process.env["JSONVIEWER__SERVER__PORT"] || 3000;
config.body_maxsize = parseInt(process.env["JSONVIEWER__SERVER__BODY_MAXSIZE"]) || 102400;

module.exports = config;
