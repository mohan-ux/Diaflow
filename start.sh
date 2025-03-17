#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js (v14 or higher) and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Warning: .env file not found. Creating a sample .env file..."
    cp .env.example .env
    echo "Please edit the .env file and add your API keys before running the application."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the application
echo "Starting Mind Map AI..."
npm start 