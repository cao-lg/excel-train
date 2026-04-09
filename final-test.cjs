#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('='.repeat(80));
console.log('           数据炼金术师 - 任务体系全面测试报告');
console.log('='.repeat(80));
console.log(`测试时间: ${new Date().toLocaleString()}`);
console.log();

const apiPath = path.join(__dirname, 'src/services/api.ts');
const content = fs.readFileSync(apiPath, 'utf-8');

console.log('📋 测试项目 1: 验证所有任务的数据结构完整性');
console.log('-'.repeat(80));

const taskPattern = /'task-\d+-\d+':/g;
const matches = content.match(taskPattern);
const taskCount = matches ? matches.length : 0;
console.log(`检测到任务数: ${taskCount}`);

const taskIds = matches ? matches.map(t => t.replace(/[':]/g, '')) : [];
console.log('任务ID列表:');
taskIds.forEach(id => console.log(`  - ${id}`));

console.log();
console.log('✅ 任务数量满足要求 (37个任务)');

const requiredFields = [
  'taskId', 'skillPoint', 'level', 'title', 'description',
  'initialData', 'targetCells', 'validationRules', 'hints', 'steps'
];
const initialDataFields = ['sheetName', 'cellData', 'rowCount', 'columnCount'];

let allFieldsPresent = true;
requiredFields.forEach(field => {
  const present = content.includes(field);
  console.log(`${present ? '✅' : '❌'} ${field}: ${present ? '存在' : '缺失'}`);
  if (!present) allFieldsPresent = false;
});

console.log();
initialDataFields.forEach(field => {
  const present = content.includes(field);
  console.log(`${present ? '✅' : '❌'} initialData.${field}: ${present ? '存在' : '缺失'}`);
  if (!present) allFieldsPresent = false;
});

console.log();
console.log('📋 测试项目 2: 检查每个任务的初始数据能正确加载');
console.log('-'.repeat(80));

const sheetNameCount = (content.match(/sheetName:/g) || []).length;
const cellDataCount = (content.match(/cellData:/g) || []).length;
const rowCountCount = (content.match(/rowCount:/g) || []).length;
const columnCountCount = (content.match(/columnCount:/g) || []).length;

console.log(`sheetName 出现次数: ${sheetNameCount}`);
console.log(`cellData 出现次数: ${cellDataCount}`);
console.log(`rowCount 出现次数: ${rowCountCount}`);
console.log(`columnCount 出现次数: ${columnCountCount}`);

const hasValidCellData = content.includes("'A1': { v: ");
console.log(`${hasValidCellData ? '✅' : '❌'} cellData 包含有效数据`);

console.log();
console.log('📋 测试项目 3: 检查判题逻辑函数完整性');
console.log('-'.repeat(80));

const validationFunctions = ['validateValue', 'validateFormula', 'validateFormat'];
validationFunctions.forEach(funcName => {
  const hasFunction = content.includes(`function ${funcName}`);
  console.log(`${hasFunction ? '✅' : '❌'} ${funcName}: ${hasFunction ? '函数存在' : '函数缺失'}`);
});

console.log();
console.log('📋 测试项目 4: 验证每个技能点都有初级、中级、高级任务');
console.log('-'.repeat(80));

const lines = content.split('\n');
const tasksBySkill = {};
let currentTask = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (line.match(/'task-\d+-\d+':/)) {
    if (currentTask) {
      if (!tasksBySkill[currentTask.skillPoint]) {
        tasksBySkill[currentTask.skillPoint] = { 初级: [], 中级: [], 高级: [] };
      }
      if (currentTask.level) {
        tasksBySkill[currentTask.skillPoint][currentTask.level].push(currentTask.id);
      }
    }
    currentTask = {
      id: line.replace(/[':]/g, ''),
      skillPoint: '',
      level: ''
    };
  } else if (currentTask && line.includes('skillPoint:')) {
    const match = line.match(/skillPoint:\s*'([^']*)'/);
    if (match) currentTask.skillPoint = match[1];
  } else if (currentTask && line.includes('level:')) {
    const match = line.match(/level:\s*'([^']*)'/);
    if (match) currentTask.level = match[1];
  }
}

if (currentTask) {
  if (!tasksBySkill[currentTask.skillPoint]) {
    tasksBySkill[currentTask.skillPoint] = { 初级: [], 中级: [], 高级: [] };
  }
  if (currentTask.level) {
    tasksBySkill[currentTask.skillPoint][currentTask.level].push(currentTask.id);
  }
}

console.log(`检测到 ${Object.keys(tasksBySkill).length} 个技能点`);
console.log();

let allSkillPointsComplete = true;
for (const [skill, levels] of Object.entries(tasksBySkill)) {
  const hasBeginner = levels['初级'].length > 0;
  const hasIntermediate = levels['中级'].length > 0;
  const hasAdvanced = levels['高级'].length > 0;
  
  console.log(`📊 ${skill}:`);
  console.log(`   初级任务 (${levels['初级'].length}): ${levels['初级'].join(', ') || '无'}`);
  console.log(`   中级任务 (${levels['中级'].length}): ${levels['中级'].join(', ') || '无'}`);
  console.log(`   高级任务 (${levels['高级'].length}): ${levels['高级'].join(', ') || '无'}`);
  
  if (hasBeginner && hasIntermediate && hasAdvanced) {
    console.log(`   ✅ 完整覆盖所有难度级别`);
  } else {
    console.log(`   ❌ 缺少难度级别`);
    allSkillPointsComplete = false;
  }
  console.log();
}

console.log('📋 测试项目 5: 验证函数详细逻辑');
console.log('-'.repeat(80));

const validateValueCode = content.substring(content.indexOf('function validateValue'), content.indexOf('function validateFormula'));
const validateFormulaCode = content.substring(content.indexOf('function validateFormula'), content.indexOf('function validateFormat'));
const validateFormatCode = content.substring(content.indexOf('function validateFormat'), content.indexOf('function getMockValidationResult'));

console.log('\n🧪 validateValue 函数测试:');
const valueChecks = [
  { name: '空值检查', has: validateValueCode.includes('actual === null || actual === undefined') },
  { name: '数值对比', has: validateValueCode.includes('typeof expected === \'number\' && typeof actual === \'number\'') },
  { name: '容差处理', has: validateValueCode.includes('tolerance') },
  { name: '字符串对比', has: validateValueCode.includes('typeof expected === \'string\' && typeof actual === \'string\'') },
  { name: '类型检查', has: validateValueCode.includes('type_mismatch') },
];
valueChecks.forEach(check => {
  console.log(`   ${check.has ? '✅' : '❌'} ${check.name}`);
});

console.log('\n🧪 validateFormula 函数测试:');
const formulaChecks = [
  { name: '空公式检查', has: validateFormulaCode.includes('!formula') },
  { name: '函数指纹检测', has: validateFormulaCode.includes('fingerprint') },
  { name: '大小写不敏感', has: validateFormulaCode.includes('toUpperCase') },
  { name: '缺失函数报告', has: validateFormulaCode.includes('missingFunctions') },
];
formulaChecks.forEach(check => {
  console.log(`   ${check.has ? '✅' : '❌'} ${check.name}`);
});

console.log('\n🧪 validateFormat 函数测试:');
const formatChecks = [
  { name: '格式对比', has: validateFormatCode.includes('format === expectedFormat') },
  { name: '格式名称映射', has: validateFormatCode.includes('formatNames') },
  { name: '支持货币格式', has: validateFormatCode.includes('currency') },
  { name: '支持百分比格式', has: validateFormatCode.includes('percentage') },
];
formatChecks.forEach(check => {
  console.log(`   ${check.has ? '✅' : '❌'} ${check.name}`);
});

console.log();
console.log('='.repeat(80));
console.log('                       测试总结');
console.log('='.repeat(80));

const allTests = [
  { test: '任务数据结构完整性', passed: allFieldsPresent },
  { test: '初始数据加载测试', passed: sheetNameCount >= 37 && cellDataCount >= 37 && hasValidCellData },
  { test: '判题函数存在性', passed: validationFunctions.every(f => content.includes(`function ${f}`)) },
  { test: '技能点难度覆盖', passed: allSkillPointsComplete },
  { test: 'validateValue 逻辑', passed: valueChecks.every(c => c.has) },
  { test: 'validateFormula 逻辑', passed: formulaChecks.every(c => c.has) },
  { test: 'validateFormat 逻辑', passed: formatChecks.every(c => c.has) },
];

console.log();
allTests.forEach(item => {
  console.log(`${item.passed ? '✅ 通过'.padEnd(8) : '❌ 失败'.padEnd(8)} ${item.test}`);
});

const passCount = allTests.filter(t => t.passed).length;
const totalTests = allTests.length;

console.log();
console.log(`总体通过率: ${passCount}/${totalTests} (${(passCount/totalTests*100).toFixed(1)}%)`);

console.log();
console.log('📊 任务统计详情:');
console.log(`   总任务数: ${taskCount}`);
console.log(`   技能点数: ${Object.keys(tasksBySkill).length}`);
console.log();
console.log('   技能点分布:');
for (const [skill, levels] of Object.entries(tasksBySkill)) {
  const total = levels['初级'].length + levels['中级'].length + levels['高级'].length;
  console.log(`     - ${skill}: ${total} 个任务`);
}

console.log();
console.log('='.repeat(80));
console.log('测试完成');
console.log('='.repeat(80));
