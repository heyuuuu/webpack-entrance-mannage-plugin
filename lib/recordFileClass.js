const toolboxClass = require("./toolboxClass");

class recordFileClass extends toolboxClass{
	constructor(compilation){
		super();
		this.init(compilation);
	}
	init(compilation){
		const lockEntry = this.getData("lockEntry");
		const outputFilePath = this.getData("pluginOptions").filePath;
		if(lockEntry === false){
			this.writeFile(compilation,outputFilePath);
		};
	}
	writeFile(compilation,outputFilePath){
		const lastBuildTime = new Date().valueOf();
		const fileDependencies = this.getData("fileDependencies");
		compilation.chunks.forEach(chunk => {
			const files = new Set();
			chunk.modulesIterable.forEach(function(module) {
				const { userRequest , rawRequest , buildInfo} = module;
				if(buildInfo.fileDependencies){
					buildInfo.fileDependencies.forEach(filepath => {
						if(/(node_modules|\?)/.test(filepath) === false){
							files.add(filepath);
						};
					});
				};
			});
			fileDependencies[this.transfromPath(chunk.name)] = Array.from(files);
		});
		const recordData = JSON.stringify({
			lastBuildTime,
			fileDependencies
		});
		compilation.assets[outputFilePath] = {
			source(){
				return recordData;
			},
			size(){
				return recordData.length;
			}
		};
	}
}

module.exports = recordFileClass;