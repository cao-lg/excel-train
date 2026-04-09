import React, { useState, useRef } from 'react';
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
  const [showTasks, setShowTasks] = useState<boolean>(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 任务列表（实际项目中可以从API获取）
  const taskList = [
    // 数据采集
    { id: 'task-1-1', title: '从CSV导入销售数据', skillPoint: '数据采集', level: '初级' },
    { id: 'task-1-2', title: 'API数据抓取与处理', skillPoint: '数据采集', level: '中级' },
    { id: 'task-1-3', title: '多源数据融合', skillPoint: '数据采集', level: '高级' },
    // 数据清洗
    { id: 'task-2-1', title: '处理缺失值', skillPoint: '数据清洗', level: '初级' },
    { id: 'task-2-2', title: '删除缺失值', skillPoint: '数据清洗', level: '初级' },
    { id: 'task-2-3', title: '线性插值填充缺失值', skillPoint: '数据清洗', level: '中级' },
    // 数据整理
    { id: 'task-3-1', title: '单元格格式设置', skillPoint: '数据整理', level: '初级' },
    { id: 'task-3-2', title: '数据转置与重组', skillPoint: '数据整理', level: '中级' },
    { id: 'task-3-3', title: '高级数据分组与汇总', skillPoint: '数据整理', level: '高级' },
    // 基础运算
    { id: 'task-4-1', title: '逻辑函数应用', skillPoint: '基础运算', level: '初级' },
    { id: 'task-4-2', title: 'AND/OR函数应用', skillPoint: '基础运算', level: '初级' },
    { id: 'task-4-3', title: '文本函数应用', skillPoint: '基础运算', level: '中级' },
    // 高级查询
    { id: 'task-5-1', title: 'VLOOKUP基础应用', skillPoint: '高级查询', level: '中级' },
    { id: 'task-5-2', title: 'INDEX-MATCH函数应用', skillPoint: '高级查询', level: '中级' },
    { id: 'task-5-3', title: 'VLOOKUP高级应用', skillPoint: '高级查询', level: '高级' },
    // 数组与公式
    { id: 'task-6-2', title: '数组入门：批量计算', skillPoint: '数组与公式', level: '初级' },
    { id: 'task-6-3', title: '数组求和与条件计算', skillPoint: '数组与公式', level: '中级' },
    { id: 'task-6-1', title: '数组公式基础', skillPoint: '数组与公式', level: '高级' },
    // 数据透视分析
    { id: 'task-7-1', title: '创建基础数据透视表', skillPoint: '数据透视分析', level: '中级' },
    { id: 'task-7-2', title: '数据透视表高级应用', skillPoint: '数据透视分析', level: '中级' },
    { id: 'task-7-3', title: '数据透视表计算字段与分组', skillPoint: '数据透视分析', level: '高级' },
    // 统计推断
    { id: 'task-8-2', title: '基础统计量计算', skillPoint: '统计推断', level: '初级' },
    { id: 'task-8-3', title: '相关性分析', skillPoint: '统计推断', level: '中级' },
    { id: 'task-8-1', title: '描述性统计分析', skillPoint: '统计推断', level: '高级' },
    // 预测模型
    { id: 'task-9-1', title: '移动平均预测', skillPoint: '预测模型', level: '高级' },
    { id: 'task-9-2', title: '指数平滑预测', skillPoint: '预测模型', level: '中级' },
    { id: 'task-9-3', title: '季节性波动分析', skillPoint: '预测模型', level: '高级' },
    { id: 'task-9-4', title: '线性回归预测', skillPoint: '预测模型', level: '高级' },
    // 图表制作
    { id: 'task-10-1', title: '基础图表制作', skillPoint: '图表制作', level: '初级' },
    { id: 'task-10-2', title: '高级图表制作', skillPoint: '图表制作', level: '中级' },
    { id: 'task-10-3', title: '热力图与双坐标轴图表', skillPoint: '图表制作', level: '高级' },
    // 动态仪表盘
    { id: 'task-11-2', title: '数据验证下拉菜单', skillPoint: '动态仪表盘', level: '初级' },
    { id: 'task-11-1', title: '表单控件关联图表', skillPoint: '动态仪表盘', level: '中级' },
    { id: 'task-11-3', title: '交互式KPI仪表盘', skillPoint: '动态仪表盘', level: '高级' },
    // 商业报告
    { id: 'task-12-2', title: '基础报告结构', skillPoint: '商业报告', level: '初级' },
    { id: 'task-12-3', title: '对比分析报告', skillPoint: '商业报告', level: '中级' },
    { id: 'task-12-1', title: '商业报告制作', skillPoint: '商业报告', level: '高级' },
    // 综合应用
    { id: 'task-comprehensive-1', title: '电商销售数据采集与分析', skillPoint: '综合应用', level: '中级' },
    { id: 'task-comprehensive-2', title: '季度销售报表制作', skillPoint: '综合应用', level: '中级' },
    { id: 'task-comprehensive-3', title: '销售数据分析与预测', skillPoint: '综合应用', level: '高级' },
    { id: 'task-comprehensive-4', title: '学生成绩管理系统', skillPoint: '综合应用', level: '高级' },
    { id: 'task-comprehensive-5', title: '客户订单数据分析', skillPoint: '综合应用', level: '高级' },
    { id: 'task-comprehensive-6', title: '年度销售报告与仪表盘', skillPoint: '综合应用', level: '高级' }
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
    '商业报告',
    '综合应用'
  ];

  const handleTaskSelect = async (taskId: string) => {
    try {
      const taskData = await api.getTask(taskId);
      onTaskLoad(taskData);
      setShowTasks(false);
    } catch (error) {
      console.error('Error loading task:', error);
    }
  };

  const handleSkillSelect = (skill: string) => {
    const newSelectedSkill = skill === selectedSkill ? null : skill;
    setSelectedSkill(newSelectedSkill);
    setShowTasks(newSelectedSkill !== null);
    
    if (newSelectedSkill && menuRefs.current[newSelectedSkill]) {
      const rect = menuRefs.current[newSelectedSkill]?.getBoundingClientRect();
      if (rect) {
        setMenuPosition({ top: rect.bottom + 4, left: rect.left });
      }
    }
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
        {skills.map(skill => (
          <div 
            key={skill} 
            className="menu-item"
            ref={el => menuRefs.current[skill] = el}
          >
            <button 
              className="menu-button"
              onClick={() => handleSkillSelect(skill)}
            >
              {skill}
            </button>
          </div>
        ))}
      </div>
      
      {/* 全局下拉菜单 */}
      {selectedSkill && showTasks && (
        <div 
          className="sub-menu task-sub-menu"
          style={{ 
            position: 'fixed',
            top: menuPosition.top,
            left: menuPosition.left,
            margin: 0
          }}
        >
          {taskList
            .filter(task => task.skillPoint === selectedSkill)
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
  );
};

export default TopNavigation;