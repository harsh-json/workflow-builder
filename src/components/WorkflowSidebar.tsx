import React from 'react';
import { useState } from 'react';
import { Node } from '@xyflow/react';
import { paletteItems, nodeAttributeMap } from '../utils/nodeAttributeMap';
import { userTaskTemplates } from "../utils/userTaskTemplates"; // Import your user task templates
import { serviceTaskTemplates } from "../utils/serviceTaskTemplates";

interface SidebarProps {
  onAddNode: (node: Node) => void;
  handleAddClick: (type: string, positionOverride?: { x: number, y: number }) => void;
}

export default function WorkflowSidebar({ onAddNode }: SidebarProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [showServiceTaskMenu, setShowServiceTaskMenu] = useState(false);

  const handleAddServiceTask = (templateKey: string) => {
    const template =
      serviceTaskTemplates[templateKey] ||
      {
        type: "serviceTask",
        executor: "",
        parameters: {},
        sequential: false,
        listener: [],
        group_name: null,
        identifier: null,
        resourceId: null,
        description: null,
        skipExpression: null,
        loopCardinality: 0
      };
    onAddNode({
      id: `node_${Date.now()}`,
      type: "serviceTask",
      position: { x: 100, y: 100 },
      data: {
        stepId: `node_${Date.now()}`,
        ...template
      }
    });
    setShowServiceTaskMenu(false);
  };

  const handleAddClick = (type: string, positionOverride?: { x: number, y: number }) => {

    const id = `node_${Date.now()}`;
    // Get current viewport center (with scroll offset)
    const x = positionOverride?.x ?? (window.innerWidth / 2 - 200 + window.scrollX);
    const y = positionOverride?.y ?? (window.innerHeight / 2 - 100 + window.scrollY);

    const attributes = nodeAttributeMap[type];

    let data: any = {
      next: [],
      ...Object.fromEntries(attributes.required.map((key) => [key, null])),
      ...Object.fromEntries(attributes.optional.map((key) => [key, null])),
      viewMode: 'flowchart',
      stepId: id,
      type,
    };

    // Prefill identifier for userTask
    if (type === "userTask") {
      data = {
        ...data,
        ...userTaskTemplates.DEFAULT_USER_TASK,
        stepId: id,
        type,
      };
    }

    const newNode: Node = {
      id,
      type,
      position: { x, y },
      data,
    };
    onAddNode(newNode);
  };
  return (
    <aside className="w-60 p-4 bg-gray-50 border-r border-gray-200 fixed left-0 top-60 z-50">
      <div className="space-y-2" style={{ position: "relative" }}>
        {paletteItems.map((item) =>
          item.type === "serviceTask" ? (
            <div
              key={item.type}
              draggable
              onDragStart={e => {
                e.dataTransfer.setData('application/reactflow', item.type);
                if (selectedTemplate) {
                  e.dataTransfer.setData('serviceTaskTemplate', selectedTemplate);
                }
                e.dataTransfer.effectAllowed = 'move';
              }}
              style={{ background: item.color + "90" }}
              className="flex items-center space-x-2 p-2 rounded shadow-sm cursor-pointer hover:bg-gray-100 relative"
              onClick={e => {
                e.stopPropagation();
                setShowServiceTaskMenu((v) => !v);
              }}
            >
              <span className="iconify text-xl" data-icon={`mdi:${item.icon}`} />
              <span className="capitalize flex-1">{item.label}</span>
              <span
                className='rounded p-1 cursor-pointer flex items-center justify-center ml-auto h-full'
              >
                <img src='https://cdn-icons-png.flaticon.com/128/32/32195.png' alt="dropdown" className={`h-3 transition-all duration-300 aspect-square ${!showServiceTaskMenu ? '-rotate-90' : 'rotate-90'}`} />
              </span>
              {showServiceTaskMenu && (
                <div
                  style={{
                    position: "absolute",
                    left: "110%",
                    top: "-20%",
                    zIndex: 100,
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    minWidth: 180,
                    padding: 8,
                  }}
                  onMouseEnter={() => setShowServiceTaskMenu(true)}
                >
                  <div className="flex flex-col gap-2">
                    <div
                      className="px-3 py-2 rounded hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        setSelectedTemplate("");
                        handleAddServiceTask("");
                      }}
                    >
                      Generic Service Task
                    </div>
                    {Object.keys(serviceTaskTemplates).map(key => (
  <div
    key={key}
    className="px-3 py-2 rounded hover:bg-blue-100 cursor-pointer"
    draggable
    onDragStart={e => {
      e.dataTransfer.setData('application/reactflow', 'serviceTask');
      e.dataTransfer.setData('serviceTaskTemplate', key);
      e.dataTransfer.effectAllowed = 'move';
      // Do NOT close the menu here!
    }}
    onClick={() => {
      setSelectedTemplate(key);
      handleAddServiceTask(key);
      setShowServiceTaskMenu(false); // OK to close on click
    }}
  >
    {key}
  </div>
))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              style={{ background: item.color + "90" }}
              key={item.type}
              draggable
              onDragStart={e => {
                e.dataTransfer.setData('application/reactflow', item.type);
                e.dataTransfer.effectAllowed = 'move';
              }}
              className="flex items-center space-x-2 p-2 rounded shadow-sm cursor-pointer hover:bg-gray-100 relative"
              onClick={() => handleAddClick(item.type)}
            >
              <span className="iconify text-xl" data-icon={`mdi:${item.icon}`} />
              <span className="capitalize flex-1">{item.label}</span>
            </div>
          )
        )}
      </div>
    </aside>
  );

  // return (
  //   <aside className="w-60 p-4 bg-gray-50 border-r border-gray-200 fixed left-0 top-60 z-50">
  //     <div className="space-y-2" style={{ position: "relative" }}>
  //       {paletteItems.map((item) =>
  //         item.type === "serviceTask" ? (
  //           <div
  //             key={item.type}
  //             draggable
  //             onDragStart={e => {
  //               e.dataTransfer.setData('application/reactflow', item.type);
  //               e.dataTransfer.effectAllowed = 'move';
  //             }}
  //             style={{ background: item.color + "90" }}
  //             className="flex items-center space-x-2 p-2 rounded shadow-sm cursor-pointer hover:bg-gray-100 relative"
  //             onClick={e => {
  //               e.stopPropagation();
  //               setShowServiceTaskMenu((v) => !v);
  //             }}
  //           // onMouseLeave={() => setShowServiceTaskMenu(false)}
  //           >
  //             <span className="iconify text-xl" data-icon={`mdi:${item.icon}`} />
  //             <span className="capitalize flex-1">{item.label}</span>
  //             <span
  //               className='rounded p-1 cursor-pointer flex items-center justify-center ml-auto h-full'
  //             >
  //               <img src='https://cdn-icons-png.flaticon.com/128/32/32195.png' alt="dropdown" className={`h-3 transition-all duration-300 aspect-square ${!showServiceTaskMenu ? '-rotate-90' : 'rotate-90'}`} />
  //             </span>
  //             {showServiceTaskMenu && (
  //               <div
  //                 style={{
  //                   position: "absolute",
  //                   left: "120%",
  //                   top: "-100%",
  //                   zIndex: 100,
  //                   background: "#fff",
  //                   border: "1px solid #ddd",
  //                   borderRadius: 6,
  //                   boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  //                   minWidth: 180,
  //                   padding: 8,
  //                 }}
  //                 onMouseEnter={() => setShowServiceTaskMenu(true)}
  //               >
  //                 <div className="flex flex-col gap-2">
  //                   <div
  //                     className="px-3 py-2 rounded hover:bg-blue-100 cursor-pointer"
  //                     onClick={() => handleAddServiceTask("")}
  //                   >
  //                     Generic Service Task
  //                   </div>
  //                   {Object.keys(serviceTaskTemplates).map(key => (
  //                     <div
  //                       key={key}
  //                       className="px-3 py-2 rounded hover:bg-blue-100 cursor-pointer"
  //                       onClick={() => handleAddServiceTask(key)}
  //                     >
  //                       {key}
  //                     </div>
  //                   ))}
  //                 </div>
  //               </div>
  //             )}
  //           </div>
  //         ) : (
  //           <div
  //             style={{ background: item.color + "90" }}
  //             key={item.type}
  //             className="flex items-center space-x-2 p-2 bg-white rounded shadow-sm cursor-pointer hover:bg-gray-100"
  //             onClick={() => handleAddClick(item.type)}
  //           >
  //             <span className="iconify text-xl" data-icon={`mdi:${item.icon}`} />
  //             <span className="capitalize flex-1">{item.label}</span>
  //           </div>
  //         )
  //       )}
  //     </div>
  //   </aside>
  // );
}