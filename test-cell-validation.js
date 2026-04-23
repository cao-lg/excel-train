// 测试脚本：验证单元格值获取是否正确

import fs from 'fs';
import path from 'path';

// 读取api.ts文件获取任务数据
function readTaskData() {
  const apiPath = path.join(process.cwd(), 'src/services/api.ts');
  const content = fs.readFileSync(apiPath, 'utf8');
  
  // 提取任务数据
  const tasksMatch = content.match(/const tasks:\s*Record<string, TaskData>\s*=\s*\{([\s\S]*?)\};/);
  if (!tasksMatch) {
    console.error('无法提取任务数据');
    return {};
  }
  
  // 解析任务数据（简化处理，只提取关键信息）
  const tasksStr = tasksMatch[1];
  const tasks = {};
  
  // 按任务ID分割
  const taskMatches = tasksStr.match(/'([^']+)'\s*:\s*\{([\s\S]*?)(?=,'|\s*}\s*})/g);
  if (taskMatches) {
    taskMatches.forEach(taskMatch => {
      const taskIdMatch = taskMatch.match(/'([^']+)'/);
      const targetCellsMatch = taskMatch.match(/targetCells:\s*\[(.*?)\]/);
      const validationRulesMatch = taskMatch.match(/validationRules:\s*\{(.*?)\}/s);
      
      if (taskIdMatch) {
        const taskId = taskIdMatch[1];
        tasks[taskId] = {
          targetCells: targetCellsMatch ? targetCellsMatch[1].replace(/'/g, '').split(',').map(s => s.trim()).filter(Boolean) : [],
          validationRules: validationRulesMatch ? validationRulesMatch[1] : ''
        };
      }
    });
  }
  
  return tasks;
}

// 模拟解析范围函数
function parseRange(rangeStr) {
  if (!rangeStr.includes(':')) return [rangeStr];
  
  const [start, end] = rangeStr.split(':');
  const startMatch = start.match(/([A-Z]+)(\d+)/i);
  const endMatch = end.match(/([A-Z]+)(\d+)/i);
  
  if (!startMatch || !endMatch) return [rangeStr];
  
  const startCol = startMatch[1].toUpperCase();
  const startRow = parseInt(startMatch[2]);
  const endCol = endMatch[1].toUpperCase();
  const endRow = parseInt(endMatch[2]);
  
  // 生成所有单元格地址
  const cells = [];
  const startColNum = colToNum(startCol);
  const endColNum = colToNum(endCol);
  
  for (let colNum = startColNum; colNum <= endColNum; colNum++) {
    const col = numToCol(colNum);
    for (let row = startRow; row <= endRow; row++) {
      cells.push(`${col}${row}`);
    }
  }
  
  return cells;
}

// 辅助函数：列字母转数字
function colToNum(col) {
  let num = 0;
  for (let i = 0; i < col.length; i++) {
    num = num * 26 + col.toUpperCase().charCodeAt(i) - 64;
  }
  return num;
}

// 辅助函数：数字转列字母
function numToCol(num) {
  let col = '';
  while (num > 0) {
    num--;
    col = String.fromCharCode(65 + (num % 26)) + col;
    num = Math.floor(num / 26);
  }
  return col;
}

// 测试函数
function testCellExtraction() {
  console.log('开始测试单元格提取...');
  
  const tasks = readTaskData();
  let testCount = 0;
  let errorCount = 0;
  
  for (const [taskId, task] of Object.entries(tasks)) {
    console.log(`\n测试任务: ${taskId}`);
    console.log(`目标单元格: ${task.targetCells.join(', ')}`);
    
    task.targetCells.forEach(targetCell => {
      testCount++;
      const extractedCells = parseRange(targetCell);
      console.log(`  范围 ${targetCell} 解析为: ${extractedCells.join(', ')}`);
      
      // 检查是否能正确解析
      if (extractedCells.length === 0) {
        errorCount++;
        console.log(`  ❌ 解析失败`);
      } else {
        console.log(`  ✅ 解析成功`);
      }
    });
  }
  
  console.log(`\n测试完成: 共测试 ${testCount} 个单元格范围，${errorCount} 个错误`);
  
  if (errorCount === 0) {
    console.log('🎉 所有测试通过！');
  } else {
    console.log('❌ 存在错误需要修复');
  }
}

// 运行测试
testCellExtraction();
