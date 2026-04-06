import React, { useState } from 'react';
import * as api from '../services/api';

interface UserProgress {
  completedTasks: string[];
  currentLevel: number;
  experience: number;
  achievements: string[];
}

interface TopNavigationProps {
  onTaskLoad: (task: any) => void;
  userProgress: UserProgress;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ onTaskLoad, userProgress }) => {
  const [showSkillBook, setShowSkillBook] = useState<boolean>(false);
  const [showTasks, setShowTasks] = useState<boolean>(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // 任务列表（实际项目中可以从API获取）
  const taskList = [
    { id: 'task-1-1', title: '从CSV导入销售数据', skillPoint: '数据采集', level: '初级' },
    { id: 'task-2-1', title: '处理缺失值', skillPoint: '数据清洗', level: '初级' },
    { id: 'task-2-2', title: '删除缺失值', skillPoint: '数据清洗', level: '初级' },
    { id: 'task-2-3', title: '线性插值填充缺失值', skillPoint: '数据清洗', level: '中级' },
    { id: 'task-3-1', title: '单元格格式设置', skillPoint: '数据整理', level: '初级' },
    { id: 'task-4-1', title: '逻辑函数应用', skillPoint: '基础运算', level: '初级' },
    { id: 'task-4-2', title: 'AND/OR函数应用', skillPoint: '基础运算', level: '初级' },
    { id: 'task-4-3', title: '文本函数应用', skillPoint: '基础运算', level: '中级' },
    { id: 'task-5-1', title: 'VLOOKUP基础应用', skillPoint: '高级查询', level: '中级' },
    { id: 'task-5-2', title: 'INDEX-MATCH函数应用', skillPoint: '高级查询', level: '中级' },
    { id: 'task-5-3', title: 'VLOOKUP高级应用', skillPoint: '高级查询', level: '高级' },
    { id: 'task-6-1', title: '数组公式基础', skillPoint: '数组与公式', level: '高级' },
    { id: 'task-7-1', title: '创建基础数据透视表', skillPoint: '数据透视分析', level: '中级' },
    { id: 'task-7-2', title: '数据透视表高级应用', skillPoint: '数据透视分析', level: '中级' },
    { id: 'task-8-1', title: '描述性统计分析', skillPoint: '统计推断', level: '高级' },
    { id: 'task-9-1', title: '移动平均预测', skillPoint: '预测模型', level: '高级' },
    { id: 'task-9-2', title: '指数平滑预测', skillPoint: '预测模型', level: '中级' },
    { id: 'task-9-3', title: '季节性波动分析', skillPoint: '预测模型', level: '高级' },
    { id: 'task-9-4', title: '线性回归预测', skillPoint: '预测模型', level: '高级' },
    { id: 'task-10-1', title: '基础图表制作', skillPoint: '图表制作', level: '初级' },
    { id: 'task-10-2', title: '高级图表制作', skillPoint: '图表制作', level: '中级' },
    { id: 'task-11-1', title: '表单控件关联图表', skillPoint: '动态仪表盘', level: '中级' },
    { id: 'task-12-1', title: '商业报告制作', skillPoint: '商业报告', level: '高级' }
  ];

  // 技能列表
  const skills = [
    '数据采集',
    '数据清洗',
    '数据整理',
    '基础运算',
    '高级查询',
    '数组与公式',
    '数据透视分析',
    '统计推断',
    '预测模型',
    '图表制作',
    '动态仪表盘',
    '商业报告'
  ];

  const handleTaskSelect = async (taskId: string) => {
    try {
      const taskData = await api.getTask(taskId);
      onTaskLoad(taskData);
      setShowSkillBook(false);
      setShowTasks(false);
    } catch (error) {
      console.error('Error loading task:', error);
    }
  };

  const handleSkillSelect = (skill: string) => {
    setSelectedSkill(skill === selectedSkill ? null : skill);
    setShowTasks(skill === selectedSkill ? false : true);
  };

  return (
    <div className="top-navigation">
      <div className="nav-header">
        <h1>数据炼金术师</h1>
        <div className="user-status">
          {userProgress && (
            <div className="status-info">
              <span className="level">等级: {userProgress.currentLevel}</span>
              <span className="experience">经验: {userProgress.experience}</span>
            </div>
          )}
        </div>
      </div>
      <div className="nav-menu">
        <div className="menu-item skill-book">
          <button 
            className="menu-button"
            onClick={() => setShowSkillBook(!showSkillBook)}
          >
            订单菜单
          </button>
          {showSkillBook && (
            <div className="sub-menu skill-book-menu">
              {skills.map(skill => (
                <div 
                  key={skill} 
                  className={`skill-item ${selectedSkill === skill ? 'selected' : ''}`}
                  onClick={() => handleSkillSelect(skill)}
                >
                  <span>{skill}</span>
                  {selectedSkill === skill && showTasks && (
                    <div className="task-sub-menu">
                      {taskList
                        .filter(task => task.skillPoint === skill)
                        .map(task => (
                          <div 
                            key={task.id} 
                            className="task-item"
                            onClick={() => handleTaskSelect(task.id)}
                          >
                            <span className="task-title">{task.title}</span>
                            <span className={`level-tag ${task.level === '初级' ? 'beginner' : task.level === '中级' ? 'intermediate' : 'advanced'}`}>
                              {task.level}
                            </span>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;