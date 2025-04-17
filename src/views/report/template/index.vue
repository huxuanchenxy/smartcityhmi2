<template>
  <div class="formula-dialog">
    <!-- <gc-spread-sheets-designer :styleInfo="styleInfo" :spreadOptions="spreadOptions"
      @designerInitialized="designerInitialized" /> -->
    <div style="height:100vh;width:100%" ref="refDesigner">
    </div>
  </div>
</template>

<script lang='ts'>

import { defineComponent, ref, onMounted, PropType } from 'vue'
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css'
import '@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css'
import GC from '@grapecity/spread-sheets'
import '@grapecity/spread-sheets-shapes'
import '@grapecity/spread-sheets-slicers'
import '@grapecity/spread-sheets-print'
import '@grapecity/spread-sheets-pdf'
import '@grapecity/spread-sheets-pivot-addon'
import '@grapecity/spread-sheets-tablesheet'
import '@grapecity/spread-sheets-ganttsheet'
import '@grapecity/spread-sheets-formula-panel'
import '@grapecity/spread-sheets-reportsheet-addon'
import '@grapecity/spread-sheets-io'
import '@grapecity/spread-excelio'
import '@grapecity/spread-sheets-resources-zh'
import '@grapecity/spread-sheets-designer-resources-cn'
import '@grapecity/spread-sheets-designer'
import * as GCDesigner from '@grapecity/spread-sheets-designer'
//import GcSpreadSheetsDesigner from '@grapecity/spread-sheets-designer-vue'

import { queryAllReport, createReport, modifyReport, deleteReport } from '@/api/report'
import { ReportModel } from '../report.vue';
import { useMessage } from 'naive-ui';
import { getToken } from '@/utils/token-util';



GC.Spread.Sheets.LicenseKey="www.sescityscada.com,E997332324881186#B1KlnTEJXUyMXSzh4cRhmeIVUett4UpBzVtFGM69maWdWaFF5RNpFeGZHMxdXSHlVZBlURJNzZqZla7wWbkBnSrlzZLhWSoNnSyMXWGtCSHd7VzoVWnR4ajV6RQZ5YZ9GVopFb5kje8RTaFB5RspkW0JlQZZHNmlVRE56d5FzV5BHWRB7QwVHclZVeWRVVa9GTLRHNsZnUKNnQ7F5MDdTOz56NqtmVXdzdrgmZzEXaXdVRkdjaxt6bChDWvB7dzBXV94kMZdUW9FmSuJ7c4c6YaBlYRZ6QFR7VhZ5YkRVUBh6UGJEcytEZBhjbENXMwZ5S6ZlV9MFMvhWN9kXV4lTZwUDUClXbjJUdwJ6T5U6U5NjePZGS6smWzhUcTFnNlpHZvcnatpmI0IyUiwiIDV4Q9YUMxcjI0ICSiwCNyczNycDM4UTM0IicfJye35XX3JSVBtUUiojIDJCLicTMuYHITpEIkFWZyB7UiojIOJyebpjIkJHUiwiIyEDNyQDMgYDMxATNyAjMiojI4J7QiwiI7ETMwUjMwIjI0ICc8VkIsISbvNmLhRWYjNXe4l6YzV6cuc7d7JiOiMXbEJCLig1jlzahlDZmpnInmDoimH9pn/agmH0vkLIul18nlfahmrbmmTJsmXLlnfbtmrIukLiOiEmTDJCLlVnc4pjIsZXRiwiI6gTMxgDO4IzMyMzM7kTOiojIklkIs4XXiQXZlh6U4RnbhdkIsICdlVGaTRncvBXZSJCLiUGbiFGV43mdpBlIbpjInxmZiwSZzxWYmpjIyNHZisnOiwmbBJye0ICRiwiI34zdlFVaQRDMi5UNX9UMR96TyNFc5Z6a8IWUZRzN9NGUqFUQPBVcTZnU6VXNthkZ1pnL";
GCDesigner.Spread.Sheets.Designer.LicenseKey = "www.sescityscada.com,E416658617398613#B11xQavdzQPVDROlXQORXNrcmR0FzRaJ4TGVnePNzY4RjbhllQuhGVYVHeKlzQxBXdaJmY75kYGl4KUVUbyQ4TrlEMURlYwoGetFkboJVNmZle4gTb9s6S6RHOPd6UBhHS5Y7calldsBVSLtGcWpEa9xkNJx4dYp4T9gDcE96Tu5Edhd6UwYEMp5ENLRHNLBFZkdDNXFDWshzYJFWNzhVMNZDe5QWd056SOxGVE3kRmJkUO3kYEhFUlVnMZRzVvIVeiNUd8JTNxpHb9ZkVopFOxF5b92SU4wkMOdXNY5kZxFjShpnQ9N5ZrBTbRB7ZxV7NyknVJFWYJNHdwYkW0xmSzZESOdzazsEUBplI0IyUiwiIwIUQ9gTRERjI0ICSiwSM6AzN9IDMxUTM0IicfJye35XX3JyUXJDNiojIDJCLicTMuYHIu3GZkFULyVmbnl6clRULTpEZhVmcwNlI0IiTis7W0ICZyBlIsIyMxQjM4ADI6ATMwUjMwIjI0ICdyNkIsIyNxEDM5IDMyIiOiAHeFJCLi46bj9SYkF6YzlHdpN6clNnL7d7diojIz5GRiwiI8+Y9sWY9QmZ0Jyp9Aqo9Re09vGo9h+L9Cib9O+Z9nWo90mp9UCr95S997Wr9KiL9iojIh94QiwSZ5JHd0ICb6VkIsIyMxYDO9MzNxYDO5YjNxQjI0ICZJJye0ICRiwiI34TUX3EVRJWcD36ULZXRoJHRwJ7Qw2CVrEHRnpEcz94RGF5dBticnZVOLh6YyZ6SmR7bvQ4RHR7Uv34VKZVczFFUK9mT4c4SWt6ds0WU";
GC.Spread.Common.CultureManager.culture("zh-cn");

export default defineComponent({
  name: 'ReportDesigner',
  components: {
    //GcSpreadSheetsDesigner
  },
  props: {
    model: {
      type: Object as PropType<ReportModel>,
      required: true,
    }
  },
  setup(props) {
    let designer : GCDesigner.Spread.Sheets.Designer.Designer
    let spread : GC.Spread.Sheets.Workbook
    const nMessage = useMessage()
    //const designer = ref(null);
    const refDesigner = ref(null)
    var config = GCDesigner.Spread.Sheets.Designer.DefaultConfig ;

    onMounted(() => {
      designer = new GCDesigner.Spread.Sheets.Designer.Designer(refDesigner.value, null, null, { sheetCount: 0 });
      spread = designer.getWorkbook() as GC.Spread.Sheets.Workbook;
      designerInitialized();
    })


    const designerInitialized = () => {
      //let spread = designer.getWorkbook();

      if (props.model.reportTplJson && props.model.reportTplJson.length > 0) {
        props.model.reportTpl.dataManager.tables[0].dataSourceOption.remote = props.model.dataSource.remote;
        props.model.reportTpl.dataManager.tables[0].dataSourceOption.schema.dataPath = props.model.dataSource.schema.dataPath;

        var reportTpl: any = {};
        Object.assign(reportTpl, props.model.reportTpl);
        if(props.model.dataSourceType!="0"){
          reportTpl.dataManager.tables[0].dataSourceOption.remote.read.body.token = getToken();
        }

        //spread.fromJSON(reportTpl);
        spread.fromJSON(reportTpl).then(r => {
          spread.getSheetTab(0).renderMode('Preview');
        })

      }
      else {
        // 添加示例表读取数据
        var tableName = "table";

        var dataSourceOption: any = {};
        Object.assign(dataSourceOption, props.model.dataSource);
        dataSourceOption.remote.read.body.token = getToken();

        var myTable = spread.dataManager().addTable(tableName, dataSourceOption);

        // var myTable = spread.dataManager().addTable(tableName, {
        //   remote: {
        //     read: function () {
        //       if (props.model.dataSource.remote.read.method == 'POST') {
        //         return icReportTplWithToken(props.model.dataSource.remote.read.url, props.model.dataSource.remote.read.body)
        //       }
        //     }
        //   },
        //   schema: {
        //     dataPath: props.model.dataSource.schema.dataPath,
        //     type: props.model.dataSource.schema.type
        //   }
        // });

    //TableSheet绑定视图
    myTable.fetch().then(function (data) {
          var reportSheet = spread.addSheetTab(0, "打印报表", GC.Spread.Sheets.SheetType.reportSheet);
          const templateSheet = reportSheet.getTemplate();
          // Set style for the template.
          const headerStyle = new GC.Spread.Sheets.Style();
          headerStyle.backColor = '#80CBC4';
          headerStyle.foreColor = '#424242';
          headerStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.right;
          headerStyle.font = '12px Maine';

          const dataStyle = new GC.Spread.Sheets.Style();
          dataStyle.foreColor = '#424242';
          dataStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.right;
          dataStyle.font = '12px Maine';

          const border = new GC.Spread.Sheets.LineBorder('#E0E0E0', 1);
          dataStyle.borderBottom = border;
          dataStyle.borderTop = border;
          dataStyle.borderLeft = border;
          dataStyle.borderRight = border;

          switch (props.model.dataSourceType) {
            case "0"://自定义
              break;
            case "1"://告警信息
              const colWidthArray = [200, 300, 300];
              colWidthArray.forEach((width, i) => {
                templateSheet.setColumnWidth(i, width);
              });
              templateSheet.getRange('A1:C1').setStyle(headerStyle);
              templateSheet.getRange('A2:C2').setStyle(dataStyle);
              templateSheet.setFormatter(1, 2, 'yyyy-MM-dd');

              // Set value and binding for the template.
              const columns_ch = ['事件名称', '触发时间', '解决时间'];
              const columns = ['name', 'triggerTime', 'resolveTime'];
              columns.forEach((columnName, i) => {
                templateSheet.setValue(0, i, `${columns_ch[i]}`);
                templateSheet.setTemplateCell(1, i, {
                  type: 'List',
                  binding: `table[${columnName}]`,
                });
              });
              break;
            case "2"://历史点位信息
              const colWidthArray2 = [200, 200, 300, 100];
              colWidthArray2.forEach((width, i) => {
                templateSheet.setColumnWidth(i, width);
              });
              templateSheet.getRange('A1:D1').setStyle(headerStyle);
              templateSheet.getRange('A2:D2').setStyle(dataStyle);

              // Set value and binding for the template.
              const columns_ch2 = ['设备编号', '点位名称', '采集时间', '点位数据'];
              const columns2 = ['deviceCode', 'nodeCode', 'seq', 'value'];
              columns2.forEach((columnName, i) => {
                templateSheet.setValue(0, i, `${columns_ch2[i]}`);
                templateSheet.setTemplateCell(1, i, {
                  type: 'List',
                  binding: `table[${columnName}]`,
                });
              });

              break;
          }
          //初始化TableSheet
          reportSheet.refresh();
        });
      }
    }

    const saveTpl = async () => {
      let rpModle = props.model;
      //let spread = designer.getWorkbook();
      let json = spread.toJSON({ includeBindingSource: true }) as any;
      rpModle.reportTpl = json;
      rpModle.dataSource.remote = json.dataManager.tables[0].dataSourceOption.remote;
      await modifyReport(rpModle).then(() => {
        nMessage.success("保存模板成功")
      })
    }

    const printTpl = () => {
      //let spread = designer.getWorkbook();
      spread.print();
    }


    return {
      designerInitialized,
      styleInfo: { height: "100vh", width: "100%" },
      config: config,
      spreadOptions: {
        sheetCount: 0,
      },
      saveTpl,
      printTpl,
      refDesigner
    };
  }
})

</script>

<style lang="scss" scoped></style>
