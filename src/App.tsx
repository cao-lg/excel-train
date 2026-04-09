import { useState, useRef } from 'react';
import UniverSpreadsheetOptimized, { UniverSpreadsheetRef } from './components/UniverSpreadsheetOptimized';
import TopNavigation from './components/TopNavigation';
import TaskHint from './components/TaskHint';
import ValidationFeedback from './components/ValidationFeedback';
import './styles/top-navigation.css';
import './styles/app.css';

interface PracticeRecord {
  taskId: string;
  attemptCount: number;
  firstTimeSuccess: boolean;
  completedAt: string;
}

interface TaskProgress {
  taskId: string;
  practiceCount: number;
  records: PracticeRecord[];
  isMastered: boolean;
}

interface UserProgress {
  completedTasks: string[];
  currentLevel: number;
  experience: number;
  achievements: string[];
  taskProgress: Record<string, TaskProgress>;
}

function App() {
  const [currentTask, setCurrentTask] = useState<any>(null);
  const spreadsheetRef = useRef<UniverSpreadsheetRef>(null);
  const [validationFeedback, setValidationFeedback] = useState<{
    isVisible: boolean;
    isCorrect: boolean;
    message: string;
    details: string[];
  }>({
    isVisible: false,
    isCorrect: false,
    message: '',
    details: []
  });
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedTasks: [],
    currentLevel: 1,
    experience: 0,
    achievements: [],
    taskProgress: {}
  });

  const handleTaskLoad = (task: any) => {
    setCurrentTask(task);
  };

  const handleTaskSubmit = async (task: any) => {
    try {
      // 1. 从电子表格中获取用户的答案
      if (!spreadsheetRef.current) {
        setValidationFeedback({
          isVisible: true,
          isCorrect: false,
          message: '电子表格尚未加载完成，请稍后再试',
          details: []
        });
        return;
      }
      
      const userAnswers = spreadsheetRef.current.getTargetCellsValues([]);
      const userFormulas = spreadsheetRef.current.getTargetCellsFormulas([]);
      
      console.log('用户答案:', userAnswers);
      console.log('用户公式:', userFormulas);
      console.log('验证规则:', task.validationRules);
      
      // 2. 使用验证规则检查答案 - 验证所有在 validationRules 中定义的单元格
      const validationDetails: string[] = [];
      let allCorrect = true;
      
      for (const [cell, rule] of Object.entries(task.validationRules)) {
        const userValue = userAnswers[cell];
        const userFormula = userFormulas[cell];
        let isCorrect = false;
        let errorMessage = '';
        
        // 根据不同的验证类型进行验证
        switch (rule.type) {
          case 'value':
            // 验证值是否匹配预期值
            // 处理数值比较，允许一定的精度误差
            const expected = rule.expectedValue;
            if (typeof expected === 'number' && typeof userValue === 'number') {
              isCorrect = Math.abs(expected - userValue) < 0.01;
            } else {
              isCorrect = expected === userValue;
            }
            if (!isCorrect) {
              errorMessage = `答案错误，预期值为 ${rule.expectedValue}`;
            }
            break;
          case 'formula':
          case 'formula_value':
            // 验证值是否匹配预期值
            const expectedValue = rule.expectedValue;
            let valueCorrect = false;
            if (typeof expectedValue === 'number' && typeof userValue === 'number') {
              valueCorrect = Math.abs(expectedValue - userValue) < 0.01;
            } else {
              valueCorrect = expectedValue === userValue;
            }
            
            // 验证公式是否正确（如果有公式指纹要求）
            let formulaCorrect = true;
            if (rule.formulaFingerprint && rule.formulaFingerprint.length > 0) {
              formulaCorrect = rule.formulaFingerprint.every((func: string) => 
                userFormula && userFormula.toUpperCase().includes(func.toUpperCase())
              );
            }
            
            isCorrect = valueCorrect && formulaCorrect;
            
            if (!valueCorrect) {
              errorMessage = `答案错误，预期值为 ${expectedValue}`;
            } else if (!formulaCorrect) {
              errorMessage = `公式错误，需要使用 ${rule.formulaFingerprint?.join('、')} 函数`;
            }
            break;
          case 'format':
            // 格式验证暂时简化处理
            isCorrect = true;
            break;
          default:
            // 默认检查值是否存在
            isCorrect = userValue !== null && userValue !== undefined && userValue !== '';
            if (!isCorrect) {
              errorMessage = '请填写该单元格';
            }
        }
        
        if (isCorrect) {
          validationDetails.push(`✅ ${cell}: 答案正确`);
        } else {
          validationDetails.push(`❌ ${cell}: ${errorMessage}`);
          allCorrect = false;
        }
      }
      
      // 3. 处理验证结果
      if (allCorrect) {
        // 4. 计算积分奖励
        const experienceReward = task.level === '初级' ? 100 : task.level === '中级' ? 200 : 300;
        
        // 5. 更新任务进度记录
        const currentTaskProgress = userProgress.taskProgress[task.taskId] || {
          taskId: task.taskId,
          practiceCount: 0,
          records: [] as PracticeRecord[],
          isMastered: false
        };
        
        const isFirstTime = !userProgress.completedTasks.includes(task.taskId);
        const newPracticeRecord: PracticeRecord = {
          taskId: task.taskId,
          attemptCount: 1,
          firstTimeSuccess: isFirstTime,
          completedAt: new Date().toISOString()
        };
        
        const newTaskProgress: TaskProgress = {
          ...currentTaskProgress,
          practiceCount: currentTaskProgress.practiceCount + 1,
          records: [...currentTaskProgress.records, newPracticeRecord],
          isMastered: currentTaskProgress.practiceCount + 1 >= 3
        };
        
        const newTaskProgressMap = {
          ...userProgress.taskProgress,
          [task.taskId]: newTaskProgress
        };
        
        // 6. 更新用户进度
        const newCompletedTasks = isFirstTime 
          ? [...userProgress.completedTasks, task.taskId]
          : userProgress.completedTasks;
        const newExperience = userProgress.experience + experienceReward;
        const newLevel = Math.floor(newExperience / 1000) + 1;
        
        setUserProgress({
          completedTasks: newCompletedTasks,
          currentLevel: newLevel,
          experience: newExperience,
          achievements: userProgress.achievements,
          taskProgress: newTaskProgressMap
        });
        
        // 7. 显示验证反馈
        const masteryMessage = newTaskProgress.isMastered 
          ? '🎉 恭喜！你已经掌握了这个技能！' 
          : `还需练习 ${3 - newTaskProgress.practiceCount} 次即可掌握`;
        
        setValidationFeedback({
          isVisible: true,
          isCorrect: true,
          message: '任务提交成功！恭喜你完成了任务！',
          details: [
            ...validationDetails,
            `获得经验值: +${experienceReward}`,
            `当前等级: ${newLevel}`,
            `当前经验: ${newExperience}`,
            `练习次数: ${newTaskProgress.practiceCount}`,
            masteryMessage,
            '继续加油，挑战更多任务！'
          ]
        });
      } else {
        setValidationFeedback({
          isVisible: true,
          isCorrect: false,
          message: '任务提交失败，请检查你的答案是否正确',
          details: [
            ...validationDetails,
            '参考任务提示中的要领步骤',
            '确保所有目标单元格都已正确填写'
          ]
        });
      }
    } catch (error) {
      console.error('提交任务时出错:', error);
      setValidationFeedback({
        isVisible: true,
        isCorrect: false,
        message: '提交任务时出错，请重试',
        details: []
      });
    }
  };

  return (
    <div className="app">
      <TopNavigation 
        onTaskLoad={handleTaskLoad} 
        userProgress={userProgress}
      />
      <main className="app-main">
        <div className="spreadsheet-container">
          <div className="univer-wrapper">
            <UniverSpreadsheetOptimized taskData={currentTask} ref={spreadsheetRef as any} />
          </div>
        </div>
      </main>
      {currentTask && (
        <TaskHint 
          taskData={currentTask} 
          onClose={() => setCurrentTask(null)} 
          onSubmit={() => handleTaskSubmit(currentTask)}
        />
      )}
      <ValidationFeedback 
        isVisible={validationFeedback.isVisible}
        isCorrect={validationFeedback.isCorrect}
        message={validationFeedback.message}
        details={validationFeedback.details}
        onClose={() => setValidationFeedback({...validationFeedback, isVisible: false})}
      />
      <footer className="app-footer">
        <p>© 2026 数据炼金术师 - Excel实训游戏平台</p>
      </footer>
    </div>
  );
}

export default App