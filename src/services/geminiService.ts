import { Node, Edge } from "reactflow";
import { CustomNode, CustomEdge } from "../types/flowTypes";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "";
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

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

// Function to generate a diagram from a user prompt
export async function generateDiagramFromPrompt(
  prompt: string
): Promise<{ nodes: CustomNode[]; edges: CustomEdge[] } | null> {
  try {
    if (!API_KEY) {
      console.error("Gemini API key is not set.");
      throw new Error(
        "API key is missing. Please set REACT_APP_GEMINI_API_KEY in your environment variables."
      );
    }

    const fullPrompt = `
Generate a diagram based on the following prompt: "${prompt}"

Return a JSON object with two properties:
1. "nodes": An array of node objects for React Flow, each with:
   - id: A unique string identifier
   - position: {x: number, y: number} for positioning
   - data: {label: string} for the node content
   - type: A string indicating node type (default, input, output, or custom)
   - style: (optional) Any custom styling

2. "edges": An array of edge objects for React Flow, each with:
   - id: A unique string identifier
   - source: The source node id
   - target: The target node id
   - animated: (optional) Boolean to animate the edge
   - label: (optional) Text label for the edge
   - style: (optional) Any custom styling

IMPORTANT: Format the response as JSON only, with no additional text, explanations or markdown formatting.
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
          temperature: 0.2,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 8192,
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

    return { nodes: customNodes, edges: customEdges };
  } catch (error) {
    console.error("Error generating diagram:", error);
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
