function assertObject(args) {
  return args || {};
}

function localog(msg, ...args) {
  console.log.call(console, msg, ...args);
}

function isPm2Enabled() {
  let enabled = process.env["JSONVIEWER__PM2__ENABLED"] === "true";
  localog("is the PM2 enabled? ", enabled);
  return enabled;
}

function getStaticDir() {
  let enabled = process.env["JSONVIEWER__REACT__ENABLED"] === "true";
  return enabled ? 'public/ui' : 'public';
}

module.exports = {
  assertObject,
  localog,
  isPm2Enabled,
  getStaticDir
}
