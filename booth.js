var booth=(function(window,document,undefined){

	var module={};


	var dep_hash={};
	var dep_loaded={};
	var dep_resolved={};
	
	var __isMet=function(obj){
		var eval_obj=null;
		var erred=null;
		try{
			
			eval_obj=eval(obj);
			
		}
		catch(err){
			erred=err;
			
		}
		if(!erred){

			if(typeof eval_obj=='function' || typeof eval_obj =='object'){
				return 1;
			}
			else{
				return 0;
			}

		}
		else{
			
			return 0;
		}
	}

	var __resolveDep=function(dep_hash){
		for(dep_type in dep_hash){
			
			if(__isMet(dep_type)){
				console.log('resolved '+dep_type);
				//no need to insert script
			}
			else{
				console.log('resolving '+dep_type);
				var src_url=window.boothconfig.ip[window.boothconfig.mode].stat;
    			for(var i=0;i<dep_hash[dep_type].length;i++){

					var script=document.createElement('script');
					script.setAttribute('type', 'text/javascript');
					script.async=false;
    				script.setAttribute('src', src_url+window.boothconfig.dep_hash[dep_type].src);
   					dep_hash[dep_type][i].insertBefore(script,dep_hash[dep_type][i].firstChild);
   				
    			}

    			
    			
    			
			}
		}
			
	}

	var __searchDepNodes=function(callback){
		window.onload=function(){	
			var objs=document.querySelectorAll("[class*='_dep']");
			
			for(var i=0;i<objs.length;i++){
				//console.log(objs[i].className);
				var objclassNames=objs[i].className.split(" ");
				for(key in objclassNames){
					
					if(objclassNames[key].trim().match(/.*_dep/)){
						var dep_type=objclassNames[key].trim().replace('_dep','');
						dep_hash[dep_type]=dep_hash[dep_type] || [];
						dep_hash[dep_type].push(objs[i]);
						
					}
				}
			}
			callback(dep_hash);
		}
	}

	module.requireConfig=function(){
		var config={};
		config.mode=window.boothconfig.mode;
		config.ip=window.boothconfig.ip;
		config.user_data=window.boothconfig.user_data;

		return config;
	}

	module.requireNodesArray=function(){
			var nodes=[];
		
			var objs=document.querySelectorAll("[class*='_node']");
			for(var i=0;i<objs.length;i++){
				var nodeClassNames=objs[i].className.split(" ");
				for(j in nodeClassNames){
					if(nodeClassNames[j].trim().match(/.*_node/)){

						var nodeName=nodeClassNames[j].trim().replace(/_node/g,'');

						if(nodes[nodeName]){
							console.log(nodeName+' already exists'+nodes[nodeName].length);

							if(!nodes[nodeName].hasOwnProperty(length)){
								console.log(nodeName+' is not array');
								var single_node=nodes[nodeName];

								nodes[nodeName]=null;
								nodes[nodeName]=new Array();
								nodes[nodeName].push(single_node);
								nodes[nodeName].push(objs[i]);
								
							}
							else{
								console.log(nodeName+' is an array');
								nodes[nodeName].push(objs[i]);

							}
						}
						else{
							console.log(nodeName+' does not exists');
						nodes[nodeName]=objs[i];
					}



					}
				}
			}
		
			return nodes;

	}

	module.requireNodes=function(){
		var nodes=[];

		for(dep_type in dep_hash){
			for(var i=0;i<dep_hash[dep_type].length;i++){
				//console.log(dep_hash[dep_type][i].className);
				var dep_nodeclassNames=dep_hash[dep_type][i].className.split(" ");

				for(key in dep_nodeclassNames){
					if(dep_nodeclassNames[key].trim().match(/.*_node/)){
						//console.log(dep_nodeclassNames[key]);
						var dep_node=dep_nodeclassNames[key].trim().replace('_node','');
						nodes[dep_node]=dep_hash[dep_type][i];
					}

					/*if(dep_nodeclassNames[key].trim().match(/.*_node/)){
						var dep_node=dep_nodeclassNames[key].trim().replace('_node','');
						

					
					}*/




				}
			}
		}
		
		return nodes;

	}		

	module.requireDeps=function(){
		var deps={}; 
		for(dep_type in dep_hash){
			for(var i=0;i<dep_hash[dep_type].length;i++){

				var dep_nodeclassNames=dep_hash[dep_type][i].className.split(" ");
				for(key in dep_nodeclassNames){
					if(dep_nodeclassNames[key].trim().match(/.*_node/)){
						var dep_node=dep_nodeclassNames[key].trim().replace('_node','');
						deps[dep_node]=deps[dep_node] || [];
						deps[dep_node][dep_type]=eval(dep_type);
					}
				}
			}
		}
		return deps;
	}



	module.init=function(){
		__searchDepNodes(__resolveDep);
	}



	return module;

})(window,document);