import { Router, IRequest, IResponse } from 'itty-router';

// 创建路由器
const router = Router();

// 任务数据
const tasks = {
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
    hints: ['使用SUM函数计算总销售额', '选择C2到C4的范围']
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
    hints: ['尝试使用AVERAGE函数计算平均值来填充缺失值', '或使用DELETE键删除整行']
  }
};

// 用户进度数据
const userProgress = {
  'user-1': {
    completedTasks: ['task-1-1'],
    currentLevel: 1,
    experience: 200,
    achievements: ['first-task']
  }
};

// 成就数据
const achievements = [
  { id: 'first-task', name: '初出茅庐', description: '完成第一个任务', unlocked: true },
  { id: 'perfect-streak', name: '完美主义者', description: '一次性通过10个关卡', unlocked: false },
  { id: 'function-master', name: '函数大师', description: '正确使用15种不同函数', unlocked: false },
  { id: 'speed-star', name: '速度之星', description: '10个关卡低于平均用时', unlocked: false }
];

// 获取任务数据
router.get('/api/tasks/:taskId', (request: IRequest) => {
  const { taskId } = request.params;
  const task = tasks[taskId as keyof typeof tasks];
  
  if (!task) {
    return new Response(JSON.stringify({ error: 'Task not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify(task), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// 校验任务
router.post('/api/tasks/:taskId/validate', async (request: IRequest) => {
  const { taskId } = request.params;
  const task = tasks[taskId as keyof typeof tasks];
  
  if (!task) {
    return new Response(JSON.stringify({ error: 'Task not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const data = await request.json();
    const { targetCells } = data;
    
    let success = true;
    const results = [];
    
    for (const [cell, formula] of Object.entries(targetCells)) {
      const rule = task.validationRules[cell];
      if (rule) {
        if (rule.type === 'formula' && formula.includes('SUM')) {
          results.push({ cell, correct: true, errorMessage: '' });
        } else if (rule.type === 'value' && formula === rule.expectedValue) {
          results.push({ cell, correct: true, errorMessage: '' });
        } else {
          results.push({ cell, correct: false, errorMessage: '请使用正确的函数或值' });
          success = false;
        }
      }
    }
    
    return new Response(JSON.stringify({
      success,
      results,
      experience: success ? 200 : 0,
      message: success ? '任务完成！' : '任务未完成，请检查您的操作',
      achievementsUnlocked: success ? ['first-task'] : []
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// 获取用户进度
router.get('/api/users/:userId/progress', (request: IRequest) => {
  const { userId } = request.params;
  const progress = userProgress[userId as keyof typeof userProgress];
  
  if (!progress) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify(progress), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// 更新用户进度
router.post('/api/users/:userId/progress', async (request: IRequest) => {
  const { userId } = request.params;
  
  try {
    const data = await request.json();
    const { taskId, completed, score } = data;
    
    // 简化实现，实际应该更新数据库
    const progress = userProgress[userId as keyof typeof userProgress] || {
      completedTasks: [],
      currentLevel: 1,
      experience: 0,
      achievements: []
    };
    
    if (completed) {
      progress.completedTasks.push(taskId);
      progress.experience += score;
      
      // 简单的等级计算
      if (progress.experience >= 1000) {
        progress.currentLevel = 2;
      }
      if (progress.experience >= 3000) {
        progress.currentLevel = 3;
      }
      if (progress.experience >= 6000) {
        progress.currentLevel = 4;
      }
    }
    
    userProgress[userId as keyof typeof userProgress] = progress;
    
    return new Response(JSON.stringify({
      success: true,
      updatedProgress: progress
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// 获取成就列表
router.get('/api/achievements', () => {
  return new Response(JSON.stringify(achievements), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// 404处理
router.all('*', () => {
  return new Response('Not Found', { status: 404 });
});

// 导出处理函数
export default {
  fetch: router.handle
};
