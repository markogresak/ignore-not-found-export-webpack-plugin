const ModuleDependencyWarning = require('webpack/lib/ModuleDependencyWarning');

const IgnoreNotFoundExportPlugin = require('.');

const [tsWarning, jsWarning, tsxWarning, jsxWarning] = [
  new ModuleDependencyWarning(
    { resource: '/demo/project/lib/test.ts' },
    new Error(
      "export 'default' (reexported as 'Test') was not found in './test'",
    ),
  ),
  new ModuleDependencyWarning(
    { resource: '/demo/project/lib/test2.js' },
    new Error(
      "export 'default' (reexported as 'Test') was not found in './test2'",
    ),
  ),
  new ModuleDependencyWarning(
    { resource: '/demo/project/components/Component.tsx' },
    new Error("export 'Component' was not found in 'components/Component'"),
  ),
  new ModuleDependencyWarning(
    { resource: '/demo/project/components/Component2.jsx' },
    new Error("export 'Component' was not found in 'components/Component2'"),
  ),
];

test('it throws if provided argument is not a RegExp', () => {
  expect(() => {
    new IgnoreNotFoundExportPlugin({ include: 123 });
  }).toThrow(TypeError);

  expect(() => {
    new IgnoreNotFoundExportPlugin({ include: [123] });
  }).toThrow(TypeError);

  expect(() => {
    new IgnoreNotFoundExportPlugin();
  }).not.toThrow();

  expect(() => {
    new IgnoreNotFoundExportPlugin({ include: [] });
  }).not.toThrow();

  expect(() => {
    new IgnoreNotFoundExportPlugin({ include: [/\.tsx?$/] });
  }).not.toThrow();
});

test('it filters out all compiler warnings by default', () => {
  const expectedWarnings = [];
  const warnings = [tsWarning, jsWarning, tsxWarning, jsxWarning];

  const stats = mockStats(warnings);
  const compiler = mockCompiler(stats);

  const plugin = new IgnoreNotFoundExportPlugin();
  plugin.apply(compiler);

  expect(stats.compilation.warnings).toEqual(expectedWarnings);
});

test('it filters out all compiler warnings where path matches the given include regular expression', () => {
  const expectedWarnings = [jsWarning, jsxWarning, tsxWarning];
  const warnings = [...expectedWarnings, tsWarning];

  const stats = mockStats(warnings);
  const compiler = mockCompiler(stats);

  const plugin = new IgnoreNotFoundExportPlugin({
    include: /\.ts$/,
  });
  plugin.apply(compiler);

  expect(stats.compilation.warnings).toEqual(expectedWarnings);
});

test('it filters out all compiler warnings where path matches any of the given include regular expressions', () => {
  const expectedWarnings = [jsxWarning, tsxWarning];
  const warnings = [...expectedWarnings, jsWarning, tsWarning];

  const stats = mockStats(warnings);
  const compiler = mockCompiler(stats);

  const plugin = new IgnoreNotFoundExportPlugin({
    include: [/\.js$/, /\.ts$/],
  });
  plugin.apply(compiler);

  expect(stats.compilation.warnings).toEqual(expectedWarnings);
});

function mockStats(warnings) {
  return {
    compilation: {
      warnings,
    },
  };
}

function mockCompiler(stats) {
  return {
    hooks: {
      done: {
        tap: (_name, callback) => {
          callback(stats);
        },
      },
    },
  };
}
