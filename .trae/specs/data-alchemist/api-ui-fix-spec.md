# 数据炼金术师 - API错误修复与UI/UX改进规范

## Overview
- **Summary**: 修复API请求错误并改进UI/UX布局，将游戏状态和菜单放在顶部，优化空间使用，使表格成为主体内容。
- **Purpose**: 解决API错误问题，提高用户体验，使界面更加直观和高效。
- **Target Users**: 高等院校商务数据分析相关课程的学生、企业员工Excel技能培训、希望提升数据分析能力的自学者。

## Goals
- 修复API请求错误，确保系统稳定运行
- 改进UI/UX布局，优化空间使用
- 将游戏状态和菜单放在顶部，减少空间占用
- 使表格成为主体内容，提供更好的操作体验
- 将技能书变成订单菜单，任务变成技能书的二级菜单

## Non-Goals (Out of Scope)
- 重写整个应用架构
- 改变核心功能逻辑
- 添加新的游戏化元素

## Background & Context
- 基于Univer开源电子表格引擎，Apache 2.0协议
- 部署于Cloudflare Pages，使用Cloudflare Workers和D1/KV存储
- 目前存在API请求错误，返回HTML而不是JSON
- 当前UI布局使用左侧面板，占用过多空间

## Functional Requirements
- **FR-1**: API错误修复 - 确保API请求正确处理，即使后端服务不可用也能正常工作
- **FR-2**: UI布局优化 - 重新设计布局，将游戏状态和菜单放在顶部
- **FR-3**: 菜单结构调整 - 将技能书变成订单菜单，任务变成技能书的二级菜单
- **FR-4**: 空间优化 - 确保表格成为主体内容，占用最大空间

## Non-Functional Requirements
- **NFR-1**: 性能 - 界面响应时间不超过1秒
- **NFR-2**: 兼容性 - 支持主流浏览器（Chrome, Firefox, Safari, Edge）
- **NFR-3**: 可用性 - 界面直观易用，新用户能够快速上手

## Constraints
- **Technical**: 使用Univer开源引擎，保持现有功能不变
- **Business**: 无授权费用，免费用于教学目的
- **Dependencies**: Univer核心库

## Assumptions
- 用户具备基本的计算机操作能力
- 网络连接可能不稳定，需要处理API请求失败的情况

## Acceptance Criteria

### AC-1: API错误修复
- **Given**: 后端API服务不可用
- **When**: 用户请求任务数据
- **Then**: 系统使用模拟数据作为fallback，不显示错误信息
- **Verification**: `programmatic`

### AC-2: UI布局优化
- **Given**: 用户打开应用
- **When**: 查看界面布局
- **Then**: 游戏状态和菜单显示在顶部，表格占据主体空间
- **Verification**: `human-judgment`

### AC-3: 菜单结构调整
- **Given**: 用户查看菜单
- **When**: 点击技能书菜单
- **Then**: 显示任务作为二级菜单
- **Verification**: `human-judgment`

### AC-4: 空间优化
- **Given**: 用户操作表格
- **When**: 查看界面空间分配
- **Then**: 表格占据80%以上的界面空间
- **Verification**: `human-judgment`

## Open Questions
- [ ] 具体的菜单交互方式如何设计
- [ ] 如何确保在不同屏幕尺寸下的响应式布局
