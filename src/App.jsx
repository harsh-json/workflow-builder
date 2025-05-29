import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import WorkflowSidebar from './components/WorkflowSidebar';
import { serializeWorkflow } from './utils/nodeAttributeMap';
import { nodeTypes } from './components/CustomNodes';

export default function App() {
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
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement.tagName.toLowerCase();
      if ((e.key === 'Delete' || e.key === 'Backspace') && tag !== 'input' && tag !== 'textarea') {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setNodes, setEdges]);

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


  return (
    <>
      <Header
        title="Workflow Builder"
        onExport={handleExport}
        viewMode={viewMode}
        onToggleView={toggleViewMode}
      />
      <div className="flex h-screen w-screen">
        <WorkflowSidebar onAddNode={(node) => setNodes((nds) => [...nds, node])} />
        <div className="flex-1 relative w-screen h-screen z-40" style={{ minHeight: 0 }}>
          <ReactFlow
            nodes={nodesWithUpdatedViewMode}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeDoubleClick={handleNodeDoubleClick}
          >
            <MiniMap />
            <Controls />
            <Background variant="dots" gap={12} size={1} /> {/* <-- dots background */}
          </ReactFlow>
        </div>
      </div>
    </>

  );
}