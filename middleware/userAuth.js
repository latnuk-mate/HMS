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
}
}