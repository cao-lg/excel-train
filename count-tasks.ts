// 简单的任务计数脚本
import { readFileSync } from 'fs';

// 读取文件内容
const content = readFileSync('./src/services/api.ts', 'utf-8');

// 匹配 taskId 模式
const taskPattern = /'task-\d+-\d+':/g;
const matches = content.match(taskPattern);

if (matches) {
  console.log(`总任务数: ${matches.length}`);
  console.log('任务ID列表:');
  matches.forEach(task => {
    const taskId = task.replace(/[':]/g, '');
    console.log(`  - ${taskId}`);
  });
  
  if (matches.length >= 36) {
    console.log('\n✅ 任务数满足要求 (≥36)');
  } else {
    console.log('\n❌ 任务数不满足要求');
  }
}
