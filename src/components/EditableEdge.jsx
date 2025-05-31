import React, { useRef, useEffect, useState } from 'react';
import { getBezierPath } from '@xyflow/react';

export default function EditableEdge({
    id,
    source,
    sourceX,
    sourceY,
    targetX,
    targetY,
    label,
    data,
    selected,
    style,
    markerEnd,
    setEdges,
    nodes,
}) {
    const sourceNode = nodes?.find((n) => n.id === source);
    const showConditionBox = sourceNode && (sourceNode.type === 'sRoute' || sourceNode.type === 'cpRoute');

    const inputRef = useRef(null);
    const spanRef = useRef(null);
    const [inputValue, setInputValue] = useState(label || '');
    const [boxWidth, setBoxWidth] = useState(60);

    useEffect(() => {
        setInputValue(label || '');
    }, [label]);

    useEffect(() => {
        if (spanRef.current) {
            setBoxWidth(Math.max(spanRef.current.offsetWidth + 24, 60));
        }
    }, [inputValue]);

    const edgePath = getBezierPath({ sourceX, sourceY, targetX, targetY })[0];
    const labelX = (sourceX + targetX) / 2;
    const labelY = (sourceY + targetY) / 2;

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleBlur = () => {
        setEdges((eds) =>
            eds.map((edge) =>
                edge.id === id ? { ...edge, label: inputValue } : edge
            )
        );
    };

    return (
        <>
            <path id={id} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} style={style} />
            {showConditionBox && (
                <foreignObject
                    width={boxWidth + 20}
                    height={40}
                    x={labelX - (boxWidth + 20) / 2}
                    y={labelY - 20}
                    style={{ overflow: 'visible' }}
                >
                    <div style={{ position: 'relative', display: 'inline-block', height: 32 }}>
                        {/* Hidden span to measure width */}
                        <span
                            ref={spanRef}
                            style={{
                                visibility: 'hidden',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                whiteSpace: 'pre',
                                fontSize: 13,
                                fontFamily: 'inherit',
                                padding: '4px 8px',
                                fontWeight: 'normal',
                            }}
                        >
                            {inputValue || ' '}
                        </span>
                        <input
                            ref={inputRef}
                            type="text"
                            style={{
                                width: boxWidth,
                                height: 32,
                                fontSize: 13,
                                border: '1px solid #b6e0fe',
                                borderRadius: 4,
                                padding: '4px 8px',
                                background: inputValue.trim().length > 0 ? '#e6f4ff' : '#fff',
                                outline: selected ? '2px solid #007bff' : 'none',
                                boxShadow: selected ? '0 0 0 2px #007bff22' : undefined,
                                fontFamily: 'inherit',
                                fontWeight: 'normal',
                                whiteSpace: 'pre',
                                overflow: 'hidden',
                                minWidth: 60,
                                maxWidth: 1000, // practically infinite
                                transition: 'width 0.1s',
                            }}
                            value={inputValue}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                </foreignObject>
            )}
        </>
    );
}