var Caches = (function(){
	var _config = { // 配置对象
		hours:new Date().getHours(),
		// url:"http://192.168.100.20:80/getSth/#beginTime/#endTime"
		url:"../mock/mapList.json?beginTime=#beginTime&endTime=#endTime"
	}
	var _caches = {
		cache:{ //保存localstorage的缓存数据
			// "1":300,
			// "2":300,
			// ...
			// "23":300,
		},
		init:function(){ // 初始化数据
			this.cache = JSON.parse(localStorage.userCaches||"{}");
			// indexDB
			// 2.尽量避免不必要的http请求
			for(var i=0;i<_config.hours;i++){
				this.get(i);
			}
		},
		clear : function(){// 清空缓存
			this.cache = {};
			localStorage.userCaches = "";
		},
		getUrl : function(hours){// 通过一个时间段拼接出对应的url
			var date = new Date();
			date.setHours(hours);
			date.setMinutes(0);
			var beginTime,endTime;
			beginTime = date.getTime();
			date.setHours(hours+1);
			date.setMinutes(0)
			endTime = date.getTime();
			return _config.url.replace("#beginTime",beginTime).replace("#endTime",endTime)
		},
		update:function(hours,value){// 更新缓存
			this.cache[String(hours)] = value;
			localStorage.userCaches = JSON.stringify(this.cache);
		},
		get : function(hours,callback,load){// 无论如何保证通过传入hours必须能够获得对应的count
			var count = this.cache[String(hours)];
			if(load||count===undefined){
				// alax => load
				this.load(hours,callback)
			}else{
				console.log("缓存加载"+hours+"数据是"+count)
				callback&&callback(count)
			}
		},
		load : function(hours,callback){// 根据时间段去异步ajax通过接口获取数据
			$.getJSON(this.getUrl(hours),function(map){
				console.log(map);
				this.update(hours,map.listMap.length);
				this.cache[String(hours)] = map.listMap.length;
				callback&&callback(this.cache[String(hours)],this.cache);
				console.log("异步加载"+hours+"数据是"+this.cache[String(hours)])
			}.bind(this))
		}
	};
	return _caches;
})()