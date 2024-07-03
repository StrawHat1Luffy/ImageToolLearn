const babel = require('@babel/core')
const t = require('@babel/types')
const { promisify } = require('node:util')
const glob = promisify(require('glob'))
const fs = require('node:fs')
const path = require('node:path')

const { mkdir, stat, writeFile } = fs.promises

const PACKAGE_JSON_IMPORT = /^\..*\/package.json$/
const SOURCE = 'packages/{*,@ImageToolLearn/*}/src/**/*.{js,ts}?(x)'
const IGNORE = /\.test\.[jt]s$|__mocks__|svelte|angular|companion\//
const META_FILES = [
  'babel.config.js',
  'package.json',
  'package-lock.json',
  'yarn.lock',
  'bin/build-lib.js',
]

function lastModified (file, createParentDir = false) {
  return stat(file).then((s) => s.mtime, async (err) => {
    if (err.code === 'ENOENT') {
      if (createParentDir) {
        await mkdir(path.dirname(file), { recursive: true })
      }
      return 0
    }
    throw err
  })
}

const versionCache = new Map()

async function preparePack (file) {
  const packageFolder = file.slice(0, file.indexOf('/src/'))
  if (versionCache.has(packageFolder)) return

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const { version } = require(path.join(__dirname, '..', packageFolder, 'package.json'))
  if (process.env.FRESH) {
    // in case it hasn't been done before.
    await mkdir(path.join(packageFolder, 'lib'), { recursive: true })
  }
  versionCache.set(packageFolder, version)
}

const nonJSImport = /^\.\.?\/.+\.([jt]sx|ts)$/
// eslint-disable-next-line no-shadow
function rewriteNonJSImportsToJS (path) {
  const match = nonJSImport.exec(path.node.source.value)
  if (match) {
    // eslint-disable-next-line no-param-reassign
    path.node.source.value = `${match[0].slice(0, -match[1].length)}js`
  }
}

async function buildLib () {
  const metaMtimes = await Promise.all(META_FILES.map((filename) => lastModified(path.join(__dirname, '..', filename))))
  const metaMtime = Math.max(...metaMtimes)

  const files = await glob(SOURCE)
  /* eslint-disable no-continue */
  for (const file of files) {
    if (IGNORE.test(file)) {
      continue
    }
    await preparePack(file)
    const libFile = file.replace('/src/', '/lib/').replace(/\.[jt]sx?$/, '.js')

    // on a fresh build, rebuild everything.
    if (!process.env.FRESH) {
      const [srcMtime, libMtime] = await Promise.all([
        lastModified(file),
        lastModified(libFile, true),
      ])
      if (srcMtime < libMtime && metaMtime < libMtime) {
        continue
      }
    }

    const plugins = [{
      visitor: {
        // eslint-disable-next-line no-shadow
        ImportDeclaration (path) {
          rewriteNonJSImportsToJS(path)
          if (PACKAGE_JSON_IMPORT.test(path.node.source.value)
              && path.node.specifiers.length === 1
              && path.node.specifiers[0].type === 'ImportDefaultSpecifier') {
            const version = versionCache.get(file.slice(0, file.indexOf('/src/')))
            if (version != null) {
              const [{ local }] = path.node.specifiers
              path.replaceWith(
                t.variableDeclaration('const', [t.variableDeclarator(local,
                  t.objectExpression([
                    t.objectProperty(t.stringLiteral('version'), t.stringLiteral(version)),
                  ]))]),
              )
            }
          }
        },

        ExportAllDeclaration: rewriteNonJSImportsToJS,
      },
    }]
    const isTSX = file.endsWith('.tsx')
    if (isTSX || file.endsWith('.ts')) { plugins.push(['@babel/plugin-transform-typescript', { disallowAmbiguousJSXLike: true, isTSX, jsxPragma: 'h' }]) }

    const { code, map } = await babel.transformFileAsync(file, { sourceMaps: true, plugins })
    const [{ default: chalk }] = await Promise.all([
      import('chalk'),
      writeFile(libFile, code),
      writeFile(`${libFile}.map`, JSON.stringify(map)),
    ])
    console.log(chalk.green('Compiled lib:'), chalk.magenta(libFile))
  }
  /* eslint-enable no-continue */
}

console.log('Using Babel version:', require('@babel/core/package.json').version)

buildLib().catch((err) => {
  console.error(err)
  process.exit(1)
})
