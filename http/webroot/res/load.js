

var kc = kc || {};

kc.strRes = "";
kc.arrRes = [];
kc.load = function() {

	 kc.Project.prepare(function () {
	 	var projectData = kc.Project.getProjectData();
		var sceneId = projectData.ResourceText.projectSetting.defaultSceneID;
		var aRes = kc.Project.getResBySceneId(sceneId);
		kc.Loader.load(aRes, function() {
			var func = function(){
				alert("Finished!!!");
		  	};
    	    setTimeout(func, 800);
		}, function(index) {
			var dLoadCout = document.getElementById("loadedCount");
			dLoadCout.textContent = index;
		}, function(err) {
			console.log(err);
		});
	 });
	 
}