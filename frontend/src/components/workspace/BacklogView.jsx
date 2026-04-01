import React, { useState } from 'react';
import useProjectStore from '../../store/projectStore';
import { useProjects } from '../../hooks/useProjects';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

const BacklogView = () => {
  const { backlogTasks } = useProjectStore();
  const { updateTaskStatus } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = backlogTasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.parent_functionality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return <CheckCircle2 size={16} className="text-success" />;
      case 'doing': return <Clock size={16} className="text-warning" />;
      default: return <AlertCircle size={16} className="text-muted" />;
    }
  };

  return (
    <div className="backlog-factory">
      {/* --- TABLE CONTROLS --- */}
      <div className="backlog-controls">
        <div className="search-wrapper">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search tickets or functionalities..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <button className="btn-secondary"><Filter size={14} /> Filter</button>
          <button className="btn-secondary"><ArrowUpDown size={14} /> Sort</button>
        </div>
      </div>

      {/* --- TASK TABLE --- */}
      <div className="table-container">
        <table className="kether-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Technical Task</th>
              <th>Functionality (Parent)</th>
              <th>Complexity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className={task.status}>
                <td>
                  <select 
                    className={`status-select ${task.status}`}
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                  >
                    <option value="todo">To Do</option>
                    <option value="doing">In Progress</option>
                    <option value="validating">Validating</option>
                    <option value="done">Done</option>
                  </select>
                </td>
                <td className="task-title-cell">
                  <strong>{task.title}</strong>
                  <span className="task-strategy">{task.strategy?.substring(0, 60)}...</span>
                </td>
                <td>
                  <span className="parent-badge">{task.parent_functionality}</span>
                </td>
                <td>
                  <div className="complexity-meter">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`bar ${i < task.complexity / 2 ? 'filled' : ''}`}></div>
                    ))}
                  </div>
                </td>
                <td>
                  <button className="icon-btn"><MoreHorizontal size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTasks.length === 0 && (
          <div className="empty-state">No tickets found matching your orchestration criteria.</div>
        )}
      </div>

      <style jsx>{`
        .backlog-factory { display: flex; flex-direction: column; gap: 20px; height: 100%; }
        
        .backlog-controls { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
        
        .search-wrapper { 
          flex: 1; display: flex; align-items: center; gap: 10px; 
          background: #0d1117; border: 1px solid #30363d; 
          padding: 8px 15px; border-radius: 6px; 
        }
        .search-wrapper input { background: none; border: none; color: #f0f6fc; width: 100%; outline: none; font-size: 0.9rem; }
        
        .filter-group { display: flex; gap: 10px; }
        .btn-secondary { 
          background: #21262d; border: 1px solid #30363d; color: #c9d1d9; 
          padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; 
          display: flex; align-items: center; gap: 6px; cursor: pointer;
        }

        .table-container { 
          background: #161b22; border: 1px solid #30363d; border-radius: 8px; 
          overflow: hidden; flex: 1; overflow-y: auto; 
        }

        .kether-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
        .kether-table th { background: #0d1117; padding: 12px 15px; color: #8b949e; font-weight: 600; border-bottom: 1px solid #30363d; }
        .kether-table td { padding: 12px 15px; border-bottom: 1px solid #21262d; vertical-align: middle; }
        
        .task-title-cell { display: flex; flex-direction: column; gap: 4px; }
        .task-strategy { font-size: 0.75rem; color: #8b949e; font-style: italic; }

        .parent-badge { background: #23863626; color: #3fb950; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; border: 1px solid #2386364d; }

        .status-select { 
          background: #0d1117; color: #f0f6fc; border: 1px solid #30363d; 
          padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; outline: none; 
        }
        .status-select.done { border-color: #238636; color: #3fb950; }
        .status-select.doing { border-color: #d29922; color: #d29922; }

        .complexity-meter { display: flex; gap: 3px; }
        .bar { width: 4px; height: 12px; background: #30363d; border-radius: 1px; }
        .bar.filled { background: #58a6ff; }

        .empty-state { padding: 40px; text-align: center; color: #8b949e; }
        .icon-btn { background: none; border: none; color: #8b949e; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default BacklogView;