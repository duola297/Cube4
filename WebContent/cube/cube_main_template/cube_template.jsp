<%@page contentType="text/html; charset=UTF-8"%>
<%@taglib prefix='security' uri='http://www.springframework.org/security/tags'%>
<%@taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>模版管理</title>
    <%@include file="/global/cube_top.jsp"%>
    <%@include file="/global/cube_common.jsp"%>
    <link href="${pageContext.request.contextPath}/cube/cube_main_template/css/cube_template.css" rel="stylesheet"/>
</head>
<body>
    <div class="loading" style="display:none;">
        <div class="loading_icon">
            <i class="fa fa-spinner fa-spin fa-4x"></i>
        </div>	
    </div>
    <div class="cube-page" style="overflow: hidden;">
        <div class="cube-page-head">
            模版管理
            <div class="top-select">
                <ul>
                    <li class="font-middle long">
                        <p class="active">文字模版(短信)</p>
                        <div class="iconfont">&#xe60d;</div>
                    </li>
                   <!--  <li class="font-middle">
                        <p>文字模版(微信)</p>
                    </li>
                    <li class="font-middle">
                        <p>图文模版(微信)</p> 
                    </li> -->
                    <li class="font-middle" id="wxTemplateControl">
                        <p>消息模版(微信)</p>
                    </li>
                    <script>
                        if(!top.index.rights.cube_wx_template){
                            $('#wxTemplateControl').hide()
                        }
                    </script>
                </ul>
            </div>
        </div>
        <div class="cube-page-body page-inner-padding">
            <iframe src="word_template.jsp" class="word_template_page" width="100%" height="100%" style="border: 0;"></iframe> 
        </div>
    </div>
    <script src="${pageContext.request.contextPath}/cube/cube_main_template/js/template_public.js"></script>
</body>
<script>
    //if(top.index.weChat.weChatAgentID==''){
        //$(".top-select ul li").hide();
        //$(".top-select ul li").eq(0).show();
    //}
</script>
</html>