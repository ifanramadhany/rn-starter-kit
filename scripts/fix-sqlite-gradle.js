const fs = require('fs');
const path = require('path');

const targets = [
  path.join(
    process.cwd(),
    'node_modules',
    'react-native-sqlite-storage',
    'platforms',
    'android',
    'build.gradle',
  ),
  path.join(
    process.cwd(),
    'node_modules',
    'react-native-sqlite-storage',
    'platforms',
    'android-native',
    'build.gradle',
  ),
];

const legacyBuildscriptPattern =
  /buildscript\s*\{\s*repositories\s*\{[\s\S]*?\}\s*dependencies\s*\{[\s\S]*?\}\s*\}\s*/m;

for (const target of targets) {
  if (!fs.existsSync(target)) {
    continue;
  }

  const current = fs.readFileSync(target, 'utf8');
  const next = current.replace(legacyBuildscriptPattern, '');

  if (next === current) {
    continue;
  }

  fs.writeFileSync(target, next);
  console.log(`Patched ${path.relative(process.cwd(), target)}`);
}
