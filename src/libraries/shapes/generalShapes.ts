import { Shape } from "../../types/shapes";

/**
 * General shapes library
 * Contains basic geometric shapes and common elements
 */
export const generalShapes: Omit<Shape, "id">[] = [
  {
    name: "Rectangle",
    category: "general",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="50" fill="#ffffff" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["rectangle", "basic", "shape", "box"],
  },
  {
    name: "Rounded Rectangle",
    category: "general",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="50" rx="10" ry="10" fill="#ffffff" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["rectangle", "rounded", "basic", "shape", "box"],
  },
  {
    name: "Circle",
    category: "general",
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["circle", "basic", "shape", "round"],
  },
  {
    name: "Ellipse",
    category: "general",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="30" rx="45" ry="25" fill="#ffffff" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["ellipse", "oval", "basic", "shape"],
  },
  {
    name: "Triangle",
    category: "general",
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,10 90,90 10,90" fill="#ffffff" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["triangle", "basic", "shape"],
  },
  {
    name: "Diamond",
    category: "general",
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,10 90,50 50,90 10,50" fill="#ffffff" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["diamond", "rhombus", "basic", "shape"],
  },
  {
    name: "Hexagon",
    category: "general",
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="25,10 75,10 95,50 75,90 25,90 5,50" fill="#ffffff" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["hexagon", "polygon", "shape"],
  },
  {
    name: "Star",
    category: "general",
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,10 61,35 90,40 70,60 75,90 50,75 25,90 30,60 10,40 39,35" fill="#ffffff" stroke="#000000" stroke-width="2"/></svg>',
    tags: ["star", "shape", "decoration"],
  },
  {
    name: "Text Box",
    category: "general",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="50" fill="#ffffff" stroke="#000000" stroke-width="2"/><text x="50" y="35" font-family="Arial" font-size="12" text-anchor="middle">Text</text></svg>',
    tags: ["text", "label", "annotation"],
  },
  {
    name: "Callout",
    category: "general",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><path d="M5,5 H85 V40 H30 L20,55 L20,40 H5 Z" fill="#ffffff" stroke="#000000" stroke-width="2"/><text x="45" y="25" font-family="Arial" font-size="12" text-anchor="middle">Callout</text></svg>',
    tags: ["callout", "speech", "bubble", "comment"],
  },
];
