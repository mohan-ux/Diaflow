import { Shape } from "../../types/shapes";

/**
 * Mind Map shapes library
 * Contains shapes specifically designed for mind mapping
 */
export const mindmapShapes: Omit<Shape, "id">[] = [
  {
    name: "Central Topic",
    category: "mindmap",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="30" rx="45" ry="25" fill="#f0f9ff" stroke="#3498db" stroke-width="2"/></svg>',
    tags: ["central", "topic", "main", "mindmap", "ellipse"],
  },
  {
    name: "Main Branch",
    category: "mindmap",
    svg: '<svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="40" rx="20" ry="20" fill="#e8f4fc" stroke="#2980b9" stroke-width="2"/></svg>',
    tags: ["main", "branch", "topic", "mindmap", "rounded"],
  },
  {
    name: "Sub Topic",
    category: "mindmap",
    svg: '<svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="30" rx="15" ry="15" fill="#f5f5f5" stroke="#7f8c8d" stroke-width="2"/></svg>',
    tags: ["sub", "topic", "branch", "mindmap", "rounded"],
  },
  {
    name: "Bubble",
    category: "mindmap",
    svg: '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="35" fill="#f0fff4" stroke="#27ae60" stroke-width="2"/></svg>',
    tags: ["bubble", "circle", "topic", "mindmap"],
  },
  {
    name: "Cloud",
    category: "mindmap",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><path d="M25,50 C10,50 10,35 20,30 C20,15 40,15 45,25 C60,15 75,25 75,40 C85,40 85,50 75,55 C75,60 65,60 60,55 C55,60 35,60 35,50 C30,55 15,55 25,50 Z" fill="#f0f0f0" stroke="#95a5a6" stroke-width="2"/></svg>',
    tags: ["cloud", "thought", "idea", "mindmap"],
  },
  {
    name: "Hexagon Topic",
    category: "mindmap",
    svg: '<svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg"><polygon points="25,5 75,5 95,45 75,85 25,85 5,45" fill="#fff0f5" stroke="#e74c3c" stroke-width="2"/></svg>',
    tags: ["hexagon", "topic", "mindmap", "polygon"],
  },
  {
    name: "Note",
    category: "mindmap",
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M5,5 H75 L95,25 V95 H5 Z" fill="#fffde7" stroke="#f39c12" stroke-width="2"/><path d="M75,5 V25 H95" fill="none" stroke="#f39c12" stroke-width="2"/></svg>',
    tags: ["note", "paper", "mindmap", "annotation"],
  },
  {
    name: "Callout",
    category: "mindmap",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><path d="M5,5 H85 V40 H30 L20,55 L20,40 H5 Z" fill="#f8f9fa" stroke="#34495e" stroke-width="2"/></svg>',
    tags: ["callout", "speech", "bubble", "mindmap", "comment"],
  },
  {
    name: "Image Placeholder",
    category: "mindmap",
    svg: '<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="70" fill="#f5f5f5" stroke="#bdc3c7" stroke-width="2"/><path d="M30,20 L70,20 L70,60 L30,60 Z" fill="none" stroke="#bdc3c7" stroke-width="2" stroke-dasharray="5,5"/><circle cx="45" cy="35" r="5" fill="#bdc3c7"/><path d="M30,60 L50,40 L60,50 L70,40 L70,60 Z" fill="#bdc3c7"/></svg>',
    tags: ["image", "picture", "photo", "mindmap", "media"],
  },
  {
    name: "Connection Line",
    category: "mindmap",
    svg: '<svg viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg"><path d="M5,10 C35,10 65,10 95,10" fill="none" stroke="#3498db" stroke-width="3" stroke-linecap="round"/></svg>',
    tags: ["connection", "line", "link", "mindmap", "branch"],
  },
];
