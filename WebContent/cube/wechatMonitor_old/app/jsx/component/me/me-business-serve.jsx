var MeBusinessServe = React.createClass({
	group_option:{
        columns : [
            { field: 'GROUPNAME',title:'座席组',sortable:true},
            { field: 'ACCEPT_CNT',align:'center',title:'已受理',sortable:true},
            { field: 'GOING_CNT',align:'center',title:'处理中',sortable:true},
            { field: 'CURVE_FINISH_CNT',align:'center',title:'今天已完成',sortable:true},
            { field: 'CURVE_VISIT_CNT',align:'center',title:'今天已回访',sortable:true},
            { field: 'NO_VISIT_CNT',align:'center',title:'不需要回访',sortable:true}
        ]
    },
    user_option:{
        columns : [
            { field: 'USER_NAME',title:'座席名称',sortable:true},
            { field: 'GROUPS',title:'座席组',sortable:true},
            { field: 'ACCEPT_CNT',align:'center',title:'已受理',sortable:true},
            { field: 'GOING_CNT',align:'center',title:'处理中',sortable:true},
            { field: 'CURVE_FINISH_CNT',align:'center',title:'今天已完成',sortable:true},
            { field: 'CURVE_VISIT_CNT',align:'center',title:'今天已回访',sortable:true},
            { field: 'NO_VISIT_CNT',align:'center',title:'不需要回访',sortable:true}
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
		DataEvent.addEvent("cube_serve", this.refresh);
	},
	render: function() {
        var data = this.state.data;

        if(!!this.state.data.infoList.length){
            var info = this.state.data.infoList[0];
            var bar_obj = {
                data:[
                    {name:"今天已完成",num:info.CURVE_FINISH_CNT,color:"rgb(145, 193, 65)",hidden:false},
                    {name:"今天已回访",num:info.CURVE_VISIT_CNT,color:"#1AB394"},
                    {name:"不需要回访",num:info.NO_VISIT_CNT,color:"#FFF1C7"},
                    {name:"处理中",num:info.GOING_CNT,color:"#F9BE59"},
                    {name:"已受理",num:info.ACCEPT_CNT,color:"#1C84C6"}
                ],
                message:[{num:1,message:"完成率：xx"}]
            }
            var car_obj = {
                title:"今天已完成的投诉回访",
                top_num:info.CURVE_FINISH_CNT,
                message:[
                    {
                        name:"未完成",
                        color:"#ed5565",
                        num:info.GOING_CNT+info.ACCEPT_CNT
                    },
                    {
                        name:"今天已回访",
                        color:"#1AB394",
                        num:info.CURVE_VISIT_CNT
                    }
                ]
            } 
        }else{
            var bar_obj = {
                data:[
                    {name:"今天已完成",num:0,color:"rgb(145, 193, 65)",hidden:false},
                    {name:"今天已回访",num:0,color:"#1AB394"},
                    {name:"不需要回访",num:0,color:"#FFF1C7"},
                    {name:"处理中",num:0,color:"#F9BE59"},
                    {name:"已受理",num:0,color:"#1C84C6"}
                ],
            }
            var car_obj = {
                title:"今天已完成的服务工单",
                top_num:0,
                message:[
                    {
                        name:"未完成",
                        color:"#ed5565",
                        num:0
                    },
                    {
                        name:"今天已回访",
                        color:"#1AB394",
                        num:0
                    }
                ]
            } 
        }

        return (
            <div className="height-100">
                <div className="p-a" style={{width:200}}>
                    <MeToolCard data={car_obj} />
                </div>
                <div style={{paddingLeft:200}}>
                    <div style={{height:"6vh"}}>
                        <BoardPanel>
                            <span className="font-middle font-bold">完成情况</span>
                            <select className="form-control pull-right" ref="table_str" value={this.state.data.table_str} onChange={this.change_table} style={{width:150}}>
                                <option value='group'>按座席组统计</option>
                                <option value='user'>按座席统计</option>
                            </select>
                        </BoardPanel>
                    </div>
                    <div style={{height:"10vh"}}>
                        <ProgressBar data={bar_obj} />
                    </div>
                    <div className={!!me.isAdmin?"padding-md p-r":"tohide"} style={{height:"29vh"}}>
                        <div className="p-a height-100" style={{left:15,right:0}}>
                            <MyTab value={data.table_str}>
                                <MyTabItem value="group">
                                    <CubeTable option={this.group_option} />
                                </MyTabItem>
                                <MyTabItem value="user">
                                    <CubeTable option={this.user_option} />
                                </MyTabItem>
                            </MyTab>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

/*serve*/
// CURVE_NO_FINISH_CNT:0    当天未完成
// FINISH_CNT:0             完成
// NAME:"孙芳"
// NO_FINISH_CNT:0          未完成
// ORGANIZER_ID:3110
// PRE_NO_FINISH_CNT:0      之前未完成
// TENANTS_ID:2
// USERID:4675


// ACCEPT_CNT:0
// CURVE_FINISH_CNT:0
// CURVE_VISIT_CNT:0
// GOING_CNT:0
// GROUPS:"--"
// NO_VISIT_CNT:0
// ORGANIZER_ID:3110
// TENANTS_ID:2
// USER_ID:5555
// USER_NAME:"天津申通81687"
// cnt:NaN