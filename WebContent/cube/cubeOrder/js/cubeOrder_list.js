var queryParam = {};
var editRight = top.index.rights.order_edit;
var addRight = top.index.rights.order_add;
var expRight = top.index.rights.order_export;
var deleteRight = top.index.rights.order_delete;
$(function(){
	getOrderList();
})

function getOrderList(){
	$.ajax({
		url: top.Client.CONST_PATH + '/cube/cubeOrder/getGridColumn.action',
		async : true,
		type: "POST",
		dataType : "json",
		success : function(resultMap) {
			var orderColumn = user_interface_column_config.getColumnConfig(resultMap.gridColumn);
			var queryComponent = user_interface_querytable_config.getQueryComponentConfig(resultMap.queryComponent,queryParam);
			//获取数据后执行表格函数
			initOrderList(orderColumn,queryComponent);
		},
		error : function(result, state) {
		}
	})
}

function initOrderList(girdColumn,queryComponent){
	var column = girdColumn;
	var gridOptions = getGridOptions("cubeOrderList", column);
	var pageList = [10];
	var pageSize = "10";
	
	//开启过滤器
	gridOptions.advance_filter = true;
	gridOptions.filters = queryComponent;
//	if(impRight){
//		importExcel({
//			tableId:"cubeOrderList",
//		  	clickFunction:function(){
//		  		impSite();
//			}
//		});
//	}
	
	if(editRight){
		gridOptions = dbClickRow({
			tableId:"cubeOrderList",
			gridOptions:gridOptions,
			onDblClickRow : function(row){
				var rowDataList = $("#cubeOrderList").bootstrapTable("getData");
				editFunc(rowDataList,row);
			} 
		});
		editData({
			tableId:"cubeOrderList",
			noChoseText:"请选择一条需要编辑的订单！",
			clickFunction:function(rowDataList,row){
				editFunc(rowDataList,row);
			}
		});
	}
	
	if(addRight){
		insertData({
			tableId:"cubeOrderList",
			clickFunction:function(){
				  top.main_nav.nextPage("cube/cubeOrder/cubeOrder_add.jsp","cube_order_add",null);
			}
		});
	}
	
	if(deleteRight){
		deleteData({ 
			url:top.Client.CONST_PATH+"/cube/cubeOrder/deleteOrder.action",
			tableId:"cubeOrderList",
			noChoseText:"请选择需要删除的订单记录！",
			sureText:"确定要删除所选订单记录？",
			uniqueFieldName:"AUTO_ID" 
		});
	}
	
	if(expRight){
    	exportAllExcel({
			tableId:"cubeOrderList",
			url:top.Client.CONST_PATH
				+ "/cube/cubeOrder/exportOrder.action",
			column:column,
			clickFunction: function(){
				return queryParam;
			}
		});
	}
	
	 gridOptions.filter_callback = function(){
		 refreshTable();
    }
	 
	 initGrid({
			url : top.Client.CONST_PATH
					+ "/cube/cubeOrder/getOrderList.action",
			tableId : "cubeOrderList",
			gridOptions : gridOptions,
			sidePagination : "server",
			pageList : pageList,
			queryParam : queryParam,
			pageSize : pageSize,
			skin : "1"
		});
	
}


//刷新表格
function refreshTable(){
	refreshDataServer("cubeOrderList", 1, 10,queryParam);
}


//双击编辑事件
function editFunc(rowDataList,row){
	var orderIdList = [];
	var contactidList = [];
	rowDataList.forEach(function(e){
		orderIdList.push(e.AUTO_ID);
		contactidList.push(e.CONTACTID);
	});
	var orderData = {};
	orderData.orderIdList = orderIdList;
	orderData.useOrderId = row.AUTO_ID;
	orderData.contactidList = contactidList;
	orderData.usePersonId = row.CONTACTID;
	top.main_nav.nextPage("cube/cubeOrder/cubeOrder.jsp","cube_order_info",orderData);
}

