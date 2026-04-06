import React, { useState, useEffect } from 'react';

interface UserProgress {
  experience: number;
  level: number;
  achievements: string[];
  completedTasks: string[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress: number;
  required: number;
}

const initialProgress: UserProgress = {
  experience: 0,
  level: 1,
  achievements: [],
  completedTasks: []
};

const achievements: Achievement[] = [
  {
    id: 'first-task',
    name: '初出茅庐',
    description: '完成第一个任务',
    unlocked: false,
    progress: 0,
    required: 1
  },
  {
    id: 'perfect-streak',
    name: '完美主义者',
    description: '一次性通过10个关卡',
    unlocked: false,
    progress: 0,
    required: 10
  },
  {
    id: 'function-master',
    name: '函数大师',
    description: '正确使用15种不同函数',
    unlocked: false,
    progress: 0,
    required: 15
  },
  {
    id: 'speed-star',
    name: '速度之星',
    description: '10个关卡低于平均用时',
    unlocked: false,
    progress: 0,
    required: 10
  }
];

const levelThresholds = [
  0,      // 学徒 1
  1000,   // 炼金术士 2
  3000,   // 大炼金师 3
  6000    // 数据贤者 4+
];

const GameSystem: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements);
  const [levelName, setLevelName] = useState<string>('学徒');

  useEffect(() => {
    // 计算等级名称
    let name = '学徒';
    if (progress.experience >= 6000) {
      name = '数据贤者';
    } else if (progress.experience >= 3000) {
      name = '大炼金师';
    } else if (progress.experience >= 1000) {
      name = '炼金术士';
    }
    setLevelName(name);
  }, [progress.experience]);

  const calculateLevel = (experience: number): number => {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (experience >= levelThresholds[i]) {
        return i + 1;
      }
    }
    return 1;
  };

  const addExperience = (amount: number) => {
    setProgress(prev => {
      const newExperience = prev.experience + amount;
      const newLevel = calculateLevel(newExperience);
      return {
        ...prev,
        experience: newExperience,
        level: newLevel
      };
    });
  };

  const completeTask = (taskId: string, perfect: boolean = false, fast: boolean = false) => {
    // 基础经验值
    let baseExp = 100;
    
    // 完美奖励
    if (perfect) {
      baseExp += 100;
    }
    
    // 速度奖励
    if (fast) {
      baseExp += 30;
    }
    
    addExperience(baseExp);
    
    // 更新任务完成记录
    setProgress(prev => ({
      ...prev,
      completedTasks: [...prev.completedTasks, taskId]
    }));
    
    // 更新成就进度
    updateAchievements();
  };

  const updateAchievements = () => {
    setUserAchievements(prev => {
      return prev.map(achievement => {
        let newProgress = achievement.progress;
        let newUnlocked = achievement.unlocked;
        
        switch (achievement.id) {
          case 'first-task':
            newProgress = progress.completedTasks.length > 0 ? 1 : 0;
            newUnlocked = newProgress >= achievement.required;
            break;
          case 'perfect-streak':
            // 简化实现，实际应该跟踪连续完美完成的任务
            newProgress = Math.min(progress.completedTasks.length, achievement.required);
            newUnlocked = newProgress >= achievement.required;
            break;
          case 'function-master':
            // 简化实现，实际应该跟踪使用的不同函数
            newProgress = Math.min(Math.floor(progress.completedTasks.length * 2), achievement.required);
            newUnlocked = newProgress >= achievement.required;
            break;
          case 'speed-star':
            // 简化实现，实际应该跟踪快速完成的任务
            newProgress = Math.min(Math.floor(progress.completedTasks.length * 0.8), achievement.required);
            newUnlocked = newProgress >= achievement.required;
            break;
        }
        
        return {
          ...achievement,
          progress: newProgress,
          unlocked: newUnlocked
        };
      });
    });
  };

  // 模拟完成任务
  const handleTestComplete = () => {
    completeTask(`task-${Date.now()}`, true, true);
  };

  return (
    <div className="game-system">
      <h3>游戏状态</h3>
      
      <div className="player-status">
        <div className="level-info">
          <span className="level-name">{levelName}</span>
          <span className="level-number">Lv.{progress.level}</span>
        </div>
        <div className="experience-bar">
          <div 
            className="experience-fill" 
            style={{ 
              width: `${Math.min(100, (progress.experience % 1000) / 10)}%` 
            }}
          ></div>
          <span className="experience-text">
            {progress.experience} / {levelThresholds[Math.min(progress.level, levelThresholds.length - 1)] + 1000}
          </span>
        </div>
      </div>

      <div className="achievements-section">
        <h4>成就</h4>
        <div className="achievements-list">
          {userAchievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-item ${achievement.unlocked ? 'unlocked' : ''}`}
            >
              <div className="achievement-icon">
                {achievement.unlocked ? '✓' : '?'}
              </div>
              <div className="achievement-info">
                <div className="achievement-name">{achievement.name}</div>
                <div className="achievement-description">{achievement.description}</div>
                <div className="achievement-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(achievement.progress / achievement.required) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {achievement.progress}/{achievement.required}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-section">
        <h4>统计</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">已完成任务</span>
            <span className="stat-value">{progress.completedTasks.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">获得经验</span>
            <span className="stat-value">{progress.experience}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">解锁成就</span>
            <span className="stat-value">
              {userAchievements.filter(a => a.unlocked).length}
            </span>
          </div>
        </div>
      </div>

      <button className="test-button" onClick={handleTestComplete}>
        测试完成任务
      </button>
    </div>
  );
};

export default GameSystem;