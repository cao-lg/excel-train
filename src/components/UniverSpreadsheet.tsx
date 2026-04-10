import React, { useEffect, useRef } from 'react';
import { LocaleType, mergeLocales, Univer, UniverInstanceType } from '@univerjs/core';
import { FUniver } from '@univerjs/core/facade';
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverUIPlugin } from '@univerjs/ui';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { UniverSheetsCrosshairHighlightPlugin } from '@univerjs/sheets-crosshair-highlight';
import { UniverSheetsZenEditorPlugin } from '@univerjs/sheets-zen-editor';

import SheetsZhCN from '@univerjs/sheets/locale/zh-CN';
import SheetsUIZhCN from '@univerjs/sheets-ui/locale/zh-CN';
import SheetsCrosshairHighlightZhCN from '@univerjs/sheets-crosshair-highlight/locale/zh-CN';
import SheetsZenEditorZhCN from '@univerjs/sheets-zen-editor/locale/zh-CN';
import UIZhCN from '@univerjs/ui/locale/zh-CN';
import DesignZhCN from '@univerjs/design/locale/zh-CN';

import type { FUniver } from '@univerjs/core/facade';

import '@univerjs/design/lib/index.css';
import '@univerjs/ui/lib/index.css';
import '@univerjs/sheets-ui/lib/index.css';
import '@univerjs/sheets-zen-editor/lib/index.css';
import '@univerjs/sheets-crosshair-highlight/lib/index.css';

interface TaskData {
  taskId: string;
  skillPoint: string;
  level: string;
  title: string;
  description: string;
  initialData: {
    sheetName: string;
    cellData: Record<string, { v: any }>;
    rowCount: number;
    columnCount: number;
  };
  targetCells: string[];
  validationRules: Record<string, {
    type: string;
    expectedValue?: any;
    formulaFingerprint?: string[];
  }>;
  hints: string[];
  steps: string[];
}

interface UniverSpreadsheetProps {
  taskData: TaskData | null;
}

interface UniverSpreadsheetRef {
  getCellValue: (cell: string) => any;
  getTargetCellsValues: (cells: string[]) => Record<string, any>;
  getCellFormula: (cell: string) => string;
  getTargetCellsFormulas: (cells: string[]) => Record<string, string>;
}

const UniverSpreadsheet = React.forwardRef<UniverSpreadsheetRef, UniverSpreadsheetProps>(({ taskData }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const univerRef = useRef<FUniver | null>(null);
  const prevTaskIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const univer = new Univer({
      locale: LocaleType.ZH_CN,
      locales: {
        [LocaleType.ZH_CN]: mergeLocales(
          DesignZhCN,
          UIZhCN,
          SheetsZhCN,
          SheetsUIZhCN,
          SheetsCrosshairHighlightZhCN,
          SheetsZenEditorZhCN,
        ),
      },
    });

    // 注册核心插件
    univer.registerPlugin(UniverRenderEnginePlugin);
    univer.registerPlugin(UniverFormulaEnginePlugin);
    univer.registerPlugin(UniverUIPlugin, {
      container: containerRef.current,
    });
    
    // 注册Sheets插件
    univer.registerPlugin(UniverSheetsPlugin);
    univer.registerPlugin(UniverSheetsUIPlugin);
    
    // 注册额外插件
    univer.registerPlugin(UniverSheetsCrosshairHighlightPlugin);
    univer.registerPlugin(UniverSheetsZenEditorPlugin);

    // 简单创建工作簿
    univer.createUnit(UniverInstanceType.UNIVER_SHEET, {});

    // 创建Facade API实例
    const univerAPI = FUniver.newAPI(univer);
    univerRef.current = univerAPI;

    return () => {
      if (univerRef.current) {
        univerRef.current.dispose();
        univerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!univerRef.current || !taskData) return;

    const univerAPI = univerRef.current;
    const workbook = univerAPI.getActiveWorkbook();
    
    if (!workbook) return;

    const currentTaskId = taskData.taskId;
    const isNewTask = prevTaskIdRef.current !== currentTaskId;

    if (isNewTask) {
      const worksheet = workbook.getActiveSheet();
      
      if (worksheet) {
        const dataRange = worksheet.getDataRange();
        dataRange.clear();

        const cellData = taskData.initialData.cellData;
        Object.entries(cellData).forEach(([cell, value]) => {
          const cellValue = value as { v: any };
          const range = worksheet.getRange(cell);
          range.setValue(cellValue.v !== null && cellValue.v !== undefined ? cellValue.v : '');
        });
      }

      prevTaskIdRef.current = currentTaskId;
    }
  }, [taskData]);

  // 暴露方法给父组件
  React.useImperativeHandle(ref, () => ({
    getCellValue: (cell: string) => {
      const univerAPI = univerRef.current;
      if (!univerAPI) return null;
      
      const workbook = univerAPI.getActiveWorkbook();
      if (!workbook) return null;
      
      const worksheet = workbook.getActiveSheet();
      if (!worksheet) return null;
      
      try {
        const range = worksheet.getRange(cell);
        return range.getValue();
      } catch (error) {
        console.error('获取单元格值时出错:', error);
        return null;
      }
    },
    getTargetCellsValues: (cells: string[]) => {
      const result: Record<string, any> = {};
      const univerAPI = univerRef.current;
      if (!univerAPI) return result;
      
      const workbook = univerAPI.getActiveWorkbook();
      if (!workbook) return result;
      
      const worksheet = workbook.getActiveSheet();
      if (!worksheet) return result;
      
      cells.forEach(cell => {
        try {
          const range = worksheet.getRange(cell);
          result[cell] = range.getValue();
        } catch (error) {
          console.error(`获取单元格${cell}值时出错:`, error);
          result[cell] = null;
        }
      });
      
      return result;
    },
    getCellFormula: (cell: string) => {
      const univerAPI = univerRef.current;
      if (!univerAPI) return '';
      
      const workbook = univerAPI.getActiveWorkbook();
      if (!workbook) return '';
      
      const worksheet = workbook.getActiveSheet();
      if (!worksheet) return '';
      
      try {
        const range = worksheet.getRange(cell);
        return range.getFormula() || '';
      } catch (error) {
        console.error('获取单元格公式时出错:', error);
        return '';
      }
    },
    getTargetCellsFormulas: (cells: string[]) => {
      const result: Record<string, string> = {};
      const univerAPI = univerRef.current;
      if (!univerAPI) return result;
      
      const workbook = univerAPI.getActiveWorkbook();
      if (!workbook) return result;
      
      const worksheet = workbook.getActiveSheet();
      if (!worksheet) return result;
      
      cells.forEach(cell => {
        try {
          const range = worksheet.getRange(cell);
          result[cell] = range.getFormula() || '';
        } catch (error) {
          console.error(`获取单元格${cell}公式时出错:`, error);
          result[cell] = '';
        }
      });
      
      return result;
    }
  }));

  return (
    <div 
      ref={containerRef} 
      style={{ height: '600px', width: '100%' }}
    />
  );
});

UniverSpreadsheet.displayName = 'UniverSpreadsheet';

export default UniverSpreadsheet;
