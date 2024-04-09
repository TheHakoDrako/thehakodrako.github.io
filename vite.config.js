import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  base: 'https://jerodev.work.gd/',
  server: {
    https: {
      key: fs.readFileSync('./.cert/jerodev.work.gd.key'),
      cert: fs.readFileSync('./.cert/jerodev.work.gd.cer'),
      ca: fs.readFileSync('./.cert/ca.cer')
    }
  }
});
