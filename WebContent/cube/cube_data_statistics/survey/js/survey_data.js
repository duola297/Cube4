let startDataTime = ''
let endDataTime = ''
let getTime = ''
let isCustomTime = false
let myChart = echarts.init(document.getElementById('surey_echarts'))
let queryParam = {};
let reportEchartData = [];
let timeType = 'HOUR';
let interval = 30*60*1000;

$(function () {
  selectTimeEvent()
  $('.echartSearchDiv button').hide()
  $('#hour').show()
  $($('.echartSearchDiv button')[0]).addClass('active')

  pageDataReport();
  initEcharts();
  selectInterval();
  initSearch();
})
/**
 * 数据统计按钮时间
 */
function initSearch() {
  $('.surverSearch button').on('click', function () {
    $('.surverSearch button').removeClass('active');
    $(this).addClass('active');
    timeType = $(this)[0].dataset.type;
    initEcharts();
  });
  $('#bookType').on('change',function(){
    initEcharts();
  })
}
function selectTimeEvent() {
  // 时间插件
  getTime = $("#timeSelector").timeSelector1({
    week_hide: true,
    default_date: "today",// 为"empty"时，就是默认不选时间
    empty_default: true,// 日期不选时是否使用默认日期
    isShowTime: false,
    // btnList : [ 'today', 'thisMonth', 'lastMonth' ],
    maxDay: 365,
    onchoose(startDate, endDate, custom) {
      isCustomTime = false
      if (startDate !== null || endDate !== null) {
        startDataTime = startDate + ' 00:00:00'
        endDataTime = endDate + ' 23:59:59'
      } else {
        startDataTime = startDate
        endDataTime = endDate
      }
      if ($('button[name="btn-all"]').hasClass('green') || custom) {
        isCustomTime = true
      }
    },
  });

  startDataTime = getTime.getTime()[0]
  endDataTime = getTime.getTime()[1]
}
// 渲染数据
function applyReportData(data) {
  if (data.foodReportData) {
    orderingData(data.foodReportData[0])
    customerData(data.repairBookingReportData[0])
    cusBehaiverData(data.pushReportData[0])
  }

}
// 客户数据
function customerData(data) {
  formatNum('member_user_num', data.TotalRBNum)
  formatNum('member_user_initiative_num', data.cusRBNum)
  formatNum('member_user_invited_num', data.userRBNum)
  formatNum('order_unreceived', data.preparedRBNum)
  formatNum('order_confirmed_num', data.saleEMPRBNum)
  formatNum('order_to_be_confirmed_num', data.verifyRBNum)
}
// 点餐数据
function orderingData(data) {
  formatNum('catalog_item_num', data.cusOrderNum)
  formatNum('catalog_item_off_sale_num', data.workerOrderNum)
  formatNum('catalog_brand_num', data.standardFoodNum)
  formatNum('catalog_supplier_user_num', data.specialFoodNum)
}
// 客户行为
function cusBehaiverData(data) {
  formatNum('shares_count', data.pushNum)
  formatNum('visit_user_count', data.pushPersonNum)
  formatNum('visit_count', data.pushViewNum)
  formatNum('visit_price_count', data.financialNum)
}
// 板块数据
function pageDataReport() {
  queryParam.tenantsId = tid;
  queryParam.organizerId = oid
  queryParam.startTime = startDataTime
  queryParam.endTime = endDataTime
  queryParam.brandId = $('#brandId').val() ? $('#brandId').val().trim() : $('#brandId').val()
  queryParam.relationId = $('#relationId').val() ? $('#relationId').val().trim() : $('#relationId').val

  $.ajax({
    url: top.Client.CONST_PATH + "/cube/mpdataReport/pageDataReport.action",
    data: {
      'tenantsId': tid,
      'organizerId': oid,
      'startTime': startDataTime,
      'endTime': endDataTime,
      'brandId': $('#brandId').val() ? $('#brandId').val().trim() : $('#brandId').val(),
      'relationId': $('#relationId').val() ? $('#relationId').val().trim() : $('#relationId').val,
    },
    type: 'post',
    success: function (res) {
      if (res.code == 0) {
        applyReportData(res)
      } else {
        swal(res.msg, '', 'warning')
      }
    }
  })
}
function getParam() {
  queryParam['startTime'] = startDataTime || ''
  queryParam['endTime'] = endDataTime || ''
  queryParam['brandId'] = $('#brandId').val().trim();
  queryParam['relationId'] = $('#relationId').val().trim();
  queryParam['bookType'] = $('#bookType').val();
  queryParam['timeType'] = timeType;
};
// 图形表数据
function initEcharts() {
  layer.load(3);
  getParam();
  $.ajax({
    url: top.Client.CONST_PATH + "/cube/mpdataReport/miniProgramRepairBookingDataChart.action",
    data: queryParam,
    type: "post",
    success: function (res) {
      layer.closeAll();
      reportEchartData = res.ReportData
      echartsData()
    }
  })
}
function echartsData() {
  let timeData = [];
  let repairBook = []
  if (reportEchartData.length) {
    reportEchartData.forEach(item => {
      timeData.push(item.dataStartTime)
      repairBook.push(item.repairBookingNum)
    })
  }

  let option = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['预约客户'],
      left: '3%'
    },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 30,
        end: 100,
        xAxisIndex: 0,
        bottom: 20
      },
      {
        type: 'inside',
        realtime: true,
        start: 30,
        end: 100,
        xAxisIndex: 0,
        bottom: 20
      }
    ],
    grid: {
      width: '92%',
      left: "5%",
      bottom: 100
    },
    xAxis:
    {
      type: 'category',
      boundaryGap: false,
      data: timeData
    },
    yAxis: {
      name: '预约客户(个)',
      type: 'value',
      axisLabel: {
        formatter: '{value} 个'
      },
    },
    series: [
      {
        name: '预约客户',
        type: 'line',
        symbolSize: 8,
        hoverAnimation: false,
        data: repairBook
      },

    ]
  };
  myChart.setOption(option)
}

function reloadData() {
  $('.echartSearchDiv button').hide()
  $('.echartSearchDiv button').removeClass('active')

  clearInterval(timeInterval);
  if (startDataTime && endDataTime && (startDataTime.slice(0, 10) == endDataTime.slice(0, 10))) {
     selectInterval();
     timeType = 'HOUR'
   } else {
     timeType = 'DAY';
   }

  pageDataReport();
  initEcharts();
  showEchartBtn(isCustomTime)
};

// 定时器
let timeInterval = ''
let selectInterval = function () {
  timeInterval = setInterval(() => {
    pageDataReport();
    initEcharts();
  }, interval);
}



