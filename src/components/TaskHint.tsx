import React, { useState, useRef, useEffect } from 'react';
import './../styles/task-hint.css';

interface TaskHintProps {
  taskData: any | null;
  onClose: () => void;
  onSubmit?: () => void;
}

const TaskHint: React.FC<TaskHintProps> = ({ taskData, onClose, onSubmit }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(true);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const hintRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (taskData) {
      const centerX = window.innerWidth / 2 - 150;
      const centerY = window.innerHeight / 2 - 200;
      setPosition({ x: centerX, y: centerY });
    }
  }, [taskData]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === hintRef.current || hintRef.current?.contains(e.target as Node)) {
      setIsDragging(true);
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, startPos]);

  if (!taskData) return null;

  return (
    <div 
      ref={hintRef}
      className="task-hint"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="task-hint-header">
        <h3>{taskData.title}</h3>
        <div className="task-hint-controls">
          <button 
            className="task-hint-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '−' : '+'}
          </button>
          <button 
            className="task-hint-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="task-hint-content">
          <p className="task-description">{taskData.description}</p>
          <div className="task-steps">
            <h4>要领步骤：</h4>
            <ol>
              {taskData.steps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="task-hints">
            <h4>提示：</h4>
            <ul>
              {taskData.hints.map((hint: string, index: number) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
          <div className="task-submit">
            <button 
              className="task-submit-button"
              onClick={onSubmit}
            >
              提交任务
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskHint;