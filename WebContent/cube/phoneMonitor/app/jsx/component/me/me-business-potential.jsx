var MeBusinessPot = React.createClass({
    group_option:{
        columns : [
            { field: 'GROUPNAME',title:'座席组',sortable:true},
            { field: 'NOEXE_CNT',align:'center',title:'未执行',sortable:true},
            { field: 'GOING_CNT',align:'center',title:'跟进中',sortable:true},
            { field: 'CURVE_FINISH_CNT',align:'center',title:'今天跟进成功',sortable:true},
            { field: 'CURVE_GIVEUP_CNT',align:'center',title:'今天跟进失败',sortable:true}
        ]
    },
    user_option:{
        columns : [
            { field: 'USER_NAME',title:'座席名称',sortable:true},
            { field: 'GROUPS',title:'座席组',sortable:true},
            { field: 'NOEXE_CNT',align:'center',title:'未执行',sortable:true},
            { field: 'GOING_CNT',align:'center',title:'跟进中',sortable:true},
            { field: 'CURVE_FINISH_CNT',align:'center',title:'今天跟进成功',sortable:true},
            { field: 'CURVE_GIVEUP_CNT',align:'center',title:'今天跟进失败',sortable:true}
        ]
    },
	getInitialState : function(){
		return {
			data:{
                table_str:top.index.rights.agb_checkall?"group":"user",
                infoList:[],
                byAgentList:[],
                byGroupList:[],
                byWechatList:[]
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
		DataEvent.addEvent("cube_potential", this.refresh);
	},
	render: function() {
        var data = this.state.data;
        if(!!this.state.data.infoList.length){
            var info = this.state.data.infoList[0];
            var bar_obj = {
                data:[
                    {name:"今天跟进成功",num:info.CURVE_FINISH_CNT,color:"rgb(145, 193, 65)"},
                    {name:"今天跟进失败",num:info.CURVE_GIVEUP_CNT,color:"#ed5565"},
                    {name:"未执行",num:info.NOEXE_CNT,color:"#1C84C6"},
                    {name:"跟进中",num:info.GOING_CNT,color:"#F9BE59"},
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
                    }
                ]
            } 
        }else{
            var bar_obj = {
                data:[
                    {name:"今天跟进成功",num:0,color:"rgb(145, 193, 65)"},
                    {name:"今天跟进失败",num:0,color:"#ed5565"},
                    {name:"未执行",num:0,color:"#1C84C6"},
                    {name:"跟进中",num:0,color:"#F9BE59"},
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


/*potential*/
// CURVE_NO_FINISH_CNT:0    当天未完成
// FINISH_CNT:0             完成
// NAME:"孙芳"
// NO_FINISH_CNT:0          未完成
// ORGANIZER_ID:3110
// PRE_NO_FINISH_CNT:0      之前未完成
// TENANTS_ID:2
// USERID:4675


// CURVE_FINISH_CNT:0
// CURVE_GIVEUP_CNT:0
// GOING_CNT:0
// GROUPS:"--"
// NOEXE_CNT:0
// ORGANIZER_ID:3110
// TENANTS_ID:2
// USER_ID:5555
// USER_NAME:"天津申通81687"
// cnt:NaN


// CONTACT_CNT:0
// CURVE_FINISH_CNT:0
// CURVE_GIVEUP_CNT:0
// GOING_CNT:0
// NOEXE_CNT:6
// NO_CONTACT_CNT:6
// ORGANIZER_ID:3110
// TENANTS_ID:2