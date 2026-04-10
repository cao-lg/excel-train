import React, { useEffect, useRef } from 'react';
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core';
import sheetsCoreZhCN from '@univerjs/preset-sheets-core/locales/zh-CN';
import { createUniver, LocaleType, mergeLocales } from '@univerjs/presets';
import { UniverSheetsCrosshairHighlightPlugin } from '@univerjs/sheets-crosshair-highlight';
import SheetsCrosshairHighlightZhCN from '@univerjs/sheets-crosshair-highlight/locale/zh-CN';
import { UniverSheetsZenEditorPlugin } from '@univerjs/sheets-zen-editor';
import SheetsZenEditorZhCN from '@univerjs/sheets-zen-editor/locale/zh-CN';
import type { FUniver } from '@univerjs/core/facade';

import '@univerjs/preset-sheets-core/lib/index.css';
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

    const { univerAPI } = createUniver({
      locale: LocaleType.ZH_CN,
      locales: {
        [LocaleType.ZH_CN]: mergeLocales(
          sheetsCoreZhCN,
          SheetsCrosshairHighlightZhCN,
          SheetsZenEditorZhCN,
        ),
      },
      presets: [
        UniverSheetsCorePreset({
          container: containerRef.current,
        }),
      ],
      plugins: [
        UniverSheetsCrosshairHighlightPlugin,
        UniverSheetsZenEditorPlugin,
      ],
    });

    univerRef.current = univerAPI;

    // 简单创建工作簿
    univerAPI.createWorkbook({});

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
