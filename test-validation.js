// 模拟getMockValidationResult函数的逻辑
function getMockValidationResult(data) {
  const { targetCells } = data;
  
  let success = true;
  const results = [];
  
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

// 测试不同的公式
console.log('测试1: 使用SUM函数');
console.log(getMockValidationResult({ targetCells: { 'C5': '=SUM(C2:C4)' } }));
console.log('\n测试2: 使用AVERAGE函数');
console.log(getMockValidationResult({ targetCells: { 'C5': '=AVERAGE(C2:C4)' } }));
console.log('\n测试3: 使用错误函数');
console.log(getMockValidationResult({ targetCells: { 'C5': '=WRONG(C2:C4)' } }));
