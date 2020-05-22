const dataStore = {
	// 插件名称
	pluginsHooksName: "MultipleMouthsManage",
	// 最后一次更新时间
	lastBuildTime: 0,
	// 记录项目文件结构
	fileDependencies: {},
	// 锁定入口
	lockEntry: false,
	// webpack.entry
	webpackEntry: null,
	// 记录入口状态
	webpackEntryState: {},
	// webpack.context
	webpackContext: null,
	// webpack.plugin.options
	pluginOptions: {}
}

module.exports = dataStore;