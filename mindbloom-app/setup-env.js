#!/usr/bin/env node

/**
 * Helper script to extract Google Cloud project ID from service account JSON
 * and update .env files
 */

const fs = require('fs');
const path = require('path');

const jsonFilePath = process.argv[2];

if (!jsonFilePath) {
  console.error('Usage: node setup-env.js <path-to-service-account-key.json>');
  process.exit(1);
}

if (!fs.existsSync(jsonFilePath)) {
  console.error(`Error: File not found: ${jsonFilePath}`);
  process.exit(1);
}

try {
  // Read and parse the JSON file
  const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
  const serviceAccount = JSON.parse(jsonContent);

  const projectId = serviceAccount.project_id;

  if (!projectId) {
    console.error('Error: Could not find project_id in the JSON file');
    process.exit(1);
  }

  console.log(`✓ Found project ID: ${projectId}`);

  // Copy JSON file to server-proxy directory
  const serverProxyDir = path.join(__dirname, 'server-proxy');
  const targetJsonPath = path.join(serverProxyDir, 'service-account-key.json');

  // Create server-proxy directory if it doesn't exist
  if (!fs.existsSync(serverProxyDir)) {
    fs.mkdirSync(serverProxyDir, { recursive: true });
  }

  // Copy the JSON file
  fs.copyFileSync(jsonFilePath, targetJsonPath);
  console.log(`✓ Copied service account key to: ${targetJsonPath}`);

  // Update server-proxy/.env file
  const serverProxyEnvPath = path.join(serverProxyDir, '.env');
  if (fs.existsSync(serverProxyEnvPath)) {
    let envContent = fs.readFileSync(serverProxyEnvPath, 'utf8');
    
    // Update project ID
    envContent = envContent.replace(
      /GOOGLE_CLOUD_PROJECT_ID=.*/,
      `GOOGLE_CLOUD_PROJECT_ID=${projectId}`
    );

    // Update service account key path
    envContent = envContent.replace(
      /GOOGLE_APPLICATION_CREDENTIALS=.*/,
      `GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json`
    );

    fs.writeFileSync(serverProxyEnvPath, envContent);
    console.log(`✓ Updated ${serverProxyEnvPath}`);
  }

  console.log('\n✓ Environment setup complete!');
  console.log('\nNext steps:');
  console.log('1. Update frontend .env file with your Supabase credentials');
  console.log('2. Run: cd server-proxy && npm install');
  console.log('3. Run: cd server-proxy && npm start');
  console.log('4. Update REACT_APP_GOOGLE_CLOUD_PROXY_URL in frontend .env if using different port');

} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

