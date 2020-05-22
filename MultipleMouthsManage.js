const path = require("path");
const toolboxClass = require("./lib/toolboxClass");
const fileTools = require("./lib/fileTools");
const entryPipe = require("./lib/optionEntryClass");
const { logPipe , logWrite} = require("./lib/optionsLogClass");
const observerClass = require("./lib/observerClass");
const recordFileClass = require("./lib/recordFileClass");
const message = require("./lib/mssageClass");

class MultipleMouthsManage extends toolboxClass{
	constructor(options){
		super();
		this.setData('pluginOptions',options);
		this.$pluginsHooksName = this.getData("pluginsHooksName");
	}
	// 读取结构记录内容
	readRecordFile(compiler,filePath){
		const recordFilePath = path.join(compiler.options.output.path,filePath);
		const recordFileData = fileTools.readJsonfileSync(recordFilePath) || {};
		this.setData(recordFileData);
	}
	// 注入事件
	hooks(compiler,tapName){
		return (name,callback) => {
			compiler.hooks[name][tapName](this.$pluginsHooksName,function(){
				// console.log(`===${name}===start========${pluginsHooksName}`);
				callback.apply(compiler,[...arguments]);
				// console.log(`===${name}===end`);
			});
		}
	}
	apply(compiler){
		this.setData("webpackEntry",compiler.options.entry);
		this.setData("webpackContext",compiler.context);
		const { filePath } = this.getData('pluginOptions');
		new entryPipe()
		.callback( (lockEntry,webpackEntryState) => {
			if(lockEntry == false){
				this.readRecordFile(compiler,filePath);
				return new observerClass();
			};
		})
		.callback( (lockEntry,webpackEntryState) => {
			for(let point in webpackEntryState){
				if(webpackEntryState[point] === false){
					delete compiler.options.entry[point];
				}
			}
		});
		const hooksTap = this.hooks(compiler,"tap");
		hooksTap("compilation",compilation => {
			const compilationTap = this.hooks(compilation,"tap");
			new logPipe(compilationTap);
		});
		hooksTap("emit",compilation => {
			new message("logData").accept( data => {
				logWrite(compilation,data);
			});
			new recordFileClass(compilation);
		});
	}
}

module.exports = MultipleMouthsManage;