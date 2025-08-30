# Quick Start Guide

Get the AI Workflow Diagram Generator running in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Setup Script
```bash
npm run setup
```

This will:
- Create a `.env` file with the correct configuration
- Check if all dependencies are installed
- Guide you through API key setup
- Optionally start the development server

### 3. Configure API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Edit the `.env` file and replace `your_gemini_api_key_here` with your actual key

### 4. Start the App
```bash
npm start
```

Open your browser to `http://localhost:3000`

## 🎯 First Workflow

1. **Click "Templates"** in the left panel
2. **Click "Generate Workflow"**
3. **Enter a description** like:
   ```
   Create a simple order processing workflow with validation, payment, and confirmation steps
   ```
4. **Click "Generate"** and watch the AI create your workflow!

## 🛠️ Manual Workflow Creation

1. **Drag shapes** from the left panel to the canvas
2. **Connect nodes** by clicking and dragging between them
3. **Edit labels** by double-clicking nodes
4. **Generate code** using the right panel

## 🆘 Need Help?

- Check the [full README](README.md) for detailed documentation
- Look at the browser console for error messages
- Ensure your API key is correctly configured

## 🎉 You're Ready!

The app is now fully functional with:
- ✅ AI-powered workflow generation
- ✅ Interactive drag-and-drop interface
- ✅ Multi-language code generation
- ✅ Real-time Mermaid preview
- ✅ Workflow analysis and optimization

Happy workflow building! 🎨
