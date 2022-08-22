var getMsgTempEr='';
var wxAccountNum;               //微信公众号数量
//弹窗归类html
var setMsgTreeHtml='<div class="tree-reset">'+
                        '<div class="reset-tree-body pull-left">'+
                            '<select class="tree-select-picker form-control"></select>'+
                            '<span class="icon iconfont pull-right icon-btn cursor-pointer icon-pos tree-dele-btn" title="删除模版">&#xe626;</span>'+
                            '<span class="glyphicon glyphicon-pencil pull-right icon-btn icon-pos cursor-pointer tree-edit-btn" title="修改树节点"></span>'+   
                            '<span class="glyphicon glyphicon-plus pull-right icon-btn icon-pos cursor-pointer tree-add-btn" title="新增下级树节点"></span>'+
                            '<div class="reset-tree-content"></div>'+
                        '</div>'+

                        '<div class="pull-left pop-btn-list">'+
                            '<div class="mid-btn-style post-btn font-big cursor-pointer" style="margin-top: 30px;">'+
                                '<span class="glyphicon glyphicon-arrow-left"></span><span class="glyphicon glyphicon-arrow-left"></span>'+
                            '</div>'+
                        '</div>'+
                        '<div class="reset-tree-body pull-left">'+
                            '<div class="template-top-pop font-big">请选择模版分类节点</div>'+
                            '<div class="list-content"></div>'+
                        '</div>'+
                    '</div>';


//获取子节点
var treeChildNodeId=function(data,nodeid){
    if(data.id==nodeid){
        if(data.children!=undefined){
            childNodeId=data.children[data.children.length-1].id; 
        }else{
            childNodeId=nodeid;
        }    
    }else{
        if(data.children!=undefined){
            for(var i=0;i<data.children.length;i++){
                treeChildNodeId(data.children[i],nodeid);
            }
        }
        
    } 
}
//弹窗树 页面树一直变化函数
resetLeftTree=function(){
    $(".select-input-tree").select2().val(moduleId).trigger("change");
    getTreeData("tree-content");
}
//弹窗按钮
$(".new-template-btn").click(function(){
    if(getMsgTempEr!=''||allTempList==undefined){
        toastr.warning(getMsgTempEr);
    }else{
        simpModal({
            head:"消息模板设置",
            body:setMsgTreeHtml,
            show_foot:true,
            size:"lg",          //sm,lg,lgx
            sure_function:function(){
                resetLeftTree();
            },
            canel_function:function(){
                resetLeftTree();
            },
        });
        $(".modal.inmodal.in").attr("tabindex","");
        $(".tree-select-picker").select2({
             data:mList,
             language:"zh-CN",
             placeholder:"请选择模块",
        });
        //树节点新增按钮
        $(".reset-tree-body .tree-add-btn").click(function(){
            addTreeNode("reset-tree-content",popSelectTreeId);
        });
        //节点和模板删除按钮
        $(".reset-tree-body .tree-dele-btn").click(function(){
        	if(selectNodeOrTemp==1){
        		swal({
                    title: "您确定要移除该模版吗",
                    text: "删除后将无法恢复，请谨慎操作！",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "删除",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                }, function () {
                	delectTempFunc(popSelectTreeId);
                }); 
        	}else{
        		delectTreeNode("reset-tree-content");
        	}
        });
        //树节点及模板节点编辑按钮
        $(".reset-tree-body .tree-edit-btn").click(function(){
        	if(selectNodeOrTemp==1){
        		updateTempNodeFunc("reset-tree-content");
        	}else{
        		updataTree("reset-tree-content",popSelectTreeId);
        	}
        });
        //select选择器
        $(".tree-select-picker").select2().val(moduleId).trigger("change");
        getTreeData("reset-tree-content");
        $(".tree-select-picker").on("change", function(e) { 
            $(".template-top-pop").show();
            if($(".reset-tree-content").val()==null){
                $(".reset-tree-content").html('<div class="no-tree"><i class="iconfont">&#xe625;</i><p>请选择模块</p></div>');
            }else{
                moduleId=$(".tree-select-picker").val();
                getTreeData("reset-tree-content");
            }
        }); 
    }
});
//增加模版数据处理函数
var tempMoveData=function(tempPopList){                 //处理要转移的
    console.log(tempPopList);
    var postParam=[];
    var map = {};
    
    treeChildNodeId(treeParam[0],popSelectTreeId);
    map["cubeTemplate.msgId"] = tempPopList[0].id;
    map["cubeTemplate.templateTitle"] = tempPopList[0].title;
    map["cubeTemplate.tempType"] = tempType;
    map["cubeTemplate.moduleId"] = moduleId;
    map["cubeTemplate.treeId"] = popSelectTreeId;
    map["cubeTemplateCriteria.publicId"]=wxAccountId,
    map["publicId"]=wxAccountId
    map["underLevel"] = childNodeId;
    moveToTree(map);
}
//增加模版接口
var moveToTree=function(postParam){                  //转移接口
    console.log(postParam);
    var loadingIndex = layer.load(0, {shade: [0.5, '#000']});
    $.ajax({
        type : "POST",
        async : true,
        data : postParam, 
        url : top.Client.CONST_PATH+ "/cube/cubeTemplate/moveToBusinessTree.action",
        dataType : "json",
        success : function(data) {
            layer.close(loadingIndex);
            getTreeData("reset-tree-content",popSelectTreeId);
            swal({
                title: "成功添加模板！",
                text: "",
                type: "success"
            });
        },
        error :function(data){
            layer.close(loadingIndex);
            console.log("moveToBusinessTree接口出错！");
        }
    });    
}
//对比模版
var contrastTempFunc=function(){
//    可以不断添加相同类型的模板 
//    var noSelectTempList=[];  
//    for(var i=0;i<allTempList.length;i++){
//        noSelectTempList.push(allTempList[i]);
//    }
//    selectedTempList=[];
//    for(var i=0;i<tempIDlist.length;i++){
//        var idSelector=tempIDlist[i]+"_anchor";
//        selectedTempList.push($("#"+idSelector).text());
//    }
//    console.log(selectedTempList);
//    var forFunc=function(a,b){
//        if(a.length!=undefined){
//            for(var j=0;j<a.length;j++){
//                if(b.length!=undefined){
//                    for(var k=0;k<b.length;k++){
//                        if(a[j].title==b[k]){
//                            a.splice(j,1);
//                            b.splice(k,1);
//                            forFunc(a,b);
//                        }
//                    }
//                }
//            } 
//        }    
//    }
//    forFunc(noSelectTempList,selectedTempList)
//    console.log(noSelectTempList);
//    console.log(allTempList);
	
    $(".list-content").empty();
    var tempListHtml='';
    for(var i=0;i<allTempList.length;i++){
        tempListHtml+='<li data-msgid='+allTempList[i].msgId+' class="cursor-pointer">'+allTempList[i].title+'</li>';
    }
    $(".list-content").html(tempListHtml);
    $(".tree-reset .list-content li").each(function(index){
        $(this).click(function(){
        	$(".tree-reset .list-content li").removeClass("active");
        	$(this).addClass("active");
            var tempId=$(this).attr("data-msgid");
        })
    });
    $(".pop-btn-list .post-btn").unbind("click");
    $(".pop-btn-list .post-btn").click(function(){
        var tempPopList=[];
        //增加模版按钮
        $(".tree-reset .list-content li").each(function(index){ 
            if($(this).hasClass("active")){
                tempPopList.push({"id":$(this).attr("data-msgid"),"title":$(this).html()});
            }
        });
        if(tempPopList.length > 0){
        	// 修改模板名称弹框
            var tempNodeHtml='<div class="tree-add-pop btn-pop">'+
    		    	'<label class="control-label pull-left"><b>*</b>模版名称 ：</label>'+
    		    	'<div class="input-name pull-left">'+
    		    	    '<input type="text" class="form-control" name="templateNode_name" value='+ tempPopList[0].title+' >'+
    		    	'</div>'+   
    		    	'</div>';
            simpModal({
                head:'<span class="font-middle">编辑模版</span>',
                body:tempNodeHtml,
                show_foot:true,
                size:"md",          //sm,lg,lgx
                sure_function:function(){
                    if($(".tree-add-pop").find("input[name='templateNode_name']").val()!=''){
                    	tempPopList[0].title = $(".tree-add-pop").find("input[name='templateNode_name']").val();
                    	tempMoveData(tempPopList);
                    }else{
                        toastr.warning('请输入模版名称...');
                        return false;
                    }
                }
            });
        }else{
            toastr.warning("请选择要添加的模版！");
        }
    });
}
//获取所有模版接口
var getAllMsgTemp=function(){
    $(".reset-tree-content").empty();
    var loadingIndex = layer.load(0, {shade: [0.5, '#000']});
    $.ajax({
        type : "POST",
        async : true,
        url : top.Client.CONST_PATH + "/cube/cubeTemplate/getUnsortedMsgTemp.action",
        dataType : "json",
        data : {
            "publicId":wxAccountId
        },
        success : function(data) {
            layer.close(loadingIndex);
            if(data.result==0){    
                if(data.data.length>0){
                    getMsgTempEr='';
                    allTempList=data.data;
                }else{
                    allTempList=[];
                    getMsgTempEr='该公众号暂无消息模版';
                    $(".list-content").html('<div class="no-tree"><i class="iconfont">&#xe625;</i><p>暂无消息模版</p></div>');
                }
            }else if(data.result=="-20"){
                layer.msg('接口异常。请重试！！！', {time: 0, icon:5,shade: [0.5, '#000']});
            }else{
                getMsgTempEr=data.message;
            }
        },
        error :function(data){
            layer.close(loadingIndex);
            layer.msg('接口出错。请重试！！！', {time: 0, icon:5,shade: [0.5, '#000']});
            console.log("getUnsortedMsgTemp接口出错！");
        }
    });
}
