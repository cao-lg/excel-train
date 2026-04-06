import React from 'react';
import UniverSpreadsheet from './UniverSpreadsheet';

export interface UniverSpreadsheetRef {
  getCellValue: (cell: string) => any;
  getTargetCellsValues: (cells: string[]) => Record<string, any>;
  getCellFormula: (cell: string) => string;
  getTargetCellsFormulas: (cells: string[]) => Record<string, string>;
}

export interface UniverSpreadsheetOptimizedProps {
  taskData: any | null;
}

const UniverSpreadsheetOptimized = React.forwardRef<UniverSpreadsheetRef, UniverSpreadsheetOptimizedProps>(({ taskData }, ref) => {
  return <UniverSpreadsheet taskData={taskData} ref={ref} />;
});

UniverSpreadsheetOptimized.displayName = 'UniverSpreadsheetOptimized';

export default UniverSpreadsheetOptimized;