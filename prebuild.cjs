const fs = require('fs').promises;
const { createClient } = require("@vercel/kv");


async function preBuild() {
  const kv = createClient({
    url: "https://superb-lion-48217.kv.vercel-storage.com",
    token:
      "AbxZASQgNTY3NWM2M2YtNzNhMy00YTlkLWFjYTQtMmU1Mzg1OGRmMWZjNTJjZGUzMTUwOGIyNDgyMTk5ODRkMzJkNDNhN2M4MTg=",
  });

  try {
    try {
      const locationsStream = await kv.get('locations');
      await fs.writeFile('stream.json', JSON.stringify(locationsStream));
    } catch (error) {
      // Handle errors
    }
  } catch (error) {
    console.error('Pre-build error:', error);
  }
}

preBuild();
