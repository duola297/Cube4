
/**
 * 定义页面常量
 * @param str
 * @returns
 */
function CONSTANS(str) {
	datagridId = str + "Datagrid";
	queryFormId = str + "QueryForm";
	queryPanelId = str + "QueryPanel";
	editFormId = str + "EditForm";
	viewFormId = str + "ViewForm";
	editDialogId = str + "EditDialog";
	viewDialogId = str + "ViewDialog";
}
	
/**
 * 获取自构造数据字典(ID-NAME)
 * 
 * @param dictType
 *            数据字典类型
 * @returns
 */
function getDictType(dictType){
	if(dictType==null || dictType=="") return null;
    return eval("(" + dictType + ")");
}

/**
 * 获取自构造数据字典ID对应NAME(多个时返回逗号分割字符串)
 * @param dictId 数据字典key
 * @param dictType 数据字典类型
 * @returns
 */
function getDictName(dictId, dictType){
	if(dictId==null || dictId.toString()=="" || dictType==null || dictType.toString()==""){
		return "";
	}
	var dictName="";
	try{
		$.each(eval("(" + dictType + ")"), function(i, dict){
			if(dict.ID==dictId){
				dictName = dict.NAME;
				return false;
			}
		});
	}catch(e){}
	return dictName;
}

/**
 * 下拉选择框
 * @param id 绑定标签id
 * @param dictType 数据字典类型
 * @param multiple 单选不传参数，多选时true
 */
function combobox(id,dictType,multiple,width){
	var str = getDictType(dictType);
	multiple = typeof multiple == "undefined"  ? false : multiple;
	width=typeof width=="undefined"?164:width;
	$("#"+id).combobox({  
	        multiple:multiple, 
			data:str,  
		    valueField:'ID',  
            textField:'NAME',
			editable:false,
			width:width,
			panelHeight: "auto"
            }); 
	$("#"+id).combobox('clear');		
}

/**
 * 数据查询
 * @param pageNumber 查询第几页
 * @param actionUrl
 */
function queryData(pageNumber,actionUrl){
	$("#currentPage").val(pageNumber);
	$('#'+queryFormId).ajaxSubmit({
		url:listActionUrl,
		dataType: 'json',
		success: function(jsonData){
			$('#'+datagridId).datagrid("loadData", jsonData);
		}
	});
//	$("form").submit(false); //防止页面刷新
}

/**
 * datagrid分页
 */
function paging(){
	$('#'+datagridId).datagrid('getPager').pagination({
		showPageList:false, //是否显示每页数据显示数列表 [10,20,30,40,50]
		showRefresh:false,  //是否显示页面刷新按钮
		//displayMsg:'', //将'显示{from}到{to},共{total}记录'设为空,
		beforePageText:'第',
		afterPageText:'页,共{pages}页',
		pageSize:30,
	    onSelectPage: function(pageNumber, pageSize){
	    	$("#" + datagridId).datagrid('reload',{
	    		'criteria.rows':pageSize,
	    		'criteria.currentPage':pageNumber
	    		}
	    	);
	    	//document.getElementById("criteria.currentPage").value=pageNumber;
	    }
	});
}

/**
 * 初始化datagrid属性
 */
function initDGOption(){
	var datagridOptions = { 
			url:listActionUrl,
			rownumbers : true, //显示行号
			nowrap:false, //显示条纹
			pagination:true, //显示分页工具条
			fitColumns:true, //充满整个datagrid
			remoteSort:false,
			sortOrder:'desc',
			queryParams:{'criteria.rows':30,'criteria.currentPage':1},
			//width:fixWidth(0.91),
			onHeaderContextMenu: function(e, field){
				e.preventDefault();
				if (!$('#tmenu').length){
					createColumnMenu();
				}
				$('#tmenu').menu('show', {
					left:e.pageX,
					top:e.pageY
				});
			}
	}; 
	$('#'+datagridId).datagrid(datagridOptions);
	paging();
	initQueryPanel();
	//初始化校验属性
	$.validator.setDefaults({
		errorClass: "errormessage",
        onkeyup: false,
        errorClass: 'error',
        validClass: 'valid'    
		//errorContainer: $('div.container'),
		//errorLabelContainer: $("ol", $('div.container')),
		//wrapper: 'li',
		//meta: "validate",
//		errorLabelContainer: $('#'+editFormId + ' div.error'),  //错误信息容器
		//errorClass: "error"    //出错样式
	});
}

/**
 * 创建datagrid头部右键显示列菜单
 */
function createColumnMenu(){
	var tmenu = $('<div id="tmenu" style="width:100px;"></div>').appendTo('body');
	var fields = $('#'+datagridId).datagrid('getColumnFields');
	for(var i=0; i<fields.length; i++){
		var hiddenFlag = $('#'+datagridId).datagrid('getColumnOption', fields[i]).hidden;  
		if(!hiddenFlag){
			$('<div id="'+fields[i] +'" iconCls="icon-ok"/>').html($('#'+datagridId).datagrid('getColumnOption', fields[i]).title).appendTo(tmenu);
		}
		
	}
	tmenu.menu({
		onClick: function(item){
			if (item.iconCls=='icon-ok'){
				$('#'+datagridId).datagrid('hideColumn', item.id);
				tmenu.menu('setIcon', {
					target: item.target,
					iconCls: 'icon-empty'
				});
			} else {
				$('#'+datagridId).datagrid('showColumn', item.id);
				tmenu.menu('setIcon', {
					target: item.target,
					iconCls: 'icon-ok'
				});
			}
		}
	});
}

/**
 * 初始化查询panel
 */
function initQueryPanel(){
	$('#'+queryPanelId).panel({  
		  //width:fixWidth(0.91),
		  height:110,
		  padding:5,
		  iconCls:"icon-search" ,
		  collapsible:"true"
		});  
}

/**
 * datagrid数据查询
 */
function search(){
	$('#'+datagridId).datagrid('getPager').pagination({ //查询时当前页不在第一页将分页工具条当前页设为1
        pageNumber: 1
    });
	//输入数据查询时将起始页设为1
    queryData(1);
//	$('#'+queryFormId).submit(false);
}

/**
 * datagrid数据删除
 * @param primaryKey 行数据主键 在datagrid中隐藏列对应field值
 * @param actionUrl
 */
function del(primaryKey,actionUrl){
	var selected = $('#'+datagridId).datagrid('getSelected');
	if (selected) {
		$.messager.confirm('信息', '确定删除?', function(r){
			if (r==true){
	           $.ajax({url:actionUrl,data:{id: selected[primaryKey]}, 
	             success: function(){
	            	$('#'+datagridId).datagrid('reload');
	             }
	           });	
			}
		});
    }else {
    	$.messager.alert('提示','请选择一行记录!','info');
    }
}

/**
 * datagrid数据批量删除(将id拼凑成逗号分割字符串)
 * @param primaryKey 行数据主键 在datagrid中隐藏列对应field值
 * @param actionUrl
 */
function delAll(primaryKey,actionUrl){
	var str = "";
	var selecteds = $('#'+datagridId).datagrid('getSelections');
	if (selecteds.length>0) {
		$.messager.confirm('信息', '确定删除?', function(r){
			if (r==true){
				jQuery.each(selecteds, function(i, rowData) {
	        		str = str +  rowData[primaryKey] + ",";	 
				  }); 
	        	$.ajax({url:actionUrl,data:{idStr: str.substring(0, str.length-1)}, 
	                success: function(){
	               	$('#'+datagridId).datagrid('reload');
	             }
	        	});
			}
		});
    }else {
    	$.messager.alert('提示','请选择一行记录!','info');
    }
}

/**
 * 填充指定form td标签的text属性
 * @param formId
 * @param rowData
 */
function viewForm(formId,rowData){
	$('#'+formId+' td').each(function(index,str) {
		$('#'+formId+' td'+'[id='+str.id+']').text
		  		(typeof rowData[str.id] == "undefined"  ? " " : rowData[str.id]);
		if(str.id == 'enableTip' || str.id == 'enableEmail' || str.id == 'enableSms'){
			if(rowData[str.id] == 'Y')
				$('#'+formId+' td'+'[id='+str.id+']').html
		  			(typeof rowData[str.id] == "undefined"  ? " " : '<img src="../../images/tick.png" />');
			else 
				$('#'+formId+' td'+'[id='+str.id+']').html
	  				(typeof rowData[str.id] == "undefined"  ? " " : '<img src="../../images/fork.gif" />');
		}
	});
}

/**
 * 弹出查看dialog
 * @param dialogId
 */
function showDialog(dialogId,dialogTitle){
	$('#'+dialogId).show();
	$('#'+dialogId).dialog({
		title:dialogTitle,
		modal : true,
		buttons:[{ 
			text: '关闭', 
			iconCls:'icon-cancel', 
			handler:function(){
				$('#'+dialogId).dialog('close');
			}
		}]
	});
	$('#'+editFormId).clearForm();
}

function showDialogEdit(dialogId,dialogTitle,btnText,btnAction){
	$('#'+dialogId).show();
	$('#'+dialogId).dialog({
		title: dialogTitle,
		modal: true,
		buttons:[{ 
			text: btnText, 
			iconCls:'icon-save', 
			handler:btnAction
		},{ 
			text: '关闭', 
			iconCls:'icon-cancel', 
			handler:function(){
				$('#'+dialogId).dialog('close');
			}
		}],
		onClose:function(){
			$("#" + dialogId + " :input").filter(".error").each(function(){
				$(this).qtip('destroy');
			});
		}
	});
	$('#'+editFormId).clearForm();
}

function closeDialog(dialogId){
	$('#'+dialogId).dialog('close');
}

/**
 * 提交表单
 * @param formId
 * @param actionUrl
 */
function formSumit(formId,actionUrl){
    $('#'+formId).ajaxForm({
        url: actionUrl,
        success: function(){
        	$('#'+editDialogId).dialog('close');
        	$.messager.alert('提示','提交成功!','info');
			$('#'+datagridId).datagrid('reload');
            
        }
    });
}

/**
 * 设置excel导出列
 */
function setClumnFields(){
	var clumnFields = "[";
	var fields = $('#'+datagridId).datagrid('getColumnFields');
	jQuery.each(fields, function(i, str) {
		var hiddenFlag = $('#'+datagridId).datagrid('getColumnOption', fields[i]).hidden;  
		if(!hiddenFlag && str!="checkBox"){	
				//格式：{ "field":"userName" , "title":"用户名" },
                var title = $('#'+datagridId).datagrid('getColumnOption', fields[i]).title;
        		clumnFields = clumnFields + "{\"field\":" +"\""+str + "\",\"title\":\""+title+ "\"}"+ ",";	 
			}
		}); 
		$('#clumnFields').val(clumnFields.substring(0, clumnFields.length - 1)+"]");
}

/**
 * datagrid数据导出excel
 * @param actionUrl
 */
function exportExcel(actionUrl){
	setClumnFields();
	jQuery('#form').attr('action', actionUrl);
	$('#'+queryFormId).submit();
}
	
/**
 * 修正easyUI不支持设置width属性百分比
 * @param percent
 * @returns {Number}
 */
function fixWidth(percent)  
{  
    return document.body.clientWidth * percent ; 
} 

//可见区域高度
function fixWidth2(percent){
	return document.documentElement.clientWidth * percent ;
}

/**
 * 修正easyUI不支持设置height属性百分比
 * @param percent
 * @returns {Number}
 */
function fixHeight(percent)  
{  
    return document.body.clientHeight * percent ;
} 

//可见区域高度
function fixHeight2(percent){
	return document.documentElement.clientHeight * percent ;
}

/**
 * 获取提示信息
 * @param error
 * @param element
 */
function getFormTips(error, element){
    var elem = $(element);
    if(!error.is(':empty')) {
       elem.filter(':not(.valid)').qtip({
          overwrite: false,
          content: error,
          position: {
        	 my: 'top center', 
  			 at: 'bottom center',
             viewport: $(window)
          },
          show: {
             event: false,
             ready: true
          },
          hide: false,
          style: {
  			//classes: 'ui-tooltip-shadow ui-tooltip-blue'
        	classes: 'ui-tooltip-red'
          }
       })
       .qtip('option', 'content.text', error);
    }
    else { elem.qtip('destroy'); }
}

function showqtip(objid,content){
	$('#' + objid).qtip({
        overwrite: false,
        content: {
        	text:content
        },
        position: {
      	 my: 'top center', 
			 at: 'bottom center',
           viewport: $(window)
        },
        show: {
           event: false,
           ready: true
        },
        hide: false,
        style: {
			classes: 'ui-tooltip-red'
        }
     }).addClass('error');
}

//获取当前模块ID
function getCurrentModuleId() {
	var bodyrel = "temp" + Math.floor(Math.random() * 100 + 1);
	$('body').attr("rel", bodyrel);
	for (var i = 0; i < window.parent.frames.length; i++) {
		try {
			if (window.parent.frames[i].name == "frmWebRTC")
				continue;
		} catch (e) {
			continue;
		}
		var tRel = $(window.parent.frames[i].document).find("body").attr("rel");
		if (tRel == bodyrel) {
			$('body').removeAttr("rel");
			return window.parent.frames[i].frameElement.id;
			break;
		}
	}
}

//对话框加上蒙板
function dialogMask(dialogId){
	if(dialogId==undefined || dialogId=="") return;
	var dlgWidth=$("#"+dialogId).css("width");
	var dlgHeight=$("#"+dialogId).css("height");
	$("#"+dialogId).before("<div id=\"sd_dlg_mask\" class=\"dialog-mask\" style=\"display:block;width:"+dlgWidth+";height:"+dlgHeight+";\"><div class=\"dialog-mask-msg\" style=\"display:block;left:"+(dlgWidth.replace("px","")/2-60)+"px;top:"+(dlgHeight.replace("px","")/2-30)+"px;\">加载中，请稍候...</div></div>");
}

//解除蒙板
function dialogUnMask(){
	$("#sd_dlg_mask").remove();
}