# 数据炼金术师 - 公式验证修复计划

## Overview
- **Summary**: 修复数据炼金术师平台的公式验证功能，确保对于formula类型的任务，不仅验证结果值，还验证使用的公式是否正确。
- **Purpose**: 确保任务验证更加准确，用户必须使用指定的函数或公式才能完成任务。
- **Target Users**: 数据炼金术师平台的用户和开发者。

## Goals
- 修复公式验证逻辑，同时验证值和公式
- 支持公式指纹验证
- 确保验证反馈清晰明了
- 保持与现有功能的兼容性

## Non-Goals (Out of Scope)
- 不修改现有任务数据
- 不改变其他类型的验证逻辑
- 不涉及后端API的修改

## Background & Context
当前的数据炼金术师平台在验证任务时，对于formula类型的任务只验证了结果值，没有验证用户使用的公式是否正确。这意味着用户可以直接输入正确的结果值而不使用指定的公式，这不符合任务的设计意图。

## Functional Requirements
- **FR-1**: 对于formula类型的验证规则，同时验证结果值和公式
- **FR-2**: 支持使用formulaFingerprint验证公式是否包含指定的函数
- **FR-3**: 提供清晰的验证反馈，包括公式错误的具体信息
- **FR-4**: 保持与现有value和format类型验证规则的兼容性

## Non-Functional Requirements
- **NFR-1**: 验证逻辑的修改不影响现有功能
- **NFR-2**: 验证反馈信息清晰明了
- **NFR-3**: 代码修改简洁明了，易于维护

## Constraints
- **Technical**: 使用React 18+、TypeScript
- **Business**: 仅修改验证逻辑，不修改任务数据
- **Dependencies**: 无

## Assumptions
- 任务数据中的formulaFingerprint字段包含了任务要求使用的函数列表
- Univer电子表格组件能够获取单元格的公式

## Acceptance Criteria

### AC-1: 公式验证功能
- **Given**: 用户提交了一个formula类型的任务
- **When**: 系统验证任务
- **Then**: 系统同时验证结果值和公式是否正确
- **Verification**: `human-judgment`

### AC-2: 公式指纹验证
- **Given**: 任务的验证规则包含formulaFingerprint
- **When**: 系统验证公式
- **Then**: 系统验证公式是否包含指定的函数
- **Verification**: `human-judgment`

### AC-3: 验证反馈
- **Given**: 用户提交了错误的公式
- **When**: 系统验证任务
- **Then**: 系统显示清晰的错误信息，指出公式错误
- **Verification**: `human-judgment`

### AC-4: 兼容性
- **Given**: 用户提交了value或format类型的任务
- **When**: 系统验证任务
- **Then**: 系统使用现有的验证逻辑，不受公式验证修改的影响
- **Verification**: `human-judgment`

## Open Questions
- 无
