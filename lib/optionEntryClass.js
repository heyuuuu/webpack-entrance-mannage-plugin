const toolboxClass = require("./toolboxClass");

// plugins.option.enrty
// 处理开发入口
class optionEntryClass extends toolboxClass{
	constructor(){
		super();
		this.$lockEntry = false;
		this.$entry = this.getData('pluginOptions').entry;
		this.$webpackEntry = this.getData("webpackEntry");
		this.init();
	}
	init(){
		if(this.$entry){
			this.$lockEntry = true;
			this.handle();
		};
		this.setData("lockEntry",this.$lockEntry);
		return this;
	}
	handle(){
		const listArrTransfrom = this.transfromArray(this.$entry).map(this.transfromPath);
		const rule = new RegExp('('+ listArrTransfrom.join('|') +')');
		const webpackEntryState = {};
		Object.keys(this.$webpackEntry).map(point => {
			const transfromPoint = this.transfromPath(point);
			webpackEntryState[point] = rule.test(transfromPoint);
		});
		this.setData("webpackEntryState",webpackEntryState);
		return this;
	}
	callback(cb){
		const resultCallback = cb(this.$lockEntry,this.getData('webpackEntryState'));
		return this.typeof(resultCallback) == "object" && resultCallback.hasOwnProperty('callback') ? resultCallback : this;
	}
}

module.exports = optionEntryClass;