import React, { useState } from 'react';
import * as api from '../services/api';

interface TaskData {
  taskId: string;
  skillPoint: string;
  level: string;
  title: string;
  description: string;
  initialData: {
    sheetName: string;
    cellData: Record<string, { v: any }>;
    rowCount: number;
    columnCount: number;
  };
  targetCells: string[];
  validationRules: Record<string, {
    type: string;
    expectedValue?: any;
    formulaFingerprint?: string[];
  }>;
  hints: string[];
  steps: string[];
}

// 任务列表（实际项目中可以从API获取）
const taskList = [
  { id: 'task-1-1', title: '从CSV导入销售数据', skillPoint: '数据采集', level: '初级' },
  { id: 'task-2-1', title: '处理缺失值', skillPoint: '数据清洗', level: '初级' },
  { id: 'task-3-1', title: '单元格格式设置', skillPoint: '数据整理', level: '初级' },
  { id: 'task-4-1', title: '逻辑函数应用', skillPoint: '基础运算', level: '初级' },
  { id: 'task-5-1', title: 'VLOOKUP基础应用', skillPoint: '高级查询', level: '中级' },
  { id: 'task-6-1', title: '数组公式基础', skillPoint: '数组与公式', level: '高级' },
  { id: 'task-7-1', title: '创建基础数据透视表', skillPoint: '数据透视分析', level: '中级' },
  { id: 'task-8-1', title: '描述性统计分析', skillPoint: '统计推断', level: '高级' },
  { id: 'task-9-1', title: '移动平均预测', skillPoint: '预测模型', level: '高级' },
  { id: 'task-10-1', title: '基础图表制作', skillPoint: '图表制作', level: '初级' },
  { id: 'task-11-1', title: '表单控件关联图表', skillPoint: '动态仪表盘', level: '中级' },
  { id: 'task-12-1', title: '商业报告制作', skillPoint: '商业报告', level: '高级' }
];

interface TaskSystemProps {
  onTaskLoad: (task: TaskData) => void;
}

const TaskSystem: React.FC<TaskSystemProps> = ({ onTaskLoad }) => {
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleTaskSelect = async (taskId: string) => {
    setLoading(true);
    try {
      const taskData = await api.getTask(taskId);
      setSelectedTask(taskData);
      onTaskLoad(taskData);
    } catch (error) {
      console.error('Error loading task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-system">
      <h3>任务列表</h3>
      <div className="task-list">
        {taskList.map(task => (
          <div 
            key={task.id} 
            className={`task-item ${selectedTask?.taskId === task.id ? 'selected' : ''}`}
            onClick={() => handleTaskSelect(task.id)}
          >
            <div className="task-title">{task.title}</div>
            <div className="task-info">
              <span className="skill-point">{task.skillPoint}</span>
              <span className={`level ${task.level === '初级' ? 'beginner' : task.level === '中级' ? 'intermediate' : 'advanced'}`}>
                {task.level}
              </span>
            </div>
          </div>
        ))}
      </div>

      {loading && <div className="loading">加载中...</div>}

      {selectedTask && (
        <div className="task-details">
          <h4>任务详情</h4>
          <div className="task-description">
            <p>{selectedTask.description}</p>
          </div>
          <div className="task-steps">
            <h5>要领步骤：</h5>
            <ol>
              {selectedTask.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="task-hints">
            <h5>提示：</h5>
            <ul>
              {selectedTask.hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
          <button className="submit-button">提交任务</button>
        </div>
      )}
    </div>
  );
};

export default TaskSystem;