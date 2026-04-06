# 数据炼金术师 - 产品需求文档

## Overview
- **Summary**: 开发一款基于Univer开源电子表格引擎的Excel实训游戏平台，为"商务数据分析与应用基础"课程提供沉浸式、游戏化的实践环境。
- **Purpose**: 帮助学生掌握从数据采集、清洗、处理、建模到可视化的全链路技能，通过游戏化元素激发学习动力，提供真实的Excel操作体验。
- **Target Users**: 高等院校商务数据分析相关课程的学生、企业员工Excel技能培训、希望提升数据分析能力的自学者。

## Goals
- 提供与Excel 2016高度一致的交互体验和计算能力
- 覆盖数据处理全流程的技能点，从数据采集到可视化
- 通过游戏化元素（剧情、经验值、成就）激发学习动力
- 实现刻意练习机制，将复杂技能拆解为可循序渐进的关卡
- 提供免费开源的教学工具，部署于Cloudflare免费计划

## Non-Goals (Out of Scope)
- 开发完整的企业级数据分析系统
- 实现所有Excel高级功能，只覆盖教学所需的核心功能
- 支持所有Excel插件和宏功能
- 提供商业级的用户管理和权限系统

## Background & Context
- 基于Univer开源电子表格引擎，Apache 2.0协议
- 部署于Cloudflare Pages，使用Cloudflare Workers和D1/KV存储
- 参考了Excel 2016的交互体验和计算能力
- 结合认知负荷理论，设计刻意练习和游戏化机制

## Functional Requirements
- **FR-1**: 技能树系统 - 实现四大维度技能树，每个技能点对应多个实训关卡
- **FR-2**: 真实实训环境 - 集成Univer引擎，提供Excel 2016兼容的交互和计算能力
- **FR-3**: 任务系统 - 每个关卡提供预定义数据和目标，用户完成操作后进行校验
- **FR-4**: 游戏化系统 - 实现经验值、等级、成就等游戏化元素
- **FR-5**: 自适应提示 - 根据用户错误类型和次数提供智能提示
- **FR-6**: 进度存储 - 保存用户学习进度和成就记录
- **FR-7**: 任务提示与要领步骤 - 在表格中注入任务提示和详细的要领步骤，引导用户完成任务

## Non-Functional Requirements
- **NFR-1**: 性能 - 电子表格操作响应时间不超过1秒
- **NFR-2**: 兼容性 - 支持主流浏览器（Chrome, Firefox, Safari, Edge）
- **NFR-3**: 可扩展性 - 易于添加新的技能点和关卡
- **NFR-4**: 可靠性 - 系统稳定运行，数据不丢失
- **NFR-5**: 安全性 - 保护用户数据和进度信息

## Constraints
- **Technical**: 使用Univer开源引擎，部署于Cloudflare免费计划
- **Business**: 无授权费用，免费用于教学目的
- **Dependencies**: Univer核心库、Cloudflare Workers、D1数据库

## Assumptions
- 用户具备基本的计算机操作能力
- 网络连接稳定，能够访问Cloudflare服务
- Univer引擎能够满足教学所需的Excel功能

## Acceptance Criteria

### AC-1: 技能树系统
- **Given**: 用户登录平台
- **When**: 访问技能树页面
- **Then**: 显示四大维度技能树，每个技能点显示完成状态
- **Verification**: `human-judgment`

### AC-2: 电子表格操作
- **Given**: 用户进入实训关卡
- **When**: 在电子表格中进行操作（输入公式、设置格式等）
- **Then**: 操作响应流畅，与Excel 2016体验一致
- **Verification**: `human-judgment`

### AC-3: 任务校验
- **Given**: 用户完成关卡任务
- **When**: 提交校验
- **Then**: 系统准确判断任务完成情况，提供即时反馈
- **Verification**: `programmatic`

### AC-4: 游戏化元素
- **Given**: 用户完成关卡
- **When**: 系统评估完成情况
- **Then**: 授予相应经验值，解锁成就，更新等级
- **Verification**: `programmatic`

### AC-5: 自适应提示
- **Given**: 用户多次尝试任务失败
- **When**: 错误次数达到阈值
- **Then**: 系统提供针对性提示，降低任务难度
- **Verification**: `human-judgment`

### AC-6: 进度存储
- **Given**: 用户完成关卡或退出平台
- **When**: 系统保存用户进度
- **Then**: 再次登录时恢复之前的进度和成就
- **Verification**: `programmatic`

### AC-7: 任务提示与要领步骤
- **Given**: 用户进入实训关卡
- **When**: 查看任务详情
- **Then**: 显示详细的任务提示和要领步骤，指导用户完成任务
- **Verification**: `human-judgment`

## Open Questions
- [ ] Univer引擎对所有教学所需Excel函数的支持情况
- [ ] Cloudflare免费计划的资源限制对平台规模的影响
- [ ] 如何设计有效的任务校验机制，确保技能掌握
- [ ] 游戏化元素的平衡，避免过度游戏化影响学习效果