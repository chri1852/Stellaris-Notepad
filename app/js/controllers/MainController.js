StellarisNotepadApp.controller('MainController', ['$scope', '$cookies', '$window', 'SaveDataPipeSvc', 'AutoSaveSvc',
	function MainController($scope, $cookies, $window, SaveDataPipeSvc, AutoSaveSvc) {
		
		$scope.userData = {
			loadedSave: null
		}
		
		$scope.saveList = [];
		$scope.selectedSave = {};
		
		//the function called when a save is saved
		$scope.SaveToCookie = function() {
			
			// set a 24 month expiration date
			var now = new $window.Date();
			var exp = new $window.Date(now.getFullYear()+2, now.getMonth(), now.getDate());
			
			// if there is a matching cookie, remove it
			if(MatchingCookie($scope.userData.loadedSave)) {
				$cookies.remove($scope.userData.loadedSave);
			}
			
			$cookies.put($scope.userData.loadedSave, SerializeAllDataForSave(), {
				expires:  exp
			});
		}
		
		//Deletes the selected system name if it exists
		$scope.DeleteCookie = function() {
			if(MatchingCookie($scope.userData.loadedSave)) {
				$cookies.remove($scope.userData.loadedSave);
			}
		}
		
		//Loads the selected Save
		$scope.LoadSave = function() {
			var parsedData = JSON.parse($scope.selectedSave);
			$scope.userData.loadedSave = parsedData.mainData;
			$scope.TestShow = parsedData;
			SaveDataPipeSvc.SetTerraformingNotepadSaveData(parsedData.terraformingNotePadData);
		}
		
		
		/*
		 *
		 *		 Non-scope helper functions below
		 *
		 */
		 
		 var MatchingCookie = function(saveName) {
			 if($scope.saveList != null) {
				for(var i=0; i<$scope.saveList.length; i++) {
					if($scope.saveList[i].Key == saveName) {
						return true;
					}
				}
			 }
			 return false;
		 }
		 
		 var SerializeAllDataForSave = function() { 
			var SaveObject = {
				terraformingNotePadData: SaveDataPipeSvc.GetTerraformingNotepadSaveData(),
				mainData: $scope.userData.loadedSave
			}
			
			return JSON.stringify(SaveObject,null,"");
		 }
		
		
		// performs some loads on initialization
		var onInit = function() {
			var testLoadedSave = SaveDataPipeSvc.GetMainSaveDataList();
			if(testLoadedSave != null) {
				$scope.userData.loadedSave = testLoadedSave;
			}
			
			var cookieList = $cookies.getAll();
			var cookieKeyList = Object.keys(cookieList);
			
			for(var i=0; i<cookieKeyList.length; i++) {
				$scope.saveList.push({
					Key: cookieKeyList[i],
					Value: cookieList[cookieKeyList[i]]
				});
			}
			
			AutoSaveSvc.ActivateMainAutoSave();
		}
		
		onInit();

	}
]);