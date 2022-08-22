var MeToolCard = React.createClass({
	getInitialState : function(){
		return {
			data:{
				data:{}
			}
		}
	},
	componentDidMount : function(){

	},
	componentWillReceiveProps:function(nextprops){
		this.state.data.data = nextprops.data;
		this.setState({
			data:this.state.data
		})
	},
	render: function() {
		var data = this.state.data.data;
		var messages = [];
		if(!isEmptyObject(data)){
			data.message.forEach(function(item){
				var message = (
					<div>
						<center>
							<div className="col-sm-7 text-right p-n">{item.name}：</div>
							<div className="col-sm-5 text-left p-n">
								<span className="font-green-dim padding-lr-xs font-middle" style={{color:item.color}}>{null2zero(item.num)}</span>
							</div>
						</center>
					</div>
				)
				messages.push(message);
			})
		}
		return (
			<div className="border-grey" style={{height:"32vh"}}>
				<BoardPanel>
					<div>
						<div className="font-middle"><center>{data.title}</center></div>
						<div>
							<center>
								<span className="font-showy font-green-dim padding-lr">{null2zero(data.top_num)}</span>
							</center>
						</div>
					</div>
					{messages}
				</BoardPanel>
			</div>
		)
	}
})