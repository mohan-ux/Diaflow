import { Shape } from "../../types/shapes";

/**
 * Modern/Creative shapes library
 * Contains contemporary design elements and artistic shapes
 */
export const modernShapes: Omit<Shape, "id">[] = [
  {
    name: "Gradient Rectangle",
    category: "modern",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8e44ad;stop-opacity:1" /><stop offset="100%" style="stop-color:#3498db;stop-opacity:1" /></linearGradient></defs><rect x="5" y="5" width="90" height="50" rx="5" ry="5" fill="url(#grad1)" stroke="none"/></svg>',
    tags: ["gradient", "rectangle", "modern", "colorful"],
  },
  {
    name: "Blob",
    category: "modern",
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,10 C70,10 90,30 90,50 C90,65 75,85 50,90 C25,85 10,65 10,50 C10,30 30,10 50,10 Z" fill="#9b59b6" stroke="none"/></svg>',
    tags: ["blob", "organic", "shape", "modern", "fluid"],
  },
  {
    name: "Wave Card",
    category: "modern",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="50" rx="5" ry="5" fill="#ffffff" stroke="#e0e0e0" stroke-width="1"/><path d="M5,25 C20,15 35,35 50,25 C65,15 80,35 95,25 L95,55 L5,55 Z" fill="#3498db" opacity="0.2" stroke="none"/></svg>',
    tags: ["wave", "card", "modern", "material"],
  },
  {
    name: "3D Box",
    category: "modern",
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="20,30 80,30 80,80 20,80" fill="#3498db" stroke="#2980b9" stroke-width="1"/><polygon points="20,30 40,10 100,10 80,30" fill="#2980b9" stroke="#2980b9" stroke-width="1"/><polygon points="80,30 100,10 100,60 80,80" fill="#1f618d" stroke="#1f618d" stroke-width="1"/></svg>',
    tags: ["3d", "box", "cube", "modern", "isometric"],
  },
  {
    name: "Neon Frame",
    category: "modern",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="neon" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter></defs><rect x="10" y="10" width="80" height="40" rx="5" ry="5" fill="none" stroke="#ff00ff" stroke-width="2" filter="url(#neon)"/></svg>',
    tags: ["neon", "frame", "modern", "glow", "border"],
  },
  {
    name: "Geometric Pattern",
    category: "modern",
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="90" fill="#f5f5f5" stroke="#e0e0e0" stroke-width="1"/><circle cx="25" cy="25" r="10" fill="#3498db" opacity="0.7"/><circle cx="75" cy="25" r="10" fill="#e74c3c" opacity="0.7"/><circle cx="25" cy="75" r="10" fill="#2ecc71" opacity="0.7"/><circle cx="75" cy="75" r="10" fill="#f1c40f" opacity="0.7"/><circle cx="50" cy="50" r="15" fill="#9b59b6" opacity="0.7"/></svg>',
    tags: ["geometric", "pattern", "modern", "circles", "abstract"],
  },
  {
    name: "Layered Card",
    category: "modern",
    svg: '<svg viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="15" width="90" height="50" rx="5" ry="5" fill="#ffffff" stroke="#e0e0e0" stroke-width="1"/><rect x="10" y="10" width="80" height="50" rx="5" ry="5" fill="#f8f9fa" stroke="#e0e0e0" stroke-width="1"/><rect x="15" y="5" width="70" height="50" rx="5" ry="5" fill="#ffffff" stroke="#e0e0e0" stroke-width="1"/></svg>',
    tags: ["layered", "card", "modern", "stack", "material"],
  },
  {
    name: "Artistic Brush",
    category: "modern",
    svg: '<svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg"><path d="M5,20 C15,5 25,35 35,20 C45,5 55,35 65,20 C75,5 85,35 95,20" fill="none" stroke="#e74c3c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tags: ["artistic", "brush", "stroke", "modern", "line"],
  },
  {
    name: "Dotted Container",
    category: "modern",
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="50" rx="5" ry="5" fill="#ffffff" stroke="#bdc3c7" stroke-width="2" stroke-dasharray="5,3"/></svg>',
    tags: ["dotted", "container", "modern", "dashed", "border"],
  },
  {
    name: "Gradient Badge",
    category: "modern",
    svg: '<svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#f1c40f;stop-opacity:1" /><stop offset="100%" style="stop-color:#e74c3c;stop-opacity:1" /></linearGradient></defs><rect x="5" y="5" width="90" height="30" rx="15" ry="15" fill="url(#grad2)" stroke="none"/></svg>',
    tags: ["gradient", "badge", "modern", "pill", "button"],
  },
];
