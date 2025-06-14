import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import open from 'open';

export function serve() {
  const app = express();
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.join(__dirname, '../dist');

  app.use(express.static(distPath));

  app.listen(3000, () => {
    console.log('🚀 Preview at http://localhost:3000');
    open('http://localhost:3000');
  });
}
