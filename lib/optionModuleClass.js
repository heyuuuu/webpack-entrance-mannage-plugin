const toolboxClass = require("./toolboxClass");

// plugins.option.module
// 新增模块
class optionModuleClass extends toolboxClass{
	constructor(){
		super();
		this.$module = this.getData('pluginOptions').module;
	}
}

module.exports = optionModuleClass;