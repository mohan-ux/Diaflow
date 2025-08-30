#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 AI Workflow Diagram Generator - Setup');
console.log('========================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env file found');
} else {
  console.log('❌ .env file not found - creating one...');
  
  // Create .env file with template
  const envTemplate = `# AI Workflow Generator Configuration
# Get your API key from: https://makersuite.google.com/app/apikey

REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_GEMINI_MODEL=gemini-2.0-flash
REACT_APP_GEMINI_TEMPERATURE=0.3
REACT_APP_GEMINI_MAX_TOKENS=4096

# Optional: Debug mode
# REACT_APP_DEBUG=true
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created');
}

// Check package.json
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  console.log('✅ package.json found');
} else {
  console.log('❌ package.json not found - please run npm init first');
  process.exit(1);
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ Dependencies installed');
} else {
  console.log('❌ Dependencies not installed');
  console.log('Run: npm install');
  process.exit(1);
}

// Interactive setup
async function setup() {
  console.log('\n📋 Setup Questions:\n');

  // Check API key
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasApiKey = envContent.includes('your_gemini_api_key_here') === false;

  if (!hasApiKey) {
    console.log('⚠️  Please configure your Gemini API key:');
    console.log('1. Visit: https://makersuite.google.com/app/apikey');
    console.log('2. Create a new API key');
    console.log('3. Replace "your_gemini_api_key_here" in the .env file\n');
  } else {
    console.log('✅ API key configured');
  }

  // Ask about starting the app
  const answer = await question('Would you like to start the development server now? (y/n): ');
  
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    console.log('\n🚀 Starting development server...');
    console.log('The app will open at: http://localhost:3000');
    console.log('Press Ctrl+C to stop the server\n');
    
    // Start the development server
    const { spawn } = require('child_process');
    const child = spawn('npm', ['start'], { 
      stdio: 'inherit',
      shell: true 
    });

    child.on('error', (error) => {
      console.error('❌ Failed to start server:', error.message);
    });
  } else {
    console.log('\n📝 To start the app later, run:');
    console.log('npm start');
  }

  console.log('\n🎉 Setup complete!');
  console.log('\n📚 Next steps:');
  console.log('1. Configure your API key in .env file');
  console.log('2. Run: npm start');
  console.log('3. Open: http://localhost:3000');
  console.log('4. Try generating a workflow with AI!');
  
  rl.close();
}

function question(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

// Run setup
setup().catch(console.error);
