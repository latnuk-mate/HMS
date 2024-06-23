

module.exports = {
	AuthUser:function(req,res,next){
        	if(req.isAuthenticated()){
        return res.redirect('/dashboard');
	}
	 next();
},
	NotAuthUser:function(req,res,next){
        	if(req.isAuthenticated()){
                return next();
	}
        res.redirect('/user/login');
},
AuthAdmin : function(req,res,next){
	if(req.cookies.admin){
		return res.redirect('/admin/dashboard');
	}
	next();
},
NotAuthAdmin: function(req,res,next){
	if(req.cookies.admin){
		return next();
}
	res.redirect('/admin/signIn');
}
}