import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parent = process.env.TENVELL_AGENT_VERIFY_DIR || os.tmpdir();
await mkdir(parent, { recursive: true });
const directory = await mkdtemp(path.join(parent, 'tenvell-agent-consumer-'));
const read = file => readFile(path.join(root, file), 'utf8');
const { version } = JSON.parse(await read('package.json'));
const archive = path.join(root, 'public/releases', version, `tenvell-${version}.tgz`);
const run = (command, args) => execFileSync(command, args, { cwd: directory, stdio: 'inherit', env: { ...process.env, DO_NOT_TRACK: '1', SHADCN_TELEMETRY_DISABLED: '1' } });
await writeFile(path.join(directory, 'package.json'), JSON.stringify({
  name: 'tenvell-agent-docs-consumer', private: true, type: 'module',
  dependencies: { tenvell: 'file:' + archive, react: '19.2.0', 'react-dom': '19.2.0', recharts: '3.10.1' },
  devDependencies: { typescript: '5.9.3', '@types/react': '19.2.2', '@types/react-dom': '19.2.2' },
}, null, 2));
run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund']);
const examples = [];
for (const file of ['public/docs/install.md', 'public/docs/recipes.md']) {
  const markdown = await read(file);
  for (const match of markdown.matchAll(/```jsx\n([\s\S]*?)\n```/g)) {
    if (match[1].includes("'@/")) continue;
    const name = `example-${examples.length + 1}.jsx`;
    await writeFile(path.join(directory, name), match[1]);
    examples.push(name);
  }
}
if (examples.length < 4) throw new Error('Missing documented package examples');
await writeFile(path.join(directory, 'tsconfig.json'), JSON.stringify({
  compilerOptions: { noEmit: true, allowJs: true, checkJs: true, noImplicitAny: false, jsx: 'react-jsx',
    module: 'ESNext', moduleResolution: 'Bundler', target: 'ES2022', skipLibCheck: true },
  include: examples,
}));
run(path.join(directory, 'node_modules/.bin/tsc'), ['--project', 'tsconfig.json']);
const inventory = JSON.parse(await read('public/docs/components.json'));
await writeFile(path.join(directory, 'check-exports.mjs'), `import assert from 'node:assert/strict';\nimport * as core from 'tenvell';\nimport * as charts from 'tenvell/charts';\nassert.deepEqual(Object.keys(core).sort(), ${JSON.stringify([...inventory.modules.tenvell.exports].sort())});\nassert.deepEqual(Object.keys(charts).sort(), ${JSON.stringify([...inventory.modules['tenvell/charts'].exports].sort())});\nconsole.log('The documented exports match the installed package runtime.');\n`);
run('node', ['check-exports.mjs']);
console.log(`Verified ${examples.length} documented JSX examples and package exports in ${directory}`);
