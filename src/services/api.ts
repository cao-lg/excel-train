// API服务层，封装与后端的通信

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
  steps: string[]; // 任务要领步骤
}

interface ValidationResult {
  success: boolean;
  results: Array<{
    cell: string;
    correct: boolean;
    errorMessage: string;
  }>;
  experience: number;
  message: string;
  achievementsUnlocked: string[];
}

interface UserProgress {
  completedTasks: string[];
  currentLevel: number;
  experience: number;
  achievements: string[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

// 获取任务数据
export async function getTask(taskId: string): Promise<TaskData> {
  try {
    // 直接使用模拟数据，避免API请求错误
    return getMockTask(taskId);
  } catch (error) {
    console.error('Error fetching task:', error);
    // 返回模拟数据作为 fallback
    return getMockTask(taskId);
  }
}

// 校验任务
export async function validateTask(_taskId: string, data: {
  userActions: any[];
  targetCells: Record<string, string>;
}): Promise<ValidationResult> {
  try {
    // 直接使用模拟数据，避免API请求错误
    return getMockValidationResult(data);
  } catch (error) {
    console.error('Error validating task:', error);
    // 返回模拟结果作为 fallback
    return getMockValidationResult(data);
  }
}

// 获取用户进度
export async function getUserProgress(userId: string): Promise<UserProgress> {
  try {
    // 直接使用模拟数据，避免API请求错误
    return getMockProgress(userId);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    // 返回模拟数据作为 fallback
    return getMockProgress(userId);
  }
}

// 更新用户进度
export async function updateUserProgress(userId: string, _data: {
  taskId: string;
  completed: boolean;
  score: number;
}): Promise<{ success: boolean; updatedProgress: UserProgress }> {
  try {
    // 直接使用模拟数据，避免API请求错误
    return {
      success: true,
      updatedProgress: getMockProgress(userId),
    };
  } catch (error) {
    console.error('Error updating user progress:', error);
    // 返回模拟结果作为 fallback
    return {
      success: true,
      updatedProgress: getMockProgress(userId),
    };
  }
}

// 获取成就列表
export async function getAchievements(): Promise<Achievement[]> {
  try {
    // 直接使用模拟数据，避免API请求错误
    return getMockAchievements();
  } catch (error) {
    console.error('Error fetching achievements:', error);
    // 返回模拟数据作为 fallback
    return getMockAchievements();
  }
}

// 模拟数据（用于开发和测试）
function getMockTask(id: string): TaskData {
  const tasks: Record<string, TaskData> = {
    'task-1-1': {
      taskId: 'task-1-1',
      skillPoint: '数据采集',
      level: '初级',
      title: '从CSV导入销售数据',
      description: '将CSV格式的销售数据导入到电子表格中，并确保数据格式正确',
      initialData: {
        sheetName: '销售数据',
        cellData: {
          'A1': { v: '日期' },
          'B1': { v: '产品' },
          'C1': { v: '销售额' },
          'A2': { v: '2023-01-01' },
          'B2': { v: '产品A' },
          'C2': { v: 1000 },
          'A3': { v: '2023-01-02' },
          'B3': { v: '产品B' },
          'C3': { v: 1500 },
          'A4': { v: '2023-01-03' },
          'B4': { v: '产品A' },
          'C4': { v: 1200 }
        },
        rowCount: 10,
        columnCount: 3
      },
      targetCells: ['C5'],
      validationRules: {
        'C5': {
          type: 'formula',
          expectedValue: 3700,
          formulaFingerprint: ['SUM']
        }
      },
      hints: ['使用SUM函数计算总销售额', '选择C2到C4的范围'],
      steps: [
        '步骤1: 观察表格数据，了解数据结构',
        '步骤2: 定位到C5单元格，准备输入求和公式',
        '步骤3: 输入"=SUM(C2:C4)"，计算总销售额',
        '步骤4: 按Enter键确认公式，检查计算结果是否正确',
        '步骤5: 提交任务，验证结果'
      ]
    },
    'task-2-1': {
      taskId: 'task-2-1',
      skillPoint: '数据清洗',
      level: '初级',
      title: '处理缺失值',
      description: '清洗销售数据中的缺失值，使用适当的方法填充或删除空值',
      initialData: {
        sheetName: '销售数据',
        cellData: {
          'A1': { v: '日期' },
          'B1': { v: '产品' },
          'C1': { v: '销售额' },
          'A2': { v: '2023-01-01' },
          'B2': { v: '产品A' },
          'C2': { v: 1000 },
          'A3': { v: '2023-01-02' },
          'B3': { v: '产品B' },
          'C3': { v: null },
          'A4': { v: '2023-01-03' },
          'B4': { v: '产品A' },
          'C4': { v: 1500 }
        },
        rowCount: 10,
        columnCount: 3
      },
      targetCells: ['C3'],
      validationRules: {
        'C3': {
          type: 'value',
          expectedValue: 1250
        }
      },
      hints: ['尝试使用AVERAGE函数计算平均值来填充缺失值', '或使用DELETE键删除整行'],
      steps: [
        '步骤1: 观察表格，发现C3单元格存在缺失值',
        '步骤2: 选择C3单元格',
        '步骤3: 输入"=AVERAGE(C2,C4)"，使用平均值填充缺失值',
        '步骤4: 按Enter键确认公式，检查计算结果是否为1250',
        '步骤5: 提交任务，验证结果'
      ]
    },
    'task-3-1': {
      taskId: 'task-3-1',
      skillPoint: '数据整理',
      level: '初级',
      title: '单元格格式设置',
      description: '为销售数据设置适当的单元格格式，使数据更加清晰易读',
      initialData: {
        sheetName: '销售数据',
        cellData: {
          'A1': { v: '日期' },
          'B1': { v: '产品' },
          'C1': { v: '销售额' },
          'A2': { v: '2023-01-01' },
          'B2': { v: '产品A' },
          'C2': { v: 1000 },
          'A3': { v: '2023-01-02' },
          'B3': { v: '产品B' },
          'C3': { v: 1500 },
          'A4': { v: '2023-01-03' },
          'B4': { v: '产品A' },
          'C4': { v: 1200 }
        },
        rowCount: 10,
        columnCount: 3
      },
      targetCells: ['C2:C4'],
      validationRules: {
        'C2': {
          type: 'format',
          expectedValue: 'currency'
        }
      },
      hints: ['使用货币格式显示销售额', '选择C2到C4范围后设置格式'],
      steps: [
        '步骤1: 选择C2到C4的单元格范围',
        '步骤2: 点击工具栏中的"数字格式"下拉菜单',
        '步骤3: 选择"货币"格式',
        '步骤4: 确认格式应用成功，销售额显示为货币格式',
        '步骤5: 提交任务，验证结果'
      ]
    }
  };
  
  return tasks[id] || tasks['task-1-1'];
}

function getMockValidationResult(data: { targetCells: Record<string, string> }): ValidationResult {
  const { targetCells } = data;
  
  let success = true;
  const results: Array<{ cell: string; correct: boolean; errorMessage: string }> = [];
  
  for (const [cell, formula] of Object.entries(targetCells)) {
    if (formula.includes('SUM') || formula.includes('AVERAGE')) {
      results.push({ cell, correct: true, errorMessage: '' });
    } else {
      results.push({ cell, correct: false, errorMessage: '请使用正确的函数' });
      success = false;
    }
  }
  
  return {
    success,
    results,
    experience: success ? 200 : 0,
    message: success ? '任务完成！' : '任务未完成，请检查您的操作',
    achievementsUnlocked: []
  };
}

function getMockProgress(_userId: string): UserProgress {
  return {
    completedTasks: ['task-1-1'],
    currentLevel: 1,
    experience: 200,
    achievements: ['first-task']
  };
}

function getMockAchievements(): Achievement[] {
  return [
    { id: 'first-task', name: '初出茅庐', description: '完成第一个任务', unlocked: true },
    { id: 'perfect-streak', name: '完美主义者', description: '一次性通过10个关卡', unlocked: false },
    { id: 'function-master', name: '函数大师', description: '正确使用15种不同函数', unlocked: false },
    { id: 'speed-star', name: '速度之星', description: '10个关卡低于平均用时', unlocked: false }
  ];
}
