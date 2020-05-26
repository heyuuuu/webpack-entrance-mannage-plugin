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
		const $optionIgnoreClass = new optionIgnoreClass;
		const entryState = {};
		const webpackEntryState = {};
		const recordFileList = {};
		const record = (f,state) => {
			if(this.typeof(state) === "boolean"){
				recordFileList[f] = {state};
			}else{
				return recordFileList[f]
			}
		};
		transfromEntryArr.map(point => {
			const entryList = this.$fileDependencies[point];
			if(entryList){
				if(this.contrast(entryList)){
					entryState[point] = true;
				}else{
					let state = false;
					entryList.map( f => {
						if(state) return ;
						if(record(f)){
							state = record(f).state;
						}else if($optionIgnoreClass.contrast(f)){
							record(f,false);
						}else{
							const stat = fileTools.statSync(f);
							if(stat){
								state = this.isChange(stat);
								record(f,state);
								state && this.$changeList.push(f);
							}else{
								record(f,false);
							}
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