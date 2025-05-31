import React, { useState, useRef, useEffect, useCallback } from 'react';
import Header from './components/Header';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import EditableEdge from './components/EditableEdge';

import { stepsJsonToFlow } from './utils/stepsJsonToFlow';
import WorkflowSidebar from './components/WorkflowSidebar';
import { serviceTaskTemplates } from './utils/serviceTaskTemplates';
import { userTaskTemplates } from './utils/userTaskTemplates';
import { serializeWorkflow, nodeAttributeMap } from './utils/nodeAttributeMap';
import { nodeTypes } from './components/CustomNodes';

export function AppWithProvider() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}

export default function App() {

  const reactFlowInstance = useRef(null);

const edgeTypes = {
  editable: (edgeProps) => (
    <EditableEdge {...edgeProps} setEdges={setEdges} nodes={nodes} />
  ),
};


  const [nodes, setNodes, onNodesChange] = useNodesState(() => {
    const saved = localStorage.getItem('workflow_nodes');
    return saved && saved[0] === '[' ? JSON.parse(saved) : [];
  });
  const [edges, setEdges, onEdgesChange] = useEdgesState(() => {
    const saved = localStorage.getItem('workflow_edges');
    return saved && saved[0] === '[' ? JSON.parse(saved) : [];
  });
  const [viewMode, setViewMode] = useState('flowchart'); // State for global view mode

  const onConnect = useCallback(
    (params) => setEdges((eds) =>
      addEdge({ ...params, type: 'editable' }, eds)),
    [setEdges]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement.tagName.toLowerCase();
      if ((e.key === 'Delete' || e.key === 'Backspace') && tag !== 'input' && tag !== 'textarea') {
        // 1) grab all the node IDs that are selected right now
        const selectedNodeIds = nodes
          .filter((n) => n.selected)
          .map((n) => n.id)

        // 2) remove the selected nodes
        setNodes((nds) => nds.filter((n) => !n.selected))

        // 3) remove edges that are either (a) selected, or (b) attached to any of the deleted nodes
        setEdges((eds) =>
          eds.filter(
            (e) =>
              !e.selected &&
              !selectedNodeIds.includes(e.source) &&
              !selectedNodeIds.includes(e.target)
          )
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nodes, setNodes, edges, setEdges])

  useEffect(() => {
    localStorage.setItem('workflow_nodes', JSON.stringify(nodes));
    localStorage.setItem('workflow_edges', JSON.stringify(edges));
  }, [nodes, edges]);

  const handleExport = () => {
    const json = serializeWorkflow(nodes, edges);
    const jsonString = JSON.stringify(json, null, 2);
    // Copy to clipboard
    navigator.clipboard.writeText(jsonString);
    alert('Exported JSON copied to clipboard!');
  };

  const handleNodeUpdate = (nodeId, updatedData) => {
    setNodes((nds) => {
      let newId = updatedData.stepId || nodeId;
      let nodesUpdated = nds.map((node) => {
        // Update the node itself
        if (node.id === nodeId) {
          return {
            ...node,
            id: newId,
            data: {
              ...node.data,
              ...updatedData,
              stepId: newId,
            },
          };
        }
        // Update next references in other nodes
        let newData = { ...node.data };
        if (typeof newData.next === 'string' && newData.next === nodeId) {
          newData.next = newId;
        } else if (Array.isArray(newData.next)) {
          newData.next = newData.next.map((n) => (n === nodeId ? newId : n));
        }
        return { ...node, data: newData };
      });
      return nodesUpdated;
    });

    // Also update edges if you want:
    setEdges((eds) =>
      eds.map((edge) =>
        edge.source === nodeId
          ? { ...edge, source: updatedData.stepId || nodeId }
          : edge.target === nodeId
            ? { ...edge, target: updatedData.stepId || nodeId }
            : edge
      )
    );
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'flowchart' ? 'data' : 'flowchart');
  };

  const nodesWithUpdatedViewMode = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      viewMode,
      onUpdate: (updatedData) => handleNodeUpdate(node.id, updatedData),
    },
  }));

  const handleNodeDoubleClick = (event, node) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === node.id
          ? {
            ...n,
            data: {
              ...n.data,
              viewMode: n.data.viewMode === 'data' ? 'flowchart' : 'data',
            },
          }
          : n
      )
    );
  };

  const toggleAllNodesViewMode = () => {
    // Check if all nodes are in 'data' mode
    setViewMode((prev) => (prev === 'flowchart' ? 'data' : 'flowchart'));
    const allInData = nodes.every((n) => n.data.viewMode === 'data');
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          viewMode: allInData ? 'flowchart' : 'data',
        },
      }))
    );
  };

  // When rendering, pass onUpdate and viewMode per node
  const nodesWithHandlers = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      viewMode: node.data.viewMode || 'flowchart',
      onUpdate: (updatedData) => handleNodeUpdate(node.id, updatedData),
    },
  }));

  const handleAddClick = (type, positionOverride, template) => {
    const id = `node_${Date.now()}`;
    const attributes = nodeAttributeMap[type];
    const x = positionOverride?.x ?? (window.innerWidth / 2 - 200 + window.scrollX);
    const y = positionOverride?.y ?? (window.innerHeight / 2 - 100 + window.scrollY);

    let data = {
      next: [],
      ...Object.fromEntries(attributes.required.map((key) => [key, null])),
      ...Object.fromEntries(attributes.optional.map((key) => [key, null])),
      viewMode: 'flowchart',
      stepId: id,
      type,
    };

    if (template) {
      data = {
        ...data,
        ...template,
        stepId: id,
        type,
      };
    } else if (type === "userTask") {
      data = {
        ...data,
        ...userTaskTemplates.DEFAULT_USER_TASK,
        stepId: id,
        type,
      };
    }

    setNodes((nds) => [
      ...nds,
      {
        id,
        type,
        position: { x, y },
        data,
      },
    ]);
  };

  const onEdgeDoubleClick = (event, edge) => {
    event.stopPropagation();
    const newLabel = prompt('Enter condition/label for this edge:', edge.label || '');
    if (newLabel !== null) {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edge.id ? { ...e, label: newLabel } : e
        )
      );
    }
  };


  return (
    <>
      <Header
        title="Workflow Builder"
        onExport={handleExport}
        viewMode={viewMode}
        onToggleView={toggleAllNodesViewMode}
        onImportJson={(json) => {
          // Accepts either {steps: {...}} or just steps object
          const steps = json.steps || json;
          const { nodes, edges } = stepsJsonToFlow(steps);
          setNodes(nodes);
          setEdges(edges);
        }}
      />
      <div className="flex h-screen w-screen">
        <WorkflowSidebar
          onAddNode={(node) => setNodes((nds) => [...nds, node])}
          handleAddClick={handleAddClick}
        />
        <div className="flex-1 relative w-screen h-screen z-40" style={{ minHeight: 0 }}>
          <ReactFlow
            edgeTypes={edgeTypes}
            onInit={instance => {
              console.log('ReactFlow instance:', instance);
              reactFlowInstance.current = instance;
            }}
            // onEdgeDoubleClick={onEdgeDoubleClick}
            onDrop={event => {
              event.preventDefault();
              const type = event.dataTransfer.getData('application/reactflow');
              const serviceTaskTemplateKey = event.dataTransfer.getData('serviceTaskTemplate');
              const userTaskTemplateKey = event.dataTransfer.getData('userTaskTemplate');
              if (!type || !reactFlowInstance.current) return;

              const position = reactFlowInstance.current.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
              });

              if (type === 'serviceTask' && serviceTaskTemplateKey) {
                const template = serviceTaskTemplates[serviceTaskTemplateKey];
                handleAddClick(type, position, template);
              } else if (type === 'userTask' && userTaskTemplateKey) {
                const template = userTaskTemplates[userTaskTemplateKey];
                handleAddClick(type, position, template);
              } else {
                handleAddClick(type, position);
              }
            }}
            onDragOver={event => {
              event.preventDefault();
              event.dataTransfer.dropEffect = 'move';
            }}
            nodes={nodesWithHandlers}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeDoubleClick={handleNodeDoubleClick}
          >
            <MiniMap />
            <Controls />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </>
  );

}