// Metro's web output is a classic (non-module) <script>, where `import.meta` is a hard
// SyntaxError at parse time. Some deps (e.g. dialkit) use `import.meta.env` for dev-mode
// detection that's already guarded by a `process.env.NODE_ENV` check Metro inlines, so the
// value is never actually read — but the bare syntax still has to go, or the whole bundle
// fails to parse and the page renders blank.
function stripImportMeta() {
  return {
    visitor: {
      MetaProperty(path) {
        if (path.node.meta.name === 'import' && path.node.property.name === 'meta') {
          path.replaceWithSourceString('({ url: undefined, env: {} })');
        }
      },
    },
  };
}

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-worklets/plugin',
      stripImportMeta,
    ],
  };
};
