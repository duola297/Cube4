var MeWork = React.createClass({displayName: "MeWork",
	getInitialState : function(){
		return {
			data:{
				call:{},
				wechat:{}
			}
		}
	},
	refresh:function(){
		this.setState({
			data:this.state.data
		})
	},
	refresh_call:function(data){
		if(!isEmptyObject(data)){
			data.lost_cnt = data.SHD_ANS_CNT - data.ANS_CNT;
			data.rest_dur = data.ONLINE_DUR - data.ANS_DUR_SUM - data.WORK_DUR_SUM;
		}else{
			data.lost_cnt = 0;
			data.rest_dur = 0;
		}
		this.state.data.call = data;
		this.refresh();
	},
	refresh_wechat:function(data){
		this.state.data.wechat = data;
		if(isEmptyObject(data)){
			data.RESPONE_CNT = 0;
			data.NO_RESPONE_CNT = 0;
		}
		this.refresh();
	},
	componentDidMount : function(){
		DataEvent.addEvent("call-info", this.refresh_call);
		DataEvent.addEvent("wechat-info", this.refresh_wechat);
	},
	render: function() {
		var call = this.state.data.call;
		var wechat = this.state.data.wechat;

		if(!!call.ANS_CNT){
			var avg_work_time = none2rail(Math.round(call.WORK_DUR_SUM/call.ANS_CNT));
			var avg_ring_time = none2rail(Math.round(call.RING_DUR_SUM/call.ANS_CNT));
			var avg_ans_time = neg_to_zero(toDecimal(call.ANS_DUR_SUM/call.ANS_CNT));
		}else{
			var avg_work_time = 0;
			var avg_ring_time = 0;
			var avg_ans_time = 0;
		}

		return (
			React.createElement(Module, {title: "工作情况统计"}, 
				React.createElement("div", {className: "height-100", style: {paddingTop:10}}, 
					React.createElement("div", {className: "pull-left height-100 padding-lr", style: {width:"25%"}}, 
						React.createElement(Paster, {header: "在线情况", icon: ""}, 
							React.createElement("div", {style: {height:"50%"}}, 
								React.createElement("div", {className: "m-t-sm"}, React.createElement("center", null, "今天", me.isAdmin?"网点":"", "在线总时长")), 
								React.createElement("div", null, 
									React.createElement("center", null, 
										React.createElement("span", {className: "font-showy font-green-dim padding-lr"}, sec_to_hour(neg_to_zero(call.ONLINE_DUR))), "小时"
									)
								)
							), 
							React.createElement("div", null, 
								React.createElement("center", null, 
									"休息总时长：", React.createElement("span", {className: "font-green-dim padding-lr-xs"}, sec_to_hour(neg_to_zero(call.STOP_DUR))), "小时"
								)
							)
						)
					), 
					React.createElement("div", {className: "pull-left height-100 padding-lr", style: {width:"50%"}}, 
						React.createElement(Paster, {header: "电话服务情况", icon: ""}, 
							React.createElement("div", {style: {height:"50%"}}, 
								React.createElement(BoardPanel, null, 
								React.createElement("div", {className: "col-sm-4 p-n border-right-grey"}, 
									React.createElement(Target, {name: "呼入", num: neg_to_zero(call.SHD_ANS_CNT)})
								), 
								React.createElement("div", {className: "col-sm-4 p-n border-right-grey"}, 
									React.createElement(Target, {name: "呼出", num: neg_to_zero(call.EXTP_CNT)})
								), 
								React.createElement("div", {className: "col-sm-4 p-n"}, 
									React.createElement(Target, {name: "未接", num: neg_to_zero(call.lost_cnt)})
								)
								)
							), 
							React.createElement("div", null, 
								React.createElement("div", {className: "col-sm-6 text-right padding-lr-md"}, "平均空闲时长：", sec_to_hour(call.rest_dur/call.AGT_CNT), "小时"), 
								React.createElement("div", {className: "col-sm-6 padding-lr-md"}, "平均通话时长：", avg_ans_time, "秒"), 
								React.createElement("div", {className: "col-sm-6 text-right padding-lr-md"}, "平均后处理时长：", avg_work_time, "秒"), 
								React.createElement("div", {className: "col-sm-6 padding-lr-md"}, "平均摘机时长：", avg_ring_time, "秒")
							)
						)
					), 
					React.createElement("div", {className: "pull-left height-100 padding-lr", style: {width:"25%"}}, 
						React.createElement(Paster, {header: "微信服务情况", icon: ""}, 
							React.createElement("div", {style: {height:"50%"}}, 
								React.createElement(BoardPanel, null, 
								React.createElement("div", {className: "col-sm-6 p-n border-right-grey"}, 
									React.createElement(Target, {name: "已响应", num: wechat.RESPONE_CNT})
								), 
								React.createElement("div", {className: "col-sm-6 p-n"}, 
									React.createElement(Target, {name: "未响应", num: wechat.NO_RESPONE_CNT})
								)
								)
							), 
							React.createElement("div", null, 
								React.createElement("center", null, 
								"平均沟通时长：", sec_to_time(wechat.CHAT_DUR)
								)
							)
						)
					)
				)
			)
		);
	}
});


// AGT_CNT:61
// ANS_CNT:1594
// ANS_DUR_CNT:168330		通话时长
// COMMON:0
// DIS_SATISFY_CNT:4
// EXTP_CNT:1508
// EXTP_SUC_CNT:624
// NOBODY_ANS_CNT:5
// NO_ANS_CNT:12
// ONLINE_DUR:532633		在线时长
// ORGANIZER_ID:3110
// RING_DUR_SUM:4774		摘机时长
// RING_USEROFF_CNT:7
// SATISFY_CNT:274
// SHD_ANS_CNT:1606
// STOP_DUR:845837
// SURVEY_CNT:278
// TENANTS_ID:2
// WORK_DUR_SUM:51256		后处理时长



// AGT_CNT:1				座席数
// CHAT_DUR:114				沟通时长
// COMMON:1					一般
// DIS_SATISFY_CNT:0		不满意
// ORGANIZER_ID:3110
// RESPONE_CNT:2			响应数
// SATISFY_CNT:0			满意
// SURVEY_CNT:1				调查数
// TENANTS_ID:2