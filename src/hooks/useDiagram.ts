import { useCallback } from "react";
import useStore from "../store/useStore";
import { Element, Connection } from "../store/useStore";
import { generateElementId, generateConnectionId } from "../utils/idGenerator";

/**
 * Custom hook for diagram operations
 */
const useDiagram = () => {
  // Get state and actions from the store
  const {
    elements,
    connections,
    selectedElementIds,
    theme,
    addElement,
    updateElement,
    removeElement,
    addConnection,
    updateConnection,
    removeConnection,
    setSelectedElementIds,
    toggleTheme,
  } = useStore();

  /**
   * Create a new element
   * @param type Element type
   * @param position Position coordinates
   * @param data Additional data
   * @param style Style properties
   * @returns The created element
   */
  const createElement = useCallback(
    (
      type: string,
      position: { x: number; y: number },
      data: any = {},
      style: any = {}
    ) => {
      const newElement: Element = {
        id: generateElementId(type),
        type,
        position,
        data,
        style,
      };

      addElement(newElement);
      return newElement;
    },
    [addElement]
  );

  /**
   * Create a connection between two elements
   * @param sourceId Source element ID
   * @param targetId Target element ID
   * @param type Connection type
   * @param label Optional label
   * @param style Style properties
   * @returns The created connection
   */
  const createConnection = useCallback(
    (
      sourceId: string,
      targetId: string,
      type: string = "default",
      label: string = "",
      style: any = {}
    ) => {
      const newConnection: Connection = {
        id: generateConnectionId(),
        source: sourceId,
        target: targetId,
        type,
        label,
        style,
      };

      addConnection(newConnection);
      return newConnection;
    },
    [addConnection]
  );

  /**
   * Select elements
   * @param ids Element IDs to select
   * @param append Whether to append to current selection
   */
  const selectElements = useCallback(
    (ids: string[], append: boolean = false) => {
      if (append) {
        setSelectedElementIds([...selectedElementIds, ...ids]);
      } else {
        setSelectedElementIds(ids);
      }
    },
    [selectedElementIds, setSelectedElementIds]
  );

  /**
   * Clear the current selection
   */
  const clearSelection = useCallback(() => {
    setSelectedElementIds([]);
  }, [setSelectedElementIds]);

  /**
   * Check if an element is selected
   * @param id Element ID
   * @returns True if selected, false otherwise
   */
  const isSelected = useCallback(
    (id: string) => {
      return selectedElementIds.includes(id);
    },
    [selectedElementIds]
  );

  /**
   * Get an element by ID
   * @param id Element ID
   * @returns The element or undefined if not found
   */
  const getElementById = useCallback(
    (id: string) => {
      return elements.find((element) => element.id === id);
    },
    [elements]
  );

  /**
   * Get a connection by ID
   * @param id Connection ID
   * @returns The connection or undefined if not found
   */
  const getConnectionById = useCallback(
    (id: string) => {
      return connections.find((connection) => connection.id === id);
    },
    [connections]
  );

  /**
   * Get all connections for an element
   * @param elementId Element ID
   * @returns Array of connections
   */
  const getConnectionsForElement = useCallback(
    (elementId: string) => {
      return connections.filter(
        (connection) =>
          connection.source === elementId || connection.target === elementId
      );
    },
    [connections]
  );

  return {
    // State
    elements,
    connections,
    selectedElementIds,
    theme,

    // Element operations
    createElement,
    updateElement,
    removeElement,
    getElementById,

    // Connection operations
    createConnection,
    updateConnection,
    removeConnection,
    getConnectionById,
    getConnectionsForElement,

    // Selection operations
    selectElements,
    clearSelection,
    isSelected,

    // Theme operations
    toggleTheme,
  };
};

export default useDiagram;
