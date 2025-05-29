/**
 * Converts a workflow "steps" JSON to React Flow nodes and edges.
 * Handles cpRoute, pRoute, sRoute, and nested subprocesses.
 */
export function stepsJsonToFlow(steps, startX = 100, startY = 100, parentId = null, level = 0) {
    const nodes = [];
    const edges = [];
    const visited = new Set();
  
    // Helper to recursively process steps
    function processStep(stepId, pos = { x: startX, y: startY }, parent = parentId, depth = level) {
      if (!steps[stepId] || visited.has(stepId)) return;
      visited.add(stepId);
  
      const step = steps[stepId];
      const node = {
        id: stepId,
        type: step.type,
        position: { x: pos.x + depth * 60, y: pos.y + nodes.length * 80 },
        data: { ...step, stepId, type: step.type, viewMode: 'flowchart' },
        parentNode: parent || undefined,
      };
      nodes.push(node);
  
      // Handle subprocess (recursively)
      if (step.type === 'subprocess' && step.steps) {
        // Place subprocess children near parent
        Object.keys(step.steps).forEach((childId, idx) => {
          processStep(childId, { x: pos.x + 200, y: pos.y + idx * 100 }, stepId, depth + 1);
        });
        // Connect subprocess node to its first child (optional)
        const firstChild = Object.keys(step.steps)[0];
        if (firstChild) {
          edges.push({ id: `${stepId}->${firstChild}`, source: stepId, target: firstChild });
        }
        // Connect subprocess to its "next" if any
        if (step.next) {
          edges.push({ id: `${stepId}->${step.next}`, source: stepId, target: step.next });
          processStep(step.next, { x: pos.x, y: pos.y + 200 }, parent, depth);
        }
        return;
      }
  
      // Handle route nodes (cpRoute, pRoute, sRoute)
      if (['cpRoute', 'pRoute', 'sRoute'].includes(step.type) && Array.isArray(step.options)) {
        step.options.forEach((opt, idx) => {
          if (opt.next) {
            edges.push({
              id: `${stepId}->${opt.next}`,
              source: stepId,
              target: opt.next,
              label: opt.condition || undefined,
            });
            processStep(opt.next, { x: pos.x + 200, y: pos.y + idx * 100 }, parent, depth + 1);
          }
        });
        // cpRoute/sRoute may have default_path
        if (step.default_path) {
          edges.push({
            id: `${stepId}->${step.default_path}`,
            source: stepId,
            target: step.default_path,
            label: 'default',
          });
          processStep(step.default_path, { x: pos.x + 200, y: pos.y + 100 }, parent, depth + 1);
        }
        return;
      }
  
      // Normal next (string or array)
      if (step.next) {
        if (Array.isArray(step.next)) {
          step.next.forEach((nxt, idx) => {
            edges.push({ id: `${stepId}->${nxt}`, source: stepId, target: nxt });
            processStep(nxt, { x: pos.x, y: pos.y + idx * 200 }, parent, depth + 1);
          });
        } else if (typeof step.next === 'string') {
          edges.push({ id: `${stepId}->${step.next}`, source: stepId, target: step.next });
          processStep(step.next, { x: pos.x , y: pos.y }, parent, depth + 2);
        }
      }
    }
  
    // Find all start nodes (type === 'start')
    const startNodes = Object.keys(steps).filter((k) => steps[k].type === 'start');
    if (startNodes.length === 0) {
      // fallback: pick any node as entry
      processStep(Object.keys(steps)[0]);
    } else {
      startNodes.forEach((sid, idx) => processStep(sid, { x: startX, y: startY + idx * 120 }));
    }
  
    return { nodes, edges };
  }