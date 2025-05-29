import React from 'react';
import { Node } from '@xyflow/react';
import { paletteItems, nodeAttributeMap } from '../utils/nodeAttributeMap';

interface SidebarProps {
  onAddNode: (node: Node) => void;
}

export default function WorkflowSidebar({ onAddNode }: SidebarProps) {
  const handleAddClick = (type: string) => {
    const id = `node_${Date.now()}`;
    const x = window.innerWidth / 2 - 200; // 200 is half of typical node width
    const y = window.innerHeight / 2 - 100; // 100 is half of typical node height  
    const attributes = nodeAttributeMap[type];
    const newNode: Node = {
      id,
      type,
      position: { x, y },
      data: {
        next: [], // Default value for `next`
        ...Object.fromEntries(attributes.required.map((key) => [key, null])), // Add required attributes
        ...Object.fromEntries(attributes.optional.map((key) => [key, null])), // Add optional attributes
        viewMode: 'flowchart', // Default view mode
        stepId: id, // Default stepId
        type, // Set the type correctly
      },
    };
    onAddNode(newNode);
  };

  return (
    <aside className="w-60 p-4 bg-gray-50 border-r border-gray-200 fixed left-0 top-60 z-50">
      <div className="space-y-2">
        {paletteItems.map((item) => (
          <div
            style={{ background: item.color + '90' }}
            key={item.type}
            className="flex items-center space-x-2 p-2 bg-white rounded shadow-sm cursor-pointer hover:bg-gray-100"
            onClick={() => handleAddClick(item.type)}
          >
            <span className="iconify text-xl" data-icon={`mdi:${item.icon}`} />
            <span className="capitalize flex-1">{item.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}