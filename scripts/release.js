/*
eslint-disable
global-require,
import/order,
import/no-dynamic-require,
no-use-before-define,
no-await-in-loop,
operator-linebreak,
consistent-return,
*/

const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const semver = require('semver');
const currentVersion = require('../package.json').version;
const { prompt } = require('enquirer');
const execa = require('execa');

const preId = args.preid || semver.prerelease(currentVersion)[0] || 'alpha';
const isDryRun = args.dry;
const { skipTests = true } = args;
const { skipBuild } = args;
const { skipTsd = true } = args;
const { skipPublish } = args;
const packages = fs
  .readdirSync(path.resolve(__dirname, '../packages'))
  .filter(p => !p.endsWith('.ts') && !p.startsWith('.'));

const skippedPackages = [];

const versionIncrements = [
  'patch',
  'minor',
  'major',
  'prepatch',
  'preminor',
  'premajor',
  'prerelease',
];

const inc = i => semver.inc(currentVersion, i, preId);
const bin = name => path.resolve(__dirname, `../node_modules/.bin/${ name }`);
const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts });
const dryRun = (bin, args, opts = {}) => console.log(chalk.blue(`[dryrun] ${ bin } ${ args.join(' ') }`), opts);
const runIfNotDry = isDryRun ? dryRun : run;
const getPkgRoot = pkg => path.resolve(__dirname, `../packages/${ pkg }`);
const step = msg => console.log(chalk.cyan(msg));

async function main() {
  let targetVersion = args._[0];

  if (!targetVersion) {
    // no explicit version, offer suggestions
    const { release } = await prompt({
      type    : 'select',
      name    : 'release',
      message : 'Select release type',
      choices : versionIncrements.map(i => `${ i } (${ inc(i) })`).concat(['custom']),
    });

    if (release === 'custom') {
      targetVersion = (await prompt({
        type    : 'input',
        name    : 'version',
        message : 'Input custom version',
        initial : currentVersion,
      })).version;
    } else {
      targetVersion = release.match(/\((.*)\)/)[1];
    }
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${ targetVersion }`);
  }

  const { yes } = await prompt({
    type    : 'confirm',
    name    : 'yes',
    message : `Releasing v${ targetVersion }. Confirm?`,
  });

  if (!yes) {
    return;
  }

  // run tests before release
  step('\nRunning tests...');
  if (!skipTests && !isDryRun) {
    await run(bin('jest'), ['--clearCache']);
    await run('yarn', ['test']);
  } else {
    console.log('(skipped)');
  }

  // update all package versions and inter-dependencies
  step('\nUpdating cross dependencies...');
  updateVersions(targetVersion);

  // build all packages with types
  step('\nBuilding all packages...');
  if (!skipBuild && !isDryRun) {
    await run('yarn', ['build', '--release']);
    if (!skipTsd) {
      // test generated dts files
      step('\nVerifying type declarations...');
      await run(bin('tsd'));
    }
  } else {
    console.log('(skipped)');
  }

  // generate changelog
  await run('yarn', ['changelog']);

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    step('\nCommitting changes...');
    await runIfNotDry('git', ['add', '-A']);
    await runIfNotDry('git', ['commit', '-m', `release: v${ targetVersion }`]);
  } else {
    console.log('No changes to commit.');
  }

  // publish packages
  step('\nPublishing packages...');
  if (!skipPublish && !isDryRun) {
    for (const pkg of packages) {
      await publishPackage(pkg, targetVersion, runIfNotDry);
    }
  } else {
    console.log('(skipped)');
  }

  // push to GitHub
  step('\nPushing to GitHub...');
  await runIfNotDry('git', ['tag', `v${ targetVersion }`]);
  await runIfNotDry('git', ['push', 'origin', `refs/tags/v${ targetVersion }`]);
  await runIfNotDry('git', ['push']);

  if (isDryRun) {
    console.log('\nDry run finished - run git diff to see package changes.');
  }

  if (skippedPackages.length) {
    console.log(
      chalk.yellow(
        `The following packages are skipped and NOT published:\n- ${ skippedPackages.join(
          '\n- ',
        ) }`,
      ),
    );
  }
  console.log();
}

function updateVersions(version) {
  // 1. update root package.json
  updatePackage(path.resolve(__dirname, '..'), version);
  // 2. update all packages
  packages.forEach(p => updatePackage(getPkgRoot(p), version));
}

function updatePackage(pkgRoot, version) {
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.version = version;
  updateDeps(pkg, 'dependencies', version);
  updateDeps(pkg, 'peerDependencies', version);
  fs.writeFileSync(pkgPath, `${ JSON.stringify(pkg, null, 2) }\n`);
}

function updateDeps(pkg, depType, version) {
  const deps = pkg[depType];
  if (!deps) return;
  Object.keys(deps).forEach(dep => {
    if (
      dep.startsWith('@meetnow') && packages.includes(dep.replace(/^@meetnow\//, ''))
    ) {
      console.log(
        chalk.yellow(`${ pkg.name } -> ${ depType } -> ${ dep }@${ version }`),
      );
      deps[dep] = version;
    }
  });
}

async function publishPackage(pkgName, version, runIfNotDry) {
  if (skippedPackages.includes(pkgName)) {
    return;
  }
  const pkgRoot = getPkgRoot(pkgName);
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  if (pkg.private) {
    return;
  }

  const releaseTags = semver.prerelease(version);
  const releaseTag = releaseTags && releaseTags[0];

  step(`Publishing ${ pkg }...`);
  try {
    await runIfNotDry(
      'yarn',
      [
        'publish',
        '--new-version',
        version,
        ...(releaseTag ? ['--tag', releaseTag] : []),
        '--access',
        'public',
      ],
      {
        cwd   : pkgRoot,
        stdio : 'pipe',
      },
    );
    console.log(chalk.green(`Successfully published ${ pkgName }@${ version }`));
  } catch (e) {
    if (e.stderr.match(/previously published/)) {
      console.log(chalk.red(`Skipping already published: ${ pkgName }`));
    } else {
      throw e;
    }
  }
}

main().catch(err => {
  console.error(err);
});
