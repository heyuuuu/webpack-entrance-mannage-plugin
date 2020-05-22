const toolboxClass = require("./toolboxClass");
const message = require("./mssageClass");

// plugins.option.log
// 记录参与构建文件
class optionsLogClass extends toolboxClass{
	constructor(compilationTap){
		super();
		const logFile = this.getData("pluginOptions").log;
		this.init(compilationTap,logFile);
	}
	init(compilationTap,logFile){
		if(logFile){
			this.event(compilationTap,logFile);
		};
		return this;
	}
	event(compilationTap,logFile){
		const fileData = new Set;
		compilationTap("buildModule", module => {
			this.checkAssets(module.userRequest , File => {
				const filePath = module.issuer ? File : `[ ${File} ]`;
				console.log(filePath);
				fileData.add(filePath);
				new message("logData").emit({fileData,logFile});
			});
		});
	}
}

function logWrite(compilation,data){
	let fileData = new Date().toLocaleString('chinese', { hour12: false }) + " \n ";
	data.fileData.forEach(file => {
		fileData += file + " \n ";
	});
	compilation.assets[data.logFile] = {
		source(){
			return fileData
		},
		size(){
			return fileData.length;
		}
	}
}

module.exports = { logPipe: optionsLogClass , logWrite};