const globalMessageDataStore = {};

class message{
	constructor(name){
		const createDataStore = () => ({
			laseEmitTime: null,
			emitData: null,
			list: []
		});
		if(name){
			this.$dataStore = globalMessageDataStore[name] || (globalMessageDataStore[name] = createDataStore());
		}else{
			this.$dataStore = createDataStore();
		};
	}
	run(){
		const { laseEmitTime , emitData , list } = this.$dataStore;
		if(laseEmitTime){
			list.map(item => {
				if(item.laseEmitTime !== laseEmitTime){
					item.laseEmitTime = laseEmitTime;
					item.callback(emitData);
				}
			});
		}
	}
	emit(data){
		this.$dataStore.laseEmitTime = new Date().valueOf();
		this.$dataStore.emitData = data;
		this.run();
	}
	accept(callback){
		this.$dataStore.list.push({
			callback,
			laseEmitTime: null
		});
		this.run();
	}
}

module.exports = message;