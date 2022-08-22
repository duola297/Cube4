var Monitor_call_queue = React.createClass({displayName: "Monitor_call_queue",
	option:agent_queue_option,
	page:0,
	queue:0,
	max_queue:0,
	queue_name_list_show:[],
	queue_value_list_show:[],
	getInitialState : function(){
		return {
			data:{
				queue:{
					data:[{grpId:"--",name:"--",value:'-'}],
					group_names:["--"]
				},
				call_data:{
					cubeNetAcdMaxData:{},
					cubeNetSvrData:{}
				}
			}
		}
	},
	getData:function(){
		$.get(sandiAppConfig.ebusiness.monitor.agent_group+"?orgId="+g_currentOrganizerId,function(data, textStatus){
			var temp = _.filter(data, function(item){ 
				return item.GROUPID != "All"; 
			});
			this.init_mygroup(temp);
			this.refresh();
	    }.bind(this));
	},
	refresh_call:function(data){
		this.state.data.call_data = data;
		this.refresh();
	},
	refresh:function(){
		this.setState({
			data:this.state.data
		})
	},
	init_queue:function(){
		var jsons = [
			{grpId:"A077",waitCall:Math.round(Math.random()*7)},
			{grpId:"A078",waitCall:Math.round(Math.random()*7)},
			{grpId:"B001",waitCall:Math.round(Math.random()*7)},
			{grpId:"C001",waitCall:Math.round(Math.random()*7)},
			{grpId:"E001",waitCall:Math.round(Math.random()*7)},
			{grpId:"D001",waitCall:Math.round(Math.random()*7)},
			{grpId:"A077",waitCall:Math.round(Math.random()*7)},
			{grpId:"A077",waitCall:Math.round(Math.random()*7)},
			{grpId:"A077",waitCall:Math.round(Math.random()*7)}
		]
		this.format_queue(jsons[Math.round(Math.random()*7)]);
		setInterval(function(){
			this.format_queue(jsons[Math.round(Math.random()*7)]);
		}.bind(this),5000);
	},
	format_queue:function(json){
		if(json.waitCall==0) json.waitCall="-";
		this.state.data.queue.data.forEach(function(item){
			if(item.grpId==json.grpId){
				item.value=json.waitCall;
			}
		})
		this.state.data.queue.data =  _.sortBy(this.state.data.queue.data, function(item){ 
			// item.QUEUE_LEN = Math.round(Math.random()*10);
			if(item.value=="-") return 0;
			return -item.value;
		});
		this.filter();
	},
	group_queue:function(json){
		this.format_queue(json);
	},
	init_mygroup:function(groups){
		var queue = this.state.data.queue;
		//设置可查看的座席组
		var group_str = top.Client.Global.Groups;
		var tempGroup = [];
		for(var i=0;i<group_str.length;){
			tempGroup.push(group_str.substring(i,i+4));
			i=i+4;
		}
		// tempGroup.forEach(function(item){
			groups.forEach(function(group){
				// if(item==group.GROUPID){
					var temp = {grpId:group.GROUPID,name:group.GROUPNAME,value:'-'};
					queue.data.push(temp);
				// }
			})
		// });
		//去除初始化数据
		if(queue.data[0].grpId=="--" && queue.data.length>1) queue.data = _.rest(queue.data);
		
		this.filter();
	},
	to_left:function(){
		if(!!this.page){
			this.page--;
			this.filter();
		}
	},
	to_right:function(){
		if(this.page >= Math.ceil(this.state.data.queue.data.length/5)-1) return;
		this.page++;
		this.filter();
	},
	filter:function(){
		this.queue=0;
		//设置座席组名称,计算网点排队数
		this.state.data.queue.group_names = [];
		this.state.data.queue.data.forEach(function(item){
			this.state.data.queue.group_names.push(item.name);

			if(item.value=="-") this.queue += 0;
			else this.queue += item.value;

		}.bind(this));

		this.queue_name_list_show = [];
		this.queue_value_list_show = [];
		this.state.data.queue.group_names.map(function(item,index){
			if(index>=this.page*5 && index<this.page*5+5) this.queue_name_list_show.push(item);
		}.bind(this));
		this.state.data.queue.data.map(function(item,index){
			if(index>=this.page*5 && index<this.page*5+5) this.queue_value_list_show.push(item);
		}.bind(this));

		if(this.queue_value_list_show.length>0){
			this.option.series[0].data = this.queue_value_list_show;
		}

		if(this.queue_name_list_show.length>0){
			this.option.xAxis[0].data = this.queue_name_list_show;
			if(this.queue_name_list_show.length>4){
				this.option.xAxis[0].axisLabel={rotate:-25};
			}else{
				this.option.xAxis[0].axisLabel={rotate:0};
			}
		}

		this.setState({
			data:this.state.data
		})
	},
	refresh_max_queue:function(data){
		this.max_queue = data.MAX_QUEUE_LEN;
	},
	componentDidMount : function(){
		this.getData();
		MyCTIEvent.addEvent("group_queue", this.group_queue);
		DataEvent.addEvent("call_data", this.refresh_call);
		DataEvent.addEvent("max_queue",this.refresh_max_queue);
		this.refresh();
		// this.init_queue(); //测试用例
	},
	componentDidUpdate:function(){
	},
	render: function() {

		if(!this.state.data.call_data.cubeNetAcdMaxData) this.state.data.call_data.cubeNetAcdMaxData={};
		if(!this.state.data.call_data.cubeNetSvrData) this.state.data.call_data.cubeNetSvrData={};

		return (
			React.createElement("div", {className: "height-100"}, 
		    	React.createElement("div", {className: "pull-left height-100", style: {width:'40%',lineHeight:"4vh"}}, 
		          	React.createElement(BoardPanel, null, 
		          		React.createElement("center", null, 
			            	React.createElement("div", {className: "font-large font-wrong"}, this.queue), 
			            	React.createElement("div", null, "排队数")
			            	
			            )
		        	)
		    	), 
		    	React.createElement("div", {className: "pull-left height-100", style: {width:'60%'}}, 
				    React.createElement("div", {className: "height-100 p-r"}, 
						React.createElement(BoardPanel, {className: "height-100 p-a"}, 
							React.createElement("center", {className: "round  pull-lef", onClick: this.to_left}, 
								React.createElement("i", {className: "icon iconfont font-white ", style: {fontSize:"10px"}}, "")
							), 
							React.createElement("center", {className: "round  pull-right", onClick: this.to_right}, 
								React.createElement("i", {className: "icon iconfont font-white", style: {fontSize:"10px"}}, "")
							)
						), 
						React.createElement("center", {className: " height-100", style: {top:'0px',width:"100%"}}, 
							React.createElement("div", {className: "height-100", style: {width:"80%"}}, 
								React.createElement(GenericChart, {option: this.option})
							)
						)
					)
		    	)
			)
		);
	}
});

// <div>今天最长排队数：{none2zero(this.max_queue)}</div>

// <span>排队数：{none2def(this.state.data.call_data.MAX_QUEUE_LEN)}</span>
//  <br/>


 // <span>今天最长排队数：{none2def(this.state.data.call_data.cubeNetAcdMaxData.MAX_QUEUE_LEN)}</span>
 //              			<br/>
 //              			<span>平均等待时长：{sec_to_time(this.state.data.call_data.cubeNetSvrData.WAITE_DUR_AVG)}</span>