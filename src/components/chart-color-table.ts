import * as colorTable from '@/../public/data/chart/color-table.json'

export function getChartColorTable()
{
  return colorTable.default as unknown as Array<string>
}


