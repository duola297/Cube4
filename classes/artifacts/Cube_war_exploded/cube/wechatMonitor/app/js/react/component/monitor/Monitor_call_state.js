var Monitor_call_state = React.createClass({displayName: "Monitor_call_state",
	option:agent_states_option,
	getInitialState : function(){
		return {
			data:{
				agents:[],
				agent_states:{
					num:0,				//总数
					online_num:0,		//在线
					ring_num:0,			//振铃
					outline_num:0,		//离线
					talking_num:0,		//通话
					rest_num:0,			//休息
					free_num:0,			//空闲（在线）
					work_behind_num:0	//后处理
				}
			}
		}
	},
	update_agents:function(agents){
		this.state.data.agents = agents;
		this.count_agent_states();
		this.setState({
			data:this.state.data
		})
	},
	count_agent_states:function(){
		var agents = this.state.data.agents;
		var agent_states = {
			num:0,				//总数
			online_num:0,		//在线
			ring_num:0,			//振铃
			outline_num:0,		//离线
			talking_num:0,		//通话
			rest_num:0,			//小休
			free_num:0,			//空闲（在线）
			work_behind_num:0	//后处理
		};
		agents.map(function(item){
			agent_states.num++;
			if(item.status>0){
				if(item.status==1) agent_states.ring_num++;
				if(item.status==2) agent_states.talking_num++;
				if(item.status==4) agent_states.talking_num++;
				agent_states.online_num++;
			}else if(item.login==1){
				agent_states.online_num++;
				if(item.pause=="1" && item.occupy!="1"){
					agent_states.rest_num++;
				}else{
					if(item.occupy=="1"){
						agent_states.work_behind_num++;
					}else{
						agent_states.free_num++;
					}
				}
			}else{
				agent_states.outline_num++;
			}
		});
		this.state.data.agent_states = agent_states;
		this.states_to_pie(agent_states);
	},
	states_to_pie:function(agent_states){
		var agent_states_pie={
			free_num:{name:"空闲",value:0,color:"#000000"},			//空闲（在线）
			ring_num:{name:"振铃",value:0,color:"#000000"},			//振铃
			talking_num:{name:"通话",value:0,color:"#000000"},		//通话
			work_behind_num:{name:"后处理",value:0,color:"#000000"},	//后处理
			rest_num:{name:"小休",value:0,color:"#000000"},			//休息
			outline_num:{name:"离线",value:0,color:"#000000"}		//离线
		};
		var pie_data = [];
		for(pre in agent_states_pie){
			agent_states_pie[pre].value = agent_states[pre];
			pie_data.push(agent_states_pie[pre]);
		}
		this.option.series[0].data = pie_data;
	},
	componentDidMount : function(){
		MyCTIEvent.addEvent("update_agents", this.update_agents);
	},
	componentDidUpdate:function(){
	},
	render: function() {
		return (
			React.createElement("div", {style: {width:'100%',height:"100%",position:"relative"}}, 
		    	React.createElement(GenericChart, {option: this.option}), 
				React.createElement(RateCenter, {key_name: "inline_agent", 
					title: "在线座席", 
					chart_option: this.option, 
					content: this.state.data.agent_states.online_num+"/"+this.state.data.agent_states.num})
			)
		);
	}
});