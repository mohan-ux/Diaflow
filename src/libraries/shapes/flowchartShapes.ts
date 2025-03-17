import { Shape } from "../../types/shapes";

/**
 * Flowchart shapes library
 * Contains shapes for creating flowcharts and process diagrams
 */
export const flowchartShapes: Omit<Shape, "id">[] = [
  {
    name: "Process",
    category: "flowchart",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="50" fill="#ffffff" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["process", "flowchart", "rectangle", "step"],
  },
  {
    name: "Decision",
    category: "flowchart",
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 95,50 50,95 5,50" fill="#ffffff" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["decision", "flowchart", "diamond", "condition", "if"],
  },
  {
    name: "Start/End",
    category: "flowchart",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="50" rx="25" ry="25" fill="#ffffff" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["terminal", "start", "end", "flowchart", "terminator"],
  },
  {
    name: "Input/Output",
    category: "flowchart",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><path d="M5,5 H85 L95,30 L85,55 H5 L15,30 Z" fill="#ffffff" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["input", "output", "io", "flowchart", "parallelogram"],
  },
  {
    name: "Document",
    category: "flowchart",
    svg: '<svg viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg"><path d="M5,5 H95 V50 C75,65 55,50 35,65 C15,50 5,65 5,50 Z" fill="#ffffff" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["document", "flowchart", "paper", "report"],
  },
  {
    name: "Data",
    category: "flowchart",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><path d="M5,30 L15,5 H95 L85,55 H5 Z" fill="#ffffff" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["data", "flowchart", "storage", "database"],
  },
  {
    name: "Predefined Process",
    category: "flowchart",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="50" fill="#ffffff" stroke="#000000" stroke-width="2"/><line x1="15" y1="5" x2="15" y2="55" stroke="#000000" stroke-width="2"/><line x1="85" y1="5" x2="85" y2="55" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["predefined", "process", "flowchart", "subroutine", "function"],
  },
  {
    name: "Manual Operation",
    category: "flowchart",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><path d="M5,5 H95 L75,55 H25 Z" fill="#ffffff" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["manual", "operation", "flowchart", "trapezoid"],
  },
  {
    name: "Preparation",
    category: "flowchart",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><path d="M25,5 H75 L95,30 L75,55 H25 L5,30 Z" fill="#ffffff" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["preparation", "flowchart", "hexagon", "initialization"],
  },
  {
    name: "Connector",
    category: "flowchart",
    svg: '<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="20" fill="#ffffff" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["connector", "flowchart", "circle", "junction", "connection"],
  },
];
