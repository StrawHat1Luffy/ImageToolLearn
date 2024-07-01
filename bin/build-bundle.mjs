#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import chalk from 'chalk'

import esbuild from 'esbuild'
import babel from 'esbuild-plugin-babel'

const ImageToolLearn_ROOT = new URL('../', import.meta.url)
const PACKAGES_ROOT = new URL('./packages/', ImageToolLearn_ROOT)

function buildBundle (srcFile, bundleFile, { minify = true, standalone = '', plugins, target, format } = {}) {
  return esbuild.build({
    bundle: true,
    sourcemap: true,
    entryPoints: [srcFile],
    outfile: bundleFile,
    platform: 'browser',
    minify,
    keepNames: true,
    plugins,
    target,
    format,
  }).then(() => {
    if (minify) {
      console.info(chalk.green(`✓ Built Minified Bundle [${standalone}]:`), chalk.magenta(bundleFile))
    } else {
      console.info(chalk.green(`✓ Built Bundle [${standalone}]:`), chalk.magenta(bundleFile))
    }
  })
}

await fs.mkdir(new URL('./ImageToolLearn/dist', PACKAGES_ROOT), { recursive: true })
await fs.mkdir(new URL('./@ImageToolLearn/locales/dist', PACKAGES_ROOT), { recursive: true })

const methods = [
  buildBundle(
    './packages/ImageToolLearn/index.mjs',
    './packages/ImageToolLearn/dist/ImageToolLearn.min.mjs',
    { standalone: 'ImageToolLearn (ESM)', format: 'esm' },
  ),
  buildBundle(
    './packages/ImageToolLearn/bundle.mjs',
    './packages/ImageToolLearn/dist/ImageToolLearn.min.js',
    { standalone: 'ImageToolLearn', format: 'iife' },
  ),
  buildBundle(
    './packages/ImageToolLearn/bundle-legacy.mjs',
    './packages/ImageToolLearn/dist/ImageToolLearn.legacy.min.js',
    {
      standalone: 'ImageToolLearn (with polyfills)',
      target: 'es5',
      plugins:[babel({
        config:{
          compact: true,
          highlightCode: true,
          inputSourceMap: true,

          browserslistEnv: 'legacy',
          presets: [['@babel/preset-env',  {
            loose: false,
            targets: { ie:11 },
            useBuiltIns: 'entry',
            corejs: { version: '3.24', proposals: true },
          }]],
        },
      })],
    },
  ),
]

// Build mini versions of all the locales
const localesModules = await fs.opendir(new URL('./@ImageToolLearn/locales/src/', PACKAGES_ROOT))
for await (const dirent of localesModules) {
  if (!dirent.isDirectory() && dirent.name.endsWith('.js')) {
    const localeName = path.basename(dirent.name, '.js')
    methods.push(
      buildBundle(
        `./packages/@ImageToolLearn/locales/src/${localeName}.js`,
        `./packages/@ImageToolLearn/locales/dist/${localeName}.min.js`,
        { minify: true },
      ),
    )
  }
}

// Add BUNDLE-README.MD
methods.push(
  fs.copyFile(
    new URL('./BUNDLE-README.md', ImageToolLearn_ROOT),
    new URL('./ImageToolLearn/dist/README.md', PACKAGES_ROOT),
  ),
)

await Promise.all(methods).then(() => {
  console.info(chalk.yellow('✓ JS bundles 🎉'))
}, (err) => {
  console.error(chalk.red('✗ Error:'), chalk.red(err.message))
})
