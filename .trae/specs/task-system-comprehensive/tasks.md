# 数据炼金术士任务体系全面梳理 - The Implementation Plan (Decomposed and Prioritized Task List)

## [ ] Task 1: 分析和梳理现有任务
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 详细分析现有的24个任务
  - 识别任务内容重复的问题
  - 评估每个任务的难度分级是否合理
  - 记录每个技能点的任务数量
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-4]
- **Test Requirements**:
  - `programmatic` TR-1.1: 生成现有任务清单，包含每个任务的技能点、难度、目标单元格、验证规则
  - `human-judgement` TR-1.2: 专家审核任务内容的重复性和难度分级合理性
- **Notes**: 需要仔细阅读api.ts中的所有任务数据

## [ ] Task 2: 制定难度分级标准
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 基于认知理论制定初级、中级、高级任务的判定标准
  - 初级：单一函数，≤5个步骤，完成时间≤10分钟
  - 中级：2-3个函数组合，≤8个步骤，完成时间≤20分钟
  - 高级：≥3个函数组合或复杂应用，≤12个步骤，完成时间≤30分钟
- **Acceptance Criteria Addressed**: [AC-2]
- **Test Requirements**:
  - `programmatic` TR-2.1: 为每个任务计算难度分数（基于步骤数、函数数量）
  - `human-judgement` TR-2.2: 专家审核难度分级标准的合理性

## [ ] Task 3: 优化现有任务内容
- **Priority**: P0
- **Depends On**: Task 2
- **Description**: 
  - 修正任务描述，使其更清晰准确
  - 优化任务提示，提供更有针对性的指导
  - 完善任务步骤，确保步骤完整且可操作
  - 消除任务内容重复的问题
- **Acceptance Criteria Addressed**: [AC-1]
- **Test Requirements**:
  - `human-judgement` TR-3.1: 专家审核所有任务描述、提示、步骤的质量
  - `programmatic` TR-3.2: 检查所有任务的初始数据和验证规则是否一致

## [ ] Task 4: 补充缺失的任务
- **Priority**: P0
- **Depends On**: Task 3
- **Description**: 
  - 为每个技能点补充任务，确保至少有初级、中级、高级各1个
  - 数据采集：+2个任务（中级、高级）
  - 数据整理：+2个任务（中级、高级）
  - 统计推断：+2个任务（初级、中级）
  - 其他技能点根据需要补充
- **Acceptance Criteria Addressed**: [AC-4]
- **Test Requirements**:
  - `programmatic` TR-4.1: 验证每个技能点至少有3个任务
  - `programmatic` TR-4.2: 验证总任务数≥36个
  - `human-judgement` TR-4.3: 专家审核新增任务的内容质量

## [ ] Task 5: 设计复合应用任务
- **Priority**: P1
- **Depends On**: Task 4
- **Description**: 
  - 设计6个复合应用任务
  - 每个任务需要使用≥2个技能点
  - 涵盖数据采集+数据清洗、基础运算+高级查询、数据透视+图表制作等组合
- **Acceptance Criteria Addressed**: [AC-5]
- **Test Requirements**:
  - `human-judgement` TR-5.1: 专家审核复合任务的设计合理性
  - `programmatic` TR-5.2: 验证每个复合任务使用≥2个技能点

## [ ] Task 6: 完善判题逻辑
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 重写getMockValidationResult函数
  - 实现多维度验证：数值、公式、格式、数据结构
  - 为每个任务编写详细的验证规则
  - 实现容错机制（允许一定的数值误差）
- **Acceptance Criteria Addressed**: [AC-3, AC-7]
- **Test Requirements**:
  - `programmatic` TR-6.1: 测试判题逻辑能正确验证数值
  - `programmatic` TR-6.2: 测试判题逻辑能正确验证公式
  - `programmatic` TR-6.3: 测试判题逻辑的容错机制
  - `human-judgement` TR-6.4: 专家审核判题逻辑的严谨性

## [ ] Task 7: 优化反馈机制
- **Priority**: P1
- **Depends On**: Task 6
- **Description**: 
  - 增强反馈信息的详细程度
  - 提供具体的错误位置（哪个单元格错了）
  - 提供错误原因分析
  - 提供改进建议和参考示例
- **Acceptance Criteria Addressed**: [AC-6]
- **Test Requirements**:
  - `human-judgement` TR-7.1: 专家审核反馈信息的完整性和帮助性
  - `programmatic` TR-7.2: 测试反馈信息包含所有必要元素

## [ ] Task 8: 基于认知理论验证任务体系
- **Priority**: P1
- **Depends On**: Task 4, Task 5
- **Description**: 
  - 基于课程内容认知复合理论验证任务体系
  - 确保知识递进合理（从简单到复杂）
  - 确保有足够的重复练习机会
  - 确保有复合应用机会
- **Acceptance Criteria Addressed**: [AC-1, AC-5]
- **Test Requirements**:
  - `human-judgement` TR-8.1: 教育专家审核任务体系的认知合理性
  - `programmatic` TR-8.2: 验证任务难度递进的平滑性

## [ ] Task 9: 全面测试所有任务
- **Priority**: P0
- **Depends On**: Task 7
- **Description**: 
  - 逐个测试所有任务
  - 验证初始数据能正确加载
  - 验证判题逻辑能正确工作
  - 验证反馈信息能正确显示
- **Acceptance Criteria Addressed**: [AC-3, AC-7]
- **Test Requirements**:
  - `programmatic` TR-9.1: 所有任务的初始数据加载测试
  - `programmatic` TR-9.2: 所有任务的判题逻辑测试
  - `programmatic` TR-9.3: 所有任务的反馈信息显示测试

## [ ] Task 10: 文档和总结
- **Priority**: P2
- **Depends On**: Task 9
- **Description**: 
  - 编写任务体系设计文档
  - 总结改进要点和成果
  - 编写后续维护指南
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7]
- **Test Requirements**:
  - `human-judgement` TR-10.1: 专家审核文档的完整性和准确性
