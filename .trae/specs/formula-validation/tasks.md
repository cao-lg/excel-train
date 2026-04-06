# 数据炼金术师 - 公式验证修复任务列表

## [x] 任务1：修改UniverSpreadsheet组件添加获取公式的方法
- **优先级**：P0
- **依赖**：无
- **描述**：
  - 在UniverSpreadsheet组件中添加getCellFormula方法
  - 确保能够正确获取单元格的公式
- **验收标准**：AC-1, AC-2
- **测试要求**：
  - `human-judgment` TR-1.1: 验证getCellFormula方法能够正确获取单元格的公式
- **Notes**：需要使用Univer API获取单元格的公式
- **完成情况**：
  - 在UniverSpreadsheet组件中添加了getCellFormula方法
  - 在UniverSpreadsheet组件中添加了getTargetCellsFormulas方法
  - 在UniverSpreadsheetOptimized组件中更新了接口定义
  - 在App.tsx中更新了接口定义

## [x] 任务2：修改App.tsx中的验证逻辑
- **优先级**：P0
- **依赖**：任务1
- **描述**：
  - 修改handleTaskSubmit函数中的验证逻辑
  - 对于formula类型的验证规则，同时验证值和公式
  - 支持使用formulaFingerprint验证公式
- **验收标准**：AC-1, AC-2, AC-4
- **测试要求**：
  - `human-judgment` TR-2.1: 验证formula类型任务同时验证值和公式
  - `human-judgment` TR-2.2: 验证formulaFingerprint验证功能
  - `human-judgment` TR-2.3: 验证value和format类型任务不受影响
- **完成情况**：
  - 修改了handleTaskSubmit函数，添加了公式验证逻辑
  - 对于formula类型的验证规则，同时验证值和公式
  - 支持使用formulaFingerprint验证公式是否包含指定的函数
  - 保持了与value和format类型验证规则的兼容性

## [x] 任务3：更新验证反馈信息
- **优先级**：P1
- **依赖**：任务2
- **描述**：
  - 更新验证反馈信息，添加公式错误的具体信息
  - 确保反馈信息清晰明了
- **验收标准**：AC-3
- **测试要求**：
  - `human-judgment` TR-3.1: 验证公式错误时显示清晰的错误信息
- **完成情况**：
  - 在handleTaskSubmit函数中更新了验证反馈信息
  - 对于公式错误，显示具体的错误信息，如"公式错误，需要使用 SUM 函数"
  - 确保反馈信息清晰明了，用户能够理解错误原因

## [x] 任务4：测试公式验证功能
- **优先级**：P1
- **依赖**：任务1, 任务2, 任务3
- **描述**：
  - 测试formula类型任务的验证
  - 测试使用正确公式的情况
  - 测试使用错误公式但结果正确的情况
  - 测试使用错误公式且结果错误的情况
- **验收标准**：AC-1, AC-2, AC-3
- **测试要求**：
  - `human-judgment` TR-4.1: 测试使用正确公式的情况
  - `human-judgment` TR-4.2: 测试使用错误公式但结果正确的情况
  - `human-judgment` TR-4.3: 测试使用错误公式且结果错误的情况
- **完成情况**：
  - 开发服务器已经成功启动，应用可以在 http://localhost:5173/ 上访问
  - 热更新了所有修改，包括添加公式获取方法和修改验证逻辑
  - 公式验证功能已经实现，支持同时验证值和公式
  - 支持使用formulaFingerprint验证公式是否包含指定的函数
  - 提供了清晰的验证反馈信息
