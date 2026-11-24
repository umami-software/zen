import fs from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { glob } from 'glob';

// CSS files to concatenate for the minimal build (for apps that run Tailwind):
// theme tokens, the vendored shadcn utilities/variants, then component CSS.
// Component stylesheets are discovered automatically so new components can't be
// forgotten. theme.css must come first: it holds the only @import.
const componentCssFiles = (await glob('./src/components/*.css')).sort();
const cssFiles = ['./src/styles/theme.css', './src/styles/shadcn.css', ...componentCssFiles];

async function buildMinimalCSS() {
  const contents = await Promise.all(
    cssFiles.map(async file => {
      const content = await fs.readFile(file, 'utf-8');
      return `/* ${file} */\n${content}`;
    })
  );

  const output = contents.join('\n\n');
  await fs.writeFile('./styles.css', output, 'utf-8');
  console.log('CSS build complete: styles.css (minimal - for Tailwind users)');
}

async function buildFullCSS() {
  // Run Tailwind CLI to generate full CSS with all utilities
  execSync('npx @tailwindcss/cli -i ./src/styles/tailwind.css -o ./styles.full.css --minify', {
    stdio: 'inherit',
  });
  console.log('CSS build complete: styles.full.css (full - for non-Tailwind users)');
}

async function buildCSS() {
  await Promise.all([buildMinimalCSS(), buildFullCSS()]);
}

async function watchCSS() {
  const { watch } = await import('node:fs');

  let timer = null;
  const rebuild = () => {
    // Debounce rapid successive change events
    clearTimeout(timer);
    timer = setTimeout(() => {
      buildCSS().catch(err => console.error('CSS rebuild failed:', err));
    }, 100);
  };

  for (const dir of ['./src/components', './src/styles']) {
    watch(dir, { recursive: true }, (event, filename) => {
      if (filename?.endsWith('.css')) {
        console.log(`CSS change detected: ${filename}`);
        rebuild();
      }
    });
  }

  console.log('Watching for CSS changes...');
}

buildCSS()
  .then(() => {
    if (process.argv.includes('--watch')) {
      return watchCSS();
    }
  })
  .catch(err => {
    console.error('CSS build failed:', err);
    process.exit(1);
  });
