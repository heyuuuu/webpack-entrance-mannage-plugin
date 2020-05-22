const toolboxClass = require("./toolboxClass");

class optionIgnoreClass extends toolboxClass { 
	constructor(){
		super();
		this.$ignore = this.transfromArray(this.getData('pluginOptions').ignore);
		const transfromIgnore = this.transfromPath(this.$ignore.join('|'));
		this.$contrast = new RegExp(`(${transfromIgnore})`);
	}
	contrast(f){
		if(this.$ignore.length){
			return this.$contrast.test(this.transfromPath(f));
		}else{
			return false;
		}
	}
}

module.exports = optionIgnoreClass;