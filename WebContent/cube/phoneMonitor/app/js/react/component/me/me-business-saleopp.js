var MeBusinessSale = React.createClass({displayName: "MeBusinessSale",
    group_option:{
        columns : [
            { field: 'GROUPNAME',title:'座席组',sortable:true},
            { field: 'LINKUP_CNT',align:'center',title:'初期沟通',sortable:true},
            { field: 'VERIFY_CNT',align:'center',title:'确认需求',sortable:true},
            { field: 'CURVE_FINISH_CNT',align:'center',title:'今天销售成功',sortable:true},
            { field: 'CURVE_GIVEUP_CNT',align:'center',title:'今天销售失败',sortable:true}
        ]
    },
    user_option:{
        columns : [
            { field: 'USER_NAME',title:'座席名称',sortable:true},
            { field: 'GROUPS',title:'座席组',sortable:true},
            { field: 'LINKUP_CNT',align:'center',title:'初期沟通',sortable:true},
            { field: 'VERIFY_CNT',align:'center',title:'确认需求',sortable:true},
            { field: 'CURVE_FINISH_CNT',align:'center',title:'今天销售成功',sortable:true},
            { field: 'CURVE_GIVEUP_CNT',align:'center',title:'今天销售失败',sortable:true}
        ]
    },
	getInitialState : function(){
		return {
			data:{
                table_str:top.index.rights.agb_checkall?"group":"user",
                infoList:[],
                byAgentList:[],
                byGroupList:[]
			}
		}
	},
	refresh:function(data){

        this.state.data.infoList = data.infoList;
        this.state.data.byAgentList = data.byAgentList;
        this.state.data.byGroupList = data.byGroupList;

        this.group_option.data = data.byGroupList;
        this.user_option.data = data.byAgentList;

		this.setState({
			data:this.state.data
		})
	},
    change_table:function(r){
        this.state.data.table_str = r.target.value;
        this.setState({
            data:this.state.data
        })
    },
	componentDidMount : function(){
		DataEvent.addEvent("cube_sale_opportunity", this.refresh);
	},
	render: function() {
        var data = this.state.data;

        if(!!this.state.data.infoList.length){
            var info = this.state.data.infoList[0];
            var bar_obj = {
                data:[
                    {name:"今天销售成功",num:info.CURVE_FINISH_CNT,color:"rgb(145, 193, 65)"},
                    {name:"今天销售失败",num:info.CURVE_GIVEUP_CNT,color:"#ed5565"},
                    {name:"确认需求",num:info.VERIFY_CNT,color:"#F9BE59"},
                    {name:"初期沟通",num:info.LINKUP_CNT,color:"#1C84C6"}
                ],
                message:[{num:1,message:"完成率：xx"}]
            }
            var car_obj = {
                title:"今天已联系的客户",
                top_num:info.CONTACT_CNT,
                message:[
                    {
                        name:"未联系",
                        color:"#ed5565",
                        num:info.NO_CONTACT_CNT
                    },
                    {
                        name:"待执行计划",
                        color:"rgb(145, 193, 65)",
                        num:info.PLAN_CNT
                    }
                ]
            } 
        }else{
            var bar_obj = {
                data:[
                    {name:"今天销售成功",num:0,color:"rgb(145, 193, 65)"},
                    {name:"今天销售失败",num:0,color:"#ed5565"},
                    {name:"确认需求",num:0,color:"#F9BE59"},
                    {name:"初期沟通",num:0,color:"#1C84C6"}
                ]
            }
            var car_obj = {
                title:"今天已联系的客户",
                top_num:0,
                message:[
                    {
                        name:"未联系",
                        color:"#ed5565",
                        num:0
                    },
                    {
                        name:"待执行计划",
                        color:"rgb(145, 193, 65)",
                        num:0
                    }
                ]
            } 
        }
		return (
			React.createElement("div", {className: "height-100"}, 
				React.createElement("div", {className: "p-a", style: {width:200}}, 
                	React.createElement(MeToolCard, {data: car_obj})
                ), 
                React.createElement("div", {style: {paddingLeft:200}}, 
                	React.createElement("div", {style: {height:"6vh"}}, 
                		React.createElement(BoardPanel, null, 
                    		React.createElement("span", {className: "font-middle font-bold"}, "完成情况"), 
                    		React.createElement("select", {className: "form-control pull-right", ref: "table_str", value: this.state.data.table_str, onChange: this.change_table, style: {width:150}}, 
                    			React.createElement("option", {value: "group"}, "按座席组统计"), 
                                React.createElement("option", {value: "user"}, "按座席统计")
                    		)
                		)
                	), 
                	React.createElement("div", {style: {height:"10vh"}}, 
                		React.createElement(ProgressBar, {data: bar_obj})
                	), 
                	React.createElement("div", {className: !!me.isAdmin?"padding-md p-r":"tohide", style: {height:"29vh"}}, 
                    	React.createElement("div", {className: "p-a height-100", style: {left:15,right:0}}, 
                            React.createElement(MyTab, {value: data.table_str}, 
                                React.createElement(MyTabItem, {value: "group"}, 
                                    React.createElement(CubeTable, {option: this.group_option})
                                ), 
                                React.createElement(MyTabItem, {value: "user"}, 
                                    React.createElement(CubeTable, {option: this.user_option})
                                )
                            )
                    	)
                	)
                )
			)
		);
	}
});


/*saleopp*/
// CURVE_NO_FINISH_CNT:0    当天未完成
// FINISH_CNT:0             完成
// NAME:"孙芳"
// NO_FINISH_CNT:2          未完成
// ORGANIZER_ID:3110
// PRE_NO_FINISH_CNT:2      之前未完成
// TENANTS_ID:2
// USERID:4675


// CONTACT_CNT:0            //已联系客户——
// CURVE_FINISH_CNT:0
// CURVE_GIVEUP_CNT:0
// LINKUP_CNT:90            
// NO_CONTACT_CNT:1         //未联系——
// ORGANIZER_ID:3110
// PLAN_CNT:3               //待执行计划——
// TENANTS_ID:2
// VERIFY_CNT:5

// CURVE_FINISH_CNT:0           销售成功
// CURVE_GIVEUP_CNT:0           销售失败
// LINKUP_CNT:1                 初期沟通
// ORGANIZER_ID:3110
// TENANTS_ID:2
// VERIFY_CNT:0                 确认需求