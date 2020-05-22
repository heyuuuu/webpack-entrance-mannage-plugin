const fs = require("fs");

const fileTools = {
	// 同步读取文件属性
	statSync(filePath){
		try{
			return fs.statSync(filePath);
		}catch(e){
			return null;
		}
	},
	// 同步读取文件信息
	readFileSync(filePath){
		try{
			return fs.readFileSync(filePath);
		}catch(e){
			return null;
		}
	},
	readJsonfileSync(filePath){
		try{
			const fileData = fs.readFileSync(filePath);
			return JSON.parse(fileData.toString());
		}catch(e){
			return null;
		}	
	}
}

module.exports = fileTools;