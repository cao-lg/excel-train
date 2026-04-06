import React, { useState, useEffect } from 'react';

interface ErrorData {
  errorType: string;
  timestamp: number;
  cell?: string;
  value?: any;
  expected?: any;
}

interface Hint {
  id: string;
  message: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  errorTypes: string[];
}

const hints: Hint[] = [
  {
    id: 'formula-syntax',
    message: '公式语法错误，请检查括号是否匹配，函数名称是否正确',
    difficulty: 'basic',
    errorTypes: ['formulaSyntax', 'functionError']
  },
  {
    id: 'vlookup-basic',
    message: 'VLOOKUP函数语法：VLOOKUP(查找值, 表数组, 列索引, [匹配类型])',
    difficulty: 'basic',
    errorTypes: ['vlookupError']
  },
  {
    id: 'vlookup-absolute',
    message: '使用VLOOKUP时，记得使用绝对引用锁定表数组范围，例如 $D$2:$E$4',
    difficulty: 'intermediate',
    errorTypes: ['vlookupError', 'referenceError']
  },
  {
    id: 'missing-values',
    message: '处理缺失值可以使用AVERAGE函数计算平均值，或使用DELETE键删除整行',
    difficulty: 'basic',
    errorTypes: ['missingValueError']
  },
  {
    id: 'text-split',
    message: '使用文本分列功能，以指定字符为分隔符拆分数据',
    difficulty: 'basic',
    errorTypes: ['textError']
  },
  {
    id: 'sum-function',
    message: 'SUM函数用于计算数值的总和，语法：SUM(数值1, 数值2, ...)',
    difficulty: 'basic',
    errorTypes: ['sumError', 'formulaError']
  },
  {
    id: 'if-function',
    message: 'IF函数用于条件判断，语法：IF(条件, 真值, 假值)',
    difficulty: 'intermediate',
    errorTypes: ['ifError', 'logicError']
  },
  {
    id: 'array-formula',
    message: '数组公式需要按Ctrl+Shift+Enter组合键确认，用于同时计算多个单元格',
    difficulty: 'advanced',
    errorTypes: ['arrayError', 'formulaError']
  }
];

interface HintSystemProps {
  taskId: string | null;
  onHintDisplay: (hint: string) => void;
}

const HintSystem: React.FC<HintSystemProps> = ({ taskId, onHintDisplay }) => {
  const [errors, setErrors] = useState<Record<string, ErrorData[]>>({});
  const [errorCounts, setErrorCounts] = useState<Record<string, number>>({});
  const [currentHints, setCurrentHints] = useState<Hint[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [selectedHint, setSelectedHint] = useState<Hint | null>(null);

  useEffect(() => {
    if (taskId) {
      // 重置任务相关的错误计数
      setErrors(prev => ({
        ...prev,
        [taskId]: []
      }));
      setErrorCounts(prev => ({
        ...prev,
        [taskId]: 0
      }));
      setCurrentHints([]);
      setShowHint(false);
      setSelectedHint(null);
    }
  }, [taskId]);

  const recordError = (errorType: string, details?: {
    cell?: string;
    value?: any;
    expected?: any;
  }) => {
    if (!taskId) return;

    const newError: ErrorData = {
      errorType,
      timestamp: Date.now(),
      ...details
    };

    setErrors(prev => {
      const taskErrors = prev[taskId] || [];
      return {
        ...prev,
        [taskId]: [...taskErrors, newError]
      };
    });

    setErrorCounts(prev => {
      const currentCount = prev[taskId] || 0;
      const newCount = currentCount + 1;
      
      // 当错误次数达到阈值时，显示提示
      if (newCount >= 3) {
        generateHints(errorType);
      }
      
      return {
        ...prev,
        [taskId]: newCount
      };
    });
  };

  const generateHints = (errorType: string) => {
    // 根据错误类型查找相关提示
    const relevantHints = hints.filter(hint => 
      hint.errorTypes.includes(errorType)
    );

    // 按难度排序，先显示基础提示
    relevantHints.sort((a, b) => {
      const difficultyOrder = { basic: 0, intermediate: 1, advanced: 2 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });

    setCurrentHints(relevantHints);
    
    if (relevantHints.length > 0) {
      setSelectedHint(relevantHints[0]);
      setShowHint(true);
      onHintDisplay(relevantHints[0].message);
    }
  };

  const handleNextHint = () => {
    if (currentHints.length === 0 || !selectedHint) return;

    const currentIndex = currentHints.indexOf(selectedHint);
    const nextIndex = (currentIndex + 1) % currentHints.length;
    const nextHint = currentHints[nextIndex];

    setSelectedHint(nextHint);
    onHintDisplay(nextHint.message);
  };

  const handleCloseHint = () => {
    setShowHint(false);
    setSelectedHint(null);
  };

  // 模拟错误记录（用于测试）
  const handleTestError = (errorType: string) => {
    recordError(errorType, { cell: 'C3', value: '错误值', expected: 1250 });
  };

  return (
    <div className="hint-system">
      <h3>智能提示系统</h3>
      
      <div className="error-stats">
        <h4>错误统计</h4>
        <div className="stats-content">
          <p>当前任务错误次数: {taskId ? errorCounts[taskId] || 0 : 0}</p>
          {taskId && errors[taskId] && errors[taskId].length > 0 && (
            <div className="recent-errors">
              <h5>最近错误:</h5>
              <ul>
                {errors[taskId]!.slice(-3).map((error, index) => (
                  <li key={index}>
                    <span className="error-type">{error.errorType}</span>
                    {error.cell && <span className="error-cell">@{error.cell}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {showHint && selectedHint && (
        <div className="hint-modal">
          <div className="hint-content">
            <h4>提示</h4>
            <p>{selectedHint.message}</p>
            <div className="hint-actions">
              <button 
                className="hint-button next"
                onClick={handleNextHint}
                disabled={currentHints.length <= 1}
              >
                下一个提示
              </button>
              <button 
                className="hint-button close"
                onClick={handleCloseHint}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="test-section">
        <h4>测试错误</h4>
        <div className="test-buttons">
          <button onClick={() => handleTestError('formulaSyntax')}>公式语法错误</button>
          <button onClick={() => handleTestError('vlookupError')}>VLOOKUP错误</button>
          <button onClick={() => handleTestError('missingValueError')}>缺失值错误</button>
          <button onClick={() => handleTestError('sumError')}>求和错误</button>
        </div>
      </div>
    </div>
  );
};

export default HintSystem;