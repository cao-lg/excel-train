import { useEffect, useRef } from 'react'
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core'
import sheetsCoreZhCN from '@univerjs/preset-sheets-core/locales/zh-CN'
import { createUniver, LocaleType, mergeLocales } from '@univerjs/presets'
import '@univerjs/preset-sheets-core/lib/index.css'

const TestUniver: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const { univerAPI } = createUniver({
      locale: LocaleType.ZH_CN,
      locales: {
        [LocaleType.ZH_CN]: mergeLocales(
          sheetsCoreZhCN,
        ),
      },
      presets: [
        UniverSheetsCorePreset({
          container: containerRef.current,
        }),
      ],
    })

    // 创建工作簿和工作表
    const workbook = univerAPI.createWorkbook({})
    const worksheet = workbook.getActiveSheet()
    
    if (worksheet) {
      // 填充一些测试数据
      worksheet.getRange('A1').setValue('测试数据')
      worksheet.getRange('A2').setValue('行1')
      worksheet.getRange('B2').setValue('值1')
      worksheet.getRange('A3').setValue('行2')
      worksheet.getRange('B3').setValue('值2')
      
      // 设置默认的行高和列宽
      worksheet.setRowHeight(0, 20)
      worksheet.setColumnWidth(0, 100)
      worksheet.setColumnWidth(1, 100)
    }

    return () => {
      univerAPI.dispose()
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      style={{ height: '600px', width: '100%', border: '1px solid #ccc' }}
    />
  )
}

export default TestUniver