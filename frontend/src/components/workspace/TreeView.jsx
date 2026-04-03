import React, { useMemo, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import useProjectStore from '../../store/projectStore';

const TreeView = () => {
  const { projectTree, setSelectedNode } = useProjectStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // --- HIERARCHY BUILDER ---
  // Transforms recursive tree into a horizontal flow
  useEffect(() => {
    if (!projectTree) return;

    const newNodes = [];
    const newEdges = [];
    const HORIZONTAL_SPACING = 300;
    const VERTICAL_SPACING = 100;

    const traverse = (node, level = 0, index = 0, parentX = 0, parentY = 0) => {
      const x = level * HORIZONTAL_SPACING;
      const y = parentY + (index * VERTICAL_SPACING);

      const colors = ['#58a6ff', '#bc8cff', '#3fb950', '#d29922', '#f85149'];

      newNodes.push({
        id: node.id.toString(),
        data: { label: node.name, level: level + 1, raw: node },
        position: { x, y },
        type: 'default',
        style: {
          background: '#161b22',
          color: '#c9d1d9',
          border: `1px solid ${colors[level] || '#30363d'}`,
          borderRadius: '8px',
          fontSize: '12px',
          width: 200,
          textAlign: 'left',
          padding: '10px'
        },
      });

      if (node.children) {
        node.children.forEach((child, i) => {
          newEdges.push({
            id: `e-${node.id}-${child.id}`,
            source: node.id.toString(),
            target: child.id.toString(),
            animated: level >= 2, // Animate edges for deeper technical tasks
            style: { stroke: colors[level] },
            markerEnd: { type: MarkerType.ArrowClosed, color: colors[level] },
          });
          traverse(child, level + 1, i, x, y);
        });
      }
    };

    traverse(projectTree);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [projectTree]);

  const onNodeClick = (event, node) => {
    // We pass the raw data stored in node.data to the store
    setSelectedNode(node.data.raw);
  };

  return (
    <div className="tree-view-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        style={{ background: 'transparent' }}
      >
        <Background color="#30363d" gap={20} />
        <Controls />
        <MiniMap 
          nodeColor={(n) => n.style.border.split(' ')[2]} 
          maskColor="rgba(0, 0, 0, 0.5)"
          style={{ background: '#0d1117', border: '1px solid #30363d' }}
        />
      </ReactFlow>

      <style jsx>{`
        .tree-view-canvas {
          width: 100%;
          height: 100%;
          position: relative;
        }

        /* ReactFlow Overrides to match Kether Dark Theme */
        :global(.react-flow__node) {
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        :global(.react-flow__controls) {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 8px;
        }
        :global(.react-flow__controls-button) {
          background: #161b22;
          border-bottom: 1px solid #30363d;
          fill: #8b949e;
        }
        :global(.react-flow__controls-button:hover) {
          background: #21262d;
        }
      `}</style>
    </div>
  );
};

export default TreeView;