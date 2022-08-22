var queryParam={};
var company = {};
company.maxLength = sandiAppConfig.tool_map.handle_length;
company.appModuleId = -1;
company.infoId = -1;
company.companyColumn = [];
company.tableOptions = {};
company.addRight = top.index.rights.comp_add;
company.editRight = top.index.rights.comp_edit;
company.deleteRight = top.index.rights.comp_delete;
company.impRight = top.index.rights.comp_imp;
company.expRight = top.index.rights.comp_exp;
//导入相关--------------------------------------------------------------------------
var moduleName = "cube_company";
var dealExcelUrl = top.Client.CONST_PATH + "/cube/cubeCompany/uploadExcel.action";
var importUrl = top.Client.CONST_PATH + "/cube/cubeCompany/importFromList.action";
var nikeName = "公司管理";
var showUpdateList = true;
var showSaveList = true;
var showCusBelong = false;
//导入相关--------------------------------------------------------------------------
$(document).ready(function(){
	company.getCompanyColumn();
});

company.getCompanyColumn = function(){
	$.ajax({
		url : top.Client.CONST_PATH + '/cube/cubeCompany/getCompanyColumn.action',
		async : true,
		type: "POST",
		data : {},
		dataType : "json",
		success : function(resultMap) {
			for(var i=0; i<resultMap.queryComponent.length; i++){
				if(resultMap.queryComponent[i].type == "input"){
					resultMap.queryComponent[i].isUseKeySearch = true;
				}
			}
			company.companyColumn = user_interface_column_config.getColumnConfig(resultMap.gridColumn);
			company.companyQueryComponent = user_interface_querytable_config.getQueryComponentConfig(resultMap.queryComponent,queryParam);
			company.initCompanyTable();
		},
		error : function(result, state) {
		}
	})
};

company.initCompanyTable = function(){
	var column = company.companyColumn;
	var gridOptions = getGridOptions("cubeCompany", column);
	if(!!company.addRight){
		insertData({
			tableId:"cubeCompany",
			clickFunction:function(){
				  top.main_nav.nextPage("cube/cube_company/cube_company_add.jsp","cube_company_add",null);
				  company.operateSuccess();
			}
		});
	}
	if(!!company.editRight){
		gridOptions = dbClickRow({
			tableId:"cubeCompany",
			gridOptions:gridOptions,
			onDblClickRow : function(row){
				var rowDataList = $("#cubeCompany").bootstrapTable("getData");
				company.editCompany(rowDataList,row);
			} 
		});
		editData({
			tableId:"cubeCompany",
			noChoseText:"请选择一条需要编辑的公司信息！",
			clickFunction:function(rowDataList,row){
				company.editCompany(rowDataList,row);
			}
		});
	};
	if(!!company.deleteRight){
		deleteData({ 
			tableId:"cubeCompany",
			noChoseText:"请选择需要删除的公司信息！",
			sureText:"确定要删除所选公司信息？",
			uniqueFieldName:"COMPANY_ID",
			clickFunction:function(rows, idList){
				company.deleteCompany(rows, idList);
			}
		});
	};
	if(!!company.impRight){
		importExcel({
			tableId:"cubeCompany",
		  	clickFunction:function(){
		  		company.impCompany();
			}
		});
	};
	if(!!company.expRight){
    	exportAllExcel({
			tableId:"cubeCompany",
			url:top.Client.CONST_PATH
				+ "/cube/cubeCompany/exportCompany.action",
			column:column,
			clickFunction: function(){
				return queryParam;
			}
		});
	}

	gridOptions.advance_filter = true;
    gridOptions.filters = company.companyQueryComponent;

    gridOptions.filter_callback = function(){
		company.operateSuccess();
    };

    company.tableOptions = initGrid({
		url : top.Client.CONST_PATH
				+ "/cube/cubeCompany/getCompanyList.action",
		tableId : "cubeCompany",
		type : "POST",
		gridOptions : gridOptions,
		sidePagination : "server",
		queryParam :queryParam,
		skin : "1"
	});
};

//刷新表格
company.operateSuccess = function(){
	refreshDataServer("cubeCompany", 1, 10, queryParam);
};

//刷新页面
var pageRefresh = function(){
	company.operateSuccess();
};

company.impCompany = function(){
	var imp_container = $('body')
	var imp_width = 800;
	var imp_height = imp_container.height() - 80;

	layerIndex = layer.open({
		type : 2,
		title : '导入公司信息',
		maxmin : true,
		area : [ imp_width + 'px', imp_height + 'px' ],
		content : [ top.Client.CONST_PATH + "/cube/user_import/user_import.jsp", 'no' ],
		end : function() {
			company.operateSuccess();
		}
	});
};

company.deleteCompany = function(rows, idList) {
	var callBackFunc = function(data){
		var rowDataList = data.rows;
		var param = {};
		for(var i=0; i<rowDataList.length; i++){
			param["cpList["+i+"]"] = rowDataList[i].COMPANY_ID;
		}
		var load = layer.load();
		$.ajax({
			url : top.Client.CONST_PATH+"/cube/cubeCompany/deleteCompany.action",
			type: "POST",
			data : param,
			success : function() {
				layer.closeAll();
				company.operateSuccess();
				swal("删除成功！", "您已经永久删除了所选记录。", "success");
			}
		});
	}
	var currentOption = $("#cubeCompany").bootstrapTable("getOptions");
	if(company.tableOptions.check_all && currentOption.totalPages != 1){
		company.getCompanyListFull(callBackFunc);
	}else{
		var data = {};
		data.rows = rows;
		callBackFunc(data);
	}
};

company.editCompany = function(rowDataList,row){
	var callBackFunc = function(data){
		var dataList = data.rows;
		var idList = [];
		var companyIdList = [];
		dataList.forEach(function(e){
			idList.push(e.COMPANY_ID);
		});
		var companyData = {};
		companyData.companyIdList = idList;
		companyData.useCompanyId = row.COMPANY_ID;
		var currentOption = $("#cubeCompany").bootstrapTable("getOptions");
		//列表总数少于指定数时，传递参数用于详情页面获取所有数据
		if(currentOption.totalRows<company.maxLength){
			companyData.currentOption = currentOption;
			companyData.totalPages = currentOption.totalPages;
			companyData.queryParam = queryParam;
			companyData.pageNumber = currentOption.pageNumber;
		}
		top.main_nav.nextPage("cube/cube_company/cube_company.jsp","cube_company_info",companyData);
		company.operateSuccess();
	}
	var data = {};
	data.rows = rowDataList;
	callBackFunc(data);
};

company.getCompanyListFull = function(callBack){
	var load = layer.load();
	$.ajax({
		url : top.Client.CONST_PATH
				+ "/cube/cubeCompany/getCompanyListFull.action",
		data : queryParam,
		success : function(data) {
			layer.close(load);
			callBack(data);
		}
	});
};