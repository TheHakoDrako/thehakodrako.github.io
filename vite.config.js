import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  base: 'https://jerodev.work.gd/',
  server: {
    https: {
      key: fs.readFileSync('./.cert/private.key'),
      cert: fs.readFileSync('./.cert/certificate.pem'),
      ca: fs.readFileSync('./.cert/ca_bundle.pem')
    }
  }
});
