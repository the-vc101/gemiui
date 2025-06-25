#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting GemiUI development server...\n');

// First, compile Electron main process
console.log('📦 Compiling Electron main process...');
const tsc = spawn('npx', ['tsc', '-p', 'tsconfig.electron.json'], {
  stdio: 'inherit',
  shell: true
});

tsc.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ TypeScript compilation failed');
    process.exit(1);
  }
  
  console.log('✅ Electron main process compiled successfully');
  console.log('🌐 Starting development servers...\n');
  
  // Start concurrently
  const dev = spawn('npx', ['concurrently', '"npm run dev:vite"', '"npm run dev:electron"'], {
    stdio: 'inherit',
    shell: true
  });
  
  dev.on('close', (code) => {
    process.exit(code);
  });
});