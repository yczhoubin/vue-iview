export default function MP(ak) {
  return new Promise(function(resolve, reject){
    if(window.baidumap_isLoaded){
      resolve(window.BMap);
    }else{  //百度地图脚本未加载则增加script标签，并使用init进行回调
      if(window.baidumap_MPResolves == null){  //如果百度地图js还在加载，将所有实例的resolve都先暂存
        window.baidumap_MPResolves = [];
      }

      if(window.baidumap_init_callback == null){
        window.baidumap_init_callback = function(){
          window.baidumap_isLoaded = true;
          window.baidumap_MPResolves.forEach((_resolve, index, array)=>{
            _resolve(window.BMap);
          });
        };
      }

      window.baidumap_MPResolves.push(resolve);
      if(!window.baidumap_isLoading){  //如果百度地图js未加载过则加载，并且将isLoading状态设为true
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://api.map.baidu.com/api?v=2.0&ak=77xeptldiwAE9Hg82HUcAeCFmZGuNc7D&callback=baidumap_init_callback";
        script.onerror = reject;
        document.head.appendChild(script);
  
        window.baidumap_isLoading = true;
      }
    }
  });
}