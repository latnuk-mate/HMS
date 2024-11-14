const multer = require('multer');
const Path = require('path');

function checkMimeTypes(file, cb){
	// find the match
		const fileTypes = /jpeg|jpg|png/;
		const mimes = fileTypes.test(file.mimetype) // check the mimes

		const extFile = fileTypes.test(Path.extname(file.originalname).toLowerCase());

	if(extFile && mimes){
		return cb(null, file)
	}else{
	 cb("Error: Upload only images");
	}
}

// we are configuring the memory storage..
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {fileSize : 3145728}, // 3 mb of data...
    fileFilter: (req, file, cb)=>{
        checkMimeTypes(file, cb);
    }
}).single('doctorImage');


module.exports = upload;