let t2_time = null;
let t1_time = null;
let clueStatus = 0;
let suleType = 1;
let allOrgs = [];
$(function () {
  $.ajax({
    url:top.Client.CONST_PATH+'/cube/clueShare/getRelationOrganizerList.action',
    type:'post',
    success(res){
      allOrgs = res.data;
      // 筛选条件
      initT1Filter();
      initT2Filter();
      reloadTable1()
    }
  })
})

// 接收线索，发出线索 切换
function initTitleNav() {
  let data = [
    {
      title: "本店接收的线索",
      key: "1",
      subTitle: "本店接收的线索",
    },
    {
      title: "本店分享的线索",
      key: "2",
      subTitle: "本店分享的线索",
    },
  ];

  $(".initTitleNav")
    .empty()
    .diy_nav_title({
      data: data,
      navClickEvent: function (data) {
        suleType = data.key;
        $('.t1').toggleClass('on');
        $('.t2').toggleClass('on');
        if (data.key == 1) {
          reloadTable1();
        } else {
          reloadTable2();
        }
      },
    });
}
initTitleNav();


// 加载树 ，树切换
function initRightTree() {
  let treeData = [{
    text: "全部线索",
    selectable: true,
    value: 0,
    state: {
      selected: true,
    },
    nodes: [
      {
        text: '微信注册',
        value: 1
      },
      {
        text: '试乘试驾',
        value: 2
      },
      {
        text: '销售订车',
        value: 3
      },
      {
        text: '销售交车',
        value: 4
      },
      {
        text: '售后维修',
        value: 5
      }, {
        text: '首次进店',
        value:6,
      }
    ]
  }];;
  treeDataOptions = {
    selectedColor: '',
    selectedBackColor: '#fff',
    showTags: true,
    data: treeData,
    onNodeSelected(val, data) {
      // searchParam['cubeClueShareCriteria.clueStatus'] = data.value;
      clueStatus = data.value;
      suleType == 1 ? reloadTable1() : reloadTable2()
    }
  };
  // queryParam['criteria.couponType']=3;
  $('#tree').cube_treeview(treeDataOptions);
}
initRightTree()

// 初始化经销商控件
function initOrgSelector($dom, placeholder,data) {
  let orgList_html = data.map(oitem => {
    return `<option value="${oitem.organizerId}">${oitem.relationName}</option>`
  }).join('')
  orgList_html = `<option value=''>${placeholder || '请选择经销商'}</option>` + orgList_html
  $dom.html(orgList_html)
  $dom.select2();
}

// 初始化  接收线索 查询条件
function initT1Filter() {
  t1_time = $('.t1_time').empty().timeSelector({
    week_hide: true,
    default_date: 'month',
    isShowTime: true,
  });
  initOrgSelector($('.select_org_list1'), '请选择分享经销商',allOrgs)
}
// 初始化 发出线索 查询条件
function initT2Filter() {
  t2_time = $('.t2_time').empty().timeSelector({
    week_hide: true,
    default_date: 'month',
    isShowTime: true,
  });
  initOrgSelector($('.select_org_list2'), '请选择接收经销商',allOrgs)
}

// 字段
let columns1 = [
  {
    title: '创建日期',
    field: 'createDate',
    align: 'left'
  },
  {
    title: '被推荐会员',
    field: 'lastName',
    align: 'left'
  },
  {
    title: '资产账户',
    field: 'memberNo',
    align: 'left'
  },
  {
    title: '关键手机',
    field: 'mobilePhone',
    align: 'left',
    formatter(val) {
      return `<span title="${val}">${phoneStar(val)}</span>`
    }
  },
  {
    title: '分享操作人',
    field: 'createName',
    align: 'left',
  },
  {
    title: '分享经销商',
    field: 'shareOrgName',
    align: 'left',
  },
  {
    title: '接收经销商',
    field: 'receiveOrgName',
    align: 'left',
  },
  {
    title: '线索状态',
    field: 'clueStatus',
    align: 'left',
    formatter(val) {
      switch (val) {
        case 1:
          return '微信注册'
        case 2:
          return '试乘试驾'
        case 3:
          return '销售订车'
        case 4:
          return '销售交车'
        case 5:
          return '售后维修'
        case 6:
          return '首次进店'
        default:
          return '-'
      }
    }
  },
  { field: 'vin', title: '相关车辆', align: 'left' },
  {
    title: '意向车型',
    field: 'modelName',
    align:'left',
  },
  {
    title: '备注',
    field: 'remake',
    align: 'left',
  },
  {
    title: '操作',
    field: '',
    align: 'left',
    formatter(value, scord) {
      return `<a href='javascript:;' onclick='checkPhone("${scord.mobilePhone}")'>查看手机号码</a><span style='margin:0px 8px'>|</span><a href='javascript:;' onclick='jumpToMemberWork("${scord.contactId}","${scord.lastName}")'>查看详情</a>`
    }
  }
]
// 字段
let columns2 = [
  {
    title: '创建日期',
    field: 'createDate',
    align: 'left'
  },
  {
    title: '被推荐会员',
    field: 'lastName',
    align: 'left'
  },
  {
    title: '资产账户',
    field: 'memberNo',
    align: 'left'
  },
  {
    title: '关键手机',
    field: 'mobilePhone',
    align: 'left',
    formatter(val) {
      return `<span title="${val}">${phoneStar(val)}</span>`
    }
  },
  {
    title: '分享操作人',
    field: 'createName',
    align: 'left',
  },
  {
    title: '分享经销商',
    field: 'shareOrgName',
    align: 'left',
  },
  {
    title: '接收经销商',
    field: 'receiveOrgName',
    align: 'left',
  },
  {
    title: '线索状态',
    field: 'clueStatus',
    align: 'left',
    formatter(val) {
      switch (val) {
        case 1:
          return '微信注册'
        case 2:
          return '试乘试驾'
        case 3:
          return '销售订车'
        case 4:
          return '销售交车'
        case 5:
          return '售后维修'
        case 6:
          return '首次进店'
        default:
          return '-'
      }
    }
  },
  { field: 'vin', title: '相关车辆', align: 'left' },
  {
    title: '意向车型',
    field: 'modelName',
    align:'left',
  },
  {
    title: '备注',
    field: 'remake',
    align: 'left',
  },
  {
    title: '操作',
    field: '',
    align: 'left',
    formatter(value, scord) {
      return `<a href='javascript:;' onclick='checkPhone("${scord.mobilePhone}")'>查看手机号码</a><span style='margin:0px 8px'>|</span><a href='javascript:;' onclick='jumpToMemberWork("${scord.contactId}","${scord.lastName}")'>查看详情</a>`
    }
  }
]

// 初始化表格 接收线索
function reloadTable1() {
  let t1layer = layer.load(3);
  let $table = $('.t1wrap').html('<table class="break-false" id="t1"></table>').find('table')
  var tableHeight = $('.t1wrap').height();
  let t1 = $table.bootstrapTable({
    method: 'POST',
    contentType: "application/x-www-form-urlencoded",
    url: top.Client.CONST_PATH + '/cube/clueShare/getReceiveOrShareCubeClueShareListByOrgId.action',
    columns: columns1,
    clickToSelect: true,
    height: tableHeight,
    singleSelect: true,
    pagination: true,
    pageList: [100],
    pageNumber: 1,
    pageSize: 100,
    sidePagination: 'server',
    queryParamsType: '',
    queryParams: function (params) {
      let searchParams = {};
      searchParams['cubeClueShareCriteria.startDate'] = t1_time.getTime()[0];
      searchParams['cubeClueShareCriteria.endDate'] = t1_time.getTime()[1];
      searchParams['cubeClueShareCriteria.clueStatus'] = clueStatus;
      searchParams['cubeClueShareCriteria.receiveOrShare'] = 0;
      searchParams['cubeClueShareCriteria.shareOrgId'] = $('.select_org_list1').val()
      searchParams['cubeClueShareCriteria.currentPage'] = params.pageNumber
      searchParams['cubeClueShareCriteria.pageSize'] = params.pageSize
      return searchParams;
    },
    responseHandler: function (res) {
      layer.close(t1layer);
      return {
        "total": res.data.total,
        "rows": res.data.rows
      }
    }
  })
  $(window).resize(function () {
    t1.bootstrapTable('resetView', {
      height: $('.t1wrap').height()
    });
  });
}

function reloadTable2() {
  let t2layer = layer.load(3);
  let $table = $('.t2wrap').html('<table class="break-false" id="t2"></table>').find('table')
  var tableHeight = $('.t2wrap').height();
  let t2 = $table.bootstrapTable({
    method: 'POST',
    contentType: "application/x-www-form-urlencoded",
    url: top.Client.CONST_PATH + '/cube/clueShare/getReceiveOrShareCubeClueShareListByOrgId.action',
    columns: columns2,
    clickToSelect: true,
    height: tableHeight,
    singleSelect: true,
    pagination: true,
    pageList: [100],
    pageNumber: 1,
    pageSize: 100,
    sidePagination: 'server',
    queryParamsType: '',
    queryParams: function (params) {
      let searchParams = {};
      searchParams['cubeClueShareCriteria.startDate'] = t2_time.getTime()[0];
      searchParams['cubeClueShareCriteria.endDate'] = t2_time.getTime()[1];
      searchParams['cubeClueShareCriteria.clueStatus'] = clueStatus;
      searchParams['cubeClueShareCriteria.receiveOrShare'] = 1;
      searchParams['cubeClueShareCriteria.receiveOrgId'] = $('.select_org_list2').val()
      searchParams['cubeClueShareCriteria.currentPage'] = params.pageNumber
      searchParams['cubeClueShareCriteria.pageSize'] = params.pageSize
      return searchParams;
    },
    responseHandler: function (res) {
      layer.close(t2layer);
      return {
        "total": res.data.total,
        "rows": res.data.rows
      }
    }
  })
  $(window).resize(function () {
    t2.bootstrapTable('resetView', {
      height: $('.t2wrap').height()
    });
  });
}

// 跳转到会员工作台
function jumpToMemberWork(contactid,name) {
  var member = {
    MEMBER_ID: '',
    CONTACTID: contactid,
    LASTNAME: name
  }
  $.ajax({
    url: top.Client.CONST_PATH + '/cube/cube_member/getMemberByContactid.action',
    type: "POST",
    data: {
      contactid: member.CONTACTID
    },
    success: function (res) {
      member.LASTNAME = res.data.lastname
      if (res.state === 'failure') {
        swalWarn('发生错误，稍后重试')
        return;
      }
      member.MEMBER_ID = res.data.memberId
      top.main_nav.new_iframe_DaChangeMember(sandiAppConfig.daChangeMember.memberIndex.url, 'cube_DC_MemberIndex', member, member.LASTNAME + '_会员工作台');
    }
  })
}

function checkPhone(phone){
  simpModal({
    head:'客户手机号码',
    body:`<div style='width:100%;margin-left:30px'>手机号码：${phone}</div>`,
    html:true,
    show_foot:false,
    size:'md'
  })
}