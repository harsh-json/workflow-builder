/**
 * Defines all workflow node types (tasks, gateways, events) and their attribute schemas,
 * aligned with Java model classes.
 */

import { Edge } from "@xyflow/react";

// Base attributes common to all steps
interface BaseNodeAttrs {
  stepId: string;
  type: string;
  next?: string;                        // single outgoing reference
  listener?: any[];                     // StepListener list
  group_name?: string | null;
  description?: string | null;
}

// Task-specific attributes
interface TaskAttrs extends BaseNodeAttrs {
  parameters?: Record<string, any>;
  identifier?: Record<string, any>;
  sequential?: boolean;
  loopCardinality?: number;
  resourceId?: string;
}

interface UserTaskAttrs extends TaskAttrs {
  type: 'userTask';
  name?: string;
  assignee?: string;
  owner?: string;
  priority?: string;
  dueDate?: string;
  formKey?: string;
  counterKey?: string;
  incremental?: boolean;
  preRequisite?: any;
  taskTemplateId?: number;
  candidateUsers?: string[];
  candidateGroups?: string[];
}

interface ServiceTaskAttrs extends TaskAttrs {
  type: 'serviceTask';
  executor: string;
  skipExpression?: string;
}

// Gateway / routing attributes
interface RouteAttrs extends BaseNodeAttrs {
  options: Array<{ condition?: string; next: string }>;
}
interface SingleRouteAttrs extends RouteAttrs {
  type: 'sRoute';
}
interface ParallelRouteAttrs extends RouteAttrs {
  type: 'pRoute';
}
interface ConditionalParallelRouteAttrs extends RouteAttrs {
  type: 'cpRoute';
  default_path?: string;
}

// CallActivity & Subprocess
interface CallActivityAttrs extends BaseNodeAttrs {
  type: 'callActivity';
  parameters: {
    outputVariable: string;
    processRequest: any;
    procedureRequest?: any;
    processDefinitionId?: number;
  };
}
interface SubprocessAttrs extends BaseNodeAttrs {
  type: 'subprocess';
  // model-specific fields if any
}

// Boundary event
interface BoundaryEventAttrs extends BaseNodeAttrs {
  type: 'boundary';
  attachedToRef: string;
  eventDefinition: Record<string, any>;
}

// Start / End events
interface StartEventAttrs extends BaseNodeAttrs { type: 'start'; }
interface EndEventAttrs extends BaseNodeAttrs { type: 'end'; }

// Union of all node attribute interfaces
export type WorkflowNodeAttrs =
  | StartEventAttrs
  | EndEventAttrs
  | UserTaskAttrs
  | ServiceTaskAttrs
  | SingleRouteAttrs
  | ParallelRouteAttrs
  | ConditionalParallelRouteAttrs
  | CallActivityAttrs
  | SubprocessAttrs
  | BoundaryEventAttrs;

// Map of node 'type' to attribute interface and required vs. optional properties
export const nodeAttributeMap: Record<string, {
  interface: string;
  required: string[];
  optional: string[];
}> = {
  start: {
    interface: 'StartEventAttrs',
    required: ['stepId', 'type', 'next'],
    optional: ['listener', 'group_name', 'description'],
  },
  end: {
    interface: 'EndEventAttrs',
    required: ['stepId', 'type'],
    optional: ['listener', 'group_name', 'description'],
  },
  userTask: {
    interface: 'UserTaskAttrs',
    required: ['stepId', 'type', 'next'],
    optional: ['name', 'assignee', 'owner', 'priority', 'dueDate', 'formKey', 'counterKey', 'incremental', 'preRequisite', 'taskTemplateId', 'candidateUsers', 'candidateGroups', 'parameters', 'identifier', 'listener', 'group_name', 'description'],
  },
  serviceTask: {
    interface: 'ServiceTaskAttrs',
    required: ['stepId', 'type', 'executor'],
    optional: ['parameters', 'next', 'listener', 'group_name', 'description', 'sequential', 'loopCardinality', 'skipExpression', 'resourceId'],
  },
  sRoute: {
    interface: 'SingleRouteAttrs',
    required: ['stepId', 'type', 'options'],
    optional: ['listener', 'group_name', 'description'],
  },
  pRoute: {
    interface: 'ParallelRouteAttrs',
    required: ['stepId', 'type', 'options'],
    optional: ['listener', 'group_name', 'description'],
  },
  cpRoute: {
    interface: 'ConditionalParallelRouteAttrs',
    required: ['stepId', 'type', 'options'],
    optional: ['default_path', 'listener', 'group_name', 'description'],
  },
  callActivity: {
    interface: 'CallActivityAttrs',
    required: ['stepId', 'type', 'parameters'],
    optional: ['next', 'listener', 'group_name', 'description'],
  },
  subprocess: {
    interface: 'SubprocessAttrs',
    required: ['stepId', 'type'],
    optional: ['next', 'listener', 'group_name', 'description'],
  },
  boundary: {
    interface: 'BoundaryEventAttrs',
    required: ['stepId', 'type', 'attachedToRef', 'eventDefinition'],
    optional: ['listener', 'group_name', 'description'],
  },
};

export const nodeTypeIcons: Record<string, string> = {
  start: 'play_circle',
  end: 'stop_circle',
  userTask: 'user',
  serviceTask: 'cog',
  sRoute: 'arrow_right',
  pRoute: 'shuffle',
  cpRoute: 'shuffle_two',
  callActivity: 'layers',
  subprocess: 'project',
  boundary: 'alert_circle',
};

export const nodeTypeColors: Record<string, string> = {
  start: '#4caf50',
  end: '#f44336',
  userTask: '#2196f3',
  serviceTask: '#009688',
  sRoute: '#ffc107',
  pRoute: '#673ab7',
  cpRoute: '#ff9800',
  callActivity: '#607d8b',
  subprocess: '#795548',
  boundary: '#e91e63',
};

export const paletteItems: Array<{ label: string; type: string; icon: string; color: string }> =
  Object.entries(nodeAttributeMap).map(([type]) => ({
    label: type.toLowerCase(),
    type,
    icon: nodeTypeIcons[type] || 'question',
    color: nodeTypeColors[type] || '#888',
  }));

// Palette items for XYFlow: label, type, and icon
// export const paletteItems: Array<{ label: string; type: string; icon: string }> =
//   Object.entries(nodeAttributeMap).map(([type]) => ({
//     label: type.toLowerCase(),
//     type,
//     icon: nodeTypeIcons[type] || 'question',
//   }));

// Helper: transform XYFlow canvas nodes & edges back into our JSON schema
type CanvasNode = { id: string; type: string; data: Record<string, any> };
type CanvasEdge = { id: string; source: string; target: string };

// export function serializeToJSON(nodes: CanvasNode[], edges: CanvasEdge[]) {
//   const steps = nodes.reduce((acc, node) => {
//     const schema = nodeAttributeMap[node.type];
//     const completeData: Partial<WorkflowNodeAttrs> = {};

//     [...schema.required, ...schema.optional].forEach((key) => {
//       completeData[key] = node.data[key] !== undefined ? node.data[key] : null;
//     });

//     completeData.stepId = node.data.stepId || node.id;
//     completeData.type = node.data.type || node.type;

//     const outgoing = edges.filter((edge) => edge.source === node.id).map((edge) => edge.target);
//     completeData.next = outgoing.length > 0
//       ? (outgoing.length === 1 ? outgoing[0] : outgoing)
//       : (node.data.next !== undefined ? node.data.next : null);

//     if (completeData.stepId) {
//       console.log('completeData:', completeData);
//       acc[completeData.stepId] = completeData;
//     }
//     return acc;
//   }, {});

//   return { steps };
// }

export function serializeWorkflow(nodes, edges) {
  // Build a map for quick lookup
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
  const outgoingEdges = {};
  edges.forEach(edge => {
    if (!outgoingEdges[edge.source]) outgoingEdges[edge.source] = [];
    outgoingEdges[edge.source].push(edge);
  });

  const result = {};
  nodes.forEach(node => {
    const { data, id, type } = node;
    // Prepare base data (exclude onUpdate, viewMode, etc.)
    const {
      onUpdate, viewMode, ...exportData
    } = data;

    // For route nodes, build options array
    if (['cpRoute', 'pRoute', 'sRoute'].includes(type)) {
      exportData.options = (outgoingEdges[id] || []).map(edge => ({
        condition: edge.label?.trim() ? "${"+edge.label+"}" : '${true}',
        next: edge.target,
      }));
      delete exportData.next;
    } else {
      // For other nodes, set next as string or array if outgoing edges exist
      const outgoing = outgoingEdges[id] || [];
      if (outgoing.length === 0) {
        exportData.next = null;
      } else if (outgoing.length === 1) {
        exportData.next = outgoing[0].target;
      } else {
        exportData.next = outgoing.map(e => e.target);
      }
    }

    result[exportData.stepId || id] = {
      type,
      ...exportData,
    };
  });

  return result;
}

