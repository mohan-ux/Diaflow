import { CustomNode, CustomEdge } from "../types/flowTypes";

// Workflow Analysis Interfaces
export interface WorkflowIntent {
  type: 'sequential' | 'conditional' | 'parallel' | 'loop' | 'dataFlow';
  entities: Array<{
    name: string;
    type: 'process' | 'decision' | 'terminal' | 'data' | 'subprocess';
    description: string;
  }>;
  relationships: Array<{
    from: string;
    to: string;
    type: 'sequential' | 'conditional' | 'parallel';
    condition?: string;
  }>;
  conditions: Array<{
    nodeId: string;
    condition: string;
    truePath: string;
    falsePath?: string;
  }>;
}

export interface WorkflowValidation {
  isValid: boolean;
  issues: Array<{
    type: 'deadEnd' | 'orphaned' | 'circular' | 'invalidType';
    message: string;
    nodeIds?: string[];
    severity: 'error' | 'warning' | 'info';
  }>;
  suggestions: string[];
}

export interface LayoutResult {
  nodes: CustomNode[];
  connections: CustomEdge[];
  layout: 'hierarchical' | 'forceDirected' | 'circular';
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ConnectionSuggestion {
  from: string;
  to: string;
  confidence: number;
  reason: string;
  type: 'sequential' | 'conditional' | 'parallel';
}

/**
 * Intelligent Workflow Analyzer
 * Provides comprehensive analysis and optimization for workflow diagrams
 */
export class WorkflowAnalyzer {
  private patterns = {
    sequential: /first.*then.*finally|step 1.*step 2.*step 3|start.*process.*end/i,
    conditional: /if.*then.*else|when.*do.*otherwise|check.*if.*then/i,
    parallel: /simultaneously|parallel|at the same time|concurrently/i,
    loops: /repeat|loop|until|while|iterate|for each/i,
    dataFlow: /input.*process.*output|transform.*data|extract.*load/i
  };

  /**
   * Parse natural language workflow description
   */
  parseUserIntent(description: string): WorkflowIntent {
    const intent: WorkflowIntent = {
      type: 'sequential',
      entities: [],
      relationships: [],
      conditions: []
    };

    // Detect workflow type
    intent.type = this.detectWorkflowType(description);

    // Extract entities
    intent.entities = this.extractEntities(description);

    // Extract relationships
    intent.relationships = this.extractRelationships(description, intent.entities);

    // Extract conditions
    intent.conditions = this.extractConditions(description);

    return intent;
  }

  /**
   * Detect workflow type from description
   */
  private detectWorkflowType(description: string): WorkflowIntent['type'] {
    if (this.patterns.conditional.test(description)) return 'conditional';
    if (this.patterns.parallel.test(description)) return 'parallel';
    if (this.patterns.loops.test(description)) return 'loop';
    if (this.patterns.dataFlow.test(description)) return 'dataFlow';
    return 'sequential';
  }

  /**
   * Extract entities from description
   */
  private extractEntities(description: string) {
    const entities: WorkflowIntent['entities'] = [];
    
    // Simple entity extraction - in a real implementation, this would use NLP
    const sentences = description.split(/[.!?]+/).filter(s => s.trim());
    
    sentences.forEach((sentence, index) => {
      const trimmed = sentence.trim();
      if (trimmed.length < 3) return;

      // Detect entity type based on keywords
      let type: WorkflowIntent['entities'][0]['type'] = 'process';
      if (/start|begin|initiate/i.test(trimmed)) type = 'terminal';
      if (/end|finish|complete/i.test(trimmed)) type = 'terminal';
      if (/check|validate|verify|if|when/i.test(trimmed)) type = 'decision';
      if (/data|input|output|file|database/i.test(trimmed)) type = 'data';

      entities.push({
        name: `Step ${index + 1}`,
        type,
        description: trimmed
      });
    });

    return entities;
  }

  /**
   * Extract relationships between entities
   */
  private extractRelationships(description: string, entities: WorkflowIntent['entities']) {
    const relationships: WorkflowIntent['relationships'] = [];
    
    // Create sequential relationships between entities
    for (let i = 0; i < entities.length - 1; i++) {
      relationships.push({
        from: entities[i].name,
        to: entities[i + 1].name,
        type: 'sequential'
      });
    }

    return relationships;
  }

  /**
   * Extract conditional logic
   */
  private extractConditions(description: string) {
    const conditions: WorkflowIntent['conditions'] = [];
    
    // Simple condition extraction
    const conditionalMatches = description.match(/if\s+(.+?)\s+then\s+(.+?)(?:\s+else\s+(.+?))?/gi);
    
    if (conditionalMatches) {
      conditionalMatches.forEach((match, index) => {
        const parts = match.match(/if\s+(.+?)\s+then\s+(.+?)(?:\s+else\s+(.+?))?/i);
        if (parts) {
          conditions.push({
            nodeId: `condition_${index}`,
            condition: parts[1].trim(),
            truePath: parts[2].trim(),
            falsePath: parts[3]?.trim()
          });
        }
      });
    }

    return conditions;
  }

  /**
   * Validate workflow structure
   */
  validateWorkflow(nodes: CustomNode[], edges: CustomEdge[]): WorkflowValidation {
    const issues: WorkflowValidation['issues'] = [];
    const suggestions: string[] = [];

    // Check for dead ends
    const deadEnds = this.checkForDeadEnds(nodes, edges);
    issues.push(...deadEnds);

    // Check for orphaned nodes
    const orphaned = this.checkForOrphanedNodes(nodes, edges);
    issues.push(...orphaned);

    // Check for circular dependencies
    const circular = this.checkForCircularDependencies(edges);
    issues.push(...circular);

    // Check for invalid node types
    const invalidTypes = this.validateNodeTypes(nodes);
    issues.push(...invalidTypes);

    // Generate suggestions
    suggestions.push(...this.generateSuggestions(issues));

    return {
      isValid: issues.filter(i => i.severity === 'error').length === 0,
      issues,
      suggestions
    };
  }

  /**
   * Check for dead end nodes
   */
  private checkForDeadEnds(nodes: CustomNode[], edges: CustomEdge[]) {
    const issues: WorkflowValidation['issues'] = [];
    
    nodes.forEach(node => {
      const hasOutgoing = edges.some(edge => edge.source === node.id);
      const isTerminal = node.type === 'terminal' || node.data?.label?.toLowerCase().includes('end');
      
      if (!hasOutgoing && !isTerminal) {
        issues.push({
          type: 'deadEnd',
          message: `Node "${node.data?.label || node.id}" has no outgoing connections`,
          nodeIds: [node.id],
          severity: 'warning'
        });
      }
    });

    return issues;
  }

  /**
   * Check for orphaned nodes
   */
  private checkForOrphanedNodes(nodes: CustomNode[], edges: CustomEdge[]) {
    const issues: WorkflowValidation['issues'] = [];
    
    nodes.forEach(node => {
      const hasIncoming = edges.some(edge => edge.target === node.id);
      const isStart = node.type === 'terminal' || node.data?.label?.toLowerCase().includes('start');
      
      if (!hasIncoming && !isStart) {
        issues.push({
          type: 'orphaned',
          message: `Node "${node.data?.label || node.id}" has no incoming connections`,
          nodeIds: [node.id],
          severity: 'warning'
        });
      }
    });

    return issues;
  }

  /**
   * Check for circular dependencies
   */
  private checkForCircularDependencies(edges: CustomEdge[]) {
    const issues: WorkflowValidation['issues'] = [];
    
    // Simple cycle detection
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
      for (const edge of outgoingEdges) {
        if (hasCycle(edge.target)) return true;
      }

      recursionStack.delete(nodeId);
      return false;
    };

    const allNodes = new Set([
      ...edges.map(e => e.source),
      ...edges.map(e => e.target)
    ]);

    for (const nodeId of allNodes) {
      if (hasCycle(nodeId)) {
        issues.push({
          type: 'circular',
          message: 'Circular dependency detected in workflow',
          nodeIds: Array.from(recursionStack),
          severity: 'error'
        });
        break;
      }
    }

    return issues;
  }

  /**
   * Validate node types
   */
  private validateNodeTypes(nodes: CustomNode[]) {
    const issues: WorkflowValidation['issues'] = [];
    
    nodes.forEach(node => {
      const validTypes = ['process', 'decision', 'terminal', 'data', 'cloud'];
      if (node.type && !validTypes.includes(node.type)) {
        issues.push({
          type: 'invalidType',
          message: `Invalid node type "${node.type}" for node "${node.data?.label || node.id}"`,
          nodeIds: [node.id],
          severity: 'warning'
        });
      }
    });

    return issues;
  }

  /**
   * Generate suggestions based on issues
   */
  private generateSuggestions(issues: WorkflowValidation['issues']): string[] {
    const suggestions: string[] = [];

    const deadEndCount = issues.filter(i => i.type === 'deadEnd').length;
    const orphanedCount = issues.filter(i => i.type === 'orphaned').length;
    const circularCount = issues.filter(i => i.type === 'circular').length;

    if (deadEndCount > 0) {
      suggestions.push(`Add connections from ${deadEndCount} dead-end node(s) to complete the workflow`);
    }

    if (orphanedCount > 0) {
      suggestions.push(`Add connections to ${orphanedCount} orphaned node(s) to integrate them into the workflow`);
    }

    if (circularCount > 0) {
      suggestions.push('Remove circular dependencies to ensure the workflow can complete');
    }

    if (suggestions.length === 0) {
      suggestions.push('Workflow structure looks good! Consider adding error handling nodes for robustness.');
    }

    return suggestions;
  }

  /**
   * Suggest intelligent connections between nodes
   */
  suggestConnections(nodes: CustomNode[]): ConnectionSuggestion[] {
    const suggestions: ConnectionSuggestion[] = [];
    
    nodes.forEach(node => {
      const potentialTargets = this.findCompatibleNodes(node, nodes);
      potentialTargets.forEach(target => {
        const confidence = this.calculateConnectionConfidence(node, target);
        if (confidence > 0.7) {
          suggestions.push({
            from: node.id,
            to: target.id,
            confidence,
            reason: this.explainConnection(node, target),
            type: this.determineConnectionType(node, target)
          });
        }
      });
    });

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Find compatible nodes for connection
   */
  private findCompatibleNodes(sourceNode: CustomNode, allNodes: CustomNode[]) {
    return allNodes.filter(node => {
      if (node.id === sourceNode.id) return false;
      
      // Don't connect to start nodes
      if (node.data?.label?.toLowerCase().includes('start')) return false;
      
      // Don't connect from end nodes
      if (sourceNode.data?.label?.toLowerCase().includes('end')) return false;
      
      return true;
    });
  }

  /**
   * Calculate connection confidence
   */
  private calculateConnectionConfidence(source: CustomNode, target: CustomNode): number {
    let confidence = 0.5; // Base confidence

    // Type-based confidence adjustments
    if (source.type === 'terminal' && target.type === 'process') confidence += 0.3;
    if (source.type === 'process' && target.type === 'decision') confidence += 0.2;
    if (source.type === 'decision' && target.type === 'process') confidence += 0.2;
    if (source.type === 'process' && target.type === 'terminal') confidence += 0.3;

    // Label-based confidence adjustments
    const sourceLabel = source.data?.label?.toLowerCase() || '';
    const targetLabel = target.data?.label?.toLowerCase() || '';

    if (sourceLabel.includes('start') && !targetLabel.includes('start')) confidence += 0.2;
    if (sourceLabel.includes('process') && targetLabel.includes('check')) confidence += 0.2;
    if (sourceLabel.includes('check') && targetLabel.includes('process')) confidence += 0.2;
    if (sourceLabel.includes('process') && targetLabel.includes('end')) confidence += 0.2;

    return Math.min(confidence, 1.0);
  }

  /**
   * Explain why a connection makes sense
   */
  private explainConnection(source: CustomNode, target: CustomNode): string {
    const sourceLabel = source.data?.label || source.type;
    const targetLabel = target.data?.label || target.type;

    if (source.type === 'terminal' && target.type === 'process') {
      return `Start node should connect to first process`;
    }
    if (source.type === 'process' && target.type === 'decision') {
      return `Process should be followed by decision point`;
    }
    if (source.type === 'decision' && target.type === 'process') {
      return `Decision should lead to next process`;
    }
    if (source.type === 'process' && target.type === 'terminal') {
      return `Process should connect to end node`;
    }

    return `Logical flow from ${sourceLabel} to ${targetLabel}`;
  }

  /**
   * Determine connection type
   */
  private determineConnectionType(source: CustomNode, target: CustomNode): 'sequential' | 'conditional' | 'parallel' {
    if (source.type === 'decision') return 'conditional';
    if (source.type === 'process' && target.type === 'process') return 'sequential';
    return 'sequential';
  }

  /**
   * Apply auto-layout algorithms
   */
  calculateOptimalLayout(nodes: CustomNode[], edges: CustomEdge[]): LayoutResult {
    const layouts = {
      hierarchical: this.hierarchicalLayout(nodes, edges),
      forceDirected: this.forceDirectedLayout(nodes, edges),
      circular: this.circularLayout(nodes, edges)
    };

    const bestLayout = this.selectBestLayout(layouts, nodes, edges);
    return bestLayout;
  }

  /**
   * Hierarchical layout algorithm
   */
  private hierarchicalLayout(nodes: CustomNode[], edges: CustomEdge[]): LayoutResult {
    const levels = this.calculateNodeLevels(nodes, edges);
    const positionedNodes = this.arrangeByLevels(levels);
    
    return {
      nodes: positionedNodes,
      connections: edges,
      layout: 'hierarchical',
      bounds: this.calculateBounds(positionedNodes)
    };
  }

  /**
   * Calculate node levels for hierarchical layout
   */
  private calculateNodeLevels(nodes: CustomNode[], edges: CustomEdge[]) {
    const levels: CustomNode[][] = [];
    const visited = new Set<string>();
    const inDegree = new Map<string, number>();

    // Initialize in-degree count
    nodes.forEach(node => inDegree.set(node.id, 0));
    edges.forEach(edge => {
      const current = inDegree.get(edge.target) || 0;
      inDegree.set(edge.target, current + 1);
    });

    // Find nodes with no incoming edges (level 0)
    let currentLevel = 0;
    let currentLevelNodes = nodes.filter(node => inDegree.get(node.id) === 0);

    while (currentLevelNodes.length > 0) {
      levels[currentLevel] = currentLevelNodes;
      currentLevelNodes.forEach(node => visited.add(node.id));

      // Find next level nodes
      const nextLevelNodes: CustomNode[] = [];
      currentLevelNodes.forEach(node => {
        const outgoingEdges = edges.filter(edge => edge.source === node.id);
        outgoingEdges.forEach(edge => {
          const targetInDegree = inDegree.get(edge.target) || 0;
          inDegree.set(edge.target, targetInDegree - 1);
          
          if (targetInDegree - 1 === 0 && !visited.has(edge.target)) {
            const targetNode = nodes.find(n => n.id === edge.target);
            if (targetNode) nextLevelNodes.push(targetNode);
          }
        });
      });

      currentLevelNodes = nextLevelNodes;
      currentLevel++;
    }

    return levels;
  }

  /**
   * Arrange nodes by levels
   */
  private arrangeByLevels(levels: CustomNode[][]) {
    const positionedNodes: CustomNode[] = [];
    const levelHeight = 120;
    const nodeSpacing = 200;

    levels.forEach((levelNodes, levelIndex) => {
      const levelWidth = levelNodes.length * nodeSpacing;
      const startX = -levelWidth / 2;

      levelNodes.forEach((node, nodeIndex) => {
        positionedNodes.push({
          ...node,
          position: {
            x: startX + nodeIndex * nodeSpacing,
            y: levelIndex * levelHeight
          }
        });
      });
    });

    return positionedNodes;
  }

  /**
   * Force-directed layout algorithm
   */
  private forceDirectedLayout(nodes: CustomNode[], edges: CustomEdge[]): LayoutResult {
    // Simplified force-directed layout
    const positionedNodes = nodes.map((node, index) => ({
      ...node,
      position: {
        x: (index % 3) * 200,
        y: Math.floor(index / 3) * 150
      }
    }));

    return {
      nodes: positionedNodes,
      connections: edges,
      layout: 'forceDirected',
      bounds: this.calculateBounds(positionedNodes)
    };
  }

  /**
   * Circular layout algorithm
   */
  private circularLayout(nodes: CustomNode[], edges: CustomEdge[]): LayoutResult {
    const radius = 300;
    const centerX = 0;
    const centerY = 0;
    const angleStep = (2 * Math.PI) / nodes.length;

    const positionedNodes = nodes.map((node, index) => ({
      ...node,
      position: {
        x: centerX + radius * Math.cos(index * angleStep),
        y: centerY + radius * Math.sin(index * angleStep)
      }
    }));

    return {
      nodes: positionedNodes,
      connections: edges,
      layout: 'circular',
      bounds: this.calculateBounds(positionedNodes)
    };
  }

  /**
   * Select best layout based on workflow characteristics
   */
  private selectBestLayout(layouts: Record<string, LayoutResult>, nodes: CustomNode[], edges: CustomEdge[]): LayoutResult {
    // Simple heuristic: use hierarchical for most workflows
    // Use circular for small workflows with many connections
    // Use force-directed for complex workflows

    if (nodes.length <= 5 && edges.length >= nodes.length * 2) {
      return layouts.circular;
    }

    if (nodes.length > 10) {
      return layouts.forceDirected;
    }

    return layouts.hierarchical;
  }

  /**
   * Calculate bounds of positioned nodes
   */
  private calculateBounds(nodes: CustomNode[]) {
    if (nodes.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    const xCoords = nodes.map(n => n.position.x);
    const yCoords = nodes.map(n => n.position.y);

    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);

    return {
      x: minX,
      y: minY,
      width: maxX - minX + 150, // Add node width
      height: maxY - minY + 100  // Add node height
    };
  }
}

// Export singleton instance
export const workflowAnalyzer = new WorkflowAnalyzer();
