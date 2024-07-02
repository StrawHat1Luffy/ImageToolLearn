const sass = require('sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const postcssLogical = require('postcss-logical');
const postcssDirPseudoClass = require('postcss-dir-pseudo-class');
const cssnano = require('cssnano');
const { promisify } = require('node:util');
const fs = require('node:fs');
const path = require('node:path');
const resolve = require('resolve');
const glob = promisify(require('glob'));

const renderScss = promisify(sass.render);
const { mkdir, writeFile } = fs.promises;

const cwd = process.cwd();
let chalk;

function handleErr(err) {
  console.error(chalk.red('✗ Error:'), chalk.red(err.message));
}

async function compileCSS() {
  ({ default: chalk } = await import('chalk'));
  const files = await glob('packages/{,@ImageToolLearn/}*/src/style.scss');

  // PostCSS plugins initialization
  const plugins = [
    autoprefixer,
    postcssLogical(),
    postcssDirPseudoClass(),
  ];

  for (const file of files) {
    const importedFiles = new Set();
    const scssResult = await renderScss({
      file,
      importer: createImporter(importedFiles),
    });

    const postcssResult = await processCSS(scssResult.css, file, plugins);
    const outputDir = path.join(path.dirname(file), '../dist');
    const outfile = determineOutfile(outputDir, 'style.css', 'ImageToolLearn.css');
    await saveAndLogCSS(outfile, postcssResult.css);

    const minifiedResult = await minifyCSS(outfile, postcssResult.css);
    await saveAndLogCSS(outfile.replace(/\.css$/, '.min.css'), minifiedResult.css);
  }
}

// Modularize the importer function
function createImporter(importedFiles) {
  return (url, from, done) => {
    resolve(url, {
      basedir: path.dirname(from),
      filename: from,
      extensions: ['.scss'],
    }, (err, resolved) => {
      if (err) {
        done(err);
        return;
      }

      const realpath = fs.realpathSync(resolved);
      if (importedFiles.has(realpath)) {
        done({ contents: '' });
        return;
      }
      importedFiles.add(realpath);
      done({ file: realpath });
    });
  };
}

// Process CSS with PostCSS
async function processCSS(css, file, plugins) {
  const result = await postcss(plugins).process(css, { from: file });
  result.warnings().forEach(warn => console.warn(warn.toString()));
  return result;
}

// Minify CSS
async function minifyCSS(outfile, css) {
  const result = await postcss([cssnano({ safe: true })]).process(css, { from: outfile });
  result.warnings().forEach(warn => console.warn(warn.toString()));
  return result;
}

// Save and Log CSS
async function saveAndLogCSS(outfile, css) {
  await mkdir(path.dirname(outfile), { recursive: true });
  await writeFile(outfile, css);
  console.info(chalk.green('✓ CSS Processed:'), chalk.magenta(path.relative(cwd, outfile)));
}

// Determine the output file name
function determineOutfile(outputDir, defaultName, packageName) {
  return outputDir.includes(path.normalize('packages/ImageToolLearn/')) ?
    path.join(outputDir, packageName) :
    path.join(outputDir, defaultName);
}

compileCSS().then(() => {
  console.info(chalk.yellow('CSS Bundles OK'));
}, handleErr);
