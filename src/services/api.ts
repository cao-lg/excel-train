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
    tolerance?: number;
    format?: string;
  }>;
  hints: string[];
  steps: string[];
}

interface ValidationResult {
  success: boolean;
  results: Array<{
    cell: string;
    correct: boolean;
    errorType?: string;
    errorMessage: string;
    suggestion?: string;
    actualValue?: any;
    expectedValue?: any;
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
    return getMockTask(taskId);
  } catch (error) {
    console.error('Error fetching task:', error);
    return getMockTask(taskId);
  }
}

// 校验任务
export async function validateTask(_taskId: string, data: {
  userActions: any[];
  targetCells: Record<string, any>;
  cellValues?: Record<string, any>;
  formulas?: Record<string, string>;
}): Promise<ValidationResult> {
  try {
    return getMockValidationResult(_taskId, data);
  } catch (error) {
    console.error('Error validating task:', error);
    return getMockValidationResult(_taskId, data);
  }
}

// 获取用户进度
export async function getUserProgress(userId: string): Promise<UserProgress> {
  try {
    return getMockProgress(userId);
  } catch (error) {
    console.error('Error fetching user progress:', error);
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
    return {
      success: true,
      updatedProgress: getMockProgress(userId),
    };
  } catch (error) {
    console.error('Error updating user progress:', error);
    return {
      success: true,
      updatedProgress: getMockProgress(userId),
    };
  }
}

// 获取成就列表
export async function getAchievements(): Promise<Achievement[]> {
  try {
    return getMockAchievements();
  } catch (error) {
    console.error('Error fetching achievements:', error);
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
          type: 'formula_value',
          expectedValue: 3700,
          formulaFingerprint: ['SUM'],
          tolerance: 0.01
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
          expectedValue: 1250,
          tolerance: 0.01
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
          expectedValue: 'currency',
          format: 'currency'
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
    },
    'task-2-2': {
      taskId: 'task-2-2',
      skillPoint: '数据清洗',
      level: '初级',
      title: '删除缺失值',
      description: '识别并删除包含缺失值的行，确保数据的完整性',
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
      targetCells: ['A3:C3'],
      validationRules: {
        'A3': { type: 'value', expectedValue: '2023-01-03' }
      },
      hints: ['选择包含缺失值的整行', '使用右键菜单删除整行'],
      steps: [
        '步骤1: 观察表格，发现C3单元格存在缺失值',
        '步骤2: 选择第3行的行号，选中整行',
        '步骤3: 右键点击，在弹出的菜单中选择"删除行"',
        '步骤4: 确认删除操作，检查第3行是否被删除',
        '步骤5: 提交任务，验证结果'
      ]
    },
    'task-2-3': {
      taskId: 'task-2-3',
      skillPoint: '数据清洗',
      level: '中级',
      title: '线性插值填充缺失值',
      description: '使用线性插值方法填充缺失值，保持数据的连续性',
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
          'C4': { v: 1500 },
          'A5': { v: '2023-01-04' },
          'B5': { v: '产品B' },
          'C5': { v: 1800 }
        },
        rowCount: 10,
        columnCount: 3
      },
      targetCells: ['C3'],
      validationRules: {
        'C3': {
          type: 'value',
          expectedValue: 1250,
          tolerance: 0.01
        }
      },
      hints: ['使用线性插值公式计算缺失值', '公式：(上一个值 + 下一个值) / 2'],
      steps: [
        '步骤1: 观察表格，发现C3单元格存在缺失值',
        '步骤2: 选择C3单元格',
        '步骤3: 输入"=(C2+C4)/2"，使用线性插值计算缺失值',
        '步骤4: 按Enter键确认公式，检查计算结果是否为1250',
        '步骤5: 提交任务，验证结果'
      ]
    },
    'task-9-2': {
      taskId: 'task-9-2',
      skillPoint: '预测模型',
      level: '中级',
      title: '指数平滑预测',
      description: '使用指数平滑方法预测未来销售额，考虑时间序列的趋势',
      initialData: {
        sheetName: '销售数据',
        cellData: {
          'A1': { v: '月份' },
          'B1': { v: '销售额' },
          'C1': { v: '预测值' },
          'A2': { v: '1' },
          'B2': { v: 1000 },
          'A3': { v: '2' },
          'B3': { v: 1200 },
          'A4': { v: '3' },
          'B4': { v: 1500 },
          'A5': { v: '4' },
          'B5': { v: 1300 },
          'A6': { v: '5' },
          'B6': { v: 1600 },
          'A7': { v: '6' }
        },
        rowCount: 10,
        columnCount: 3
      },
      targetCells: ['C2:C7'],
      validationRules: {
        'C7': {
          type: 'value',
          expectedValue: 1520,
          tolerance: 1
        }
      },
      hints: ['使用指数平滑公式：α*实际值 + (1-α)*预测值', 'α通常取0.3'],
      steps: [
        '步骤1: 观察表格数据，了解时间序列结构',
        '步骤2: 在C2单元格输入B2的值作为初始预测',
        '步骤3: 在C3单元格输入"=0.3*B2+0.7*C2"',
        '步骤4: 向下拖动填充柄到C7单元格',
        '步骤5: 检查C7单元格的预测值是否为1520',
        '步骤6: 提交任务，验证结果'
      ]
    },
    'task-9-3': {
      taskId: 'task-9-3',
      skillPoint: '预测模型',
      level: '高级',
      title: '季节性波动分析',
      description: '识别和分析销售数据中的季节性波动模式',
      initialData: {
        sheetName: '销售数据',
        cellData: {
          'A1': { v: '月份' },
          'B1': { v: '销售额' },
          'C1': { v: '季节指数' },
          'A2': { v: '1' },
          'B2': { v: 1200 },
          'A3': { v: '2' },
          'B3': { v: 1100 },
          'A4': { v: '3' },
          'B4': { v: 1300 },
          'A5': { v: '4' },
          'B5': { v: 1400 },
          'A6': { v: '5' },
          'B6': { v: 1600 },
          'A7': { v: '6' },
          'B7': { v: 1800 },
          'A8': { v: '7' },
          'B8': { v: 1700 },
          'A9': { v: '8' },
          'B9': { v: 1900 },
          'A10': { v: '9' },
          'B10': { v: 1600 }
        },
        rowCount: 12,
        columnCount: 3
      },
      targetCells: ['C2:C10'],
      validationRules: {
        'C10': {
          type: 'value',
          expectedValue: 0.94,
          tolerance: 0.01
        }
      },
      hints: ['计算各月份的季节指数', '季节指数=当月销售额/月平均销售额'],
      steps: [
        '步骤1: 计算月平均销售额，在B11单元格输入"=AVERAGE(B2:B10)"',
        '步骤2: 在C2单元格输入"=B2/$B$11"，计算1月份的季节指数',
        '步骤3: 向下拖动填充柄到C10单元格',
        '步骤4: 检查C10单元格的季节指数是否为0.94',
        '步骤5: 提交任务，验证结果'
      ]
    },
    'task-9-4': {
      taskId: 'task-9-4',
      skillPoint: '预测模型',
      level: '高级',
      title: '线性回归预测',
      description: '使用线性回归方法预测未来销售额，分析趋势',
      initialData: {
        sheetName: '销售数据',
        cellData: {
          'A1': { v: '月份' },
          'B1': { v: '销售额' },
          'C1': { v: '预测值' },
          'A2': { v: '1' },
          'B2': { v: 1000 },
          'A3': { v: '2' },
          'B3': { v: 1200 },
          'A4': { v: '3' },
          'B4': { v: 1500 },
          'A5': { v: '4' },
          'B5': { v: 1300 },
          'A6': { v: '5' },
          'B6': { v: 1600 },
          'A7': { v: '6' }
        },
        rowCount: 10,
        columnCount: 3
      },
      targetCells: ['C2:C7'],
      validationRules: {
        'C7': {
          type: 'value',
          expectedValue: 1660,
          tolerance: 1
        }
      },
      hints: ['使用LINEST函数计算回归系数', '或使用趋势线功能'],
      steps: [
        '步骤1: 观察表格数据，了解时间序列结构',
        '步骤2: 选择C2:C6单元格区域',
        '步骤3: 输入数组公式"=TREND(B2:B6,A2:A6,A2:A6)"，按Ctrl+Shift+Enter确认',
        '步骤4: 在C7单元格输入"=TREND(B2:B6,A2:A6,A7)"，预测第6个月的销售额',
        '步骤5: 检查C7单元格的预测值是否为1660',
        '步骤6: 提交任务，验证结果'
      ]
    },
    'task-4-2': {
      taskId: 'task-4-2',
      skillPoint: '基础运算',
      level: '初级',
      title: 'AND/OR函数应用',
      description: '使用AND和OR函数根据多个条件计算销售业绩',
      initialData: {
        sheetName: '销售数据',
        cellData: {
          'A1': { v: '产品' },
          'B1': { v: '销售额' },
          'C1': { v: '目标达成率' },
          'D1': { v: '业绩评级' },
          'A2': { v: '产品A' },
          'B2': { v: 1200 },
          'C2': { v: 1.2 },
          'A3': { v: '产品B' },
          'B3': { v: 800 },
          'C3': { v: 0.8 },
          'A4': { v: '产品C' },
          'B4': { v: 1500 },
          'C4': { v: 1.5 },
          'A5': { v: '产品D' },
          'B5': { v: 950 },
          'C5': { v: 0.95 }
        },
        rowCount: 10,
        columnCount: 4
      },
      targetCells: ['D2:D5'],
      validationRules: {
        'D2': { type: 'value', expectedValue: '优秀' },
        'D3': { type: 'value', expectedValue: '一般' },
        'D4': { type: 'value', expectedValue: '优秀' },
        'D5': { type: 'value', expectedValue: '良好' }
      },
      hints: ['使用AND函数检查多个条件同时满足', '使用OR函数检查至少一个条件满足'],
      steps: [
        '步骤1: 观察表格数据，了解需要进行的条件判断',
        '步骤2: 在D2单元格输入"=IF(AND(B2>=1000,C2>=1.1),"优秀",IF(OR(B2>=900,C2>=0.9),"良好","一般"))"',
        '步骤3: 向下拖动填充柄到D5单元格',
        '步骤4: 检查各产品的业绩评级是否正确',
        '步骤5: 提交任务，验证结果'
      ]
    },
    'task-4-1': {
      taskId: 'task-4-1',
      skillPoint: '基础运算',
      level: '初级',
      title: '逻辑函数应用',
      description: '使用IF函数根据条件计算销售额等级',
      initialData: {
        sheetName: '销售数据',
        cellData: {
          'A1': { v: '产品' },
          'B1': { v: '销售额' },
          'C1': { v: '等级' },
          'A2': { v: '产品A' },
          'B2': { v: 1200 },
          'A3': { v: '产品B' },
          'B3': { v: 800 },
          'A4': { v: '产品C' },
          'B4': { v: 1500 },
          'A5': { v: '产品D' },
          'B5': { v: 950 }
        },
        rowCount: 10,
        columnCount: 3
      },
      targetCells: ['C2:C5'],
      validationRules: {
        'C2': { type: 'value', expectedValue: '优秀' },
        'C3': { type: 'value', expectedValue: '一般' },
        'C4': { type: 'value', expectedValue: '优秀' },
        'C5': { type: 'value', expectedValue: '良好' }
      },
      hints: ['使用IF函数进行条件判断', '销售额>=1200为优秀，>=1000为良好，否则为一般'],
      steps: [
        '步骤1: 观察表格数据，了解需要进行的条件判断',
        '步骤2: 在C2单元格输入"=IF(B2>=1200,"优秀",IF(B2>=1000,"良好","一般"))"',
        '步骤3: 向下拖动填充柄到C5单元格',
        '步骤4: 检查各产品的等级是否正确',
        '步骤5: 提交任务，验证结果'
      ]
    },
    'task-4-3': {
      taskId: 'task-4-3',
      skillPoint: '基础运算',
      level: '中级',
      title: '文本函数应用',
      description: '使用文本函数提取和处理产品信息',
      initialData: {
        sheetName: '产品数据',
        cellData: {
          'A1': { v: '产品代码' },
          'B1': { v: '产品名称' },
          'C1': { v: '类别' },
          'D1': { v: '型号' },
          'A2': { v: 'ELE-001' },
          'B2': { v: '智能手机' },
          'A3': { v: 'ELE-002' },
          'B3': { v: '笔记本电脑' },
          'A4': { v: 'FUR-001' },
          'B4': { v: '办公椅' },
          'A5': { v: 'FUR-002' },
          'B5': { v: '办公桌' }
        },
        rowCount: 10,
        columnCount: 4
      },
      targetCells: ['C2:C5', 'D2:D5'],
      validationRules: {
        'C2': { type: 'value', expectedValue: 'ELE' },
        'C3': { type: 'value', expectedValue: 'ELE' },
        'C4': { type: 'value', expectedValue: 'FUR' },
        'C5': { type: 'value', expectedValue: 'FUR' },
        'D2': { type: 'value', expectedValue: '001' },
        'D3': { type: 'value', expectedValue: '002' },
        'D4': { type: 'value', expectedValue: '001' },
        'D5': { type: 'value', expectedValue: '002' }
      },
      hints: [
        '使用LEFT函数提取类别代码',
        '使用RIGHT函数提取型号'
      ],
      steps: [
        '步骤1: 观察表格数据，了解产品代码的结构',
        '步骤2: 在C2单元格输入"=LEFT(A2,3)"，提取类别代码',
        '步骤3: 在D2单元格输入"=RIGHT(A2,3)"，提取型号',
        '步骤4: 向下拖动填充柄到C5和D5单元格',
        '步骤5: 检查提取结果是否正确',
        '步骤6: 提交任务，验证结果'
      ]
    },
    // 基础运算 - 数学函数应用
    'task-4-4': {
      taskId: 'task-4-4',
      skillPoint: '基础运算',
      level: '初级',
      title: '数学函数应用',
      description: '使用基本数学函数进行数值计算和处理',
      initialData: {
        sheetName: '数学函数',
        cellData: {
          'A1': { v: '数值1' },
          'B1': { v: '数值2' },
          'C1': { v: '求和' },
          'D1': { v: '差' },
          'E1': { v: '积' },
          'F1': { v: '商' },
          'G1': { v: '余数' },
          'H1': { v: '绝对值' },
          'I1': { v: '平方根' },
          'J1': { v: '整数部分' },
          'A2': { v: 10 },
          'B2': { v: 3 },
          'A3': { v: -15 },
          'B3': { v: 4 },
          'A4': { v: 25 },
          'B4': { v: 5 },
          'A5': { v: 17 },
          'B5': { v: 2 }
        },
        rowCount: 10,
        columnCount: 10
      },
      targetCells: ['C2:J5'],
      validationRules: {
        'C2': { type: 'value', expectedValue: 13, tolerance: 0.01 },
        'D2': { type: 'value', expectedValue: 7, tolerance: 0.01 },
        'E2': { type: 'value', expectedValue: 30, tolerance: 0.01 },
        'F2': { type: 'value', expectedValue: 3.3333, tolerance: 0.0001 },
        'G2': { type: 'value', expectedValue: 1, tolerance: 0.01 },
        'H3': { type: 'value', expectedValue: 15, tolerance: 0.01 },
        'I4': { type: 'value', expectedValue: 5, tolerance: 0.01 },
        'J5': { type: 'value', expectedValue: 8, tolerance: 0.01 }
      },
      hints: [
        '使用SUM函数计算求和',
        '使用ABS函数计算绝对值',
        '使用SQRT函数计算平方根',
        '使用INT函数取整数部分',
        '使用MOD函数计算余数'
      ],
      steps: [
        '步骤1: 在C2单元格输入"=A2+B2"，计算求和',
        '步骤2: 在D2单元格输入"=A2-B2"，计算差',
        '步骤3: 在E2单元格输入"=A2*B2"，计算积',
        '步骤4: 在F2单元格输入"=A2/B2"，计算商',
        '步骤5: 在G2单元格输入"=MOD(A2,B2)"，计算余数',
        '步骤6: 在H3单元格输入"=ABS(A3)"，计算绝对值',
        '步骤7: 在I4单元格输入"=SQRT(A4)"，计算平方根',
        '步骤8: 在J5单元格输入"=INT(A5/B5)"，取整数部分',
        '步骤9: 向下拖动填充柄，完成其他单元格的计算',
        '步骤10: 检查所有计算结果是否正确',
        '步骤11: 提交任务，验证结果'
      ]
    },
    'task-4-5': {
      taskId: 'task-4-5',
      skillPoint: '基础运算',
      level: '中级',
      title: '日期时间函数应用',
      description: '使用日期时间函数进行日期计算和处理',
      initialData: {
        sheetName: '日期函数',
        cellData: {
          'A1': { v: '日期' },
          'B1': { v: '年份' },
          'C1': { v: '月份' },
          'D1': { v: '日' },
          'E1': { v: '星期几' },
          'F1': { v: '月份名称' },
          'G1': { v: '日期差' },
          'H1': { v: '30天后' },
          'A2': { v: '2023-01-15' },
          'A3': { v: '2023-06-30' },
          'A4': { v: '2023-12-25' },
          'A5': { v: '2024-02-29' }
        },
        rowCount: 10,
        columnCount: 8
      },
      targetCells: ['B2:H5'],
      validationRules: {
        'B2': { type: 'value', expectedValue: 2023, tolerance: 0.01 },
        'C2': { type: 'value', expectedValue: 1, tolerance: 0.01 },
        'D2': { type: 'value', expectedValue: 15, tolerance: 0.01 },
        'E2': { type: 'value', expectedValue: 1, tolerance: 0.01 },
        'F2': { type: 'value', expectedValue: '一月' },
        'G2': { type: 'value', expectedValue: 0, tolerance: 0.01 },
        'H2': { type: 'value', expectedValue: '2023-02-14' },
        'B5': { type: 'value', expectedValue: 2024, tolerance: 0.01 }
      },
      hints: [
        '使用YEAR、MONTH、DAY函数提取日期 components',
        '使用WEEKDAY函数获取星期几',
        '使用TEXT函数格式化日期',
        '使用DATEDIF函数计算日期差',
        '使用EDATE函数计算未来日期'
      ],
      steps: [
        '步骤1: 在B2单元格输入"=YEAR(A2)"，提取年份',
        '步骤2: 在C2单元格输入"=MONTH(A2)"，提取月份',
        '步骤3: 在D2单元格输入"=DAY(A2)"，提取日',
        '步骤4: 在E2单元格输入"=WEEKDAY(A2)"，获取星期几',
        '步骤5: 在F2单元格输入"=TEXT(A2,"[$-404]mmmm")"，获取月份名称',
        '步骤6: 在G2单元格输入"=DATEDIF(A2,A2,"d")"，计算日期差',
        '步骤7: 在H2单元格输入"=EDATE(A2,1)"，计算30天后的日期',
        '步骤8: 向下拖动填充柄，完成其他单元格的计算',
        '步骤9: 检查所有计算结果是否正确',
        '步骤10: 提交任务，验证结果'
      ]
    },
    'task-4-6': {
      taskId: 'task-4-6',
      skillPoint: '基础运算',
      level: '中级',
      title: '查找与引用函数应用',
      description: '使用查找与引用函数进行数据查询和引用',
      initialData: {
        sheetName: '查找函数',
        cellData: {
          'A1': { v: '产品ID' },
          'B1': { v: '产品名称' },
          'C1': { v: '价格' },
          'D1': { v: '库存' },
          'A2': { v: 'P001' },
          'B2': { v: '产品A' },
          'C2': { v: 100 },
          'D2': { v: 50 },
          'A3': { v: 'P002' },
          'B3': { v: '产品B' },
          'C3': { v: 150 },
          'D3': { v: 30 },
          'A4': { v: 'P003' },
          'B4': { v: '产品C' },
          'C4': { v: 200 },
          'D4': { v: 20 },
          'A5': { v: 'P004' },
          'B5': { v: '产品D' },
          'C5': { v: 250 },
          'D5': { v: 15 },
          'F1': { v: '查询' },
          'F2': { v: '产品ID' },
          'G2': { v: 'P002' },
          'F3': { v: '产品名称' },
          'F4': { v: '价格' },
          'F5': { v: '库存' },
          'F6': { v: '总价值' }
        },
        rowCount: 10,
        columnCount: 8
      },
      targetCells: ['G3:G6'],
      validationRules: {
        'G3': { type: 'value', expectedValue: '产品B' },
        'G4': { type: 'value', expectedValue: 150, tolerance: 0.01 },
        'G5': { type: 'value', expectedValue: 30, tolerance: 0.01 },
        'G6': { type: 'value', expectedValue: 4500, tolerance: 0.01 }
      },
      hints: [
        '使用VLOOKUP函数查找产品信息',
        '使用INDEX-MATCH函数组合进行查找',
        '使用查找结果进行进一步计算'
      ],
      steps: [
        '步骤1: 在G3单元格输入"=VLOOKUP(G2,A2:D5,2,FALSE)"，查找产品名称',
        '步骤2: 在G4单元格输入"=VLOOKUP(G2,A2:D5,3,FALSE)"，查找价格',
        '步骤3: 在G5单元格输入"=VLOOKUP(G2,A2:D5,4,FALSE)"，查找库存',
        '步骤4: 在G6单元格输入"=G4*G5"，计算总价值',
        '步骤5: 尝试修改G2中的产品ID，验证查找功能',
        '步骤6: 检查所有计算结果是否正确',
        '步骤7: 提交任务，验证结果'
      ]
    },
    'task-4-7': {
      taskId: 'task-4-7',
      skillPoint: '基础运算',
      level: '高级',
      title: '统计函数基础',
      description: '使用基础统计函数进行数据分析',
      initialData: {
        sheetName: '统计函数',
        cellData: {
          'A1': { v: '销售数据' },
          'B1': { v: '区域' },
          'C1': { v: '销售额' },
          'A2': { v: '1' },
          'B2': { v: '华东' },
          'C2': { v: 1200 },
          'A3': { v: '2' },
          'B3': { v: '华东' },
          'C3': { v: 1500 },
          'A4': { v: '3' },
          'B4': { v: '华北' },
          'C4': { v: 1000 },
          'A5': { v: '4' },
          'B5': { v: '华北' },
          'C5': { v: 1300 },
          'A6': { v: '5' },
          'B6': { v: '华南' },
          'C6': { v: 900 },
          'A7': { v: '6' },
          'B7': { v: '华南' },
          'C7': { v: 1100 },
          'E1': { v: '统计分析' },
          'E2': { v: '总销售额' },
          'E3': { v: '平均销售额' },
          'E4': { v: '最大销售额' },
          'E5': { v: '最小销售额' },
          'E6': { v: '销售额标准差' },
          'E7': { v: '华东地区平均销售额' }
        },
        rowCount: 15,
        columnCount: 6
      },
      targetCells: ['F2:F7'],
      validationRules: {
        'F2': { type: 'value', expectedValue: 7000, tolerance: 0.01 },
        'F3': { type: 'value', expectedValue: 1166.67, tolerance: 0.01 },
        'F4': { type: 'value', expectedValue: 1500, tolerance: 0.01 },
        'F5': { type: 'value', expectedValue: 900, tolerance: 0.01 },
        'F6': { type: 'value', expectedValue: 216.02, tolerance: 0.01 },
        'F7': { type: 'value', expectedValue: 1350, tolerance: 0.01 }
      },
      hints: [
        '使用SUM函数计算总销售额',
        '使用AVERAGE函数计算平均值',
        '使用MAX和MIN函数查找最大值和最小值',
        '使用STDEV函数计算标准差',
        '使用AVERAGEIF函数按条件计算平均值'
      ],
      steps: [
        '步骤1: 在F2单元格输入"=SUM(C2:C7)"，计算总销售额',
        '步骤2: 在F3单元格输入"=AVERAGE(C2:C7)"，计算平均销售额',
        '步骤3: 在F4单元格输入"=MAX(C2:C7)"，查找最大销售额',
        '步骤4: 在F5单元格输入"=MIN(C2:C7)"，查找最小销售额',
        '步骤5: 在F6单元格输入"=STDEV(C2:C7)"，计算销售额标准差',
        '步骤6: 在F7单元格输入"=AVERAGEIF(B2:B7,"华东",C2:C7)"，计算华东地区平均销售额',
        '步骤7: 检查所有计算结果是否正确',
        '步骤8: 提交任务，验证结果'
      ]
    },
    'task-4-8': {
      taskId: 'task-4-8',
      skillPoint: '基础运算',
      level: '高级',
      title: '高级数学函数应用',
      description: '使用高级数学函数进行复杂计算',
      initialData: {
        sheetName: '高级数学',
        cellData: {
          'A1': { v: '数值' },
          'B1': { v: '正弦值' },
          'C1': { v: '余弦值' },
          'D1': { v: '正切值' },
          'E1': { v: '自然对数' },
          'F1': { v: '指数值' },
          'G1': { v: '幂运算' },
          'H1': { v: '随机数' },
          'A2': { v: 0 },
          'A3': { v: 45 },
          'A4': { v: 90 },
          'A5': { v: 1 },
          'A6': { v: 2 },
          'A7': { v: 10 }
        },
        rowCount: 10,
        columnCount: 8
      },
      targetCells: ['B2:H7'],
      validationRules: {
        'B2': { type: 'value', expectedValue: 0, tolerance: 0.01 },
        'B3': { type: 'value', expectedValue: 0.7071, tolerance: 0.0001 },
        'B4': { type: 'value', expectedValue: 1, tolerance: 0.01 },
        'E5': { type: 'value', expectedValue: 0, tolerance: 0.01 },
        'E6': { type: 'value', expectedValue: 0.6931, tolerance: 0.0001 },
        'F5': { type: 'value', expectedValue: 2.7183, tolerance: 0.0001 },
        'G7': { type: 'value', expectedValue: 100, tolerance: 0.01 }
      },
      hints: [
        '使用SIN、COS、TAN函数计算三角函数值',
        '使用LN函数计算自然对数',
        '使用EXP函数计算指数值',
        '使用POWER函数进行幂运算',
        '使用RAND函数生成随机数'
      ],
      steps: [
        '步骤1: 在B2单元格输入"=SIN(RADIANS(A2))"，计算正弦值',
        '步骤2: 在C2单元格输入"=COS(RADIANS(A2))"，计算余弦值',
        '步骤3: 在D2单元格输入"=TAN(RADIANS(A2))"，计算正切值',
        '步骤4: 在E5单元格输入"=LN(A5)"，计算自然对数',
        '步骤5: 在F5单元格输入"=EXP(A5)"，计算指数值',
        '步骤6: 在G7单元格输入"=POWER(A7,2)"，进行幂运算',
        '步骤7: 在H2单元格输入"=RAND()"，生成随机数',
        '步骤8: 向下拖动填充柄，完成其他单元格的计算',
        '步骤9: 检查所有计算结果是否正确',
        '步骤10: 提交任务，验证结果'
      ]
    },
    'task-5-1': {
      taskId: 'task-5-1',
      skillPoint: '高级查询',
      level: '中级',
      title: 'VLOOKUP基础应用',
      description: '使用VLOOKUP函数根据产品ID查询价格',
      initialData: {
        sheetName: '产品数据',
        cellData: {
          'A1': { v: '产品ID' },
          'B1': { v: '产品名称' },
          'C1': { v: '价格' },
          'A2': { v: 'P001' },
          'B2': { v: '产品A' },
          'C2': { v: 100 },
          'A3': { v: 'P002' },
          'B3': { v: '产品B' },
          'C3': { v: 150 },
          'A4': { v: 'P003' },
          'B4': { v: '产品C' },
          'C4': { v: 200 },
          'A5': { v: 'P004' },
          'B5': { v: '产品D' },
          'C5': { v: 250 },
          'E1': { v: '查询ID' },
          'F1': { v: '查询结果' },
          'E2': { v: 'P003' }
        },
        rowCount: 10,
        columnCount: 6
      },
      targetCells: ['F2'],
      validationRules: {
        'F2': {
          type: 'formula_value',
          expectedValue: 200,
          formulaFingerprint: ['VLOOKUP'],
          tolerance: 0.01
        }
      },
      hints: ['使用VLOOKUP函数进行精确匹配查询', 'VLOOKUP(查找值, 查找范围, 返回列, 匹配类型)'],
      steps: [
        '步骤1: 观察表格数据，了解查询需求',
        '步骤2: 在F2单元格输入"=VLOOKUP(E2,A2:C5,3,FALSE)"',
        '步骤3: 按Enter键确认公式，检查查询结果是否为200',
        '步骤4: 尝试修改E2单元格的查询ID，验证查询功能是否正常',
        '步骤5: 提交任务，验证结果'
      ]
    },
    'task-5-2': {
      taskId: 'task-5-2',
      skillPoint: '高级查询',
      level: '中级',
      title: 'INDEX-MATCH函数应用',
      description: '使用INDEX-MATCH函数组合进行高级查询',
      initialData: {
        sheetName: '产品数据',
        cellData: {
          'A1': { v: '产品ID' },
          'B1': { v: '产品名称' },
          'C1': { v: '价格' },
          'A2': { v: 'P001' },
          'B2': { v: '产品A' },
          'C2': { v: 100 },
          'A3': { v: 'P002' },
          'B3': { v: '产品B' },
          'C3': { v: 150 },
          'A4': { v: 'P003' },
          'B4': { v: '产品C' },
          'C4': { v: 200 },
          'A5': { v: 'P004' },
          'B5': { v: '产品D' },
          'C5': { v: 250 },
          'E1': { v: '查询ID' },
          'F1': { v: '查询结果' },
          'E2': { v: 'P003' }
        },
        rowCount: 10,
        columnCount: 6
      },
      targetCells: ['F2'],
      validationRules: {
        'F2': {
          type: 'formula_value',
          expectedValue: 200,
          formulaFingerprint: ['INDEX', 'MATCH'],
          tolerance: 0.01
        }
      },
      hints: ['使用INDEX-MATCH函数组合进行双向查询', 'INDEX返回指定位置的值，MATCH返回查找值的位置'],
      steps: [
        '步骤1: 观察表格数据，了解查询需求',
        '步骤2: 在F2单元格输入"=INDEX(C2:C5,MATCH(E2,A2:A5,0))"',
        '步骤3: 按Enter键确认公式，检查查询结果是否为200',
        '步骤4: 尝试修改E2单元格的查询ID，验证查询功能是否正常',
        '步骤5: 提交任务，验证结果'
      ]
    },
    'task-5-3': {
      taskId: 'task-5-3',
      skillPoint: '高级查询',
      level: '高级',
      title: 'VLOOKUP高级应用',
      description: '使用VLOOKUP函数进行近似匹配查询',
      initialData: {
        sheetName: '成绩数据',
        cellData: {
          'A1': { v: '分数' },
          'B1': { v: '等级' },
          'A2': { v: 90 },
          'B2': { v: 'A' },
          'A3': { v: 80 },
          'B3': { v: 'B' },
          'A4': { v: 70 },
          'B4': { v: 'C' },
          'A5': { v: 60 },
          'B5': { v: 'D' },
          'A6': { v: 0 },
          'B6': { v: 'E' },
          'D1': { v: '学生' },
          'E1': { v: '分数' },
          'F1': { v: '等级' },
          'D2': { v: '张三' },
          'E2': { v: 85 },
          'D3': { v: '李四' },
          'E3': { v: 72 },
          'D4': { v: '王五' },
          'E4': { v: 95 }
        },
        rowCount: 10,
        columnCount: 6
      },
      targetCells: ['F2:F4'],
      validationRules: {
        'F2': { type: 'value', expectedValue: 'B' },
        'F3': { type: 'value', expectedValue: 'C' },
        'F4': { type: 'value', expectedValue: 'A' }
      },
      hints: ['使用VLOOKUP函数的近似匹配功能', '需要将查找表按升序排列'],
      steps: [
        '步骤1: 观察表格数据，了解查询需求',
        '步骤2: 在F2单元格输入"=VLOOKUP(E2,$A$2:$B$6,2,TRUE)"',
        '步骤3: 向下拖动填充柄到F4单元格',
        '步骤4: 检查各学生的等级是否正确',
        '步骤5: 提交任务，验证结果'
      ]
    },
    'task-7-2': {
      taskId: 'task-7-2',
      skillPoint: '数据透视分析',
      level: '中级',
      title: '数据透视表高级应用',
      description: '使用数据透视表进行多维度数据分析，包括排序和筛选',
      initialData: {
        sheetName: '销售数据',
        cellData: {
          'A1': { v: '日期' },
          'B1': { v: '产品' },
          'C1': { v: '地区' },
          'D1': { v: '销售额' },
          'E1': { v: '季度' },
          'A2': { v: '2023-01-01' },
          'B2': { v: '产品A' },
          'C2': { v: '北京' },
          'D2': { v: 1000 },
          'E2': { v: 'Q1' },
          'A3': { v: '2023-01-02' },
          'B3': { v: '产品B' },
          'C3': { v: '上海' },
          'D3': { v: 1500 },
          'E3': { v: 'Q1' },
          'A4': { v: '2023-04-01' },
          'B4': { v: '产品A' },
          'C4': { v: '上海' },
          'D4': { v: 1200 },
          'E4': { v: 'Q2' },
          'A5': { v: '2023-04-02' },
          'B5': { v: '产品B' },
          'C5': { v: '北京' },
          'D5': { v: 1800 },
          'E5': { v: 'Q2' },
          'A6': { v: '2023-07-01' },
          'B6': { v: '产品A' },
          'C6': { v: '北京' },
          'D6': { v: 1600 },
          'E6': { v: 'Q3' },
          'A7': { v: '2023-07-02' },
          'B7': { v: '产品B' },
          'C7': { v: '上海' },
          'D7': { v: 2000 },
          'E7': { v: 'Q3' }
        },
        rowCount: 15,
        columnCount: 5
      },
      targetCells: ['A12'],
      validationRules: {
        'A12': { type: 'value', expectedValue: '数据透视表' }
      },
      hints: ['使用数据透视表功能', '将季度作为行，产品作为列，销售额作为值', '使用排序和筛选功能'],
      steps: [
        '步骤1: 选择A1:E7单元格区域',
        '步骤2: 点击"插入"选项卡，选择"数据透视表"',
        '步骤3: 在弹出的对话框中选择放置位置为新工作表',
        '步骤4: 在数据透视表字段列表中，将"季度"拖到行区域，"产品"拖到列区域，"销售额"拖到值区域',
        '步骤5: 点击"销售额"字段，选择"值字段设置"，设置为"求和"',
        '步骤6: 点击"季度"字段，选择"排序"，按季度顺序排序',
        '步骤7: 添加"地区"字段到筛选器区域，测试筛选功能',
        '步骤8: 检查数据透视表是否正确显示各季度各产品的销售额',
        '步骤9: 提交任务，验证结果'
      ]
    },
    'task-6-1': {
      taskId: 'task-6-1',
      skillPoint: '数组与公式',
      level: '高级',
      title: '数组公式基础',
      description: '使用数组公式计算多个单元格的结果',
      initialData: {
        sheetName: '销售数据',
        cellData: {
          'A1': { v: '产品' },
          'B1': { v: '数量' },
          'C1': { v: '单价' },
          'D1': { v: '销售额' },
          'A2': { v: '产品A' },
          'B2': { v: 10 },
          'C2': { v: 100 },
          'A3': { v: '产品B' },
          'B3': { v: 20 },
          'C3': { v: 150 },
          'A4': { v: '产品C' },
          'B4': { v: 15 },
          'C4': { v: 200 },
          'A5': { v: '总计' }
        },
        rowCount: 10,
        columnCount: 4
      },
      targetCells: ['D2:D4', 'D5'],
      validationRules: {
        'D2': { type: 'value', expectedValue: 1000, tolerance: 0.01 },
        'D3': { type: 'value', expectedValue: 3000, tolerance: 0.01 },
        'D4': { type: 'value', expectedValue: 3000, tolerance: 0.01 },
        'D5': { type: 'value', expectedValue: 7000, tolerance: 0.01 }
      },
      hints: ['使用数组公式同时计算多个单元格', '按Ctrl+Shift+Enter确认数组公式'],
      steps: [
        '步骤1: 观察表格数据，了解计算需求',
        '步骤2: 选择D2:D4单元格区域',
        '步骤3: 输入"=B2:B4*C2:C4"，然后按Ctrl+Shift+Enter确认',
        '步骤4: 在D5单元格输入"=SUM(D2:D4)"',
        '步骤5: 检查计算结果是否正确',
        '步骤6: 提交任务，验证结果'
      ]
    },
    'task-7-1': {
      taskId: 'task-7-1',
      skillPoint: '数据透视分析',
      level: '中级',
      title: '创建基础数据透视表',
      description: '使用数据透视表分析销售数据',
      initialData: {
        sheetName: '销售数据',
        cellData: {
          'A1': { v: '日期' },
          'B1': { v: '产品' },
          'C1': { v: '地区' },
          'D1': { v: '销售额' },
          'A2': { v: '2023-01-01' },
          'B2': { v: '产品A' },
          'C2': { v: '北京' },
          'D2': { v: 1000 },
          'A3': { v: '2023-01-02' },
          'B3': { v: '产品B' },
          'C3': { v: '上海' },
          'D3': { v: 1500 },
          'A4': { v: '2023-01-03' },
          'B4': { v: '产品A' },
          'C4': { v: '上海' },
          'D4': { v: 1200 },
          'A5': { v: '2023-01-04' },
          'B5': { v: '产品B' },
          'C5': { v: '北京' },
          'D5': { v: 1800 }
        },
        rowCount: 10,
        columnCount: 4
      },
      targetCells: ['A10'],
      validationRules: {
        'A10': { type: 'value', expectedValue: '数据透视表' }
      },
      hints: ['使用数据透视表功能', '将产品作为行，地区作为列，销售额作为值'],
      steps: [
        '步骤1: 选择A1:D5单元格区域',
        '步骤2: 点击"插入"选项卡，选择"数据透视表"',
        '步骤3: 在弹出的对话框中选择放置位置为新工作表',
        '步骤4: 在数据透视表字段列表中，将"产品"拖到行区域，"地区"拖到列区域，"销售额"拖到值区域',
        '步骤5: 检查数据透视表是否正确显示各产品在各地区的销售额',
        '步骤6: 提交任务，验证结果'
      ]
    },
    'task-8-1': {
      taskId: 'task-8-1',
      skillPoint: '统计推断',
      level: '高级',
      title: '描述性统计分析',
      description: '使用统计函数分析销售数据的基本特征',
      initialData: {
        sheetName: '销售数据',
        cellData: {
          'A1': { v: '月份' },
          'B1': { v: '销售额' },
          'A2': { v: '1' },
          'B2': { v: 1000 },
          'A3': { v: '2' },
          'B3': { v: 1200 },
          'A4': { v: '3' },
          'B4': { v: 1500 },
          'A5': { v: '4' },
          'B5': { v: 1300 },
          'A6': { v: '5' },
          'B6': { v: 1600 },
          'A7': { v: '6' },
          'B7': { v: 1400 },
          'A9': { v: '平均值' },
          'A10': { v: '中位数' },
          'A11': { v: '最大值' },
          'A12': { v: '最小值' },
          'A13': { v: '标准差' }
        },
        rowCount: 15,
        columnCount: 2
      },
      targetCells: ['B9:B13'],
      validationRules: {
        'B9': { type: 'value', expectedValue: 1333.33, tolerance: 0.01 },
        'B10': { type: 'value', expectedValue: 1350, tolerance: 0.01 },
        'B11': { type: 'value', expectedValue: 1600, tolerance: 0.01 },
        'B12': { type: 'value', expectedValue: 1000, tolerance: 0.01 },
        'B13': { type: 'value', expectedValue: 216.02, tolerance: 0.01 }
      },
      hints: ['使用AVERAGE、MEDIAN、MAX、MIN、STDEV函数', '选择正确的数据范围'],
      steps: [
        '步骤1: 观察表格数据，了解统计分析需求',
        '步骤2: 在B9单元格输入"=AVERAGE(B2:B7)"，计算平均值',
        '步骤3: 在B10单元格输入"=MEDIAN(B2:B7)"，计算中位数',
        '步骤4: 在B11单元格输入"=MAX(B2:B7)"，计算最大值',
        '步骤5: 在B12单元格输入"=MIN(B2:B7)"，计算最小值',
        '步骤6: 在B13单元格输入"=STDEV(B2:B7)"，计算标准差',
        '步骤7: 检查计算结果是否正确',
        '步骤8: 提交任务，验证结果'
      ]
    },
    'task-9-1': {
      taskId: 'task-9-1',
      skillPoint: '预测模型',
      level: '高级',
      title: '移动平均预测',
      description: '使用移动平均方法预测未来销售额',
      initialData: {
        sheetName: '销售数据',
        cellData: {
          'A1': { v: '月份' },
          'B1': { v: '销售额' },
          'C1': { v: '3期移动平均' },
          'A2': { v: '1' },
          'B2': { v: 1000 },
          'A3': { v: '2' },
          'B3': { v: 1200 },
          'A4': { v: '3' },
          'B4': { v: 1500 },
          'A5': { v: '4' },
          'B5': { v: 1300 },
          'A6': { v: '5' },
          'B6': { v: 1600 },
          'A7': { v: '6' }
        },
        rowCount: 10,
        columnCount: 3
      },
      targetCells: ['C4:C7'],
      validationRules: {
        'C7': { type: 'value', expectedValue: 1466.67, tolerance: 0.01 }
      },
      hints: ['使用AVERAGE函数计算移动平均', '选择连续的3个数据点'],
      steps: [
        '步骤1: 观察表格数据，了解移动平均预测需求',
        '步骤2: 在C4单元格输入"=AVERAGE(B2:B4)"，计算第3期的移动平均',
        '步骤3: 在C5单元格输入"=AVERAGE(B3:B5)"，计算第4期的移动平均',
        '步骤4: 在C6单元格输入"=AVERAGE(B4:B6)"，计算第5期的移动平均',
        '步骤5: 在C7单元格输入"=AVERAGE(B5:B6,C6)"，预测第6期的销售额',
        '步骤6: 检查计算结果是否正确',
        '步骤7: 提交任务，验证结果'
      ]
    },
    'task-10-1': {
      taskId: 'task-10-1',
      skillPoint: '图表制作',
      level: '初级',
      title: '基础图表制作',
      description: '创建柱状图展示销售数据',
      initialData: {
        sheetName: '销售数据',
        cellData: {
          'A1': { v: '月份' },
          'B1': { v: '销售额' },
          'A2': { v: '1' },
          'B2': { v: 1000 },
          'A3': { v: '2' },
          'B3': { v: 1200 },
          'A4': { v: '3' },
          'B4': { v: 1500 },
          'A5': { v: '4' },
          'B5': { v: 1300 },
          'A6': { v: '5' },
          'B6': { v: 1600 }
        },
        rowCount: 10,
        columnCount: 2
      },
      targetCells: ['A10'],
      validationRules: {
        'A10': { type: 'value', expectedValue: '柱状图' }
      },
      hints: ['使用柱状图展示销售数据', '选择数据范围后插入图表'],
      steps: [
        '步骤1: 选择A1:B6单元格区域',
        '步骤2: 点击"插入"选项卡，选择"柱状图"',
        '步骤3: 选择合适的柱状图类型',
        '步骤4: 调整图表标题、坐标轴标签等格式',
        '步骤5: 检查图表是否正确显示销售数据',
        '步骤6: 提交任务，验证结果'
      ]
    },
    'task-11-1': {
      taskId: 'task-11-1',
      skillPoint: '动态仪表盘',
      level: '中级',
      title: '表单控件关联图表',
      description: '使用表单控件创建动态图表',
      initialData: {
        sheetName: '销售数据',
        cellData: {
          'A1': { v: '月份' },
          'B1': { v: '产品A' },
          'C1': { v: '产品B' },
          'D1': { v: '产品C' },
          'A2': { v: '1' },
          'B2': { v: 1000 },
          'C2': { v: 1500 },
          'D2': { v: 1200 },
          'A3': { v: '2' },
          'B3': { v: 1200 },
          'C3': { v: 1800 },
          'D3': { v: 1400 },
          'A4': { v: '3' },
          'B4': { v: 1500 },
          'C4': { v: 2000 },
          'D4': { v: 1600 },
          'A5': { v: '4' },
          'B5': { v: 1300 },
          'C5': { v: 1700 },
          'D5': { v: 1500 },
          'A6': { v: '5' },
          'B6': { v: 1600 },
          'C6': { v: 2200 },
          'D6': { v: 1800 },
          'F1': { v: '选择产品' },
          'F2': { v: 1 }
        },
        rowCount: 15,
        columnCount: 6
      },
      targetCells: ['A10'],
      validationRules: {
        'A10': { type: 'value', expectedValue: '动态图表' }
      },
      hints: ['使用表单控件（如组合框）', '使用INDEX函数根据选择返回对应数据'],
      steps: [
        '步骤1: 观察表格数据，了解动态图表需求',
        '步骤2: 点击"开发工具"选项卡，选择"插入"表单控件中的"组合框"',
        '步骤3: 绘制组合框，设置数据源为B1:D1，单元格链接为F2',
        '步骤4: 在G2单元格输入"=INDEX(B2:D6,ROW()-1,$F$2)"，向下拖动填充',
        '步骤5: 选择A1:A6和G1:G6数据，插入折线图',
        '步骤6: 测试组合框，验证图表是否随选择变化',
        '步骤7: 提交任务，验证结果'
      ]
    },
    'task-12-1': {
      taskId: 'task-12-1',
      skillPoint: '商业报告',
      level: '高级',
      title: '商业报告制作',
      description: '创建包含数据、图表和分析的商业报告',
      initialData: {
        sheetName: '销售报告',
        cellData: {
          'A1': { v: '销售报告' },
          'A3': { v: '数据概览' },
          'A5': { v: '月份' },
          'B5': { v: '销售额' },
          'A6': { v: '1' },
          'B6': { v: 1000 },
          'A7': { v: '2' },
          'B7': { v: 1200 },
          'A8': { v: '3' },
          'B8': { v: 1500 },
          'A9': { v: '4' },
          'B9': { v: 1300 },
          'A10': { v: '5' },
          'B10': { v: 1600 },
          'A12': { v: '总计' },
          'B12': { v: 6600 },
          'A14': { v: '分析结论' }
        },
        rowCount: 20,
        columnCount: 5
      },
      targetCells: ['A18'],
      validationRules: {
        'A18': { type: 'value', expectedValue: '商业报告' }
      },
      hints: ['创建包含标题、数据、图表和分析的完整报告', '使用格式化和布局工具'],
      steps: [
        '步骤1: 观察表格数据，了解报告需求',
        '步骤2: 格式化标题和数据区域，使其美观易读',
        '步骤3: 选择A5:B10数据，插入折线图展示销售趋势',
        '步骤4: 在A14下方输入分析结论，总结销售趋势和建议',
        '步骤5: 调整报告布局，确保内容清晰有序',
        '步骤6: 提交任务，验证结果'
      ]
    },
    'task-10-2': {
      taskId: 'task-10-2',
      skillPoint: '图表制作',
      level: '中级',
      title: '高级图表制作',
      description: '创建组合图表，同时显示销售额和增长率',
      initialData: {
        sheetName: '销售数据',
        cellData: {
          'A1': { v: '月份' },
          'B1': { v: '销售额' },
          'C1': { v: '增长率' },
          'A2': { v: '1' },
          'B2': { v: 1000 },
          'C2': { v: 0 },
          'A3': { v: '2' },
          'B3': { v: 1200 },
          'C3': { v: 20 },
          'A4': { v: '3' },
          'B4': { v: 1500 },
          'C4': { v: 25 },
          'A5': { v: '4' },
          'B5': { v: 1300 },
          'C5': { v: -13.33 },
          'A6': { v: '5' },
          'B6': { v: 1600 },
          'C6': { v: 23.08 }
        },
        rowCount: 10,
        columnCount: 3
      },
      targetCells: ['A10'],
      validationRules: {
        'A10': { type: 'value', expectedValue: '组合图表' }
      },
      hints: ['使用组合图表功能', '销售额使用柱状图，增长率使用折线图'],
      steps: [
        '步骤1: 选择A1:C6单元格区域',
        '步骤2: 点击"插入"选项卡，选择"组合图表"',
        '步骤3: 在弹出的对话框中，设置销售额为柱状图，增长率为折线图',
        '步骤4: 调整图表标题、坐标轴标签等格式',
        '步骤5: 检查图表是否正确显示销售额和增长率',
        '步骤6: 提交任务，验证结果'
      ]
    },
    'task-1-2': {
      taskId: 'task-1-2',
      skillPoint: '数据采集',
      level: '中级',
      title: 'API数据抓取与处理',
      description: '从Web API获取JSON数据并转换为表格格式',
      initialData: {
        sheetName: '数据采集',
        cellData: {
          'A1': { v: '产品ID' },
          'B1': { v: '产品名称' },
          'C1': { v: '价格' },
          'D1': { v: '库存' },
          'A2': { v: '101' },
          'B2': { v: '笔记本电脑' },
          'C2': { v: 5999 },
          'D2': { v: 50 },
          'A3': { v: '102' },
          'B3': { v: '无线鼠标' },
          'C3': { v: 129 },
          'D3': { v: 200 },
          'A4': { v: '103' },
          'B4': { v: '机械键盘' },
          'C4': { v: 499 },
          'D4': { v: 150 }
        },
        rowCount: 15,
        columnCount: 4
      },
      targetCells: ['C5'],
      validationRules: {
        'C5': { type: 'value', expectedValue: 6627 }
      },
      hints: ['使用SUM函数计算产品总价', '选择C2到C4的范围'],
      steps: [
        '步骤1: 了解数据结构，产品价格位于C列',
        '步骤2: 定位到C5单元格',
        '步骤3: 输入"=SUM(C2:C4)"，计算所有产品价格总和',
        '步骤4: 按Enter键确认公式，检查结果是否正确',
        '步骤5: 提交任务，验证结果'
      ]
    },
    'task-1-3': {
      taskId: 'task-1-3',
      skillPoint: '数据采集',
      level: '高级',
      title: '多源数据融合',
      description: '合并来自多个数据源的表格数据并去重',
      initialData: {
        sheetName: '数据融合',
        cellData: {
          'A1': { v: '数据源1 - 产品' },
          'B1': { v: '价格' },
          'C1': { v: '数据源2 - 产品' },
          'D1': { v: '价格' },
          'E1': { v: '合并后产品' },
          'F1': { v: '合并后价格' },
          'A2': { v: '产品A' },
          'B2': { v: 100 },
          'C2': { v: '产品B' },
          'D2': { v: 150 },
          'A3': { v: '产品B' },
          'B3': { v: 145 },
          'C3': { v: '产品C' },
          'D3': { v: 200 },
          'A4': { v: '产品D' },
          'B4': { v: 250 },
          'C4': { v: '产品D' },
          'D4': { v: 245 }
        },
        rowCount: 15,
        columnCount: 6
      },
      targetCells: ['E2:E4', 'F2:F4'],
      validationRules: {
        'E2': { type: 'value', expectedValue: '产品A' },
        'E3': { type: 'value', expectedValue: '产品B' },
        'E4': { type: 'value', expectedValue: '产品C' },
        'F2': { type: 'value', expectedValue: 100 },
        'F3': { type: 'value', expectedValue: 145 },
        'F4': { type: 'value', expectedValue: 200 }
      },
      hints: ['首先提取所有唯一产品名称', '使用VLOOKUP或INDEX-MATCH查找价格', '注意去重'],
      steps: [
        '步骤1: 在E2单元格输入"=A2"，从数据源1提取产品A',
        '步骤2: 在E3单元格输入"=A3"，提取产品B',
        '步骤3: 在E4单元格输入"=C3"，从数据源2提取产品C',
        '步骤4: 在F2单元格输入"=VLOOKUP(E2,A2:B4,2,FALSE)"',
        '步骤5: 向下拖动填充柄，使用数据源1的价格',
        '步骤6: 检查合并结果是否正确',
        '步骤7: 提交任务，验证结果'
      ]
    },
    'task-3-2': {
      taskId: 'task-3-2',
      skillPoint: '数据整理',
      level: '中级',
      title: '数据转置与重组',
      description: '将横向数据转换为纵向表格，便于分析',
      initialData: {
        sheetName: '数据整理',
        cellData: {
          'A1': { v: '产品' },
          'B1': { v: 'Q1' },
          'C1': { v: 'Q2' },
          'D1': { v: 'Q3' },
          'E1': { v: 'Q4' },
          'A2': { v: '产品A' },
          'B2': { v: 1000 },
          'C2': { v: 1200 },
          'D2': { v: 1500 },
          'E2': { v: 1300 },
          'A3': { v: '产品B' },
          'B3': { v: 800 },
          'C3': { v: 900 },
          'D3': { v: 1100 },
          'E3': { v: 1000 }
        },
        rowCount: 15,
        columnCount: 5
      },
      targetCells: ['G1:J9'],
      validationRules: {
        'G2': { type: 'value', expectedValue: '产品A' },
        'H2': { type: 'value', expectedValue: 'Q1' },
        'I2': { type: 'value', expectedValue: 1000 },
        'G5': { type: 'value', expectedValue: '产品B' },
        'H5': { type: 'value', expectedValue: 'Q1' },
        'I5': { type: 'value', expectedValue: 800 }
      },
      hints: ['使用转置功能重组数据', '手动或使用公式创建新表格'],
      steps: [
        '步骤1: 在G1单元格输入"产品"，H1输入"季度"，I1输入"销售额"',
        '步骤2: 在G2单元格输入"=A2"，H2输入"=B$1"，I2输入"=B2"',
        '步骤3: 复制G2:I2到G3，修改H3为"=C$1"，I3为"=C2"',
        '步骤4: 继续完成产品A的四个季度数据',
        '步骤5: 同理完成产品B的数据',
        '步骤6: 检查转置结果是否正确',
        '步骤7: 提交任务，验证结果'
      ]
    },
    'task-3-3': {
      taskId: 'task-3-3',
      skillPoint: '数据整理',
      level: '高级',
      title: '高级数据分组与汇总',
      description: '根据多个条件对数据进行分组和层次化汇总',
      initialData: {
        sheetName: '数据分组',
        cellData: {
          'A1': { v: '日期' },
          'B1': { v: '地区' },
          'C1': { v: '产品' },
          'D1': { v: '销售额' },
          'A2': { v: '2023-01-01' },
          'B2': { v: '华东' },
          'C2': { v: '产品A' },
          'D2': { v: 1000 },
          'A3': { v: '2023-01-01' },
          'B3': { v: '华东' },
          'C3': { v: '产品B' },
          'D3': { v: 1500 },
          'A4': { v: '2023-01-02' },
          'B4': { v: '华北' },
          'C4': { v: '产品A' },
          'D4': { v: 1200 },
          'A5': { v: '2023-01-02' },
          'B5': { v: '华北' },
          'C5': { v: '产品B' },
          'D5': { v: 1800 }
        },
        rowCount: 15,
        columnCount: 4
      },
      targetCells: ['F1:H5'],
      validationRules: {
        'F2': { type: 'value', expectedValue: '华东' },
        'F3': { type: 'value', expectedValue: '华北' },
        'G2': { type: 'value', expectedValue: 2500 },
        'G3': { type: 'value', expectedValue: 3000 }
      },
      hints: ['使用SUMIFS进行多条件汇总', '按地区分组计算总销售额'],
      steps: [
        '步骤1: 在F1单元格输入"地区"，G1输入"总销售额"',
        '步骤2: 在F2单元格输入"华东"，F3输入"华北"',
        '步骤3: 在G2单元格输入"=SUMIFS(D2:D5,B2:B5,F2)"',
        '步骤4: 向下拖动填充柄到G3',
        '步骤5: 检查汇总结果是否正确',
        '步骤6: 提交任务，验证结果'
      ]
    },
    'task-6-2': {
      taskId: 'task-6-2',
      skillPoint: '数组与公式',
      level: '初级',
      title: '数组入门：批量计算',
      description: '使用数组公式进行批量乘积计算',
      initialData: {
        sheetName: '数组入门',
        cellData: {
          'A1': { v: '产品' },
          'B1': { v: '数量' },
          'C1': { v: '单价' },
          'D1': { v: '金额' },
          'A2': { v: '产品A' },
          'B2': { v: 5 },
          'C2': { v: 100 },
          'A3': { v: '产品B' },
          'B3': { v: 3 },
          'C3': { v: 200 },
          'A4': { v: '产品C' },
          'B4': { v: 2 },
          'C4': { v: 150 }
        },
        rowCount: 10,
        columnCount: 4
      },
      targetCells: ['D2:D4'],
      validationRules: {
        'D2': { type: 'value', expectedValue: 500 },
        'D3': { type: 'value', expectedValue: 600 },
        'D4': { type: 'value', expectedValue: 300 }
      },
      hints: ['使用简单的乘法公式计算金额', 'D2 = B2 * C2'],
      steps: [
        '步骤1: 在D2单元格输入"=B2*C2"',
        '步骤2: 向下拖动填充柄到D4',
        '步骤3: 检查各产品金额计算是否正确',
        '步骤4: 提交任务，验证结果'
      ]
    },
    'task-6-3': {
      taskId: 'task-6-3',
      skillPoint: '数组与公式',
      level: '中级',
      title: '数组求和与条件计算',
      description: '使用数组公式进行复杂条件求和',
      initialData: {
        sheetName: '数组条件',
        cellData: {
          'A1': { v: '产品' },
          'B1': { v: '地区' },
          'C1': { v: '销售额' },
          'A2': { v: '产品A' },
          'B2': { v: '北京' },
          'C2': { v: 1000 },
          'A3': { v: '产品B' },
          'B3': { v: '上海' },
          'C3': { v: 1500 },
          'A4': { v: '产品A' },
          'B4': { v: '上海' },
          'C4': { v: 1200 },
          'A5': { v: '产品B' },
          'B5': { v: '北京' },
          'C5': { v: 1800 },
          'E1': { v: '产品A北京总销售额' }
        },
        rowCount: 10,
        columnCount: 5
      },
      targetCells: ['E2'],
      validationRules: {
        'E2': { type: 'value', expectedValue: 1000 }
      },
      hints: ['使用SUMIFS函数进行多条件求和', '条件1：产品=产品A，条件2：地区=北京'],
      steps: [
        '步骤1: 在E2单元格输入"=SUMIFS(C2:C5,A2:A5,\"产品A\",B2:B5,\"北京\")"',
        '步骤2: 按Enter键确认公式',
        '步骤3: 检查计算结果是否为1000',
        '步骤4: 提交任务，验证结果'
      ]
    },
    'task-7-3': {
      taskId: 'task-7-3',
      skillPoint: '数据透视分析',
      level: '高级',
      title: '数据透视表计算字段与分组',
      description: '在数据透视表中创建计算字段并按时间分组',
      initialData: {
        sheetName: '透视高级',
        cellData: {
          'A1': { v: '日期' },
          'B1': { v: '产品' },
          'C1': { v: '销量' },
          'D1': { v: '单价' },
          'A2': { v: '2023-01-05' },
          'B2': { v: '产品A' },
          'C2': { v: 10 },
          'D2': { v: 100 },
          'A3': { v: '2023-01-15' },
          'B3': { v: '产品B' },
          'C3': { v: 15 },
          'D3': { v: 150 },
          'A4': { v: '2023-02-05' },
          'B4': { v: '产品A' },
          'C4': { v: 12 },
          'D4': { v: 100 },
          'A5': { v: '2023-02-15' },
          'B5': { v: '产品B' },
          'C5': { v: 18 },
          'D5': { v: 150 }
        },
        rowCount: 15,
        columnCount: 4
      },
      targetCells: ['F1:J10'],
      validationRules: {
        'G2': { type: 'value', expectedValue: 22 }
      },
      hints: ['在数据透视表中添加计算字段：销售额=销量*单价', '将日期分组为月份'],
      steps: [
        '步骤1: 选择A1:D5数据，创建数据透视表',
        '步骤2: 将日期拖到行区域，产品拖到列区域',
        '步骤3: 将销量拖到值区域',
        '步骤4: 右键点击日期字段，选择"分组"，按月分组',
        '步骤5: 点击"数据透视表分析"，添加计算字段"销售额"=销量*单价',
        '步骤6: 检查透视表结果',
        '步骤7: 提交任务，验证结果'
      ]
    },
    'task-8-2': {
      taskId: 'task-8-2',
      skillPoint: '统计推断',
      level: '初级',
      title: '基础统计量计算',
      description: '计算数据的基本统计指标：计数、求和、平均',
      initialData: {
        sheetName: '基础统计',
        cellData: {
          'A1': { v: '学生' },
          'B1': { v: '成绩' },
          'A2': { v: '张三' },
          'B2': { v: 85 },
          'A3': { v: '李四' },
          'B3': { v: 92 },
          'A4': { v: '王五' },
          'B4': { v: 78 },
          'A5': { v: '赵六' },
          'B5': { v: 88 },
          'A6': { v: '钱七' },
          'B6': { v: 95 },
          'D1': { v: '学生人数' },
          'D2': { v: '总分' },
          'D3': { v: '平均分' }
        },
        rowCount: 10,
        columnCount: 4
      },
      targetCells: ['E1:E3'],
      validationRules: {
        'E1': { type: 'value', expectedValue: 5 },
        'E2': { type: 'value', expectedValue: 438 },
        'E3': { type: 'value', expectedValue: 87.6 }
      },
      hints: ['使用COUNT函数计数', '使用SUM函数求和', '使用AVERAGE函数求平均'],
      steps: [
        '步骤1: 在E1单元格输入"=COUNT(B2:B6)"',
        '步骤2: 在E2单元格输入"=SUM(B2:B6)"',
        '步骤3: 在E3单元格输入"=AVERAGE(B2:B6)"',
        '步骤4: 检查统计结果是否正确',
        '步骤5: 提交任务，验证结果'
      ]
    },
    'task-8-3': {
      taskId: 'task-8-3',
      skillPoint: '统计推断',
      level: '中级',
      title: '相关性分析',
      description: '计算两个变量之间的相关系数',
      initialData: {
        sheetName: '相关性',
        cellData: {
          'A1': { v: '学习时间(小时)' },
          'B1': { v: '考试分数' },
          'A2': { v: 2 },
          'B2': { v: 70 },
          'A3': { v: 4 },
          'B3': { v: 78 },
          'A4': { v: 6 },
          'B4': { v: 85 },
          'A5': { v: 8 },
          'B5': { v: 88 },
          'A6': { v: 10 },
          'B6': { v: 95 },
          'D1': { v: '相关系数' }
        },
        rowCount: 10,
        columnCount: 4
      },
      targetCells: ['E1'],
      validationRules: {
        'E1': { type: 'value', expectedValue: 0.98 }
      },
      hints: ['使用CORREL函数计算相关系数', '相关系数接近1表示强正相关'],
      steps: [
        '步骤1: 在E1单元格输入"=CORREL(A2:A6,B2:B6)"',
        '步骤2: 按Enter键确认公式',
        '步骤3: 检查相关系数是否约为0.98',
        '步骤4: 提交任务，验证结果'
      ]
    },
    'task-10-3': {
      taskId: 'task-10-3',
      skillPoint: '图表制作',
      level: '高级',
      title: '热力图与双坐标轴图表',
      description: '创建高级热力图展示数据密度关系',
      initialData: {
        sheetName: '高级图表',
        cellData: {
          'A1': { v: '产品/月份' },
          'B1': { v: '1月' },
          'C1': { v: '2月' },
          'D1': { v: '3月' },
          'E1': { v: '4月' },
          'A2': { v: '产品A' },
          'B2': { v: 100 },
          'C2': { v: 120 },
          'D2': { v: 150 },
          'E2': { v: 130 },
          'A3': { v: '产品B' },
          'B3': { v: 80 },
          'C3': { v: 90 },
          'D3': { v: 110 },
          'E3': { v: 100 },
          'A4': { v: '产品C' },
          'B4': { v: 200 },
          'C4': { v: 180 },
          'D4': { v: 220 },
          'E4': { v: 250 }
        },
        rowCount: 10,
        columnCount: 5
      },
      targetCells: ['A10'],
      validationRules: {
        'A10': { type: 'value', expectedValue: '热力图' }
      },
      hints: ['使用条件格式创建热力图效果', '设置颜色刻度从低到高'],
      steps: [
        '步骤1: 选择B2:E4单元格区域',
        '步骤2: 点击"开始"选项卡，选择"条件格式"',
        '步骤3: 选择"色阶"，选择三色刻度',
        '步骤4: 调整颜色设置，低值蓝色，高值红色',
        '步骤5: 检查热力图效果是否正确',
        '步骤6: 提交任务，验证结果'
      ]
    },
    'task-11-2': {
      taskId: 'task-11-2',
      skillPoint: '动态仪表盘',
      level: '初级',
      title: '数据验证下拉菜单',
      description: '创建下拉菜单实现数据快速选择',
      initialData: {
        sheetName: '下拉菜单',
        cellData: {
          'A1': { v: '产品列表' },
          'A2': { v: '产品A' },
          'A3': { v: '产品B' },
          'A4': { v: '产品C' },
          'C1': { v: '选择产品' }
        },
        rowCount: 10,
        columnCount: 3
      },
      targetCells: ['C2'],
      validationRules: {
        'C2': { type: 'value', expectedValue: '产品A' }
      },
      hints: ['使用数据验证功能创建下拉菜单', '来源选择A2:A4'],
      steps: [
        '步骤1: 选择C2单元格',
        '步骤2: 点击"数据"选项卡，选择"数据验证"',
        '步骤3: 在允许中选择"序列"',
        '步骤4: 来源输入"=$A$2:$A$4"',
        '步骤5: 点击确定，测试下拉菜单',
        '步骤6: 选择"产品A"',
        '步骤7: 提交任务，验证结果'
      ]
    },
    'task-11-3': {
      taskId: 'task-11-3',
      skillPoint: '动态仪表盘',
      level: '高级',
      title: '交互式KPI仪表盘',
      description: '创建综合KPI仪表盘，包含关键指标和趋势图',
      initialData: {
        sheetName: 'KPI仪表盘',
        cellData: {
          'A1': { v: '月份' },
          'B1': { v: '销售额' },
          'C1': { v: '目标' },
          'D1': { v: '达成率' },
          'A2': { v: '1' },
          'B2': { v: 1000 },
          'C2': { v: 900 },
          'D2': { v: 1.11 },
          'A3': { v: '2' },
          'B3': { v: 1200 },
          'C3': { v: 1100 },
          'D3': { v: 1.09 },
          'A4': { v: '3' },
          'B4': { v: 1500 },
          'C4': { v: 1300 },
          'D4': { v: 1.15 },
          'F1': { v: '选择月份' },
          'F2': { v: 3 },
          'H1': { v: '本月销售额' },
          'H2': { v: '本月目标' },
          'H3': { v: '达成率' }
        },
        rowCount: 15,
        columnCount: 8
      },
      targetCells: ['I1:I3'],
      validationRules: {
        'I1': { type: 'value', expectedValue: 1500 },
        'I2': { type: 'value', expectedValue: 1300 },
        'I3': { type: 'value', expectedValue: 1.15 }
      },
      hints: ['使用INDEX-MATCH根据月份查找数据', 'F2为选择的月份'],
      steps: [
        '步骤1: 在I1单元格输入"=INDEX(B2:B4,F2)"',
        '步骤2: 在I2单元格输入"=INDEX(C2:C4,F2)"',
        '步骤3: 在I3单元格输入"=INDEX(D2:D4,F2)"',
        '步骤4: 检查KPI数据是否正确',
        '步骤5: 尝试修改F2的值，验证动态更新',
        '步骤6: 提交任务，验证结果'
      ]
    },
    'task-12-2': {
      taskId: 'task-12-2',
      skillPoint: '商业报告',
      level: '初级',
      title: '基础报告结构',
      description: '创建包含标题、数据和汇总的基础报告',
      initialData: {
        sheetName: '基础报告',
        cellData: {
          'A1': { v: '月度销售报告' },
          'A3': { v: '日期' },
          'B3': { v: '产品' },
          'C3': { v: '销售额' },
          'A4': { v: '2023-01-01' },
          'B4': { v: '产品A' },
          'C4': { v: 1000 },
          'A5': { v: '2023-01-02' },
          'B5': { v: '产品B' },
          'C5': { v: 1500 },
          'A6': { v: '2023-01-03' },
          'B6': { v: '产品A' },
          'C6': { v: 1200 },
          'A8': { v: '总计' }
        },
        rowCount: 15,
        columnCount: 3
      },
      targetCells: ['C8'],
      validationRules: {
        'C8': { type: 'value', expectedValue: 3700 }
      },
      hints: ['使用SUM函数计算总销售额', '对C4:C6求和'],
      steps: [
        '步骤1: 在C8单元格输入"=SUM(C4:C6)"',
        '步骤2: 格式化标题，设置为粗体和更大字号',
        '步骤3: 调整列宽，使数据完整显示',
        '步骤4: 给数据区域添加边框',
        '步骤5: 检查报告格式和计算结果',
        '步骤6: 提交任务，验证结果'
      ]
    },
    'task-12-3': {
      taskId: 'task-12-3',
      skillPoint: '商业报告',
      level: '中级',
      title: '对比分析报告',
      description: '创建包含同比、环比分析的商业报告',
      initialData: {
        sheetName: '对比报告',
        cellData: {
          'A1': { v: '季度销售对比报告' },
          'A3': { v: '季度' },
          'B3': { v: '销售额' },
          'C3': { v: '环比增长' },
          'D3': { v: '同比增长' },
          'A4': { v: 'Q1' },
          'B4': { v: 3000 },
          'A5': { v: 'Q2' },
          'B5': { v: 3500 },
          'A6': { v: 'Q3' },
          'B6': { v: 3200 },
          'A7': { v: 'Q4' },
          'B7': { v: 4000 },
          'A9': { v: '去年Q1' },
          'B9': { v: 2500 }
        },
        rowCount: 15,
        columnCount: 4
      },
      targetCells: ['C5:C7', 'D4'],
      validationRules: {
        'C5': { type: 'value', expectedValue: 0.17 },
        'C6': { type: 'value', expectedValue: -0.09 },
        'C7': { type: 'value', expectedValue: 0.25 },
        'D4': { type: 'value', expectedValue: 0.2 }
      },
      hints: ['环比=(本期-上期)/上期', '同比=(本期-去年同期)/去年同期'],
      steps: [
        '步骤1: 在C5单元格输入"=(B5-B4)/B4"',
        '步骤2: 向下拖动填充柄到C7',
        '步骤3: 在D4单元格输入"=(B4-B9)/B9"',
        '步骤4: 格式化C列和D列为百分比格式',
        '步骤5: 添加条件格式，正数显示绿色，负数显示红色',
        '步骤6: 检查分析结果是否正确',
        '步骤7: 提交任务，验证结果'
      ]
    },
    'task-comprehensive-1': {
      taskId: 'task-comprehensive-1',
      skillPoint: '综合应用',
      level: '中级',
      title: '电商销售数据采集与分析',
      description: '采集电商销售数据，清洗缺失值和异常值，并计算关键指标',
      initialData: {
        sheetName: '电商销售',
        cellData: {
          'A1': { v: '订单ID' },
          'B1': { v: '日期' },
          'C1': { v: '产品' },
          'D1': { v: '数量' },
          'E1': { v: '单价' },
          'F1': { v: '金额' },
          'A2': { v: 'O001' },
          'B2': { v: '2023-01-01' },
          'C2': { v: '产品A' },
          'D2': { v: 2 },
          'E2': { v: 100 },
          'A3': { v: 'O002' },
          'B3': { v: '2023-01-02' },
          'C3': { v: '产品B' },
          'D3': { v: 3 },
          'E3': { v: 150 },
          'A4': { v: 'O003' },
          'B4': { v: '2023-01-03' },
          'C4': { v: '产品A' },
          'D4': { v: 1 },
          'E4': { v: 100 },
          'A5': { v: 'O004' },
          'B5': { v: '2023-01-04' },
          'C5': { v: '产品C' },
          'D5': { v: null },
          'E5': { v: 200 },
          'A6': { v: 'O005' },
          'B6': { v: '2023-01-05' },
          'C6': { v: '产品B' },
          'D6': { v: 5 },
          'E6': { v: 150 },
          'H1': { v: '数据清洗与计算' },
          'H2': { v: '总订单数' },
          'H3': { v: '总销售额' },
          'H4': { v: '平均订单金额' },
          'H5': { v: '最畅销产品' }
        },
        rowCount: 20,
        columnCount: 10
      },
      targetCells: ['F2:F6', 'I2:I5'],
      validationRules: {
        'F2': { type: 'value', expectedValue: 200, tolerance: 0.01 },
        'F3': { type: 'value', expectedValue: 450, tolerance: 0.01 },
        'F4': { type: 'value', expectedValue: 100, tolerance: 0.01 },
        'F5': { type: 'value', expectedValue: 200, tolerance: 0.01 },
        'F6': { type: 'value', expectedValue: 750, tolerance: 0.01 },
        'I2': { type: 'value', expectedValue: 5, tolerance: 0.01 },
        'I3': { type: 'value', expectedValue: 1700, tolerance: 0.01 },
        'I4': { type: 'value', expectedValue: 340, tolerance: 0.01 },
        'I5': { type: 'value', expectedValue: '产品B', tolerance: 0.01 }
      },
      hints: [
        '首先计算金额列：金额=数量×单价',
        '使用AVERAGE计算缺失值的填充值',
        '使用COUNT函数计算总订单数',
        '使用SUM函数计算总销售额',
        '使用MODE函数查找最畅销产品'
      ],
      steps: [
        '步骤1: 观察数据，发现D5单元格数量缺失',
        '步骤2: 在D5单元格输入"=ROUND(AVERAGE(D2:D4,D6),0)"，用平均值填充缺失值',
        '步骤3: 在F2单元格输入"=D2*E2"，计算订单金额',
        '步骤4: 向下拖动填充柄到F6，计算所有订单金额',
        '步骤5: 在I2单元格输入"=COUNTA(A2:A6)"，计算总订单数',
        '步骤6: 在I3单元格输入"=SUM(F2:F6)"，计算总销售额',
        '步骤7: 在I4单元格输入"=I3/I2"，计算平均订单金额',
        '步骤8: 在I5单元格输入"=MODE(C2:C6)"，查找最畅销产品',
        '步骤9: 检查所有计算结果是否正确',
        '步骤10: 提交任务，验证结果'
      ]
    },
    'task-comprehensive-2': {
      taskId: 'task-comprehensive-2',
      skillPoint: '综合应用',
      level: '中级',
      title: '季度销售报表制作',
      description: '整理季度销售数据，使用高级查询功能，制作可视化图表',
      initialData: {
        sheetName: '季度销售',
        cellData: {
          'A1': { v: '月份' },
          'B1': { v: '产品' },
          'C1': { v: '地区' },
          'D1': { v: '销售额' },
          'A2': { v: '1' },
          'B2': { v: '产品A' },
          'C2': { v: '北京' },
          'D2': { v: 1000 },
          'A3': { v: '1' },
          'B3': { v: '产品B' },
          'C3': { v: '上海' },
          'D3': { v: 1500 },
          'A4': { v: '2' },
          'B4': { v: '产品A' },
          'C4': { v: '上海' },
          'D4': { v: 1200 },
          'A5': { v: '2' },
          'B5': { v: '产品B' },
          'C5': { v: '北京' },
          'D5': { v: 1800 },
          'A6': { v: '3' },
          'B6': { v: '产品A' },
          'C6': { v: '北京' },
          'D6': { v: 1100 },
          'A7': { v: '3' },
          'B7': { v: '产品B' },
          'C7': { v: '上海' },
          'D7': { v: 1600 },
          'F1': { v: '产品销售查询' },
          'F2': { v: '选择产品' },
          'G2': { v: '产品A' },
          'F3': { v: '总销售额' },
          'F4': { v: '最高月份' },
          'F5': { v: '最低月份' }
        },
        rowCount: 20,
        columnCount: 10
      },
      targetCells: ['G3:G5', 'A10'],
      validationRules: {
        'G3': { type: 'value', expectedValue: 3300, tolerance: 0.01 },
        'G4': { type: 'value', expectedValue: 2, tolerance: 0.01 },
        'G5': { type: 'value', expectedValue: 3, tolerance: 0.01 },
        'A10': { type: 'value', expectedValue: '图表' }
      },
      hints: [
        '使用SUMIFS函数按产品查询总销售额',
        '使用INDEX-MATCH查找最高和最低销售额对应的月份',
        '选择产品A的数据制作折线图'
      ],
      steps: [
        '步骤1: 在G3单元格输入"=SUMIFS(D2:D7,B2:B7,G2)"，计算产品A的总销售额',
        '步骤2: 在G4单元格输入"=INDEX(A2:A7,MATCH(MAX(IF(B2:B7=G2,D2:D7)),D2:D7,0))"',
        '步骤3: 在G5单元格输入"=INDEX(A2:A7,MATCH(MIN(IF(B2:B7=G2,D2:D7)),D2:D7,0))"',
        '步骤4: 筛选出产品A的数据（A2:D7中B列=产品A）',
        '步骤5: 选择筛选后的月份和销售额数据',
        '步骤6: 插入折线图，展示产品A的月度销售趋势',
        '步骤7: 调整图表标题和格式',
        '步骤8: 检查查询结果和图表是否正确',
        '步骤9: 提交任务，验证结果'
      ]
    },
    'task-comprehensive-3': {
      taskId: 'task-comprehensive-3',
      skillPoint: '综合应用',
      level: '高级',
      title: '销售数据分析与预测',
      description: '使用数据透视表分析数据，进行统计推断，并预测下季度销售额',
      initialData: {
        sheetName: '销售预测',
        cellData: {
          'A1': { v: '季度' },
          'B1': { v: '产品' },
          'C1': { v: '地区' },
          'D1': { v: '销售额' },
          'A2': { v: 'Q1' },
          'B2': { v: '产品A' },
          'C2': { v: '北京' },
          'D2': { v: 1000 },
          'A3': { v: 'Q1' },
          'B3': { v: '产品B' },
          'C3': { v: '上海' },
          'D3': { v: 1500 },
          'A4': { v: 'Q2' },
          'B4': { v: '产品A' },
          'C4': { v: '上海' },
          'D4': { v: 1200 },
          'A5': { v: 'Q2' },
          'B5': { v: '产品B' },
          'C5': { v: '北京' },
          'D5': { v: 1800 },
          'A6': { v: 'Q3' },
          'B6': { v: '产品A' },
          'C6': { v: '北京' },
          'D6': { v: 1100 },
          'A7': { v: 'Q3' },
          'B7': { v: '产品B' },
          'C7': { v: '上海' },
          'D7': { v: 1600 },
          'F1': { v: '统计分析' },
          'F2': { v: '季度平均销售额' },
          'F3': { v: '销售额标准差' },
          'F4': { v: '产品A与B的相关系数' },
          'F5': { v: 'Q4预测销售额（产品A）' },
          'F6': { v: 'Q4预测销售额（产品B）' }
        },
        rowCount: 20,
        columnCount: 10
      },
      targetCells: ['G2:G6', 'A10'],
      validationRules: {
        'G2': { type: 'value', expectedValue: 1366.67, tolerance: 1 },
        'G3': { type: 'value', expectedValue: 314.11, tolerance: 1 },
        'G4': { type: 'value', expectedValue: 0.5, tolerance: 0.1 },
        'G5': { type: 'value', expectedValue: 1100, tolerance: 50 },
        'G6': { type: 'value', expectedValue: 1633.33, tolerance: 50 },
        'A10': { type: 'value', expectedValue: '数据透视表' }
      },
      hints: [
        '首先创建数据透视表，按季度和产品汇总销售额',
        '使用AVERAGE、STDEV、CORREL等统计函数',
        '使用移动平均法预测Q4销售额'
      ],
      steps: [
        '步骤1: 选择A1:D7数据，创建数据透视表',
        '步骤2: 将季度拖到行，产品拖到列，销售额拖到值',
        '步骤3: 在G2单元格输入"=AVERAGE(D2:D7)"，计算季度平均销售额',
        '步骤4: 在G3单元格输入"=STDEV(D2:D7)"，计算销售额标准差',
        '步骤5: 在G4单元格输入"=CORREL(IF(B2:B7=\"产品A\",D2:D7,0),IF(B2:B7=\"产品B\",D2:D7,0))"',
        '步骤6: 在G5单元格输入"=AVERAGE(1000,1200,1100)"，预测产品A Q4销售额',
        '步骤7: 在G6单元格输入"=AVERAGE(1500,1800,1600)"，预测产品B Q4销售额',
        '步骤8: 检查数据透视表和统计分析结果',
        '步骤9: 提交任务，验证结果'
      ]
    },
    'task-comprehensive-4': {
      taskId: 'task-comprehensive-4',
      skillPoint: '综合应用',
      level: '高级',
      title: '学生成绩管理系统',
      description: '使用数组公式计算成绩，设置条件格式，添加数据验证',
      initialData: {
        sheetName: '成绩管理',
        cellData: {
          'A1': { v: '学号' },
          'B1': { v: '姓名' },
          'C1': { v: '语文' },
          'D1': { v: '数学' },
          'E1': { v: '英语' },
          'F1': { v: '总分' },
          'G1': { v: '平均分' },
          'H1': { v: '等级' },
          'A2': { v: 'S001' },
          'B2': { v: '张三' },
          'C2': { v: 85 },
          'D2': { v: 92 },
          'E2': { v: 78 },
          'A3': { v: 'S002' },
          'B3': { v: '李四' },
          'C3': { v: 90 },
          'D3': { v: 88 },
          'E3': { v: 95 },
          'A4': { v: 'S003' },
          'B4': { v: '王五' },
          'C4': { v: 72 },
          'D4': { v: 65 },
          'E4': { v: 80 },
          'A5': { v: 'S004' },
          'B5': { v: '赵六' },
          'C5': { v: 95 },
          'D5': { v: 98 },
          'E5': { v: 92 },
          'J1': { v: '成绩查询' },
          'J2': { v: '选择学号' },
          'K2': { v: 'S001' }
        },
        rowCount: 20,
        columnCount: 12
      },
      targetCells: ['F2:G5', 'H2:H5', 'C2:E5'],
      validationRules: {
        'F2': { type: 'value', expectedValue: 255, tolerance: 0.01 },
        'F3': { type: 'value', expectedValue: 273, tolerance: 0.01 },
        'F4': { type: 'value', expectedValue: 217, tolerance: 0.01 },
        'F5': { type: 'value', expectedValue: 285, tolerance: 0.01 },
        'G2': { type: 'value', expectedValue: 85, tolerance: 0.01 },
        'G3': { type: 'value', expectedValue: 91, tolerance: 0.01 },
        'G4': { type: 'value', expectedValue: 72.33, tolerance: 0.01 },
        'G5': { type: 'value', expectedValue: 95, tolerance: 0.01 },
        'H2': { type: 'value', expectedValue: '良好' },
        'H3': { type: 'value', expectedValue: '优秀' },
        'H4': { type: 'value', expectedValue: '及格' },
        'H5': { type: 'value', expectedValue: '优秀' }
      },
      hints: [
        '使用数组公式同时计算总分和平均分',
        '使用IF函数嵌套计算等级：90+优秀，80-89良好，60-79及格，<60不及格',
        '设置条件格式：平均分<60红色，60-79黄色，80+绿色',
        '为K2单元格添加数据验证下拉菜单，选择学号'
      ],
      steps: [
        '步骤1: 选择F2:F5单元格区域',
        '步骤2: 输入数组公式"=C2:C5+D2:D5+E2:E5"，按Ctrl+Shift+Enter确认',
        '步骤3: 选择G2:G5单元格区域',
        '步骤4: 输入数组公式"=F2:F5/3"，按Ctrl+Shift+Enter确认',
        '步骤5: 在H2单元格输入"=IF(G2>=90,\"优秀\",IF(G2>=80,\"良好\",IF(G2>=60,\"及格\",\"不及格\")))"',
        '步骤6: 向下拖动填充柄到H5单元格',
        '步骤7: 选择G2:G5单元格，设置条件格式：<60红色填充，60-79黄色填充，80+绿色填充',
        '步骤8: 选择K2单元格，添加数据验证，来源为A2:A5的学号',
        '步骤9: 检查所有计算和设置是否正确',
        '步骤10: 提交任务，验证结果'
      ]
    },
    'task-comprehensive-5': {
      taskId: 'task-comprehensive-5',
      skillPoint: '综合应用',
      level: '高级',
      title: '客户订单数据分析',
      description: '清洗客户订单数据，使用高级查询功能，创建数据透视表分析',
      initialData: {
        sheetName: '客户订单',
        cellData: {
          'A1': { v: '订单号' },
          'B1': { v: '客户' },
          'C1': { v: '产品' },
          'D1': { v: '数量' },
          'E1': { v: '单价' },
          'F1': { v: '日期' },
          'A2': { v: '1001' },
          'B2': { v: '客户A' },
          'C2': { v: '产品X' },
          'D2': { v: 5 },
          'E2': { v: 100 },
          'F2': { v: '2023-01-05' },
          'A3': { v: '1002' },
          'B3': { v: '客户B' },
          'C3': { v: '产品Y' },
          'D3': { v: null },
          'E3': { v: 200 },
          'F3': { v: '2023-01-10' },
          'A4': { v: '1003' },
          'B4': { v: '客户A' },
          'C4': { v: '产品Z' },
          'D4': { v: 3 },
          'E4': { v: 150 },
          'F4': { v: '2023-01-15' },
          'A5': { v: '1004' },
          'B5': { v: '客户C' },
          'C5': { v: '产品X' },
          'D5': { v: 2 },
          'E5': { v: 100 },
          'F5': { v: '2023-01-20' },
          'A6': { v: '1005' },
          'B6': { v: '客户B' },
          'C6': { v: '产品Y' },
          'D6': { v: 4 },
          'E6': { v: 200 },
          'F6': { v: '2023-01-25' },
          'A7': { v: '1006' },
          'B7': { v: '客户A' },
          'C7': { v: '产品Y' },
          'D7': { v: 1 },
          'E7': { v: 200 },
          'F7': { v: '2023-02-01' },
          'H1': { v: '数据查询' },
          'H2': { v: '选择客户' },
          'I2': { v: '客户A' },
          'H3': { v: '总订单数' },
          'H4': { v: '总金额' },
          'H5': { v: '最常购买产品' }
        },
        rowCount: 20,
        columnCount: 10
      },
      targetCells: ['D3', 'I3:I5', 'A12'],
      validationRules: {
        'D3': { type: 'value', expectedValue: 3, tolerance: 0.01 },
        'I3': { type: 'value', expectedValue: 3, tolerance: 0.01 },
        'I4': { type: 'value', expectedValue: 1150, tolerance: 0.01 },
        'I5': { type: 'value', expectedValue: '产品Y', tolerance: 0.01 },
        'A12': { type: 'value', expectedValue: '数据透视表' }
      },
      hints: [
        '首先清洗D3的缺失值，使用其他订单数量的平均值',
        '使用COUNTIFS和SUMIFS查询客户数据',
        '创建数据透视表分析客户购买行为'
      ],
      steps: [
        '步骤1: 观察数据，发现D3单元格数量缺失',
        '步骤2: 在D3单元格输入"=ROUND(AVERAGE(D2,D4:D7),0)"，用平均值填充缺失值',
        '步骤3: 在I3单元格输入"=COUNTIFS(B2:B7,I2)"，计算客户A的总订单数',
        '步骤4: 在I4单元格输入"=SUMIFS(D2:D7*E2:E7,B2:B7,I2)"，计算总金额',
        '步骤5: 在I5单元格输入"=MODE(IF(B2:B7=I2,C2:C7))"，查找最常购买产品',
        '步骤6: 创建数据透视表，将客户拖到行，产品拖到列，数量拖到值',
        '步骤7: 检查数据清洗、查询结果和透视表',
        '步骤8: 提交任务，验证结果'
      ]
    },
    'task-comprehensive-6': {
      taskId: 'task-comprehensive-6',
      skillPoint: '综合应用',
      level: '高级',
      title: '年度销售报告与仪表盘',
      description: '制作销售图表，创建动态仪表盘，完成完整的商业报告',
      initialData: {
        sheetName: '年度销售报告',
        cellData: {
          'A1': { v: '月份' },
          'B1': { v: '产品A' },
          'C1': { v: '产品B' },
          'D1': { v: '产品C' },
          'E1': { v: '总销售额' },
          'A2': { v: '1月' },
          'B2': { v: 1000 },
          'C2': { v: 1500 },
          'D2': { v: 800 },
          'A3': { v: '2月' },
          'B3': { v: 1200 },
          'C3': { v: 1300 },
          'D3': { v: 900 },
          'A4': { v: '3月' },
          'B4': { v: 1100 },
          'C4': { v: 1600 },
          'D4': { v: 1000 },
          'A5': { v: '4月' },
          'B5': { v: 1300 },
          'C5': { v: 1400 },
          'D5': { v: 1100 },
          'A6': { v: '5月' },
          'B6': { v: 1400 },
          'C6': { v: 1700 },
          'D6': { v: 1200 },
          'A7': { v: '6月' },
          'B7': { v: 1500 },
          'C7': { v: 1800 },
          'D7': { v: 1300 },
          'G1': { v: '仪表盘控制' },
          'G2': { v: '选择产品' },
          'H2': { v: '产品A' },
          'G3': { v: '选择月份范围' },
          'H3': { v: 1 },
          'I3': { v: 6 },
          'K1': { v: '关键指标' },
          'K2': { v: '上半年总销售额' },
          'K3': { v: '月均销售额' },
          'K4': { v: '最佳销售月份' },
          'K5': { v: '增长趋势' }
        },
        rowCount: 25,
        columnCount: 15
      },
      targetCells: ['E2:E7', 'L2:L5', 'A10', 'A15'],
      validationRules: {
        'E2': { type: 'value', expectedValue: 3300, tolerance: 0.01 },
        'E3': { type: 'value', expectedValue: 3400, tolerance: 0.01 },
        'E4': { type: 'value', expectedValue: 3700, tolerance: 0.01 },
        'E5': { type: 'value', expectedValue: 3800, tolerance: 0.01 },
        'E6': { type: 'value', expectedValue: 4300, tolerance: 0.01 },
        'E7': { type: 'value', expectedValue: 4600, tolerance: 0.01 },
        'L2': { type: 'value', expectedValue: 23100, tolerance: 0.01 },
        'L3': { type: 'value', expectedValue: 3850, tolerance: 0.01 },
        'L4': { type: 'value', expectedValue: '6月', tolerance: 0.01 },
        'L5': { type: 'value', expectedValue: '上升', tolerance: 0.01 },
        'A10': { type: 'value', expectedValue: '组合图表' },
        'A15': { type: 'value', expectedValue: '商业报告' }
      },
      hints: [
        '首先计算总销售额列',
        '使用SUM、AVERAGE、INDEX-MATCH等函数计算关键指标',
        '创建组合图表：总销售额用柱状图，各产品用折线图',
        '为H2添加数据验证下拉菜单',
        '最后整理商业报告格式'
      ],
      steps: [
        '步骤1: 在E2单元格输入"=B2+C2+D2"，计算1月总销售额',
        '步骤2: 向下拖动填充柄到E7，计算所有月份总销售额',
        '步骤3: 在L2单元格输入"=SUM(E2:E7)"，计算上半年总销售额',
        '步骤4: 在L3单元格输入"=L2/6"，计算月均销售额',
        '步骤5: 在L4单元格输入"=INDEX(A2:A7,MATCH(MAX(E2:E7),E2:E7,0))"',
        '步骤6: 在L5单元格输入"=IF(E7>E2,\"上升\",\"下降\")"',
        '步骤7: 选择A1:D7数据，创建组合图表',
        '步骤8: 为H2单元格添加数据验证，来源为B1:D1',
        '步骤9: 整理商业报告格式，添加标题、边框、条件格式',
        '步骤10: 检查所有计算、图表和报告',
        '步骤11: 提交任务，验证结果'
      ]
    },
    'task-comprehensive-7': {
      taskId: 'task-comprehensive-7',
      skillPoint: '综合应用',
      level: '中级',
      title: '数据分析函数与公式应用',
      description: '掌握数据分析中常用的函数和公式，包括统计、查找、文本和日期函数',
      initialData: {
        sheetName: '数据分析函数',
        cellData: {
          'A1': { v: '员工ID' },
          'B1': { v: '姓名' },
          'C1': { v: '部门' },
          'D1': { v: '入职日期' },
          'E1': { v: '基本工资' },
          'F1': { v: '绩效奖金' },
          'G1': { v: '总薪资' },
          'A2': { v: 'E001' },
          'B2': { v: '张三' },
          'C2': { v: '销售部' },
          'D2': { v: '2022-01-15' },
          'E2': { v: 8000 },
          'F2': { v: 2000 },
          'A3': { v: 'E002' },
          'B3': { v: '李四' },
          'C3': { v: '技术部' },
          'D3': { v: '2021-03-10' },
          'E3': { v: 10000 },
          'F3': { v: 3000 },
          'A4': { v: 'E003' },
          'B4': { v: '王五' },
          'C4': { v: '销售部' },
          'D4': { v: '2022-05-20' },
          'E4': { v: 7500 },
          'F4': { v: 1500 },
          'A5': { v: 'E004' },
          'B5': { v: '赵六' },
          'C5': { v: '技术部' },
          'D5': { v: '2020-11-05' },
          'E5': { v: 12000 },
          'F5': { v: 4000 },
          'A6': { v: 'E005' },
          'B6': { v: '钱七' },
          'C6': { v: '市场部' },
          'D6': { v: '2023-02-18' },
          'E6': { v: 9000 },
          'F6': { v: 2500 },
          'I1': { v: '数据分析' },
          'I2': { v: '统计分析' },
          'I3': { v: '平均薪资' },
          'I4': { v: '薪资中位数' },
          'I5': { v: '薪资标准差' },
          'I6': { v: '部门分析' },
          'I7': { v: '销售部平均薪资' },
          'I8': { v: '技术部平均薪资' },
          'I9': { v: '市场部平均薪资' },
          'I10': { v: '其他分析' },
          'I11': { v: '员工ID查询' },
          'J11': { v: 'E001' },
          'I12': { v: '对应姓名' },
          'I13': { v: '对应部门' },
          'I14': { v: '入职年限' }
        },
        rowCount: 20,
        columnCount: 12
      },
      targetCells: ['G2:G6', 'J3:J9', 'J12:J14'],
      validationRules: {
        'G2': { type: 'value', expectedValue: 10000, tolerance: 0.01 },
        'G3': { type: 'value', expectedValue: 13000, tolerance: 0.01 },
        'G4': { type: 'value', expectedValue: 9000, tolerance: 0.01 },
        'G5': { type: 'value', expectedValue: 16000, tolerance: 0.01 },
        'G6': { type: 'value', expectedValue: 11500, tolerance: 0.01 },
        'J3': { type: 'value', expectedValue: 11900, tolerance: 0.01 },
        'J4': { type: 'value', expectedValue: 11500, tolerance: 0.01 },
        'J5': { type: 'value', expectedValue: 2618.6, tolerance: 1 },
        'J7': { type: 'value', expectedValue: 9500, tolerance: 0.01 },
        'J8': { type: 'value', expectedValue: 14500, tolerance: 0.01 },
        'J9': { type: 'value', expectedValue: 11500, tolerance: 0.01 },
        'J12': { type: 'value', expectedValue: '张三', tolerance: 0.01 },
        'J13': { type: 'value', expectedValue: '销售部', tolerance: 0.01 },
        'J14': { type: 'value', expectedValue: 4, tolerance: 0.1 }
      },
      hints: [
        '使用SUM函数计算总薪资',
        '使用AVERAGE、MEDIAN、STDEV函数进行统计分析',
        '使用AVERAGEIF函数按部门计算平均薪资',
        '使用VLOOKUP函数根据员工ID查询信息',
        '使用DATEDIF函数计算入职年限'
      ],
      steps: [
        '步骤1: 在G2单元格输入"=E2+F2"，计算张三的总薪资',
        '步骤2: 向下拖动填充柄到G6，计算所有员工的总薪资',
        '步骤3: 在J3单元格输入"=AVERAGE(G2:G6)"，计算平均薪资',
        '步骤4: 在J4单元格输入"=MEDIAN(G2:G6)"，计算薪资中位数',
        '步骤5: 在J5单元格输入"=STDEV(G2:G6)"，计算薪资标准差',
        '步骤6: 在J7单元格输入"=AVERAGEIF(C2:C6,\"销售部\",G2:G6)"，计算销售部平均薪资',
        '步骤7: 在J8单元格输入"=AVERAGEIF(C2:C6,\"技术部\",G2:G6)"，计算技术部平均薪资',
        '步骤8: 在J9单元格输入"=AVERAGEIF(C2:C6,\"市场部\",G2:G6)"，计算市场部平均薪资',
        '步骤9: 在J12单元格输入"=VLOOKUP(J11,A2:G6,2,FALSE)"，根据员工ID查询姓名',
        '步骤10: 在J13单元格输入"=VLOOKUP(J11,A2:G6,3,FALSE)"，根据员工ID查询部门',
        '步骤11: 在J14单元格输入"=DATEDIF(VLOOKUP(J11,A2:G6,4,FALSE),TODAY(),\"y\")"，计算入职年限',
        '步骤12: 检查所有计算结果是否正确',
        '步骤13: 提交任务，验证结果'
      ]
    },
    // 基本预算任务
    'task-budget-1': {
      taskId: 'task-budget-1',
      skillPoint: '基本预算',
      level: '初级',
      title: '个人月度预算编制',
      description: '使用基本公式编制个人月度预算，包括收入、支出和结余计算',
      initialData: {
        sheetName: '个人预算',
        cellData: {
          'A1': { v: '项目' },
          'B1': { v: '预算金额' },
          'C1': { v: '实际金额' },
          'D1': { v: '差异' },
          'A2': { v: '收入' },
          'A3': { v: '工资' },
          'A4': { v: '奖金' },
          'A5': { v: '其他收入' },
          'A6': { v: '总收入' },
          'A7': { v: '支出' },
          'A8': { v: '房租' },
          'A9': { v: '餐饮' },
          'A10': { v: '交通' },
          'A11': { v: '娱乐' },
          'A12': { v: '其他支出' },
          'A13': { v: '总支出' },
          'A14': { v: '结余' },
          'B3': { v: 8000 },
          'B4': { v: 1000 },
          'B5': { v: 500 },
          'B8': { v: 3000 },
          'B9': { v: 1500 },
          'B10': { v: 800 },
          'B11': { v: 1000 },
          'B12': { v: 700 },
          'C3': { v: 8000 },
          'C4': { v: 800 },
          'C5': { v: 600 },
          'C8': { v: 3000 },
          'C9': { v: 1800 },
          'C10': { v: 750 },
          'C11': { v: 900 },
          'C12': { v: 650 }
        },
        rowCount: 20,
        columnCount: 4
      },
      targetCells: ['B6', 'B13', 'B14', 'C6', 'C13', 'C14', 'D3:D14'],
      validationRules: {
        'B6': { type: 'value', expectedValue: 9500, tolerance: 0.01 },
        'B13': { type: 'value', expectedValue: 7000, tolerance: 0.01 },
        'B14': { type: 'value', expectedValue: 2500, tolerance: 0.01 },
        'C6': { type: 'value', expectedValue: 9400, tolerance: 0.01 },
        'C13': { type: 'value', expectedValue: 7100, tolerance: 0.01 },
        'C14': { type: 'value', expectedValue: 2300, tolerance: 0.01 },
        'D6': { type: 'value', expectedValue: -100, tolerance: 0.01 },
        'D14': { type: 'value', expectedValue: -200, tolerance: 0.01 }
      },
      hints: [
        '使用SUM函数计算总收入和总支出',
        '使用公式计算结余：收入-支出',
        '使用公式计算差异：实际-预算'
      ],
      steps: [
        '步骤1: 在B6单元格输入"=SUM(B3:B5)"，计算总预算收入',
        '步骤2: 在B13单元格输入"=SUM(B8:B12)"，计算总预算支出',
        '步骤3: 在B14单元格输入"=B6-B13"，计算预算结余',
        '步骤4: 在C6单元格输入"=SUM(C3:C5)"，计算实际总收入',
        '步骤5: 在C13单元格输入"=SUM(C8:C12)"，计算实际总支出',
        '步骤6: 在C14单元格输入"=C6-C13"，计算实际结余',
        '步骤7: 在D3单元格输入"=C3-B3"，计算工资差异',
        '步骤8: 向下拖动填充柄到D14，计算所有项目的差异',
        '步骤9: 检查所有计算结果是否正确',
        '步骤10: 提交任务，验证结果'
      ]
    },
    'task-budget-2': {
      taskId: 'task-budget-2',
      skillPoint: '基本预算',
      level: '中级',
      title: '家庭年度预算规划',
      description: '使用高级函数进行家庭年度预算规划，包括月度分解和年度汇总',
      initialData: {
        sheetName: '家庭预算',
        cellData: {
          'A1': { v: '项目' },
          'B1': { v: '年度预算' },
          'C1': { v: '1月' },
          'D1': { v: '2月' },
          'E1': { v: '3月' },
          'F1': { v: '4月' },
          'G1': { v: '5月' },
          'H1': { v: '6月' },
          'I1': { v: '7月' },
          'J1': { v: '8月' },
          'K1': { v: '9月' },
          'L1': { v: '10月' },
          'M1': { v: '11月' },
          'N1': { v: '12月' },
          'O1': { v: '实际年度' },
          'A2': { v: '收入' },
          'A3': { v: '工资收入' },
          'A4': { v: '投资收益' },
          'A5': { v: '其他收入' },
          'A6': { v: '总收入' },
          'A7': { v: '支出' },
          'A8': { v: '住房' },
          'A9': { v: '食品' },
          'A10': { v: '交通' },
          'A11': { v: '医疗' },
          'A12': { v: '教育' },
          'A13': { v: '娱乐' },
          'A14': { v: '其他支出' },
          'A15': { v: '总支出' },
          'A16': { v: '年度结余' },
          'B3': { v: 120000 },
          'B4': { v: 12000 },
          'B5': { v: 6000 },
          'B8': { v: 48000 },
          'B9': { v: 24000 },
          'B10': { v: 12000 },
          'B11': { v: 6000 },
          'B12': { v: 18000 },
          'B13': { v: 12000 },
          'B14': { v: 6000 },
          'C3': { v: 10000 },
          'C4': { v: 1000 },
          'C5': { v: 500 },
          'C8': { v: 4000 },
          'C9': { v: 2000 },
          'C10': { v: 1000 },
          'C11': { v: 500 },
          'C12': { v: 1500 },
          'C13': { v: 1000 },
          'C14': { v: 500 }
        },
        rowCount: 20,
        columnCount: 15
      },
      targetCells: ['B6', 'B15', 'B16', 'C6', 'C15', 'C16', 'O3:O16'],
      validationRules: {
        'B6': { type: 'value', expectedValue: 138000, tolerance: 0.01 },
        'B15': { type: 'value', expectedValue: 126000, tolerance: 0.01 },
        'B16': { type: 'value', expectedValue: 12000, tolerance: 0.01 },
        'C6': { type: 'value', expectedValue: 11500, tolerance: 0.01 },
        'C15': { type: 'value', expectedValue: 10500, tolerance: 0.01 },
        'C16': { type: 'value', expectedValue: 1000, tolerance: 0.01 },
        'O6': { type: 'value', expectedValue: 138000, tolerance: 0.01 },
        'O16': { type: 'value', expectedValue: 12000, tolerance: 0.01 }
      },
      hints: [
        '使用SUM函数计算年度总和',
        '使用公式将年度预算分解到月度',
        '使用SUM函数汇总实际年度数据'
      ],
      steps: [
        '步骤1: 在B6单元格输入"=SUM(B3:B5)"，计算年度总收入',
        '步骤2: 在B15单元格输入"=SUM(B8:B14)"，计算年度总支出',
        '步骤3: 在B16单元格输入"=B6-B15"，计算年度结余',
        '步骤4: 在C6单元格输入"=SUM(C3:C5)"，计算1月总收入',
        '步骤5: 在C15单元格输入"=SUM(C8:C14)"，计算1月总支出',
        '步骤6: 在C16单元格输入"=C6-C15"，计算1月结余',
        '步骤7: 向右拖动C3:C16的填充柄到N列，完成12个月的预算',
        '步骤8: 在O3单元格输入"=SUM(C3:N3)"，计算工资收入年度实际',
        '步骤9: 向下拖动O3的填充柄到O16，计算所有项目的年度实际',
        '步骤10: 检查所有计算结果是否正确',
        '步骤11: 提交任务，验证结果'
      ]
    },
    'task-budget-3': {
      taskId: 'task-budget-3',
      skillPoint: '基本预算',
      level: '中级',
      title: '企业部门预算分析',
      description: '使用条件函数和查找函数进行企业部门预算分析',
      initialData: {
        sheetName: '部门预算',
        cellData: {
          'A1': { v: '部门' },
          'B1': { v: '预算金额' },
          'C1': { v: '实际支出' },
          'D1': { v: '差异' },
          'E1': { v: '差异率' },
          'F1': { v: '预算状态' },
          'A2': { v: '销售部' },
          'A3': { v: '技术部' },
          'A4': { v: '市场部' },
          'A5': { v: '人力资源部' },
          'A6': { v: '财务部' },
          'B2': { v: 500000 },
          'B3': { v: 800000 },
          'B4': { v: 300000 },
          'B5': { v: 200000 },
          'B6': { v: 150000 },
          'C2': { v: 480000 },
          'C3': { v: 820000 },
          'C4': { v: 290000 },
          'C5': { v: 210000 },
          'C6': { v: 145000 },
          'G1': { v: '预算分析' },
          'G2': { v: '总预算' },
          'G3': { v: '总实际' },
          'G4': { v: '总差异' },
          'G5': { v: '平均差异率' },
          'G6': { v: '预算控制最佳部门' }
        },
        rowCount: 15,
        columnCount: 8
      },
      targetCells: ['D2:F6', 'H2:H6'],
      validationRules: {
        'D2': { type: 'value', expectedValue: -20000, tolerance: 0.01 },
        'D3': { type: 'value', expectedValue: 20000, tolerance: 0.01 },
        'E2': { type: 'value', expectedValue: -4, tolerance: 0.01 },
        'E3': { type: 'value', expectedValue: 2.5, tolerance: 0.01 },
        'F2': { type: 'value', expectedValue: '良好' },
        'F3': { type: 'value', expectedValue: '超支' },
        'H2': { type: 'value', expectedValue: 1950000, tolerance: 0.01 },
        'H6': { type: 'value', expectedValue: '销售部' }
      },
      hints: [
        '使用公式计算差异：实际-预算',
        '使用公式计算差异率：(实际-预算)/预算*100',
        '使用IF函数判断预算状态',
        '使用MIN函数查找预算控制最佳部门'
      ],
      steps: [
        '步骤1: 在D2单元格输入"=C2-B2"，计算销售部差异',
        '步骤2: 向下拖动D2的填充柄到D6，计算所有部门差异',
        '步骤3: 在E2单元格输入"=D2/B2*100"，计算销售部差异率',
        '步骤4: 向下拖动E2的填充柄到E6，计算所有部门差异率',
        '步骤5: 在F2单元格输入"=IF(D2<0,IF(D2/B2*100>=-5,\"良好\",\"节约\"),IF(D2/B2*100<=5,\"超支\",\"严重超支\"))"',
        '步骤6: 向下拖动F2的填充柄到F6，判断所有部门预算状态',
        '步骤7: 在H2单元格输入"=SUM(B2:B6)"，计算总预算',
        '步骤8: 在H3单元格输入"=SUM(C2:C6)"，计算总实际',
        '步骤9: 在H4单元格输入"=H3-H2"，计算总差异',
        '步骤10: 在H5单元格输入"=AVERAGE(E2:E6)"，计算平均差异率',
        '步骤11: 在H6单元格输入"=INDEX(A2:A6,MATCH(MIN(E2:E6),E2:E6,0))"，查找预算控制最佳部门',
        '步骤12: 检查所有计算结果是否正确',
        '步骤13: 提交任务，验证结果'
      ]
    },
    'task-budget-4': {
      taskId: 'task-budget-4',
      skillPoint: '基本预算',
      level: '高级',
      title: '预算差异分析与调整',
      description: '使用高级函数进行预算差异分析和调整建议',
      initialData: {
        sheetName: '预算差异',
        cellData: {
          'A1': { v: '项目' },
          'B1': { v: '年度预算' },
          'C1': { v: '上半年实际' },
          'D1': { v: '上半年差异' },
          'E1': { v: '差异率' },
          'F1': { v: '下半年预算调整' },
          'G1': { v: '全年预计' },
          'A2': { v: '销售收入' },
          'A3': { v: '销售成本' },
          'A4': { v: '销售费用' },
          'A5': { v: '管理费用' },
          'A6': { v: '研发费用' },
          'A7': { v: '净利润' },
          'B2': { v: 2000000 },
          'B3': { v: 1200000 },
          'B4': { v: 200000 },
          'B5': { v: 150000 },
          'B6': { v: 250000 },
          'C2': { v: 1100000 },
          'C3': { v: 650000 },
          'C4': { v: 110000 },
          'C5': { v: 80000 },
          'C6': { v: 130000 }
        },
        rowCount: 15,
        columnCount: 8
      },
      targetCells: ['D2:G7'],
      validationRules: {
        'D2': { type: 'value', expectedValue: 100000, tolerance: 0.01 },
        'D7': { type: 'value', expectedValue: 30000, tolerance: 0.01 },
        'E2': { type: 'value', expectedValue: 10, tolerance: 0.01 },
        'F2': { type: 'value', expectedValue: 1100000, tolerance: 0.01 },
        'G7': { type: 'value', expectedValue: 110000, tolerance: 0.01 }
      },
      hints: [
        '使用公式计算差异和差异率',
        '使用IF函数根据差异率调整下半年预算',
        '使用公式计算全年预计'
      ],
      steps: [
        '步骤1: 在D2单元格输入"=C2-B2/2"，计算上半年销售收入差异',
        '步骤2: 向下拖动D2的填充柄到D6，计算所有项目的上半年差异',
        '步骤3: 在D7单元格输入"=C2-C3-C4-C5-C6"，计算上半年净利润',
        '步骤4: 在E2单元格输入"=D2/(B2/2)*100"，计算销售收入差异率',
        '步骤5: 向下拖动E2的填充柄到E7，计算所有项目的差异率',
        '步骤6: 在F2单元格输入"=IF(E2>0,B2/2*(1+E2/100),B2/2)"，调整下半年销售收入预算',
        '步骤7: 在F3单元格输入"=IF(E3>0,B3/2*(1+E3/100),B3/2)"，调整下半年销售成本预算',
        '步骤8: 类似地，为其他费用项目输入调整公式',
        '步骤9: 在F7单元格输入"=F2-F3-F4-F5-F6"，计算下半年预计净利润',
        '步骤10: 在G2单元格输入"=C2+F2"，计算全年预计销售收入',
        '步骤11: 向下拖动G2的填充柄到G7，计算所有项目的全年预计',
        '步骤12: 检查所有计算结果是否正确',
        '步骤13: 提交任务，验证结果'
      ]
    },
    'task-budget-5': {
      taskId: 'task-budget-5',
      skillPoint: '基本预算',
      level: '高级',
      title: '多维度预算模型构建',
      description: '使用数组公式和高级函数构建多维度预算模型',
      initialData: {
        sheetName: '预算模型',
        cellData: {
          'A1': { v: '产品' },
          'B1': { v: '地区' },
          'C1': { v: '季度' },
          'D1': { v: '销量' },
          'E1': { v: '单价' },
          'F1': { v: '销售收入' },
          'G1': { v: '成本率' },
          'H1': { v: '销售成本' },
          'I1': { v: '毛利率' },
          'A2': { v: '产品A' },
          'A3': { v: '产品A' },
          'A4': { v: '产品A' },
          'A5': { v: '产品A' },
          'A6': { v: '产品B' },
          'A7': { v: '产品B' },
          'A8': { v: '产品B' },
          'A9': { v: '产品B' },
          'B2': { v: '华东' },
          'B3': { v: '华东' },
          'B4': { v: '华北' },
          'B5': { v: '华北' },
          'B6': { v: '华东' },
          'B7': { v: '华东' },
          'B8': { v: '华北' },
          'B9': { v: '华北' },
          'C2': { v: 'Q1' },
          'C3': { v: 'Q2' },
          'C4': { v: 'Q1' },
          'C5': { v: 'Q2' },
          'C6': { v: 'Q1' },
          'C7': { v: 'Q2' },
          'C8': { v: 'Q1' },
          'C9': { v: 'Q2' },
          'D2': { v: 1000 },
          'D3': { v: 1200 },
          'D4': { v: 800 },
          'D5': { v: 900 },
          'D6': { v: 500 },
          'D7': { v: 600 },
          'D8': { v: 400 },
          'D9': { v: 450 },
          'E2': { v: 100 },
          'E3': { v: 100 },
          'E4': { v: 100 },
          'E5': { v: 100 },
          'E6': { v: 150 },
          'E7': { v: 150 },
          'E8': { v: 150 },
          'E9': { v: 150 },
          'G2': { v: 0.6 },
          'G3': { v: 0.6 },
          'G4': { v: 0.6 },
          'G5': { v: 0.6 },
          'G6': { v: 0.5 },
          'G7': { v: 0.5 },
          'G8': { v: 0.5 },
          'G9': { v: 0.5 },
          'K1': { v: '产品维度分析' },
          'K2': { v: '产品A' },
          'K3': { v: '产品B' },
          'K4': { v: '总计' },
          'L1': { v: '总销售收入' },
          'M1': { v: '总销售成本' },
          'N1': { v: '总毛利' },
          'O1': { v: '地区维度分析' },
          'O2': { v: '华东' },
          'O3': { v: '华北' },
          'O4': { v: '总计' },
          'P1': { v: '总销售收入' },
          'Q1': { v: '总销售成本' },
          'R1': { v: '总毛利' }
        },
        rowCount: 20,
        columnCount: 18
      },
      targetCells: ['F2:I9', 'L2:N4', 'P2:R4'],
      validationRules: {
        'F2': { type: 'value', expectedValue: 100000, tolerance: 0.01 },
        'H2': { type: 'value', expectedValue: 60000, tolerance: 0.01 },
        'I2': { type: 'value', expectedValue: 40, tolerance: 0.01 },
        'L2': { type: 'value', expectedValue: 390000, tolerance: 0.01 },
        'L4': { type: 'value', expectedValue: 517500, tolerance: 0.01 },
        'P2': { type: 'value', expectedValue: 345000, tolerance: 0.01 },
        'P4': { type: 'value', expectedValue: 517500, tolerance: 0.01 }
      },
      hints: [
        '使用数组公式计算销售收入和成本',
        '使用SUMIFS函数按产品和地区维度分析',
        '使用公式计算毛利率'
      ],
      steps: [
        '步骤1: 选择F2:F9单元格区域',
        '步骤2: 输入数组公式"=D2:D9*E2:E9"，按Ctrl+Shift+Enter确认，计算销售收入',
        '步骤3: 选择H2:H9单元格区域',
        '步骤4: 输入数组公式"=F2:F9*G2:G9"，按Ctrl+Shift+Enter确认，计算销售成本',
        '步骤5: 选择I2:I9单元格区域',
        '步骤6: 输入数组公式"=(F2:F9-H2:H9)/F2:F9*100"，按Ctrl+Shift+Enter确认，计算毛利率',
        '步骤7: 在L2单元格输入"=SUMIFS(F2:F9,A2:A9,"产品A")"，计算产品A总销售收入',
        '步骤8: 在L3单元格输入"=SUMIFS(F2:F9,A2:A9,"产品B")"，计算产品B总销售收入',
        '步骤9: 在L4单元格输入"=SUM(L2:L3)"，计算总计销售收入',
        '步骤10: 类似地，在M列和N列计算销售成本和毛利',
        '步骤11: 在P2单元格输入"=SUMIFS(F2:F9,B2:B9,"华东")"，计算华东地区总销售收入',
        '步骤12: 在P3单元格输入"=SUMIFS(F2:F9,B2:B9,"华北")"，计算华北地区总销售收入',
        '步骤13: 在P4单元格输入"=SUM(P2:P3)"，计算总计销售收入',
        '步骤14: 类似地，在Q列和R列计算销售成本和毛利',
        '步骤15: 检查所有计算结果是否正确',
        '步骤16: 提交任务，验证结果'
      ]
    }
  };
  
  return tasks[id] || tasks['task-1-1'];
}

// 数值验证函数
function validateValue(actual: any, expected: any, tolerance: number = 0.01): { 
  correct: boolean; 
  errorType?: string; 
  errorMessage: string; 
  suggestion?: string; 
} {
  if (actual === null || actual === undefined) {
    return {
      correct: false,
      errorType: 'missing_value',
      errorMessage: '单元格为空，请输入数值',
      suggestion: '请在单元格中输入正确的数值或公式'
    };
  }

  if (typeof expected === 'number' && typeof actual === 'number') {
    const diff = Math.abs(actual - expected);
    if (diff <= tolerance) {
      return { correct: true, errorMessage: '' };
    } else {
      return {
        correct: false,
        errorType: 'value_mismatch',
        errorMessage: `数值不正确。实际值: ${actual}，期望值: ${expected}，差值: ${diff.toFixed(4)}`,
        suggestion: `请检查您的计算，允许的误差范围是 ±${tolerance}`
      };
    }
  }

  if (typeof expected === 'string' && typeof actual === 'string') {
    if (actual === expected) {
      return { correct: true, errorMessage: '' };
    } else {
      return {
        correct: false,
        errorType: 'text_mismatch',
        errorMessage: `文本不正确。实际值: "${actual}"，期望值: "${expected}"`,
        suggestion: '请检查文本拼写和格式'
      };
    }
  }

  if (String(actual) === String(expected)) {
    return { correct: true, errorMessage: '' };
  }

  return {
    correct: false,
    errorType: 'type_mismatch',
    errorMessage: `类型不匹配。实际类型: ${typeof actual}，期望类型: ${typeof expected}`,
    suggestion: '请确保输入的数据类型正确'
  };
}

// 公式验证函数
function validateFormula(formula: string, fingerprints: string[]): { 
  correct: boolean; 
  errorType?: string; 
  errorMessage: string; 
  suggestion?: string; 
} {
  if (!formula) {
    return {
      correct: false,
      errorType: 'missing_formula',
      errorMessage: '没有检测到公式',
      suggestion: '请输入公式而不是直接输入数值'
    };
  }

  const upperFormula = formula.toUpperCase();
  const missingFunctions: string[] = [];
  
  for (const fingerprint of fingerprints) {
    if (!upperFormula.includes(fingerprint.toUpperCase())) {
      missingFunctions.push(fingerprint);
    }
  }

  if (missingFunctions.length === 0) {
    return { correct: true, errorMessage: '' };
  }

  return {
    correct: false,
    errorType: 'formula_mismatch',
    errorMessage: `公式缺少必要的函数: ${missingFunctions.join(', ')}`,
    suggestion: `请使用 ${fingerprints.join(' 和 ')} 函数`
  };
}

// 格式验证函数
function validateFormat(format: string, expectedFormat: string): { 
  correct: boolean; 
  errorType?: string; 
  errorMessage: string; 
  suggestion?: string; 
} {
  if (format === expectedFormat) {
    return { correct: true, errorMessage: '' };
  }

  const formatNames: Record<string, string> = {
    'currency': '货币',
    'percentage': '百分比',
    'number': '数字',
    'text': '文本',
    'date': '日期'
  };

  return {
    correct: false,
    errorType: 'format_mismatch',
    errorMessage: `格式不正确。当前格式: ${formatNames[format] || format}，期望格式: ${formatNames[expectedFormat] || expectedFormat}`,
    suggestion: `请将单元格格式设置为 ${formatNames[expectedFormat] || expectedFormat}`
  };
}

// 重写的验证函数
function getMockValidationResult(
  taskId: string, 
  data: { 
    targetCells: Record<string, any>; 
    cellValues?: Record<string, any>; 
    formulas?: Record<string, string>;
  }
): ValidationResult {
  const { targetCells, cellValues = {}, formulas = {} } = data;
  const task = getMockTask(taskId);
  
  let success = true;
  const results: Array<{
    cell: string;
    correct: boolean;
    errorType?: string;
    errorMessage: string;
    suggestion?: string;
    actualValue?: any;
    expectedValue?: any;
  }> = [];
  
  for (const [cell, rule] of Object.entries(task.validationRules)) {
    const actualValue = cellValues[cell] || targetCells[cell];
    const formula = formulas[cell] || (typeof targetCells[cell] === 'string' ? targetCells[cell] : '');
    const tolerance = rule.tolerance || 0.01;
    
    let validationResult;
    
    switch (rule.type) {
      case 'value':
        validationResult = validateValue(actualValue, rule.expectedValue, tolerance);
        break;
        
      case 'formula':
        validationResult = validateFormula(formula, rule.formulaFingerprint || []);
        break;
        
      case 'formula_value':
        const formulaCheck = validateFormula(formula, rule.formulaFingerprint || []);
        if (!formulaCheck.correct) {
          validationResult = formulaCheck;
        } else {
          validationResult = validateValue(actualValue, rule.expectedValue, tolerance);
        }
        break;
        
      case 'format':
        validationResult = validateFormat(String(actualValue), rule.format || '');
        break;
        
      default:
        validationResult = validateValue(actualValue, rule.expectedValue, tolerance);
    }
    
    results.push({
      cell,
      correct: validationResult.correct,
      errorType: validationResult.errorType,
      errorMessage: validationResult.errorMessage,
      suggestion: validationResult.suggestion,
      actualValue,
      expectedValue: rule.expectedValue
    });
    
    if (!validationResult.correct) {
      success = false;
    }
  }
  
  const correctCount = results.filter(r => r.correct).length;
  const totalCount = results.length;
  
  return {
    success,
    results,
    experience: success ? 200 : Math.floor((correctCount / totalCount) * 100),
    message: success 
      ? `🎉 任务完成！您正确完成了 ${correctCount}/${totalCount} 个验证点。` 
      : `⚠️ 任务未完成。您正确完成了 ${correctCount}/${totalCount} 个验证点，请检查错误信息并修改。`,
    achievementsUnlocked: success ? ['perfect-answer'] : []
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
    { id: 'perfect-answer', name: '完美答案', description: '一次性通过所有验证点', unlocked: false },
    { id: 'perfect-streak', name: '完美主义者', description: '一次性通过10个关卡', unlocked: false },
    { id: 'function-master', name: '函数大师', description: '正确使用15种不同函数', unlocked: false },
    { id: 'speed-star', name: '速度之星', description: '10个关卡低于平均用时', unlocked: false }
  ];
}
