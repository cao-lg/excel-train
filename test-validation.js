// 测试验证逻辑
const taskId = 'task-4-6';

// 模拟任务数据
const taskData = {
  taskId: 'task-4-6',
  skillPoint: '基础运算',
  level: '中级',
  title: '查找与引用函数应用',
  validationRules: {
    'G3': { type: 'value', expectedValue: '产品B' },
    'G4': { type: 'value', expectedValue: 150, tolerance: 0.01 },
    'G5': { type: 'value', expectedValue: 30, tolerance: 0.01 },
    'G6': { type: 'value', expectedValue: 4500, tolerance: 0.01 }
  }
};

// 模拟用户答案
const userAnswers = {
  'G3': '产品B',
  'G4': 150,
  'G5': 30,
  'G6': 4500
};

const userFormulas = {
  'G3': '=VLOOKUP(G2,A2:D5,2,FALSE)',
  'G4': '=VLOOKUP(G2,A2:D5,3,FALSE)',
  'G5': '=VLOOKUP(G2,A2:D5,4,FALSE)',
  'G6': '=G4*G5'
};

// 模拟验证函数
function validateTask(task, userAnswers, userFormulas) {
  const validationDetails = [];
  let allCorrect = true;
  
  for (const [cell, rule] of Object.entries(task.validationRules)) {
    const userValue = userAnswers[cell];
    const userFormula = userFormulas[cell];
    let isCorrect = false;
    let errorMessage = '';
    
    console.log(`验证单元格 ${cell}:`);
    console.log(`  用户值: ${userValue} (类型: ${typeof userValue})`);
    console.log(`  预期值: ${rule.expectedValue} (类型: ${typeof rule.expectedValue})`);
    console.log(`  用户公式: ${userFormula}`);
    
    switch (rule.type) {
      case 'value':
        const expected = rule.expectedValue;
        if (userValue === null || userValue === undefined) {
          isCorrect = false;
          errorMessage = `❌ ${cell}: 答案错误，实际值为 undefined，请检查是否填写了该单元格`;
        } else if (typeof expected === 'number' && typeof userValue === 'number') {
          isCorrect = Math.abs(expected - userValue) < 0.01;
          if (!isCorrect) {
            errorMessage = `❌ ${cell}: 答案错误，实际值为 ${userValue}，预期值为 ${rule.expectedValue}，请检查计算是否正确`;
          }
        } else if (typeof expected === 'string' && typeof userValue === 'string') {
          isCorrect = expected === userValue;
          if (!isCorrect) {
            errorMessage = `❌ ${cell}: 答案错误，实际值为 "${userValue}"，预期值为 "${rule.expectedValue}"，请检查输入是否正确`;
          }
        } else {
          // 类型不匹配时尝试转换为字符串比较
          isCorrect = String(expected) === String(userValue);
          if (!isCorrect) {
            errorMessage = `❌ ${cell}: 答案错误，实际值为 ${userValue}，预期值为 ${rule.expectedValue}，请检查输入是否正确`;
          }
        }
        break;
      case 'formula':
      case 'formula_value':
        const expectedValue = rule.expectedValue;
        let valueCorrect = false;
        if (userValue === null || userValue === undefined) {
          valueCorrect = false;
          errorMessage = `❌ ${cell}: 答案错误，实际值为 undefined，请检查是否填写了该单元格`;
        } else if (typeof expectedValue === 'number' && typeof userValue === 'number') {
          valueCorrect = Math.abs(expectedValue - userValue) < 0.01;
        } else if (typeof expectedValue === 'string' && typeof userValue === 'string') {
          valueCorrect = expectedValue === userValue;
        } else {
          // 类型不匹配时尝试转换为字符串比较
          valueCorrect = String(expectedValue) === String(userValue);
        }
        
        // 验证公式是否正确（如果有公式指纹要求）
        let formulaCorrect = true;
        if (rule.formulaFingerprint && rule.formulaFingerprint.length > 0) {
          formulaCorrect = rule.formulaFingerprint.every((func) => 
            userFormula && userFormula.toUpperCase().includes(func.toUpperCase())
          );
        }
        
        isCorrect = valueCorrect && formulaCorrect;
        
        if (!valueCorrect) {
          errorMessage = `❌ ${cell}: 答案错误，实际值为 ${userValue}，预期值为 ${expectedValue}，请检查计算是否正确`;
        } else if (!formulaCorrect) {
          errorMessage = `❌ ${cell}: 公式错误，需要使用 ${rule.formulaFingerprint?.join('、')} 函数，请检查公式是否正确`;
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
          errorMessage = `❌ ${cell}: 请填写该单元格`;
        }
    }
    
    if (isCorrect) {
      validationDetails.push(`✅ ${cell}: 答案正确`);
    } else {
      validationDetails.push(`❌ ${cell}: ${errorMessage}`);
      allCorrect = false;
    }
  }
  
  console.log('验证结果:');
  validationDetails.forEach(detail => console.log(detail));
  console.log(`总体结果: ${allCorrect ? '成功' : '失败'}`);
  
  return { allCorrect, validationDetails };
}

// 测试场景1: 正确的答案
console.log('=== 测试场景1: 正确的答案 ===');
validateTask(taskData, userAnswers, userFormulas);

// 测试场景2: G3单元格值为undefined
console.log('\n=== 测试场景2: G3单元格值为undefined ===');
const userAnswersUndefined = { ...userAnswers, 'G3': undefined };
validateTask(taskData, userAnswersUndefined, userFormulas);

// 测试场景3: G3单元格值错误
console.log('\n=== 测试场景3: G3单元格值错误 ===');
const userAnswersWrong = { ...userAnswers, 'G3': '产品A' };
validateTask(taskData, userAnswersWrong, userFormulas);

// 测试场景4: 数值类型验证
console.log('\n=== 测试场景4: 数值类型验证 ===');
const userAnswersNumeric = { ...userAnswers, 'G4': 150.01 };
validateTask(taskData, userAnswersNumeric, userFormulas);
