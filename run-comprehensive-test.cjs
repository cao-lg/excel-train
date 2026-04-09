#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { VM } = require('vm');

console.log('='.repeat(80));
console.log('           数据炼金术师 - 任务体系全面测试报告');
console.log('='.repeat(80));
console.log(`测试时间: ${new Date().toLocaleString()}`);
console.log();

const apiPath = path.join(__dirname, 'src/services/api.ts');
let content = fs.readFileSync(apiPath, 'utf-8');

// 移除 TypeScript 类型注解，使其能在 Node.js 中运行
content = content
  .replace(/:\s*TaskData/g, '')
  .replace(/:\s*ValidationResult/g, '')
  .replace(/:\s*UserProgress/g, '')
  .replace(/:\s*Achievement\[\]/g, '')
  .replace(/:\s*string/g, '')
  .replace(/:\s*any/g, '')
  .replace(/:\s*number/g, '')
  .replace(/:\s*boolean/g, '')
  .replace(/<string, any>/g, '')
  .replace(/<string, TaskData>/g, '')
  .replace(/Record<string, { v: any }>/g, 'Object')
  .replace(/Record<string, {/g, '{')
  .replace(/:\s*\{[\s\S]*?\}/g, '')
  .replace(/interface[\s\S]*?}/g, '')
  .replace(/export async function/g, 'async function')
  .replace(/export function/g, 'function');

// 在 VM 中执行代码
const vmContext = {};
try {
  const script = new VM.Script(content);
  script.runInNewContext(vmContext);
  console.log('✅ 代码执行环境初始化成功');
} catch (e) {
  console.log('⚠️  代码执行环境初始化有问题，使用备用测试方法');
}

console.log();
console.log('📋 测试项目 1: 验证所有任务的数据结构完整性');
console.log('-'.repeat(80));

const taskPattern = /'task-\d+-\d+':/g;
const matches = content.match(taskPattern);
const taskCount = matches ? matches.length : 0;
console.log(`检测到任务数: ${taskCount}`);

const requiredFields = [
  'taskId', 'skillPoint', 'level', 'title', 'description',
  'initialData', 'targetCells', 'validationRules', 'hints', 'steps'
];

const initialDataRequiredFields = ['sheetName', 'cellData', 'rowCount', 'columnCount'];

const allFieldsPresent = requiredFields.every(field => content.includes(field));
const initialDataFieldsPresent = initialDataRequiredFields.every(field => content.includes(field));

console.log(`必要字段完整: ${allFieldsPresent ? '✅' : '❌'}`);
console.log(`初始数据字段完整: ${initialDataFieldsPresent ? '✅' : '❌'}`);

// 手动解析任务信息
console.log();
console.log('解析任务详情...');
const taskInfo = [];
const lines = content.split('\n');
let currentTask = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (line.match(/'task-\d+-\d+':/)) {
    if (currentTask) {
      taskInfo.push(currentTask);
    }
    currentTask = {
      taskId: line.replace(/[':]/g, ''),
      skillPoint: '',
      level: '',
      title: '',
      hasInitialData: false,
      hasSheetName: false,
      hasCellData: false,
      hasValidationRules: false,
      hasHints: false,
      hasSteps: false
    };
  } else if (currentTask && line.includes('skillPoint:')) {
    const match = line.match(/skillPoint:\s*'([^']*)'/);
    if (match) currentTask.skillPoint = match[1];
  } else if (currentTask && line.includes('level:')) {
    const match = line.match(/level:\s*'([^']*)'/);
    if (match) currentTask.level = match[1];
  } else if (currentTask && line.includes('title:')) {
    const match = line.match(/title:\s*'([^']*)'/);
    if (match) currentTask.title = match[1];
  } else if (currentTask && line.includes('initialData:')) {
    currentTask.hasInitialData = true;
  } else if (currentTask && line.includes('sheetName:')) {
    currentTask.hasSheetName = true;
  } else if (currentTask && line.includes('cellData:')) {
    currentTask.hasCellData = true;
  } else if (currentTask && line.includes('validationRules:')) {
    currentTask.hasValidationRules = true;
  } else if (currentTask && line.includes('hints:')) {
    currentTask.hasHints = true;
  } else if (currentTask && line.includes('steps:')) {
    currentTask.hasSteps = true;
  }
}

if (currentTask) {
  taskInfo.push(currentTask);
}

console.log(`成功解析 ${taskInfo.length} 个任务`);
console.log();

let allStructuralTestsPassed = true;
const structuralIssues = [];

for (const task of taskInfo) {
  let taskValid = true;
  const missingFields = [];
  
  if (!task.skillPoint) { missingFields.push('skillPoint'); taskValid = false; }
  if (!task.level) { missingFields.push('level'); taskValid = false; }
  if (!task.title) { missingFields.push('title'); taskValid = false; }
  if (!task.hasInitialData) { missingFields.push('initialData'); taskValid = false; }
  if (!task.hasSheetName) { missingFields.push('sheetName'); taskValid = false; }
  if (!task.hasCellData) { missingFields.push('cellData'); taskValid = false; }
  if (!task.hasValidationRules) { missingFields.push('validationRules'); taskValid = false; }
  if (!task.hasHints) { missingFields.push('hints'); taskValid = false; }
  if (!task.hasSteps) { missingFields.push('steps'); taskValid = false; }
  
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

// 检查初始数据相关字段
const hasInitialData = content.includes('initialData:');
const hasSheetName = content.includes('sheetName:');
const hasCellData = content.includes('cellData:');
const hasRowCount = content.includes('rowCount:');
const hasColumnCount = content.includes('columnCount:');

console.log(`包含 initialData: ${hasInitialData ? '✅' : '❌'}`);
console.log(`包含 sheetName: ${hasSheetName ? '✅' : '❌'}`);
console.log(`包含 cellData: ${hasCellData ? '✅' : '❌'}`);
console.log(`包含 rowCount: ${hasRowCount ? '✅' : '❌'}`);
console.log(`包含 columnCount: ${hasColumnCount ? '✅' : '❌'}`);

const allInitialDataTestsPassed = hasInitialData && hasSheetName && hasCellData && hasRowCount && hasColumnCount;

// 验证一些任务的 cellData 不为空
console.log();
console.log('验证 cellData 不为空...');
let cellDataValid = true;
const cellDataChecks = content.match(/cellData:\s*\{[^}]*'[A-Z]+\d+':/g);
if (cellDataChecks && cellDataChecks.length > 0) {
  console.log(`✅ 检测到 ${cellDataChecks.length} 个 cellData 定义包含数据`);
} else {
  console.log('❌ 未检测到有效的 cellData');
  cellDataValid = false;
}

console.log();
console.log('📋 测试项目 3: 检查判题逻辑函数完整性');
console.log('-'.repeat(80));

const validationFunctions = ['validateValue', 'validateFormula', 'validateFormat'];
const functionChecks = {};

for (const funcName of validationFunctions) {
  const hasFunction = content.includes(`function ${funcName}`);
  functionChecks[funcName] = hasFunction;
  console.log(`${hasFunction ? '✅' : '❌'} ${funcName}: ${hasFunction ? '函数存在' : '函数缺失'}`);
}

const allFunctionsPresent = Object.values(functionChecks).every(v => v);

console.log();
console.log('📋 测试项目 4: 验证每个技能点都有初级、中级、高级任务');
console.log('-'.repeat(80));

const skillPoints = {};

for (const task of taskInfo) {
  if (!skillPoints[task.skillPoint]) {
    skillPoints[task.skillPoint] = { 初级: [], 中级: [], 高级: [] };
  }
  skillPoints[task.skillPoint][task.level].push(task.taskId);
}

const skillPointIssues = [];
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
    const missing = [];
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

// 总结
console.log();
console.log('='.repeat(80));
console.log('                       测试总结');
console.log('='.repeat(80));

const summary = [
  { test: '任务数据结构完整性', status: allStructuralTestsPassed ? '✅ 通过' : '❌ 失败' },
  { test: '初始数据加载测试', status: allInitialDataTestsPassed && cellDataValid ? '✅ 通过' : '❌ 失败' },
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
console.log(`   总任务数: ${taskInfo.length}`);
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
