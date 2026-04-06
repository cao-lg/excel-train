# 数据炼金术师 - 公式验证修复验证清单

- [x] UniverSpreadsheet组件添加了getCellFormula方法
- [x] getCellFormula方法能够正确获取单元格的公式
- [x] App.tsx中的验证逻辑已修改，支持公式验证
- [x] formula类型任务同时验证值和公式
- [x] 支持使用formulaFingerprint验证公式
- [x] value和format类型任务不受影响
- [x] 公式错误时显示清晰的错误信息
- [x] 使用正确公式的任务能够通过验证
- [x] 使用错误公式但结果正确的任务不能通过验证
- [x] 使用错误公式且结果错误的任务不能通过验证
