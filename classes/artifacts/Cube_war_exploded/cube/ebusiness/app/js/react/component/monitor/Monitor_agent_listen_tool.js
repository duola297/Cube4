//监听工具条
var Monitor_agent_listen_tool = React.createClass({displayName: "Monitor_agent_listen_tool",
	getInitialState : function(){
		return {
			data:{
				agent:{}
			}
		}
	},
	componentDidMount : function(){
		// MyCTIEvent.addEvent("forceInsert",this.insert_function);
	},
	componentDidUpdate:function(){
	},
	// insert_function:function(){
		// this.setState({
		// 	data:this.state.data
		// })
	// },
	exist_listen:function(){
		exist_listen();
	},
	forceInsert:function(){
		forceInsert();
	},
	forceExist:function(){
		forceExist();
	},
	breadUp:function(){
		breadUp();
	},
	intercept:function(){
		intercept();
	},
	render: function() {
		var data = this.props.data;
		if(!data){
			switch(top.index.callStatus){
				case 4:
					var tool = (
						React.createElement("div", {className: "font-white"}, 
							"您现在处于监听状态，点击按钮可以退出监听", 
							React.createElement("button", {className: "btn btn-sm btn-primary m-l-sm", onClick: exist_listen}, 
								"退出监听"
							)
						)
					)
					break;
				case 8:
					var tool = (
						React.createElement("div", {className: "font-white"}, 
							"您现在处于加入通话的状态，点击按钮可以退出通话", 
							React.createElement("button", {className: "btn btn-sm btn-primary m-l-sm", onClick: forceExist}, 
								"退出通话"
							)
						)
					)
					break;
				default :
					var tool = React.createElement("span", null);
					break;
			}
			return (
				React.createElement("div", {className: "height-100", style: {backgroundColor:"rgba(0, 0, 0, 0.8)"}}, 
					React.createElement(BoardPanel, null, 
						React.createElement("center", null, tool)
					)
		        )
			)
		}
		if(monitor.state == "forceInsert"){
			var btn_group = (
				React.createElement("div", {className: "pull-left btn-group"}, 
	            	React.createElement("button", {onClick: function(){this.forceExist();}.bind(this), className: "btn btn-primary", type: "button"}, "退出通话")
	        	)
			)
		}else{
			var btn_group =  (
				React.createElement("div", {className: "pull-right"}, 
					React.createElement("div", {className: "pull-right", style: {paddingTop:2}}, 
		                React.createElement("button", {onClick: function(){this.exist_listen();}.bind(this), className: "btn btn-warning", type: "button", style: {marginTop:-2,color:"#ffffff"}}, "退出监听")
		            ), 
					React.createElement("div", {className: "pull-right btn-group"}, 
		            	React.createElement("button", {onClick: function(){this.forceInsert();}.bind(this), className: "btn btn-white", type: "button"}, "加入通话"), ";", 
		            	React.createElement("button", {onClick: function(){this.breadUp();}.bind(this), className: "btn btn-white", type: "button"}, "强拆"), 
		           		React.createElement("button", {onClick: function(){this.intercept();}.bind(this), className: "btn btn-white", type: "button"}, "拦截")
		        	)
	        	)
			)
		}
		return (
			React.createElement("div", {className: "height-100", style: {backgroundColor:"rgba(0, 0, 0, 0.8)"}}, 
			React.createElement(BoardPanel, null, 
			React.createElement("div", {className: "height-100"}, 
	            React.createElement("div", {className: "pull-left m-r-sm"}, 
	                React.createElement("img", {className: "img-circle img-responsive", style: {height:36}, src: "images/head_big.png"})
	            ), 
	            React.createElement("div", {className: "pull-left m-r-md height-100", style: {paddingTop:10}}, 
	                React.createElement("strong", null, "座席名称："), React.createElement("span", {id: "onListenName", className: "m-r-sm"}, data.user_name), 
	                
	                React.createElement("div", {style: {clear:"both"}})
	            ), 
	            btn_group, 
	        	React.createElement("div", {style: {clear:"both"}})
	        )
	        )
	        )
		);
	}
});

// <strong>座席工号：</strong><span id="onListenAgentId">{data.agentId}</span>