var MyNavItem = React.createClass({displayName: "MyNavItem",
	render:function() {  
		return (
			React.createElement("span", null)
		)
	}
});
var MyNav = React.createClass({displayName: "MyNav",
	title_htmls:[],
	content_htmls:[],
	select_function:function(index){
		this.state.data.active_index = index;
		if(!!this.props.selectAction) this.props.selectAction(index);
		this.setState({
			data:this.state.data
		})
	},
	getInitialState : function(){
		return {
			data:{
				active_index:0
			}
		};
	},
	componentDidMount : function(){
	},
	render:function() {  
		var children = _.filter(this.props.children,function(item){
			return item.type.displayName=='MyNavItem';
		})
		
		if(this.state.data.active_index>=children.length){
			this.state.data.active_index=0;
		}
		var titles = [];
		var contents = [];
		children.map(function(item,index){
			titles.push(item.props.title);
			contents.push(item.props.children);
		}.bind(this));

		return (
			React.createElement("div", {id: this.props.key_name, className: "height-100"}, 
				React.createElement("div", {className: "module"}, 
					React.createElement("div", {className: "mynav"}, 
						React.createElement("div", {className: "mynav-heading"}, 
							React.createElement(MyNav_Head, {
								data: titles, 
								addition: this.props.addition, 
								select_function: this.select_function, 
								active_index: this.state.data.active_index, 
								title_class: this.props.title_class})
						), 
						React.createElement("div", {className: "mynav-body"}, 
							React.createElement("div", {className: this.props.body_class + " mynav-body-content radius-bottom"}, 
								React.createElement(MyNav_Body, {
									data: contents, 
									active_index: this.state.data.active_index})
							)
						)
					)
				)
			)
		)
	}
});

var MyNav_Head = React.createClass({displayName: "MyNav_Head",
	select_function:function(index){
		this.props.select_function(index);
	},
	render:function() {  
		var addition = this.props.addition;
		var titles = this.props.data;
		var titles_html = [];
		titles.map(function(item,index){
			var item_class = (index==this.props.active_index?"mynav-title-item active " + this.props.title_class:"mynav-title-item " + this.props.title_class);
			var title_html = (
				React.createElement("div", {className: item_class, onClick: function(){
					this.select_function(index);
				}.bind(this)}, 
					React.createElement("div", {className: "mynav-title-content height-100"}, 
						React.createElement(BoardPanel, null, 
							React.createElement("center", null, 
								item
							)
						)
					)
				)
			);
			titles_html.push(title_html);
		}.bind(this))
		return (
			React.createElement("div", {className: "height-100"}, 
				React.createElement("div", {className: "mynav-title"}, 
					titles_html
				), 
				React.createElement("div", {className: "height-100", style: {width:"100%",borderBottom:"3px solid #444444"}}
				), 
				React.createElement("div", {className: "height-100 p-a", style: {right:0,top:0}}, 
					addition
				)
			)
		)
	}
});

var MyNav_Body = React.createClass({displayName: "MyNav_Body",
	render:function() {  
		var contents = this.props.data;
		var contents_html = [];
		contents.map(function(item,index){
			var item_class = (index==this.props.active_index?"outside":"inside");
			var title_html = (
				React.createElement("div", {className: item_class}, 
					item
				)
			);
			contents_html.push(title_html);
		}.bind(this))
		return (
			React.createElement("div", {className: "height-100"}, 
				contents_html
			)
		)
	}
});