const dataStore = require("./dataStore");

class toolboxClass {
	constructor(){

	}
	// 设置数据
	setData(name,val){
		const setData = (n,v) => {
			if(dataStore.hasOwnProperty(n)){
				dataStore[n] = v
			};
		};
		if(typeof name == "string"){
			setData(name,val);
		}else if(typeof name == "object"){
			for(let k in name){
				setData(k,name[k]);
			};
		}
	}
	// 获取数据
	getData(name){
		if(dataStore.hasOwnProperty(name)){
			return dataStore[name];
		}else{
			return dataStore;
		};
	}
	// 转换路径，用于处理路径
	transfromPath(path = ""){
		return path.replace(/[\/\\]+/g,'_');
	}
	// 转换数组
	transfromArray(data,errResult = []){
		return data ? typeof data == "string" ? [data] : data instanceof Array ? data : errResult : [];
	}
	// 判断类型
	typeof(content){
		const typeResultString = Object.prototype.toString.call(content);
		const typeResult = typeResultString.match(/\[object\s(\w+)\]/)[1];
		return typeResult.toLowerCase();
	}
	// 判断是否是资源
	checkAssets(filePath,callback){
		const isAssets = /(node_modules|\?)/.test(filePath) === false ;
		filePath && isAssets && this.typeof(callback) == "function" && callback(filePath);
		return isAssets;
	}
}

module.exports = toolboxClass;