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
        'C3': { type: 'value', expectedValue: 1250 }
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
        'C7': { type: 'value', expectedValue: 1520 }
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
        'C10': { type: 'value', expectedValue: 0.94 }
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
        'C7': { type: 'value', expectedValue: 1660 }
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
      hints: ['使用LEFT函数提取类别代码', '使用RIGHT函数提取型号'],
      steps: [
        '步骤1: 观察表格数据，了解产品代码的结构',
        '步骤2: 在C2单元格输入"=LEFT(A2,3)"，提取类别代码',
        '步骤3: 在D2单元格输入"=RIGHT(A2,3)"，提取型号',
        '步骤4: 向下拖动填充柄到C5和D5单元格',
        '步骤5: 检查提取结果是否正确',
        '步骤6: 提交任务，验证结果'
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
        'F2': { type: 'value', expectedValue: 200 }
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
      description: '使用数据透视表进行多维度数据分析',
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
