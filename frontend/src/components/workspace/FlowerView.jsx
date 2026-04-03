import React, { useMemo, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import useProjectStore from '../../store/projectStore';

const FlowerView = () => {
  const { projectTree, setSelectedNode } = useProjectStore();
  const containerRef = useRef(null);
  const graphRef = useRef(null);

  // --- DATA TRANSFORMER ---
  // Converts the nested recursive tree into a flat { nodes, links } format for the graph
  const graphData = useMemo(() => {
    if (!projectTree) return { nodes: [], links: [] };

    const nodes = [];
    const links = [];

    const traverse = (node, level = 1) => {
      // Color coding based on the 5-layer hierarchy
      const colors = {
        1: '#58a6ff', // Project (Blue)
        2: '#bc8cff', // Functionality (Purple)
        3: '#3fb950', // Functional Task (Green)
        4: '#d29922', // Technical Task (Orange)
        5: '#f85149'  // ToDo (Red)
      };

      nodes.push({
        id: node.id,
        name: node.name,
        level: level,
        color: colors[level] || '#8b949e',
        val: 10 / level // Higher levels are physically larger
      });

      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          links.push({ source: node.id, target: child.id });
          traverse(child, level + 1);
        });
      }
    };

    traverse(projectTree);
    return { nodes, links };
  }, [projectTree]);

  // Center the graph on mount/update
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-150); // Push nodes apart
      graphRef.current.d3Force('center').x(0).y(0);
    }
  }, [graphData]);

  return (
    <div className="flower-view-container" ref={containerRef}>
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeLabel={(node) => `Lvl ${node.level}: ${node.name}`}
        nodeColor={(node) => node.color}
        nodeRelSize={6}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        linkColor={() => '#30363d'}
        onNodeClick={(node) => setSelectedNode(node)}
        backgroundColor="rgba(0,0,0,0)" // Transparent to show Workspace gradient
        width={containerRef.current?.clientWidth}
        height={containerRef.current?.clientHeight}
        
        // Node Custom Drawing (Labels)
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Inter, sans-serif`;
          
          // Draw Circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color;
          ctx.fill();

          // Draw Text
          if (globalScale > 1.5) { // Only show text when zoomed in
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#c9d1d9';
            ctx.fillText(label, node.x, node.y + 10);
          }
        }}
      />

      <div className="legend">
        <div className="legend-item"><span className="dot p1"></span> Project</div>
        <div className="legend-item"><span className="dot p2"></span> Functionality</div>
        <div className="legend-item"><span className="dot p3"></span> Logic</div>
        <div className="legend-item"><span className="dot p4"></span> Tech</div>
        <div className="legend-item"><span className="dot p5"></span> ToDo</div>
      </div>

      <style jsx>{`
        .flower-view-container {
          width: 100%;
          height: 100%;
          cursor: grab;
        }

        .flower-view-container:active { cursor: grabbing; }

        .legend {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: rgba(22, 27, 34, 0.8);
          backdrop-filter: blur(4px);
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #30363d;
          display: flex;
          flex-direction: column;
          gap: 5px;
          pointer-events: none;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
          color: #8b949e;
        }

        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .p1 { background: #58a6ff; }
        .p2 { background: #bc8cff; }
        .p3 { background: #3fb950; }
        .p4 { background: #d29922; }
        .p5 { background: #f85149; }
      `}</style>
    </div>
  );
};

export default FlowerView;