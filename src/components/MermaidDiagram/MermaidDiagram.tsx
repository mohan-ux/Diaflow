import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import './MermaidDiagram.css';

interface MermaidDiagramProps {
  chart: string;
  config?: any;
  className?: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  chart,
  config = {
    theme: 'default',
    securityLevel: 'loose',
    startOnLoad: true,
    flowchart: {
      htmlLabels: true,
      curve: 'basis',
    },
  },
  className = '',
}) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const diagramId = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Initialize mermaid with the provided configuration
    mermaid.initialize(config);

    // Only render if we have a chart and a ref
    if (chart && mermaidRef.current) {
      try {
        // Clear previous diagram
        mermaidRef.current.innerHTML = '';

        // Render the new diagram
        mermaid.render(diagramId.current, chart).then(({ svg }) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg;

            // Add click event listeners to nodes if needed
            const svgElement = mermaidRef.current.querySelector('svg');
            if (svgElement) {
              svgElement.style.width = '100%';
              svgElement.style.height = 'auto';
              svgElement.style.maxWidth = '100%';
            }
          }
        });
      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `<div class="mermaid-error">Error rendering diagram: ${error}</div>`;
        }
      }
    }
  }, [chart, config]);

  return (
    <div className={`mermaid-diagram-container ${className}`}>
      <div ref={mermaidRef} className="mermaid-content" />
    </div>
  );
};

export default MermaidDiagram;