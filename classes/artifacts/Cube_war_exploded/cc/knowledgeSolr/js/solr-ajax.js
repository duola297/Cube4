	function doSearch(value){
		var content =  $('input[name="searchContent"]').val();
		var field = $('#searchBox').searchbox('getName');
		var old_field = $('input[name="field"]').val();
		var currentPage = $('input[name="currentPage"]').val();
		if(content!=value||field!=old_field){
			 $('input[name="searchContent"]').val(value);
		        $('input[name="field"]').val(field);
		        $('input[name="totalPage"]').val(0);
		        $('input[name="counts"]').val(0);
		        $('input[name="currentPage"]').val(1);
		        if(currentPage!=1){
		        	$('#getPager').pagination('select',1); 
		        }
		        var target = 2;
		        getKnowledge(target);
		}
       
    }
	
	
	
	function getKnowledge(target){
		var path = $("#path").val();
		var pageMask=$("<div class=\"datagrid-mask\"></div>").css({display:"block",width:"100%",height:$(window).height()});
		var pageMaskMsg=$("<div class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候。。。").css({display:"block",left:($(document.body).outerWidth(true) - 190) / 2,top:($(window).height() - 45) / 2});
		var field = $('input[name="field"]').val();
		$.ajax({
			beforeSend: function(){
				pageMask.appendTo("body");
				pageMaskMsg.appendTo("body");
			},
			type: "POST",
			url: "./searchSolr.action",
			data: $('#searchForm').serialize(),
//			data:{content:content,field:field,type:type,sort:sort,currentPage:currentPage,totalPage:totalPage,counts:counts},
//			dataType: "json", 
			success: function(data){
				
				if(data.msg==0){
					$.messager.show({
						ok:	"确定",
						title:'错误提示',
						msg:'请输入搜索内容且不能包含非法字符',
						timeout:2000,
						showType:'fade',
						style:{
							position:'absolute',
							left:$(window).width()*0.4,
							top:$(window).height()*0.4
						}
					});
				}
				
				pageMask.remove();
				pageMaskMsg.remove();
				if(typeof(data.counts) == "undefined"){
					$('#seachCounts').text('找到的相关结果约0个');
					var listData = new Array(0);
				}else{
					$('input[name="counts"]').val(data.counts);
					$('input[name="totalPage"]').val(data.totalPage);
					$('#seachCounts').text('找到的相关结果约'+data.counts+'个');
					var listData = data.listData;
				}
				
				$('#data_list').empty();
				if(listData.length==0){
					var result = '<li style="list-style-type:none;"><div style="padding-top: 90px;margin-left: 30%;margin-bottom: 22%;"><p><img alt="没有任何搜索结果" src="images/no_result.png"></p></div></li>';
					$('#data_list').append(result);
				}else{
					for (var i = 0; i < listData.length; i++) {
						var content = listData[i].content;
						var result = '<li><div style="padding-top: 10px;margin-right: 7%;font-family:Microsoft YaHei;">'
									+'<div  style="font-size: 20px;"><a>'+(i+1)+'.</a>'+'<a href="'+ path +listData[i].htmlurl
									+'" target="_blank">'+listData[i].title+'</a></div>'
									+'<div style="padding-top: 0px">'
									+'<div style="font-size: 12px;color: #888;"><p>分类：'
									+listData[i].mold+'</p></div><div style="height:90px;overflow:hidden;"><p style="font-size: 15px;color: #5e5d5d;line-height:1.7;">'
									+content+'</p></div><div style="font-size: 12px;color: #888"><p>上传时间：';
						result = result + listData[i].uploadTime4Date;
						result = result	+' &nbsp;|&nbsp;上传者：'
									+listData[i].uploader+'&nbsp;|&nbsp;浏览次数：'+listData[i].scanTime+'&nbsp;|&nbsp;格式：'
									+listData[i].type+'</p></div></div></div></li>';
						$('#data_list').append(result);
					}
				}
				if(target==2){
					paging();
				}
			},
			error: function(data){
				pageMask.remove();
				pageMaskMsg.remove();
				$.messager.show({
					ok:	"确定",
					title:'错误提示',
					msg:'网络连接异常',
					timeout:2000,
					showType:'fade',
					style:{
						position:'absolute',
						left:$(window).width()*0.4,
						top:$(window).height()*0.4
					}
				});
			}
		});
	}
