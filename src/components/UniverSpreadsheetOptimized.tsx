import React from 'react';
import UniverSpreadsheet from './UniverSpreadsheet';

interface UniverSpreadsheetOptimizedProps {
  taskData: any | null;
}

interface UniverSpreadsheetRef {
  getCellValue: (cell: string) => any;
  getTargetCellsValues: (cells: string[]) => Record<string, any>;
  getCellFormula: (cell: string) => string;
  getTargetCellsFormulas: (cells: string[]) => Record<string, string>;
}

const UniverSpreadsheetOptimized: React.FC<UniverSpreadsheetOptimizedProps> = React.forwardRef<UniverSpreadsheetRef, UniverSpreadsheetOptimizedProps>(({ taskData }, ref) => {
  return <UniverSpreadsheet taskData={taskData} ref={ref} />;
});

export default UniverSpreadsheetOptimized;