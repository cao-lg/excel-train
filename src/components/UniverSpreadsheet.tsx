import React, { useEffect, useRef } from 'react';
import { createUniver, LocaleType, mergeLocales } from '@univerjs/presets';
import type { FUniver } from '@univerjs/core/facade';
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core';
import sheetsCoreZhCN from '@univerjs/preset-sheets-core/locales/zh-CN';
import { UniverSheetsSortPreset } from '@univerjs/preset-sheets-sort';
import SheetsSortZhCN from '@univerjs/preset-sheets-sort/locales/zh-CN';
import { UniverSheetsDrawingPreset } from '@univerjs/preset-sheets-drawing';
import sheetsDrawingZhCN from '@univerjs/preset-sheets-drawing/locales/zh-CN';
import { UniverSheetsConditionalFormattingPreset } from '@univerjs/preset-sheets-conditional-formatting';
import sheetsConditionalFormattingZhCN from '@univerjs/preset-sheets-conditional-formatting/locales/zh-CN';
import { UniverSheetsFilterPreset } from '@univerjs/preset-sheets-filter';
import UniverPresetSheetsFilterZhCN from '@univerjs/preset-sheets-filter/locales/zh-CN';
import { UniverSheetsFindReplacePreset } from '@univerjs/preset-sheets-find-replace';
import UniverPresetSheetsFindReplaceZhCN from '@univerjs/preset-sheets-find-replace/locales/zh-CN';
import { UniverSheetsHyperLinkPreset } from '@univerjs/preset-sheets-hyper-link';
import sheetsHyperLinkZhCN from '@univerjs/preset-sheets-hyper-link/locales/zh-CN';
import { UniverSheetsDataValidationPreset } from '@univerjs/preset-sheets-data-validation';
import sheetsDataValidationZhCN from '@univerjs/preset-sheets-data-validation/locales/zh-CN';
import { UniverSheetsThreadCommentPreset } from '@univerjs/preset-sheets-thread-comment';
import UniverPresetSheetsThreadCommentZhCN from '@univerjs/preset-sheets-thread-comment/locales/zh-CN';
import { UniverSheetsCrosshairHighlightPlugin } from '@univerjs/sheets-crosshair-highlight';
import SheetsCrosshairHighlightZhCN from '@univerjs/sheets-crosshair-highlight/locale/zh-CN';
import { UniverSheetsZenEditorPlugin } from '@univerjs/sheets-zen-editor';
import SheetsZenEditorZhCN from '@univerjs/sheets-zen-editor/locale/zh-CN';

import '@univerjs/preset-sheets-core/lib/index.css';
import '@univerjs/preset-sheets-sort/lib/index.css';
import '@univerjs/preset-sheets-drawing/lib/index.css';
import '@univerjs/preset-sheets-conditional-formatting/lib/index.css';
import '@univerjs/preset-sheets-filter/lib/index.css';
import '@univerjs/preset-sheets-find-replace/lib/index.css';
import '@univerjs/preset-sheets-hyper-link/lib/index.css';
import '@univerjs/preset-sheets-data-validation/lib/index.css';
import '@univerjs/preset-sheets-thread-comment/lib/index.css';
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

    try {
      console.log('Starting Univer spreadsheet initialization');
      
      const { univerAPI } = createUniver({
        locale: LocaleType.ZH_CN,
        locales: {
          [LocaleType.ZH_CN]: mergeLocales(
            sheetsCoreZhCN,
            SheetsSortZhCN,
            UniverPresetSheetsFilterZhCN,
            sheetsConditionalFormattingZhCN,
            sheetsDataValidationZhCN,
            UniverPresetSheetsFindReplaceZhCN,
            sheetsDrawingZhCN,
            sheetsHyperLinkZhCN,
            UniverPresetSheetsThreadCommentZhCN,
            SheetsCrosshairHighlightZhCN,
            SheetsZenEditorZhCN,
          ),
        },
        presets: [
          UniverSheetsCorePreset({
            container: containerRef.current,
          }),
          UniverSheetsFindReplacePreset(),
          UniverSheetsSortPreset(),
          UniverSheetsFilterPreset(),
          UniverSheetsConditionalFormattingPreset(),
          UniverSheetsDataValidationPreset(),
          UniverSheetsDrawingPreset(),
          UniverSheetsHyperLinkPreset(),
          UniverSheetsThreadCommentPreset(),
        ],
        plugins: [
          UniverSheetsCrosshairHighlightPlugin,
          UniverSheetsZenEditorPlugin,
        ],
      });

      console.log('Univer spreadsheet initialized successfully');
      univerRef.current = univerAPI;

      // 创建工作簿和工作表
      console.log('Creating workbook');
      const workbook = univerAPI.createWorkbook({})
      const worksheet = workbook.getActiveSheet()
      
      if (worksheet) {
        // 设置默认的行高和列宽
        worksheet.setRowHeight(0, 20)
        worksheet.setColumnWidth(0, 100)
      }

      return () => {
        if (univerRef.current) {
          univerRef.current.dispose();
          univerRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing Univer spreadsheet:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'N/A',
        error: error
      });
      // 降级处理：显示错误信息
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="padding: 20px; text-align: center; color: red;">
            <h3>表格加载失败</h3>
            <p>请刷新页面重试</p>
            <p style="font-size: 12px; margin-top: 10px;">错误信息: ${error instanceof Error ? error.message : String(error)}</p>
            <p style="font-size: 12px; margin-top: 5px;">堆栈信息: ${error instanceof Error ? error.stack : 'N/A'}</p>
          </div>
        `;
      }
    }
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
      style={{ height: '600px', width: '100%', border: '1px solid #ccc', backgroundColor: '#fff' }}
    />
  );
});

UniverSpreadsheet.displayName = 'UniverSpreadsheet';

export default UniverSpreadsheet;
