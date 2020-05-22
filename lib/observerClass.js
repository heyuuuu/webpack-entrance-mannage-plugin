const toolboxClass = require("./toolboxClass");
const optionIgnoreClass = require("./optionIgnoreClass");
const fileTools = require("./fileTools");

class observerClass extends toolboxClass{
	constructor(recordFileData){
		super();
		this.$lastBuildTime = this.getData("lastBuildTime");
		this.$fileDependencies = this.getData("fileDependencies");
		this.$webpackEntry = this.getData("webpackEntry");
		this.$changeList = [];
		this.transfromEntry();
	}
	transfromEntry(){
		const transfromEntryArr = [];
		const correspondEntry = {};
		Object.keys(this.$webpackEntry).map(point => {
			const transfromPoint = this.transfromPath(point);
			correspondEntry[transfromPoint] = point;
			transfromEntryArr.push(transfromPoint);
		});
		this.core(transfromEntryArr,correspondEntry);
	}
	contrast(list){
		return list.filter(f => this.$changeList.indexOf(f) !== -1).length ? true : false;
	}
	isChange(stat){
		const ft = Timestamp => new Date(Timestamp).valueOf();
		return ft(stat.mtime) > this.$lastBuildTime || ft(stat.birthtime) > this.$lastBuildTime;
	}
	core(transfromEntryArr,correspondEntry){
		const entryState = {};
		const webpackEntryState = {};
		const recordFileList = {};
		const $optionIgnoreClass = new optionIgnoreClass;
		transfromEntryArr.map(point => {
			const entryList = this.$fileDependencies[point];
			if(entryList){
				if(this.contrast(entryList)){
					entryState[point] = true;
				}else{
					let state = false;
					entryList.map( f => {
						if(state) return ;
						if(recordFileList[f]){
							state = recordFileList[f].state;
						}else if($optionIgnoreClass.contrast(f)){
							recordFileList[f] = {state: false};
						}else{
							const stat = fileTools.statSync(f);
							state = this.isChange(stat);
							recordFileList[f] = {state};
							state && this.$changeList.push(f);
						}
					});
					entryState[point] = state;
				};
			}else{
				entryState[point] = true;
			};
			webpackEntryState[correspondEntry[point]] = entryState[point];
		});
		this.setData("webpackEntryState",webpackEntryState);
	}
}

module.exports = observerClass;