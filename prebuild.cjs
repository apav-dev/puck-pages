const fs = require('fs').promises;
// const { configBuilder } = require('./path/to/configBuilder');

async function preBuild() {
  try {
    const config = await fetch("https://rj5zl0ygxkk90ul8.public.blob.vercel-storage.com/streams-sOHBGXIVYy4DjZglr2hAEQcpKxGnCt.json");
    const stream = await config.json();
    await fs.writeFile('stream.json', JSON.stringify(stream[0]));
  } catch (error) {
    console.error('Pre-build error:', error);
  }
}

preBuild();
