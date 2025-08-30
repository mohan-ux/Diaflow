# Screenshots Directory

This directory contains screenshots of the AI Workflow Diagram Generator application.

## Required Screenshots

Please add the following screenshots to showcase the application's features:

### 1. main-interface.png
- **Description**: Main application interface showing the three-panel layout
- **Content**: Left panel (shape library), center canvas area, right panel (AI assistant)
- **Size**: 1920x1080 or similar high resolution
- **Features to highlight**: 
  - Shape library with categories
  - Empty canvas with grid
  - AI assistant panel with tabs

### 2. ai-generation.png
- **Description**: AI workflow generation in action
- **Content**: Right panel showing AI chat with workflow generation
- **Features to highlight**:
  - User prompt input
  - AI response with generated workflow
  - Generated nodes and connections on canvas

### 3. code-generation.png
- **Description**: Code generation panel with multiple language outputs
- **Content**: Right panel "Code Generator" tab
- **Features to highlight**:
  - Language selection buttons (Python, JavaScript, JSON, YAML)
  - Generated code snippets
  - Syntax highlighting

### 4. workflow-analysis.png
- **Description**: Workflow analysis and optimization recommendations
- **Content**: Analysis results in the right panel
- **Features to highlight**:
  - Workflow type identification
  - Process count and connections
  - Optimization recommendations

### 5. shape-library.png
- **Description**: Detailed view of the shape library
- **Content**: Left panel with expanded shape categories
- **Features to highlight**:
  - Terminal shapes (start/end)
  - Process shapes (rectangles, hexagons)
  - Decision shapes (diamonds)
  - Data shapes (parallelograms, cylinders)
  - Connection types

### 6. mermaid-preview.png
- **Description**: Mermaid diagram preview
- **Content**: Mermaid syntax and rendered diagram
- **Features to highlight**:
  - Mermaid code syntax
  - Rendered flowchart
  - Synchronization with canvas

### 7. dark-mode.png
- **Description**: Application in dark mode
- **Content**: Complete interface with dark theme
- **Features to highlight**:
  - Dark color scheme
  - All panels visible
  - Good contrast and readability

## Screenshot Guidelines

### Technical Requirements
- **Format**: PNG or JPG
- **Resolution**: Minimum 1920x1080, preferably 2560x1440
- **Quality**: High quality, clear and crisp
- **File Size**: Optimize for web (under 1MB each)

### Content Guidelines
- **Clean Interface**: Remove any personal data or sensitive information
- **Good Examples**: Use realistic workflow examples
- **Consistent Styling**: Use the same theme (light or dark) across all screenshots
- **Professional Look**: Ensure the interface looks polished and professional

### Taking Screenshots
1. **Start the application**: `npm start`
2. **Set up the scene**: Create a good example workflow
3. **Use browser dev tools**: Set viewport to desktop size
4. **Take screenshots**: Use browser screenshot tools or system screenshot
5. **Crop and optimize**: Remove browser chrome if needed

## Example Workflows for Screenshots

### Simple Workflow
```
Start → Validate Input → Process Data → Generate Report → End
```

### Complex Workflow
```
Start → Validate Order → Check Inventory → [In Stock?] → Yes: Process Payment → Send Confirmation
                                                      → No: Notify Customer → End
```

### ETL Workflow
```
Data Source → Extract → Transform → Load → Database → Generate Report → End
```

## File Naming Convention
- Use kebab-case: `main-interface.png`
- Be descriptive: `workflow-analysis.png`
- Keep it simple: `dark-mode.png`

## Adding Screenshots
1. Take screenshots following the guidelines above
2. Save them in this directory with the exact filenames listed
3. Update the main README.md if you add new screenshots
4. Commit and push to the repository

## Notes
- Screenshots should be updated when major UI changes are made
- Consider taking screenshots for both light and dark themes
- Include screenshots of any new features added to the application
