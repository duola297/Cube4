let brandLlistQueryParam = {};
let brandAddQueryParam = {}
let uuid = ''
let isEdit = false
let phoneReg = /^1[3456789]\d{9}$/
let tableList = ''

let brandAndCcList =''

// 权限按钮 
let cube_brand_add = top.index.rights.cube_brand_add
let cube_brand_edit = top.index.rights.cube_brand_edit
let cube_brand_export = top.index.rights.cube_brand_export
let cube_brand_modification_record = top.index.rights.cube_brand_modification_record

userLimited(cube_brand_add, '#addBrand')
userLimited(cube_brand_edit, '#editBrand')
userLimited(cube_brand_export, '#exportBrand')
userLimited(cube_brand_modification_record, '#checkLogs')

let cube_brand_brandKey = top.index.rights.cube_brand_brandKey

$(document).ready(function () {
	getBrandAndCcList()
	initBrandTable()

})

function getBrandAndCcList(){
	$.ajax({
		url: top.Client.CONST_PATH + '/cube/cubebasic/getBasicShowOrgList.action',
		type: "POST",
		success: function (res) {
			brandAndCcList = res.brandAndCcList
			var $html=''
			brandAndCcList.forEach(item=>{
				$html +=`
					<option value="${item.organizerId}" data-brandKey="${item.brandKey}">${item.brandName}</option>
				`
			})
			$("#brandList").append($html)
		}
	});
	
}


let brandListCol = [
	{
		field: 'checked',// 复选框
		checkbox: true
	},
	{
		title: '品牌名称',
		field: 'BRAND_NAME',
		align: 'left',
		valign: 'middle',
	},
	{
		title: '品牌代码',
		field: 'BRAND_KEY',
		align: 'left',
		valign: 'middle',
	},
	{
		title: '创建人',
		field: 'CREATE_NAME',
		align: 'left',
		valign: 'middle',
	},
	{
		title: '创建时间',
		field: 'CREATE_DATE',
		align: 'left',
		valign: 'middle',
	},
	{
		title: '修改人',
		field: 'MODIFY_NAME',
		align: 'left',
		valign: 'middle',
	},
	{
		title: '修改时间',
		field: 'MODIFY_DATE',
		align: 'left',
		valign: 'middle',
	},
	{
		title: '品牌简介',
		field: 'INTRO',
		align: 'left',
		valign: 'middle',
		formatter(val, row, index) {
			if (val != null) {
				return `<div style="width: 200px" title="${val}" class="text-over">${val}</div>`
			}
			return val
		}
	},
	
]

// 获取品牌列表
function initBrandTable() {
	layer.load(3)
	let options = {
		contentType: "application/x-www-form-urlencoded",//必须要有！！！！
		pagination: true,
		cache: false,
		pageSize: 100,
		clickToSelect: true,
		uniqueId: "giftId",
		singleSelect: true,
		pageNumber: 1,//初始化加载第一页，默认第一页
		url: top.Client.CONST_PATH + "/cube/cubebasic/getBrandList.action",
		sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
		method: 'post',
		queryParamsType: '',
		queryParams: function queryParams(params) {
			brandLlistQueryParam['cubeBrandCriteria.currentPage'] = params.pageNumber
			brandLlistQueryParam['cubeBrandCriteria.rows'] = params.pageSize
			return brandLlistQueryParam
		},
		columns: brandListCol,
		responseHandler: function (res) {
			layer.closeAll()
			tableList = res.rows
			return {
				"total": res.total,//总页数
				"rows": res.rows   //数据
			}
		},
		onLoadSuccess: function () {

		},
		onDblClickRow: function (row, e) {
			
		}
	}

	$('#brandListTable').my_bootstrap_table(options);
}

// 查询
function reloadData() {
	$('#tableDiv').html('<table id="brandListTable" class="break-false"></table>')
	initBrandTable()
}

// 新增
function brandAdd() {
	simpModal({
		head: '新建品牌',
		body: $body,
		show_foot: true,
		size: "lg", //sm,lg,lgx，md
		close_default: true,
		show_callback() {
			$("#count").text("0/300")
		},
		sure_function() {
			layer.load(3)
			checkFormData();
			if ($(".showError").length > 0) {
				return false
			} else {
				$.ajax({
					url: top.Client.CONST_PATH + '/cube/cubebasic/saveBrand.action',
					type: "POST",
					data:{
						"sysColumnValue":JSON.stringify(brandAddQueryParam)
					},
					success: function (data) {
						layer.closeAll()
						if(data.result == 1){
							swal("新建成功",'品牌：'+brandAddQueryParam['brandName'],'success')
							$(".modal-header .close").trigger('click')
							getBrandAndCcList()
							reloadData()
						}else{
							swal("新建失败",data.info,'error')
						}
					},
				});
				return false
			}
		}
	})
}

// 编辑
function brandEdit() {
	countSelected(function (index) {
		var data = tableList[index]
		simpModal({
			head: '编辑品牌',
			body: $body,
			show_foot: true,
			size: "lg", //sm,lg,lgx，md
			close_default: true,
			show_callback() {
				editLimited(cube_brand_brandKey, '#addBrandCode')

				$("#addBrandName").val(data.BRAND_NAME)
				$("#addBrandCode").val(data.BRAND_KEY)
				$("#brandDec").val(data.INTRO)

				decNum()
			},
			sure_function() {
				checkFormData();
				
				if ($(".showError").length > 0) {
					return false
				} else {
					layer.load(3)
					$.ajax({
						url: top.Client.CONST_PATH + '/cube/cubebasic/saveBrand.action',
						type: "POST",
						data:{
							"sysColumnValue":JSON.stringify(brandAddQueryParam),
							"organizerId":data.ORGANIZER_ID
						},
						success: function (data) {
							layer.closeAll()
							if(data.result == 1){
								swal("保存成功",'品牌：'+brandAddQueryParam['brandName'],'success')
								$(".modal-header .close").trigger('click')
								reloadData()
							}else{
								swal('保存失败',data.info,'error')
							}
						},
					});
					
					return false
				}
			}
		})
	})

}

function checkFormData() {
	$('label.error').removeClass('showError')
	if (($('#addBrandName').val() == null || $('#addBrandName').val() === '')) {
		showError('#addBrandName', '请输入品牌名称', 1)
	} else {
		brandAddQueryParam['brandName'] = $.trim($('#addBrandName').val())
	}
	if (($('#addBrandCode').val() == null || $('#addBrandCode').val() === '')) {
		showError('#addBrandCode', '请输入品牌代码', 1)
	} else {
		brandAddQueryParam['brandKey'] = $.trim($("#addBrandCode").val())
		brandAddQueryParam['dealerNames'] = '('+$('#addBrandCode').val()+')'
	}

	
	brandAddQueryParam['intro'] = $.trim($("#brandDec").val())
	brandAddQueryParam['parentOrgId'] = 1
}



// 重置查询条件
function resetForm() {
	// $("#loadUser").find('input[type=text],select,input[type=hidden]').each(function () {
	// 	$(this).val('');
	// })
	brandAddQueryParam = {}
}

// 导出
function exportBrandList(){
	let exportPoolColumnFields = []
	brandListCol.slice(1).forEach(function (item) {
		exportPoolColumnFields.push({
			field: item.field,
			title: item.title
		})
	})

	let data = {
		columnFields: exportPoolColumnFields,
		columnFieldsTrans: "",
		// ['cubeBrandCriteria.brandKey'] : $("#brandCode").val(),
		
	}

	/**
	 * 导出时候默认是当前查询条件的，checkBox相对无效
	 */
	let length = sandiAppConfig.tool_map.handle_length;
	let getOptions = $("#brandListTable").bootstrapTable("getOptions");
	if(getOptions.totalRows == 0){//没有数据
		swal('表格数据为空，无法导出', '', 'warning');
		return;
	//超出系统导出的最大条数
	}else if(getOptions.totalRows > length){
		swal('导出行数需控制在' + length + '条内，请重试!', '', 'warning');
		return;
	}

	$('#exportForm').attr("action",top.Client.CONST_PATH + "/cube/cubebasic/exportBrandList.action");
	//导出but隐藏10s
	let expButton = $("#exportBrand");
	expButton.attr('disabled',true);
	setTimeout(function(){
		expButton.attr('disabled',false);
	}, 3000);

	for(let key in data){
		if(data[key] != undefined){
			let str = "";
			let value = data[key];

			if(key=='columnFields'){
				value = JSON.stringify(value);
				str = "<input style='display:none;' type='text' name='"+key+"' value='"+value+"' />";
			}else{
				str = '<input style="display:none;" type="text" name="'+key+'" value="'+value+'" />';
			}
			$("#exportForm").append(str);
		}
	}

	//提交form表单
	$("#exportForm").submit();
	$("#exportForm").html("");
}

// 查看修改记录
function checkLog() {
	countSelected(function(index){
		var data = tableList[index]
		top.main_nav.nextPage('cube/cube_brand_management/brand_log.jsp', 'brand_log', data.ORGANIZER_ID)
	})
	
}