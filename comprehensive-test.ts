#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, 'src/services/api.ts');
const content = fs.readFileSync(apiPath, 'utf-8');

console.log('='.repeat(80));
console.log('           数据炼金术师 - 任务体系全面测试报告');
console.log('='.repeat(80));
console.log(`测试时间: ${new Date().toLocaleString()}`);
console.log();

const requiredFields = [
  'taskId', 'skillPoint', 'level', 'title', 'description',
  'initialData', 'targetCells', 'validationRules', 'hints', 'steps'
];

const initialDataRequiredFields = ['sheetName', 'cellData', 'rowCount', 'columnCount'];

function extractTasks() {
  const tasks: TaskData[] = [];
  const taskPattern = /'task-\d+-\d+':\s*\{([\s\S]*?)(?=\n\s{4}'task-\d+-\d+':|\n\s{4}\};)/g;
  
  const taskDefinitions = content.match(/'task-\d+-\d+':/g);
  if (!taskDefinitions) {
    return tasks;
  }

  const taskIds = taskDefinitions.map(t => t.replace(/[':]/g, ''));
  
  for (const taskId of taskIds) {
    const taskStart = `'${taskId}': {`;
    const startIndex = content.indexOf(taskStart);
    if (startIndex === -1) continue;
    
    let braceCount = 0;
    let endIndex = startIndex;
    for (let i = startIndex; i < content.length; i++) {
      if (content[i] === '{') braceCount++;
      if (content[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          endIndex = i + 1;
          break;
        }
      }
    }
    
    const taskStr = content.substring(startIndex, endIndex);
    
    try {
      const taskObj = eval(`(function(){ return {${taskStr}}; })()`);
      const task = taskObj[taskId];
      if (task) {
        task.taskId = taskId;
        tasks.push(task);
      }
    } catch (e) {
      console.log(`警告: 无法解析任务 ${taskId}`);
    }
  }
  
  return tasks;
}

const tasks = extractTasks();

console.log('📋 测试项目 1: 验证所有任务的数据结构完整性');
console.log('-'.repeat(80));
console.log(`检测到任务数: ${tasks.length}`);
console.log();

let allStructuralTestsPassed = true;
const structuralIssues: string[] = [];

for (const task of tasks) {
  let taskValid = true;
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (!(field in task) || task[field] === undefined || task[field] === null) {
      missingFields.push(field);
      taskValid = false;
    }
  }
  
  if (task.initialData) {
    for (const field of initialDataRequiredFields) {
      if (!(field in task.initialData)) {
        missingFields.push(`initialData.${field}`);
        taskValid = false;
      }
    }
  }
  
  if (missingFields.length > 0) {
    structuralIssues.push(`❌ ${task.taskId} (${task.title}): 缺少字段 - ${missingFields.join(', ')}`);
    allStructuralTestsPassed = false;
  } else {
    console.log(`✅ ${task.taskId}: ${task.title} - 数据结构完整`);
  }
}

if (structuralIssues.length > 0) {
  console.log();
  console.log('结构问题:');
  structuralIssues.forEach(issue => console.log(issue));
}

console.log();
console.log('📋 测试项目 2: 检查每个任务的初始数据能正确加载');
console.log('-'.repeat(80));

let allInitialDataTestsPassed = true;
const initialDataIssues: string[] = [];

for (const task of tasks) {
  if (task.initialData) {
    if (!task.initialData.sheetName) {
      initialDataIssues.push(`❌ ${task.taskId}: 缺少 sheetName`);
      allInitialDataTestsPassed = false;
    } else if (!task.initialData.cellData || Object.keys(task.initialData.cellData).length === 0) {
      initialDataIssues.push(`❌ ${task.taskId}: cellData 为空`);
      allInitialDataTestsPassed = false;
    } else if (!task.initialData.rowCount || task.initialData.rowCount <= 0) {
      initialDataIssues.push(`❌ ${task.taskId}: rowCount 无效`);
      allInitialDataTestsPassed = false;
    } else if (!task.initialData.columnCount || task.initialData.columnCount <= 0) {
      initialDataIssues.push(`❌ ${task.taskId}: columnCount 无效`);
      allInitialDataTestsPassed = false;
    } else {
      console.log(`✅ ${task.taskId}: ${task.title} - 初始数据有效 (${Object.keys(task.initialData.cellData).length} 个单元格)`);
    }
  }
}

if (initialDataIssues.length > 0) {
  console.log();
  console.log('初始数据问题:');
  initialDataIssues.forEach(issue => console.log(issue));
}

console.log();
console.log('📋 测试项目 3: 检查判题逻辑函数完整性');
console.log('-'.repeat(80));

const validationFunctions = ['validateValue', 'validateFormula', 'validateFormat'];
const functionChecks: Record<string, boolean> = {};

for (const funcName of validationFunctions) {
  const hasFunction = content.includes(`function ${funcName}`);
  functionChecks[funcName] = hasFunction;
  console.log(`${hasFunction ? '✅' : '❌'} ${funcName}: ${hasFunction ? '函数存在' : '函数缺失'}`);
}

const allFunctionsPresent = Object.values(functionChecks).every(v => v);

console.log();
console.log('📋 测试项目 4: 验证每个技能点都有初级、中级、高级任务');
console.log('-'.repeat(80));

const skillPoints: Record<string, { 初级: string[], 中级: string[], 高级: string[] }> = {};

for (const task of tasks) {
  if (!skillPoints[task.skillPoint]) {
    skillPoints[task.skillPoint] = { 初级: [], 中级: [], 高级: [] };
  }
  skillPoints[task.skillPoint][task.level].push(task.taskId);
}

const skillPointIssues: string[] = [];
let allSkillPointTestsPassed = true;

for (const [skillPoint, levels] of Object.entries(skillPoints)) {
  const hasBeginner = levels['初级'].length > 0;
  const hasIntermediate = levels['中级'].length > 0;
  const hasAdvanced = levels['高级'].length > 0;
  
  console.log(`\n📊 ${skillPoint}:`);
  console.log(`   初级任务 (${levels['初级'].length}): ${levels['初级'].join(', ') || '无'}`);
  console.log(`   中级任务 (${levels['中级'].length}): ${levels['中级'].join(', ') || '无'}`);
  console.log(`   高级任务 (${levels['高级'].length}): ${levels['高级'].join(', ') || '无'}`);
  
  if (!hasBeginner || !hasIntermediate || !hasAdvanced) {
    allSkillPointTestsPassed = false;
    const missing: string[] = [];
    if (!hasBeginner) missing.push('初级');
    if (!hasIntermediate) missing.push('中级');
    if (!hasAdvanced) missing.push('高级');
    skillPointIssues.push(`❌ ${skillPoint}: 缺少 ${missing.join('、')} 任务`);
  } else {
    console.log(`   ✅ 完整覆盖所有难度级别`);
  }
}

if (skillPointIssues.length > 0) {
  console.log();
  console.log('技能点覆盖问题:');
  skillPointIssues.forEach(issue => console.log(issue));
}

console.log();
console.log('📋 测试项目 5: 验证函数详细逻辑');
console.log('-'.repeat(80));

function testValidateValueLogic() {
  console.log('\n🧪 validateValue 函数测试:');
  
  const code = content.substring(content.indexOf('function validateValue'), content.indexOf('function validateFormula'));
  const checks = [
    { name: '空值检查', has: code.includes('actual === null || actual === undefined') },
    { name: '数值对比', has: code.includes('typeof expected === \'number\' && typeof actual === \'number\'') },
    { name: '容差处理', has: code.includes('tolerance') },
    { name: '字符串对比', has: code.includes('typeof expected === \'string\' && typeof actual === \'string\'') },
    { name: '类型检查', has: code.includes('type_mismatch') },
  ];
  
  checks.forEach(check => {
    console.log(`   ${check.has ? '✅' : '❌'} ${check.name}`);
  });
  
  return checks.every(c => c.has);
}

function testValidateFormulaLogic() {
  console.log('\n🧪 validateFormula 函数测试:');
  
  const code = content.substring(content.indexOf('function validateFormula'), content.indexOf('function validateFormat'));
  const checks = [
    { name: '空公式检查', has: code.includes('!formula') },
    { name: '函数指纹检测', has: code.includes('fingerprint') },
    { name: '大小写不敏感', has: code.includes('toUpperCase') },
    { name: '缺失函数报告', has: code.includes('missingFunctions') },
  ];
  
  checks.forEach(check => {
    console.log(`   ${check.has ? '✅' : '❌'} ${check.name}`);
  });
  
  return checks.every(c => c.has);
}

function testValidateFormatLogic() {
  console.log('\n🧪 validateFormat 函数测试:');
  
  const code = content.substring(content.indexOf('function validateFormat'), content.indexOf('function getMockValidationResult'));
  const checks = [
    { name: '格式对比', has: code.includes('format === expectedFormat') },
    { name: '格式名称映射', has: code.includes('formatNames') },
    { name: '支持货币格式', has: code.includes('currency') },
    { name: '支持百分比格式', has: code.includes('percentage') },
  ];
  
  checks.forEach(check => {
    console.log(`   ${check.has ? '✅' : '❌'} ${check.name}`);
  });
  
  return checks.every(c => c.has);
}

const valueLogicPassed = testValidateValueLogic();
const formulaLogicPassed = testValidateFormulaLogic();
const formatLogicPassed = testValidateFormatLogic();

console.log();
console.log('='.repeat(80));
console.log('                       测试总结');
console.log('='.repeat(80));

const summary = [
  { test: '任务数据结构完整性', status: allStructuralTestsPassed ? '✅ 通过' : '❌ 失败' },
  { test: '初始数据加载测试', status: allInitialDataTestsPassed ? '✅ 通过' : '❌ 失败' },
  { test: '判题函数存在性', status: allFunctionsPresent ? '✅ 通过' : '❌ 失败' },
  { test: '技能点难度覆盖', status: allSkillPointTestsPassed ? '✅ 通过' : '❌ 失败' },
  { test: 'validateValue 逻辑', status: valueLogicPassed ? '✅ 通过' : '❌ 失败' },
  { test: 'validateFormula 逻辑', status: formulaLogicPassed ? '✅ 通过' : '❌ 失败' },
  { test: 'validateFormat 逻辑', status: formatLogicPassed ? '✅ 通过' : '❌ 失败' },
];

console.log();
summary.forEach(item => {
  console.log(`${item.status.padEnd(8)} ${item.test}`);
});

const passCount = summary.filter(s => s.status.includes('✅')).length;
const totalTests = summary.length;

console.log();
console.log(`总体通过率: ${passCount}/${totalTests} (${(passCount/totalTests*100).toFixed(1)}%)`);

console.log();
console.log('📊 任务统计详情:');
console.log(`   总任务数: ${tasks.length}`);
console.log(`   技能点数: ${Object.keys(skillPoints).length}`);
console.log();
console.log('   技能点分布:');
for (const [skillPoint, levels] of Object.entries(skillPoints)) {
  const total = levels['初级'].length + levels['中级'].length + levels['高级'].length;
  console.log(`     - ${skillPoint}: ${total} 个任务`);
}

console.log();
console.log('='.repeat(80));
console.log('测试完成');
console.log('='.repeat(80));
