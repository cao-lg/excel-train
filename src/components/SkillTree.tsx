import React from 'react';

interface SkillNodeProps {
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  onSelect: () => void;
}

const SkillNode: React.FC<SkillNodeProps> = ({ title, level, completed, onSelect }) => {
  return (
    <div 
      className={`skill-node ${level} ${completed ? 'completed' : ''}`}
      onClick={onSelect}
    >
      <div className="skill-title">{title}</div>
      <div className="skill-level">{level === 'beginner' ? '初级' : level === 'intermediate' ? '中级' : '高级'}</div>
      {completed && <div className="skill-checkmark">✓</div>}
    </div>
  );
};

interface SkillDimensionProps {
  title: string;
  skills: Array<{
    id: string;
    title: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    completed: boolean;
  }>;
  onSkillSelect: (skillId: string) => void;
}

const SkillDimension: React.FC<SkillDimensionProps> = ({ title, skills, onSkillSelect }) => {
  return (
    <div className="skill-dimension">
      <h3 className="dimension-title">{title}</h3>
      <div className="skills-container">
        {skills.map(skill => (
          <SkillNode
            key={skill.id}
            title={skill.title}
            level={skill.level}
            completed={skill.completed}
            onSelect={() => onSkillSelect(skill.id)}
          />
        ))}
      </div>
    </div>
  );
};

const SkillTree: React.FC = () => {
  const skillData: Record<string, Array<{
    id: string;
    title: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    completed: boolean;
  }>> = {
    '数据治理与清洗': [
      { id: 'data-collection', title: '数据采集', level: 'beginner', completed: false },
      { id: 'data-cleaning', title: '数据清洗', level: 'beginner', completed: false },
      { id: 'data-organization', title: '数据整理', level: 'intermediate', completed: false },
    ],
    '数据处理与运算': [
      { id: 'basic-calculations', title: '基础运算', level: 'beginner', completed: false },
      { id: 'advanced-queries', title: '高级查询', level: 'intermediate', completed: false },
      { id: 'arrays-formulas', title: '数组与公式', level: 'advanced', completed: false },
    ],
    '数据分析与建模': [
      { id: 'pivot-analysis', title: '数据透视分析', level: 'intermediate', completed: false },
      { id: 'statistical-analysis', title: '统计推断', level: 'advanced', completed: false },
      { id: 'prediction-models', title: '预测模型', level: 'advanced', completed: false },
    ],
    '商业智能可视化': [
      { id: 'chart-creation', title: '图表制作', level: 'beginner', completed: false },
      { id: 'dynamic-dashboards', title: '动态仪表盘', level: 'intermediate', completed: false },
      { id: 'business-reports', title: '商业报告', level: 'advanced', completed: false },
    ],
  };

  const handleSkillSelect = (skillId: string) => {
    console.log('Selected skill:', skillId);
    // TODO: 导航到技能对应的关卡
  };

  return (
    <div className="skill-tree">
      <h2>技能树</h2>
      <div className="dimensions-container">
        {Object.entries(skillData).map(([dimension, skills]) => (
          <SkillDimension
            key={dimension}
            title={dimension}
            skills={skills}
            onSkillSelect={handleSkillSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default SkillTree;