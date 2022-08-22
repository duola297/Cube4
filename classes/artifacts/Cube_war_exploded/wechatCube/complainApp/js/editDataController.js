
app.controller('editDataPage', [
    '$scope','searchDataFactory','customDataFactory','orderListFactory','postUrlFactory', function($scope,searchDataFactory,customDataFactory,orderListFactory,postUrlFactory) {
        $scope.customerHead={
            item:"",
            name:"",
        }                                  
        $scope.cubeTitle='投诉管理';
        $scope.cubeTitleNum=$scope.cubeTitle+"(5)";
        $scope.searchPopFlag=false;
        $scope.newOrderHtml='';
        $scope.hostUrl="http://"+window.location.host+"/Cube";      //当前域名
        $scope.newOrderParam=newOrderParam;                         //客户选择
        resetpickerData('searchstarttime');                         //搜索日期控件
        resetpickerData('searchendtime');                           //搜索日期控件
        $scope.editDatatab=[                                        //工单编辑详情页
                    {
                    "name":"投诉详情",
                    "rounter":"order_detail",
                    "content":'',
                    },
                    {
                    "name":"客户信息",
                    "rounter":"custom_msg",
                    "content":'',
                    },
                ];   
        $scope.selectOrderSearch=function(value){
            $scope.orderList='';
            $scope.serveType=value;
            for(var j=0;j<$scope.orderListCheck.length;j++){
               if($scope.orderListCheck[j].orderDataValue==value){
                 $scope.orderListName=$scope.orderListCheck[j].orderDataName;
               }
            }
            
            $$.router.load("#page-order-list"); 
            $scope.getData();
        }
        $scope.showSearchPop=function(){
           $scope.searchPopFlag=true; 
        }
        $(".search-content").click(function(){
                $scope.searchPopFlag=false; 
                return false;
            })
        $(".search-content .search-inner").click(function(){
            return false;
        })
        $scope.searchCustomer=function(){           //客户资料
            if($scope.searchcustomer==''||$scope.searchcustomer==' '){
            }else{
                $.ajax({
                        type : "POST",
                        async : false,	
                        url:$scope.hostUrl+"/cube/cube_customer/getSelCusDiaList.action",
                        dataType : "json",
                        data:{'selCusDiaListCriteria.keyword':$scope.searchcustomer,
                        },
                        success : function(data){ 
                            if(data.total>0){
                                $(".search-input .search_picker").remove();
                                var pickerParam=[];
                                for(var i=0;i<data.total;i++){
                                    pickerParam.push(data.rows[i].PERSON_NAME);
                                }
                                $scope.setCustomerValue=function(value){
                                    console.log(value);
                                    for(var i=0;i<data.total;i++){
                                        if(data.rows[i].PERSON_NAME==value){
                                            console.log(data.rows[i]);
                                            customDataFactory.contactid=data.rows[i].CONTACTID;
                                            for(var now in data.rows[i]){
                                                for(var j=0;j<$scope.newOrderParam.length;j++){
                                                    if($scope.newOrderParam[j].id==now){
                                                        if(data.rows[i][now]=='null'){
                                                            $scope.newOrderParam[j].value='';
                                                        }else{
                                                            $scope.newOrderParam[j].value=data.rows[i][now];
                                                        }   
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    $scope.$apply();
                                    console.log($scope.newOrderParam);
                                }
                                $(".search-input").append('<input type="search" class="search_picker" style="display:none;" readonly="">');
                                $$(".search_picker").picker({
                                      toolbarTemplate: '<header class="bar bar-nav">\
                                      <button class="button button-link pull-left"></button>\
                                      <button class="button button-link pull-right close-picker">确定</button>\
                                      <h1 class="title">选择客户</h1>\
                                      </header>',
                                      cols: [
                                        {
                                          textAlign: 'center',
                                          values: pickerParam,
                                        }
                                      ],
                                      onClose:function(picker){
                                        $scope.setCustomerValue(picker.cols[0].displayValue);
                                    },
                                    });
                                $$(".search_picker").picker("open");
                            }
                            console.log(data);
                            },
                             error:function(xhr,status,statusText){
                                window.location.href=$scope.hostUrl+"/wechatCube/errorPage/error.html";
                                console.log("出错了:"+xhr.status);
                            }
                }); 
            }
        }
        $scope.addServerOrder=function(){           //新增
            $(".loadingPop").show();
            $$.router.load("#new_order"); 
            $.ajax({                                
                    type : "POST",
                    async : true,	
                    url:$scope.hostUrl+"/cube/user_interface/getTableStruct.action",
                    dataType : "json",
                    data:{'moduleId':370,
                    },
                    success : function(data){          
                            if(data!=''){
                                var customData=$.parseJSON(data);
                                console.log(customData);
                                customDataFactory.data=customData;
                                customDataFactory.definedType='NEW';
                                customDataFactory.controllerDiv='new_order'; 
                                postUrlFactory.editur=$scope.hostUrl+"/cube/cubeComplain/saveComplain.action";
                                $scope.newuserDate=customDataFactory;                                    
                                $scope.newOrderHtml='<user-defined userdata="newuserDate"></user-defined>'; 
                                 $scope.$apply();
                                $(".loadingPop").hide();
                            }
                        },
                     error:function(xhr,status,statusText){
                        window.location.href=$scope.hostUrl+"/wechatCube/errorPage/error.html";
                        console.log("出错了:"+xhr.status);
                    }
            });
        }
        $scope.editData=function(row,li,isChange){           //点击进入自定义界面
            orderListFactory.index=li;
            $scope.customerhead = '<customer-head customer="customerHead"></customer-head>';
            hasIds=false;
            $(".loadingPop").show();
            $scope.editDatatab[0].content='';
            $scope.editDatatab[1].content='';     
            if(isChange!='no'){
                $$.router.load("#detail_msg"); 
                 $scope.$apply();
            }
            console.log(row);
            $scope.customerHead.item=row.COMPTITLE;
            $scope.customerHead.name=row.PERSON_NAME;
            customDataFactory.autoId=row.COMP_ID;
            customDataFactory.contactid=row.CONTACTID;
            $.ajax({                                    //编辑工单
                    type : "POST",
                    async : true,	
                    url:$scope.hostUrl+"/cube/cubeComplain/getComplainDetailById.action",
                    dataType : "json",
                    timeout : 3000, //超时时间设置，单位毫秒
                    data:{'autoId':row.COMP_ID,},
                    success : function(data){          
                            if(data!=''){
                                var customData=$.parseJSON(data);
                                console.log(customData);
                                customDataFactory.data=customData.tableStruct;
                                customDataFactory.definedType='EDIT';
                                postUrlFactory.editur=$scope.hostUrl+"/cube/cubeComplain/saveComplain.action";
//                                customDataFactory.postUrl=$scope.hostUrl+"/cube/cubeServe/saveServe.action";
                                customDataFactory.setValue=customData.detail[0];
                                $scope.userDate=customDataFactory;
                                $scope.editDatatab[0].content='<user-defined userdata="userDate"></user-defined>';
                                $scope.$apply();
                                $.ajax({                                            //编辑客户信息
                                        type : "POST",
                                        async : true,	
                                        url:$scope.hostUrl+"/cube/cube_customer/getCustomerDetailById.action",
                                        dataType : "json",
                                        data:{'autoId':row.CONTACTID,
                                        },
                                        success : function(data){          
                                                if(data!=''){
                                                    var customData=$.parseJSON(data);
                                                    console.log(customData);
                                                    customDataFactory.data=customData.tableStruct;
                                                    customDataFactory.setValue=customData.cusDetail[0];
                                                    customDataFactory.div='customerForm';
                                                    customDataFactory.definedType='CUSTOMER';
                                                    postUrlFactory.customerurl=$scope.hostUrl+"/cube/cube_customer/saveCustomerData.action";
//                                                    customDataFactory.postUrl=$scope.hostUrl+"/cube/cube_customer/saveCustomerData.action";
                                                    $scope.customerDate=customDataFactory; 
                                                    $scope.editDatatab[1].content='<user-defined userdata="customerDate"></user-defined>';
                                                    $scope.$apply();
                                                    $(".loadingPop").delay(1000).hide();
                                                }
                                            }
                                });
                            }
                        },
                        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                            if(status=='timeout'){//超时,status还有success,error等值的情况
                                alert("请求超时");
                                window.location.href=$scope.hostUrl+"/wechatCube/errorPage/error.html";

                            }
                        },
                         error:function(xhr,status,statusText){
                              console.log("出错了:"+xhr.status);
                            window.location.href=$scope.hostUrl+"/wechatCube/errorPage/error.html";
                           
                        }
            });

        }

        $scope.deleteTable=function(row,li){        //删除事件
            console.log(row.COMP_ID);
            $$.confirm('确定删除?', function () {
                $.ajax({
                    type : "POST",
                    async : false,	
                    url:$scope.hostUrl+"/cube/cubeComplain/deleteComplain.action",
                    dataType : "json",
                    data:{'compIdList[0]':row.COMP_ID,
                    },
                    success : function(data){          
                        if(data=='1'){
                            $scope.getData();
                            $$.toast("删除成功");
                            console.log('删除成功');
                            }
                        },
                     error:function(xhr,status,statusText){
                        window.location.href=$scope.hostUrl+"/wechatCube/errorPage/error.html";
                        console.log("出错了:"+xhr.status);
                    }
                });
            });
            
        }
        $scope.editTableOption=function(row,li,option){         //长按操作
            console.log(option);
            if(option=='转移'){
                $(".loadingPop").show();
                $.ajax({
                    type : "POST",
                    async : true,	
                    url:$scope.hostUrl+"/cube/cube_customer/getPersonByOrganizerID.action",
                    dataType : "json",
                    success : function(data){          
                            if(data.length>0){
                                var option=[];
                                    for(i in data){
                                        option.push({value:data[i].USER_NAME,id:data[i].USER_ID});
                                    }   
                                    $('body').append('    <input id="multiPickerInput" type="text" readonly/><div id="targetContainer"></div>');
                                    new MultiPicker({
                                        input: 'multiPickerInput',//点击触发插件的input框的id
                                        container: 'targetContainer',//插件插入的容器id
                                        jsonData: option,
                                        title:"选择坐席",
                                        success: function (arr) {
//                                            console.log(arr);
                                            $scope.transferServe(arr[0].id);
                                        },//回调
                                    });
                                    $("#targetContainer").find(".multi-picker-bg").addClass("multi-picker-bg-up");
                                    $("#targetContainer").find(".multi-picker-bg .multi-picker-container ").addClass(" multi-picker-container-up");
                                    $(".loadingPop").hide();
                                layer.closeAll();
                            }
                        },
                     error:function(xhr,status,statusText){
                        window.location.href=$scope.hostUrl+"/wechatCube/errorPage/error.html";
                        console.log("出错了:"+xhr.status);
                    }
                });
                
                $scope.transferServe=function(UserId){              //转移接口
                    $(".loadingPop").show();
                    $.ajax({
                        type : "POST",
                        async : false,	
                        url:$scope.hostUrl+"/cube/cubeComplain/transferComplain.action",
                        dataType : "json",
                        data:{'compIdList[0]':row.COMP_ID,
                              'transferUserId':UserId,
                        },
                        success : function(data){    
                            $(".loadingPop").hide();
                            if(data=='1'){
                                console.log('转移成功');
                                $scope.getData();
                                $$.toast("转移成功");
                                } 
                            },
                         error:function(xhr,status,statusText){
                              console.log("出错了:"+xhr.status);
                            window.location.href=$scope.hostUrl+"/wechatCube/errorPage/error.html";
                           
                        }
                    });
                }

            }
        }
        $scope.getListData=function(){
            $.ajax({
                url:$scope.hostUrl+"/cube/cubeComplain/getComplainStatistics.action",
                async : true,
                type: "POST",
                data:{
                      'cubeComplainCriteria.isPool':0,
                      'cubeComplainCriteria.startTime':$scope.searchStartTime,
                      'cubeComplainCriteria.endTime':$scope.searchEndTime,
                      'cubeComplainCriteria.serveState':$scope.serveType,
                      'cubeComplainCriteria.search':$scope.serveContent,
                      },
                dataType : "json",
                success : function(result) {
                    $scope.cubeTitle='投诉管理';
                    $scope.isIndex=false;
                    var colorList=["#00c765;","#ff6554;","#ff9e00;","#2fb4d7;","#009ffd;","#7ccd00;","#001FFF"];
                    if(result.returnCode){
                        if(result.data.length>0){
                            $scope.orderListCheck=[];
                            var total=0;
                            var i=0
                            for(;i<result.data.length;i++){
                                 $scope.orderListCheck.push(
                                    {
                                        orderDataName:"我的"+result.data[i].name+"的投诉",
                                        orderDataValue:result.data[i].state,
                                        orderState:result.data[i].name,
                                        color:colorList[i],
                                        num:result.data[i].num,   
                                    });
                                total+=result.data[i].num;
                            }
                            i++
                             $scope.orderListCheck.push(
                                    {
                                        orderDataName:"我的所有的投诉",
                                        orderDataValue:"",
                                        orderState:"",
                                        color:colorList[i],
                                        num:total,   
                                    });
                        }
                    }
                    $scope.$apply();
                }
        	});
        }
        if(serveId==undefined){
            $scope.getListData();
        } 
        $scope.getData=function(){                  //获取数据接口
            $(".loadingPop").show();
            $.ajax({
                    type : "POST",
                    async : true,	
                    url:$scope.hostUrl+"/cube/cubeComplain/getComplainList.action",
                    timeout : 5000, //超时时间设置，单位毫秒
                    dataType : "json",
                    data:{
                          'cubeComplainCriteria.isPool':0,
                          'cubeComplainCriteria.rows':100,
                          'cubeComplainCriteria.startTime':$scope.searchStartTime,
                          'cubeComplainCriteria.endTime':$scope.searchEndTime,
                          'cubeComplainCriteria.compState':$scope.serveType,
                          'cubeComplainCriteria.fuzzyKeySearch':$scope.serveContent,
                          'idList':$scope.urlServeId,
                    },
                    success : function(data){                            
                            $scope.orderList=$scope.orderListName+"("+data.total+")";
                            var longOption=['转移'];
                            $scope.isIndex=true;
                            Table.rend_table(data.rows,longOption);
                            orderListFactory.data=data.rows;
                            $scope.cubeTitle=$scope.orderList;
                            hasIds=true;
                            if(serveId!=undefined&&data.total==1){
                                $scope.editData(data.rows[0],0);
                            }else if(serveId!=undefined&&data.total==0){      //模版消息工单已被删除
                                $scope.cubeTitle="暂无投诉"
                                $$.toast("该投诉已被删除");
                            }
                            if(serveId!=undefined){
                                $("#page-order-list .bar-nav .pull-left").hide();
                            }
                            $scope.$apply();
                            $(".loadingPop").hide();
                        },
                        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                            if(status=='timeout'){//超时,status还有success,error等值的情况
                                alert("请求超时！");

                            }
                        },                       
                         error:function(xhr,status,statusText){
//                             alert("出错了:"+xhr.status);
                            window.location.href=$scope.hostUrl+"/wechatCube/errorPage/error.html";
                            
                        }
                });           
        }   
        $scope.suresearch=function(){               //搜索确定
            var url=window.location.href;
            var router=url.substring(url.lastIndexOf("#")+1);
            if($scope.searchStartTime==undefined&&$scope.searchEndTime==undefined){
                if(router=="page-order-list"){
                    $scope.getData();
                }else{
                    $scope.getListData();
                } 
                $scope.searchPopFlag=false;
            }else if($scope.searchStartTime!=undefined&&$scope.searchEndTime!=undefined){
                if(CompareDate($scope.searchEndTime,$scope.searchStartTime)){
                    if(router=="page-order-list"){
                        $scope.getData();
                    }else{
                        $scope.getListData();
                    } 
                    $scope.searchPopFlag=false;
                }else{
                    $$.toast("结束时间必须大于开始时间");
                }
            }else{
                $$.toast("请填写全部时间");
            }
        }
        $scope.backServerIndex=function(){          //返回上一次初始化
            $scope.newOrderHtml='';
            $scope.searchcustomer='';
            for(var j=0;j<$scope.newOrderParam.length;j++){
                $scope.newOrderParam[j].value='';
            }
            $scope.getListData();
        }
        $scope.backServerIndex1=function(){          //返回上一次初始化
            $$.router.load("#page-index");
            $scope.getListData();
        }   
        $scope.resetsearch=function(){              //搜索初始化
            $scope.searchEndTime=undefined;
            $scope.searchStartTime=undefined;
            $scope.serveContent='';
        }
    }
]);
