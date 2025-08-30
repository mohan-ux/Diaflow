import { CustomNode, CustomEdge } from "../types/flowTypes";

// Gemini API configuration
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "";
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";
const MODEL = process.env.REACT_APP_GEMINI_MODEL || "gemini-1.5-pro";
const TEMPERATURE = parseFloat(process.env.REACT_APP_GEMINI_TEMPERATURE || "0.3");
const MAX_TOKENS = parseInt(process.env.REACT_APP_GEMINI_MAX_TOKENS || "4096", 10);

// Interface for Gemini API response
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

// Interface for Mermaid diagram data
interface MermaidDiagramData {
  mermaidCode: string;
  nodes: CustomNode[];
  edges: CustomEdge[];
}

/**
 * Convert Mermaid syntax to ReactFlow nodes and edges
 * @param mermaidCode Mermaid diagram syntax
 * @returns Object containing nodes and edges for ReactFlow
 */
export function convertMermaidToReactFlow(mermaidCode: string): { nodes: CustomNode[]; edges: CustomEdge[] } {
  // This is a simplified implementation
  // A full implementation would need to parse the Mermaid syntax and convert it to ReactFlow format
  
  const nodes: CustomNode[] = [];
  const edges: CustomEdge[] = [];
  
  // Parse nodes (very simplified example)
  const nodeRegex = /\s*([A-Za-z0-9_-]+)\s*(?:\[([^\]]+)\]|\(([^\)]+)\)|\{([^\}]+)\}|\(\(([^\)]+)\)\)|\>([^\]]+)\]|\[\[([^\]]+)\]\]|\[\(([^\)]+)\)\]|\[\/(([^\]]+))\])/g;
  let nodeMatch;
  let nodeId = 0;
  
  while ((nodeMatch = nodeRegex.exec(mermaidCode)) !== null) {
    const id = nodeMatch[1];
    const label = nodeMatch[2] || nodeMatch[3] || nodeMatch[4] || nodeMatch[5] || nodeMatch[6] || nodeMatch[7] || nodeMatch[8] || nodeMatch[9] || id;
    
    // Determine node type based on syntax
    let type = "default";
    if (nodeMatch[2]) type = "rectangle"; // [Text]
    else if (nodeMatch[3]) type = "rounded"; // (Text)
    else if (nodeMatch[4]) type = "diamond"; // {Text}
    else if (nodeMatch[5]) type = "circle"; // ((Text))
    else if (nodeMatch[8]) type = "stadium"; // [(Text)]
    
    nodes.push({
      id,
      type,
      position: { x: 100 + (nodeId % 3) * 200, y: 100 + Math.floor(nodeId / 3) * 100 },
      data: { label },
      style: {
        border: "1px solid #ddd",
        padding: 10,
        borderRadius: type === "rounded" ? 10 : type === "circle" ? 50 : type === "diamond" ? 0 : 5,
        width: type === "diamond" ? 150 : 150,
        height: type === "diamond" ? 100 : 50,
      },
    } as CustomNode);
    
    nodeId++;
  }
  
  // Parse edges (very simplified example)
  const edgeRegex = /\s*([A-Za-z0-9_-]+)\s*(-?-+>|=+>|\.-+>)\s*(?:\|([^|]+)\|)?\s*([A-Za-z0-9_-]+)/g;
  let edgeMatch;
  let edgeId = 0;
  
  while ((edgeMatch = edgeRegex.exec(mermaidCode)) !== null) {
    const source = edgeMatch[1];
    const target = edgeMatch[4];
    const label = edgeMatch[3] || "";
    const edgeType = edgeMatch[2];
    
    // Determine edge style based on syntax
    let animated = false;
    let style = {};
    
    if (edgeType.includes("=>")) {
      style = { strokeWidth: 2 };
    } else if (edgeType.includes(".->")) {
      style = { strokeDasharray: "5, 5" };
    } else if (edgeType.includes("-->")) {
      style = {};
    }
    
    edges.push({
      id: `e${edgeId}`,
      source,
      target,
      label,
      animated,
      style,
      type: "default",
    } as CustomEdge);
    
    edgeId++;
  }
  
  return { nodes, edges };
}

/**
 * Convert ReactFlow nodes and edges to Mermaid syntax
 * @param nodes ReactFlow nodes
 * @param edges ReactFlow edges
 * @returns Mermaid diagram syntax
 */
export function convertReactFlowToMermaid(nodes: CustomNode[], edges: CustomEdge[]): string {
  let mermaidCode = "flowchart TD\n";
  
  // Convert nodes to Mermaid syntax
  nodes.forEach((node) => {
    let nodeDefinition = "";
    
    // Determine node shape based on type
    switch (node.type) {
      case "rectangle":
        nodeDefinition = `    ${node.id}[${node.data.label}]\n`;
        break;
      case "rounded":
        nodeDefinition = `    ${node.id}(${node.data.label})\n`;
        break;
      case "diamond":
        nodeDefinition = `    ${node.id}{${node.data.label}}\n`;
        break;
      case "circle":
        nodeDefinition = `    ${node.id}((${node.data.label}))\n`;
        break;
      case "stadium":
        nodeDefinition = `    ${node.id}([${node.data.label}])\n`;
        break;
      case "cylinder":
        nodeDefinition = `    ${node.id}[(${node.data.label})]\n`;
        break;
      default:
        nodeDefinition = `    ${node.id}[${node.data.label}]\n`;
    }
    
    mermaidCode += nodeDefinition;
  });
  
  // Convert edges to Mermaid syntax
  edges.forEach((edge) => {
    let edgeDefinition = "";
    let connector = "-->";
    
    // Determine edge style based on properties
    if (edge.style?.strokeDasharray) {
      connector = "-.->";
    } else if (edge.style?.strokeWidth && (edge.style.strokeWidth as number) > 1) {
      connector = "==>"; 
    }
    
    // Add label if present
    if (edge.label) {
      edgeDefinition = `    ${edge.source} ${connector}|${edge.label}| ${edge.target}\n`;
    } else {
      edgeDefinition = `    ${edge.source} ${connector} ${edge.target}\n`;
    }
    
    mermaidCode += edgeDefinition;
  });
  
  return mermaidCode;
}

/**
 * Generate a Mermaid diagram from a natural language prompt using Gemini API
 * @param prompt User's natural language description
 * @returns Object containing Mermaid code and ReactFlow nodes/edges
 */
export async function generateMermaidFromPrompt(
  prompt: string
): Promise<MermaidDiagramData | null> {
  try {
    if (!API_KEY) {
      console.error("Gemini API key is not set.");
      throw new Error(
        "API key is missing. Please set REACT_APP_GEMINI_API_KEY in your environment variables."
      );
    }

    const fullPrompt = `
Generate a Mermaid flowchart diagram based on the following description: "${prompt}"

Return ONLY the Mermaid code with no additional text or explanations. Use the flowchart TD (top-down) syntax.

Use appropriate node shapes based on their function:
- Process steps as rectangles: A[Process Step]
- Decision points as diamonds: B{Decision Point}
- Start/End points as stadium shapes: C([Start/End])
- Data inputs/outputs as parallelograms: D[/Data Input/]
- Databases as cylinders: E[(Database)]

Use appropriate connections:
- Standard flow: -->
- Conditional flow with labels: -->|Yes/No| or -->|Condition|
- Dotted lines for optional flows: -.->  
- Thick lines for important flows: ==>

Ensure the diagram is well-structured, logical, and follows best practices for flowchart design.
`;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
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
          temperature: TEMPERATURE,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: MAX_TOKENS,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const data: GeminiResponse = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response generated from the API.");
    }

    const mermaidCode = data.candidates[0].content.parts[0].text.trim();
    
    // Convert Mermaid code to ReactFlow nodes and edges
    const { nodes, edges } = convertMermaidToReactFlow(mermaidCode);

    return { mermaidCode, nodes, edges };
  } catch (error) {
    console.error("Error generating Mermaid diagram:", error);
    throw error;
  }
}

/**
 * Parse Mermaid code and convert it to ReactFlow nodes and edges
 * @param mermaidCode Mermaid diagram syntax
 * @returns Object containing nodes and edges for ReactFlow
 */
export function parseMermaidCode(mermaidCode: string): { nodes: CustomNode[]; edges: CustomEdge[] } {
  return convertMermaidToReactFlow(mermaidCode);
}