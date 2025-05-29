import React, { useState, useRef, useEffect } from 'react';
import { Handle } from '@xyflow/react';
import { nodeTypeColors } from '../utils/nodeAttributeMap';

const nodeStyle = {
    padding: '10px',
    border: '1px solid',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
};

// const NodeWrapper = ({ data, children, onUpdate }) => {
//     const [jsonData, setJsonData] = useState(JSON.stringify(data, null, 2));
//     const [error, setError] = useState('');
//     const [lastValidJson, setLastValidJson] = useState(jsonData);

//     useEffect(() => {
//         setJsonData(JSON.stringify(data, null, 2));
//         setLastValidJson(JSON.stringify(data, null, 2));
//         setError('');
//     }, [data.viewMode]);

//     const handleJsonChange = (e) => {
//         const newText = e.target.value;
//         setJsonData(newText);
//         try {
//             JSON.parse(newText);
//             setError('');
//             setLastValidJson(newText); // Save the last valid JSON
//         } catch (err) {
//             setError('Invalid JSON format: ' + err.message);
//         }
//     };

//     const handleBlur = () => {
//         if (!error && typeof onUpdate === 'function') {
//             try {
//                 const parsedData = JSON.parse(jsonData);
//                 onUpdate(parsedData);
//             } catch {
//                 // Do nothing, invalid JSON
//             }
//         }
//     };

//     if (data.viewMode === 'data') {
//         return (
//             <div style={{ border: '1px solid #ccc', background: nodeTypeColors[data.type] + '70' || '#888', width: 400, height: 300, position: 'relative' }}>
//                 <textarea
//                     value={jsonData}
//                     onChange={handleJsonChange}
//                     onBlur={handleBlur}
//                     style={{
//                         width: '100%',
//                         height: '100%',
//                         fontSize: '12px',
//                         textAlign: 'left',
//                         border: '1px solid #ddd',
//                         borderRadius: '5px',
//                         padding: '5px',
//                     }}
//                 />
//                 {error && <div style={{ color: 'red', marginTop: '5px' }}>{error}</div>}
//             </div>
//         );
//     }
//     return children;
// };

const NodeWrapper = ({ data, children, onUpdate }) => {
    // Remove 'next' from the editable JSON
    const { next, ...editableData } = data;
    const [jsonData, setJsonData] = useState(JSON.stringify(editableData, null, 2));
    const [error, setError] = useState('');
    const [lastValidJson, setLastValidJson] = useState(jsonData);

    useEffect(() => {
        setJsonData(JSON.stringify(editableData, null, 2));
        setLastValidJson(JSON.stringify(editableData, null, 2));
        setError('');
    }, [data.viewMode, data.stepId]); // also reset if node changes

    const handleJsonChange = (e) => {
        const newText = e.target.value;
        setJsonData(newText);
        try {
            JSON.parse(newText);
            setError('');
            setLastValidJson(newText);
        } catch (err) {
            setError('Invalid JSON format: ' + err.message);
        }
    };

    const handleBlur = () => {
        if (!error && typeof onUpdate === 'function') {
            try {
                const parsedData = JSON.parse(jsonData);
                onUpdate(parsedData);
            } catch {
                // Do nothing, invalid JSON
            }
        }
    };

    if (data.viewMode === 'data') {
        return (
            <div style={{ border: '1px solid #ccc', background: nodeTypeColors[data.type] + '70' || '#888', width: 400, height: 300, position: 'relative' }}>
                <textarea
                    value={jsonData}
                    onChange={handleJsonChange}
                    onBlur={handleBlur}
                    style={{
                        width: '100%',
                        height: '100%',
                        fontSize: '12px',
                        textAlign: 'left',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        padding: '5px',
                    }}
                />
                {error && <div style={{ color: 'red', marginTop: '5px' }}>{error}</div>}
            </div>
        );
    }
    return children;
};

const StartNode = ({ data }) => (
    <NodeWrapper data={data} onUpdate={data.onUpdate}>
        <div style={{ ...nodeStyle, borderColor: '#000', backgroundColor: nodeTypeColors[data.type] + '70' || '#888' }}>
            <strong>{data.stepId || 'Step ID'} - {data.type || 'START'}</strong>
            <Handle type="source" position="bottom" style={{ background: '#555' }} />
            <Handle type="target" position="top" style={{ background: '#555' }} />
        </div>
    </NodeWrapper>
);

const EndNode = ({ data }) => (
    <NodeWrapper data={data} onUpdate={data.onUpdate}>
        <div style={{ ...nodeStyle, borderColor: '#ff0000', backgroundColor: nodeTypeColors[data.type] + '70' || '#888' }}>
            <strong>{data.stepId || 'Step ID'} - {data.type || 'END'}</strong>
            <Handle type="source" position="bottom" style={{ background: '#555' }} />
            <Handle type="target" position="top" style={{ background: '#555' }} />
        </div>
    </NodeWrapper>
);

const UserTaskNode = ({ data }) => (
    <NodeWrapper data={data} onUpdate={data.onUpdate}>
        <div style={{ ...nodeStyle, borderColor: '#007bff', backgroundColor: nodeTypeColors[data.type] + '70' || '#888' }}>
            <strong>{data.stepId || 'Step ID'} - {data.type || 'USERTASK'}</strong>
            <Handle type="source" position="bottom" style={{ background: '#555' }} />
            <Handle type="target" position="top" style={{ background: '#555' }} />
        </div>
    </NodeWrapper>
);

const ServiceTaskNode = ({ data }) => (
    <NodeWrapper data={data} onUpdate={data.onUpdate}>
        <div style={{ ...nodeStyle, borderColor: '#28a745', backgroundColor: nodeTypeColors[data.type] + '70' || '#888' }}>
            <strong>{data.stepId || 'Step ID'} - {data.type || 'SERVICETASK'}</strong>
            <Handle type="source" position="bottom" style={{ background: '#555' }} />
            <Handle type="target" position="top" style={{ background: '#555' }} />
        </div>
    </NodeWrapper>
);

// A shared DecisionPointNode component that displays as a diamond shape. 
// It receives a color prop that determines its border and background.
const DecisionPointNode = ({ data, color, defaultLabel }) => (
    <NodeWrapper data={data} onUpdate={data.onUpdate}>
        <div
            style={{
                ...nodeStyle,
                borderColor: color,
                backgroundColor: `${color}20`, // light tint of the color
                transform: 'rotate(45deg)', // Diamond shape
                width: '80px',
                height: '80px',
            }}
        >
            <div style={{ transform: 'rotate(-45deg)', textAlign: 'center' }}>
                <strong>{data.stepId || 'Step ID'} - {data.type || defaultLabel}</strong>
            </div>
            <Handle type="source" position="bottom" style={{ background: '#555' }} />
            <Handle type="target" position="top" style={{ background: '#555' }} />
        </div>
    </NodeWrapper>
);

const SingleRouteNode = (props) => (
    <DecisionPointNode {...props} color={nodeTypeColors['sRoute'] + '70' }defaultLabel="SROUTE" />
);

const ParallelRouteNode = (props) => (
    <DecisionPointNode {...props} color={nodeTypeColors['pRoute'] + '70'} defaultLabel="PROUTE" />
);

const ConditionalParallelRouteNode = (props) => (
    <DecisionPointNode {...props} color={nodeTypeColors['cpRoute'] + '70'} defaultLabel="CPROUTE" />
);

export const nodeTypes = {
    start: StartNode,
    end: EndNode,
    userTask: UserTaskNode,
    serviceTask: ServiceTaskNode,
    sRoute: SingleRouteNode,
    pRoute: ParallelRouteNode,
    cpRoute: ConditionalParallelRouteNode,
};