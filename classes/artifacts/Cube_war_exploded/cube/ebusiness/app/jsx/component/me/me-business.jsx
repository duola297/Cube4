var MeBusiness = React.createClass({
	getInitialState : function(){
		return {
			data:{
			}
		}
	},
	refresh:function(data){
		this.setState({
			data:this.state.data
		})
	},
	componentDidMount : function(){
		$(".tabs-left>ul>li").click(function(){
			setTimeout(function(){
				page.tidy();
			},100)
		})
	},
	render: function() {
		var contents = [];
		var lis = [];
		if(!!top.cube_rights.cube_sale_opportunity){
			var li = <li className=""><a data-toggle="tab" href="#saleopp">销售机会</a></li>;
			var item = (
				<div id="saleopp" className="tab-pane">
                    <div className="panel-body height-100" style={{width:"90%",marginLeft:"10%"}}>
                        <MeBusinessSale />
                    </div>
                </div>
			)
			lis.push(li);
			contents.push(item);
		}
		if(!!top.cube_rights.cube_potential){
			var li = <li className=""><a data-toggle="tab" href="#potential">潜客开发</a></li>;
			var item = (
				<div id="potential" className="tab-pane">
                    <div className="panel-body height-100" style={{width:"90%",marginLeft:"10%"}}>
                        <MeBusinessPot />
                    </div>
                </div>
			)
			lis.push(li);
			contents.push(item);
		}
		if(!!top.cube_rights.cube_canvass_tel){
			var li = <li className=""><a data-toggle="tab" href="#canvasstel">客户招揽</a></li>;
			var item = (
				<div id="canvasstel" className="tab-pane">
                    <div className="panel-body height-100" style={{width:"90%",marginLeft:"10%"}}>
                        <MeBusinessCan />
                    </div>
                </div>
			)
			lis.push(li);
			contents.push(item);
		}
		if(!!top.cube_rights.cube_complain){
			var li = <li className=""><a data-toggle="tab" href="#complain">投诉管理</a></li>;
			var item = (
				<div id="complain" className="tab-pane">
                    <div className="panel-body height-100" style={{width:"90%",marginLeft:"10%"}}>
                        <MeBusinessCom />
                    </div>
                </div>
			)
			lis.push(li);
			contents.push(item);
		}
		if(!!top.cube_rights.cube_serve){
			var li = <li className=""><a data-toggle="tab" href="#serve">服务工单</a></li>;
			var item = (
				<div id="serve" className="tab-pane">
                    <div className="panel-body height-100" style={{width:"90%",marginLeft:"10%"}}>
                        <MeBusinessServe />
                    </div>
                </div>
			)
			lis.push(li);
			contents.push(item);
		}

		//li
		var default_li = false;
		lis.forEach(function(item){
			if(item.props.className=="active") default_li=true;
		})
		if(!default_li && lis.length>0){
			lis[0].props.className="active";
		}

		//content
		var default_content = false;
		contents.forEach(function(item){
			if(item.props.className=="active") default_content=true;
		})
		if(!default_content && contents.length>0){
			contents[0].props.className="active";
		}
		return (
			<Module title="业务完成情况统计">
				<div className="padding height-100">
				<div className="height-100 response-tab">
					<div className="tabs-container">
	                    <div className="tabs-left">
	                        <ul className="nav nav-tabs" style={{width:"10%"}}>
	                        	{lis}
	                        </ul>
	                        <div className="tab-content ">
	                            {contents}
	                        </div>
	                    </div>
	                </div>
	            </div>
                </div>
			</Module>
		);
	}
});
