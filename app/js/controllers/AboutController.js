StellarisNotepadApp.controller('AboutController', ['$scope', 'SaveDataPipeSvc', 'AutoSaveSvc',
	function AboutController($scope, SaveDataPipeSvc, AutoSaveSvc) {
		
		var OnInit = function() {
			AutoSaveSvc.ActivateAboutAutoSaveOn();
		}
		
		OnInit();
	}
]);