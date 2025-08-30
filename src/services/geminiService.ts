import { Node, Edge } from "reactflow";
import { CustomNode, CustomEdge } from "../types/flowTypes";
import { getApiConfig, isApiConfigured } from "../config/apiConfig";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface DiagramData {
  nodes: Node[];
  edges: Edge[];
  mermaidCode?: string;
  generatedCode?: {
    python?: string;
    javascript?: string;
    json?: string;
    yaml?: string;
  };
  analysis?: WorkflowAnalysis;
}

interface WorkflowAnalysis {
  workflowType: string;
  processes: Array<{
    id: string;
    name: string;
    type: 'process' | 'decision' | 'terminal' | 'data' | 'subprocess';
    description: string;
    parameters?: Record<string, any>;
  }>;
  connections: Array<{
    from: string;
    to: string;
    condition?: string;
    type: 'sequential' | 'conditional' | 'parallel';
  }>;
  recommendations: string[];
}

// Helper function to convert ReactFlow nodes to CustomNode format
const convertToDiaFlowNodes = (nodes: Node[]): CustomNode[] => {
  return nodes.map((node) => ({
    ...node,
    style: {
      border: "1px solid #ddd",
      padding: 10,
      borderRadius: 5,
      width:
        typeof node.style?.width === "string"
          ? parseInt(node.style.width as string)
          : (node.style?.width as number) || undefined,
      height:
        typeof node.style?.height === "string"
          ? parseInt(node.style.height as string)
          : (node.style?.height as number) || undefined,
      ...(node.style || {}),
    },
    type: node.type || "default",
  })) as CustomNode[];
};

// Helper function to convert ReactFlow edges to CustomEdge format
const convertToDiaFlowEdges = (edges: Edge[]): CustomEdge[] => {
  return edges.map((edge) => {
    // Convert ReactNode label to string if needed
    let edgeLabel: string | undefined;
    if (edge.label !== undefined && edge.label !== null) {
      edgeLabel = String(edge.label);
    }

    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      label: edgeLabel,
      animated: edge.animated,
      style: {
        strokeColor:
          typeof edge.style?.stroke === "string"
            ? edge.style.stroke
            : undefined,
        strokeWidth:
          typeof edge.style?.strokeWidth === "string"
            ? parseInt(edge.style.strokeWidth as string)
            : (edge.style?.strokeWidth as number) || undefined,
        dashed: edge.style?.strokeDasharray ? true : false,
      },
      data: edge.data,
      selected: edge.selected,
      markerEnd: edge.markerEnd,
      markerStart: edge.markerStart,
      zIndex: edge.zIndex,
      hidden: edge.hidden,
    };
  }) as CustomEdge[];
};

// Enhanced prompt engineering for workflow generation
const createWorkflowPrompt = (prompt: string, context?: string) => {
  return `
You are an expert workflow diagram designer and software architect. Analyze the following workflow description and create a comprehensive diagram with executable code.

WORKFLOW DESCRIPTION: "${prompt}"
${context ? `CONTEXT: ${context}` : ''}

TASK: Generate a complete workflow implementation including:

1. VISUAL DIAGRAM: Create a ReactFlow-compatible JSON with nodes and edges
2. MERMAID CODE: Generate Mermaid flowchart syntax
3. EXECUTABLE CODE: Generate implementation code in multiple languages
4. ANALYSIS: Provide workflow analysis and recommendations

REQUIREMENTS:

NODES:
- Use appropriate shapes for different node types:
  * Process steps: rectangles with rounded corners
  * Decision points: diamonds
  * Start/End points: stadium shapes
  * Data inputs/outputs: parallelograms
  * Databases: cylinders
  * Subprocesses: rectangles with double borders

- Each node should have:
  * Unique ID (alphanumeric)
  * Descriptive label
  * Appropriate type classification
  * Position coordinates (x, y)
  * Styling properties

EDGES:
- Use different line styles:
  * Solid lines for sequential flow
  * Dotted lines for optional/conditional flow
  * Thick lines for critical paths
  * Arrows with labels for conditional branches

- Each edge should have:
  * Source and target node IDs
  * Optional label for conditions
  * Appropriate styling

CODE GENERATION:
- Python: Generate executable Python script with proper error handling
- JavaScript: Generate Node.js implementation
- JSON: Configuration file for the workflow
- YAML: Alternative configuration format

ANALYSIS:
- Identify workflow type (ETL, approval, automation, etc.)
- List all processes and their relationships
- Provide optimization recommendations
- Suggest error handling and monitoring points

RESPONSE FORMAT:
Return a JSON object with the following structure:
{
  "nodes": [array of ReactFlow nodes],
  "edges": [array of ReactFlow edges],
  "mermaidCode": "flowchart TD\n...",
  "generatedCode": {
    "python": "def main():\n...",
    "javascript": "async function main() {\n...",
    "json": "{...}",
    "yaml": "..."
  },
  "analysis": {
    "workflowType": "string",
    "processes": [...],
    "connections": [...],
    "recommendations": [...]
  }
}

IMPORTANT: Return ONLY valid JSON with no additional text, explanations, or markdown formatting.
`;
};

// Function to generate a diagram from a user prompt
export async function generateDiagramFromPrompt(
  prompt: string,
  context?: string
): Promise<{ 
  nodes: CustomNode[]; 
  edges: CustomEdge[]; 
  mermaidCode?: string;
  generatedCode?: Record<string, string>;
  analysis?: WorkflowAnalysis;
} | null> {
  try {
    // Check if API is configured
    if (!isApiConfigured()) {
      throw new Error(
        "Gemini API key is not configured. Please set REACT_APP_GEMINI_API_KEY in your environment variables."
      );
    }

    const config = getApiConfig();
    const fullPrompt = createWorkflowPrompt(prompt, context);

    const response = await fetch(`${config.API_URL}?key=${config.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: config.GEMINI_TEMPERATURE,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: config.GEMINI_MAX_TOKENS,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const data: GeminiResponse = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response generated from the API.");
    }

    const textResponse = data.candidates[0].content.parts[0].text;

    // Extract JSON from the response (in case the model includes explanatory text)
    const jsonMatch =
      textResponse.match(/```json([\s\S]*?)```/) ||
      textResponse.match(/{[\s\S]*}/) ||
      null;

    const jsonString = jsonMatch
      ? jsonMatch[1]
        ? jsonMatch[1].trim()
        : jsonMatch[0]
      : textResponse.trim();

    // Parse the JSON
    const diagramData: DiagramData = JSON.parse(jsonString);

    // Validate the response
    if (
      !diagramData.nodes ||
      !diagramData.edges ||
      !Array.isArray(diagramData.nodes) ||
      !Array.isArray(diagramData.edges)
    ) {
      throw new Error("Invalid diagram data format returned from the API.");
    }

    // Convert ReactFlow nodes/edges to DiaFlow's CustomNode/CustomEdge format
    const customNodes = convertToDiaFlowNodes(diagramData.nodes);
    const customEdges = convertToDiaFlowEdges(diagramData.edges);

    return { 
      nodes: customNodes, 
      edges: customEdges,
      mermaidCode: diagramData.mermaidCode,
      generatedCode: diagramData.generatedCode,
      analysis: diagramData.analysis as WorkflowAnalysis
    };
  } catch (error) {
    console.error("Error generating diagram:", error);
    throw error;
  }
}

// Function to generate code for existing workflow
export async function generateCodeForWorkflow(
  nodes: CustomNode[],
  edges: CustomEdge[],
  language: 'python' | 'javascript' | 'json' | 'yaml' = 'python'
): Promise<string> {
  try {
    if (!isApiConfigured()) {
      throw new Error("API key is missing");
    }

    const config = getApiConfig();
    const workflowDescription = `Generate ${language} code for the following workflow:
    
Nodes: ${JSON.stringify(nodes.map(n => ({ id: n.id, label: n.data?.label, type: n.type })))}
Edges: ${JSON.stringify(edges.map(e => ({ from: e.source, to: e.target, label: e.label })))}

Generate executable ${language} code that implements this workflow with proper error handling, logging, and best practices.`;

    const response = await fetch(`${config.API_URL}?key=${config.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: workflowDescription,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("Error generating code:", error);
    throw error;
  }
}

// Function to analyze and optimize workflow
export async function analyzeWorkflow(
  nodes: CustomNode[],
  edges: CustomEdge[]
): Promise<WorkflowAnalysis> {
  try {
    if (!isApiConfigured()) {
      throw new Error("API key is missing");
    }

    const config = getApiConfig();
    const analysisPrompt = `Analyze the following workflow and provide optimization recommendations:

Nodes: ${JSON.stringify(nodes.map(n => ({ id: n.id, label: n.data?.label, type: n.type })))}
Edges: ${JSON.stringify(edges.map(e => ({ from: e.source, to: e.target, label: e.label })))}

Provide analysis including:
1. Workflow type classification
2. Process identification and relationships
3. Optimization opportunities
4. Error handling recommendations
5. Performance improvements

Return as JSON with structure:
{
  "workflowType": "string",
  "processes": [...],
  "connections": [...],
  "recommendations": [...]
}`;

    const response = await fetch(`${config.API_URL}?key=${config.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: analysisPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const jsonMatch = data.candidates[0].content.parts[0].text.match(/{[\s\S]*}/);
    const jsonString = jsonMatch ? jsonMatch[0] : data.candidates[0].content.parts[0].text;
    
    return JSON.parse(jsonString) as WorkflowAnalysis;
  } catch (error) {
    console.error("Error analyzing workflow:", error);
    throw error;
  }
}

// Helper function to convert plain text to nodes and edges
export function convertTextToDiagram(text: string): {
  nodes: CustomNode[];
  edges: CustomEdge[];
} {
  const lines = text.trim().split("\n");
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Simple parsing algorithm - this is just a basic example
  // In a real application, you would want a more sophisticated parser
  lines.forEach((line, index) => {
    if (line.trim()) {
      // Create a node for each line
      nodes.push({
        id: `node-${index}`,
        type: "default",
        position: { x: 100, y: 100 + index * 100 },
        data: { label: line.trim() },
      });

      // Create edges between consecutive nodes
      if (index > 0) {
        edges.push({
          id: `edge-${index - 1}-${index}`,
          source: `node-${index - 1}`,
          target: `node-${index}`,
          type: "default",
        });
      }
    }
  });

  return {
    nodes: convertToDiaFlowNodes(nodes),
    edges: convertToDiaFlowEdges(edges),
  };
}
