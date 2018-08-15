module.exports = function(){
	return{
		setRouting: function(router){
			router.get('/group/:name', this.groupPage);
		},

		groupPage: function(req, res){
			const name = req.params.name;
			res.render('groupChat/group', {title: 'C.CHAT - Grupo ', user:req.user, groupName: name});
		}
	}
}