StellarisNotepadApp.controller('TerraformingNotepadController', ['$scope', '$interval', 'SaveDataPipeSvc', 'AutoSaveSvc',
	function TerraformingNotepadController($scope, $interval, SaveDataPipeSvc, AutoSaveSvc) {
		
		$scope.userData = {
			settings : {
				filterSettings: {
					IdleFilter: true,
					TerraformingFilter: true,
					DoneFilter: true,
					ColonizedFilter: true,
					planetNameFilter: "",
					systemNameFilter: ""
				}
			},
			
			terraformTableData : [
			/*
				{
					pID: 0,
					planetName: "testActive",
					systemName: "testSystem",
					currentClass: 1,
					nextClass: 5,
					goalClass: 3,
					status: 2,
					isEditting: false
				},
				{
					pID: 1,
					planetName: "testIdle",
					systemName: "testSystem",
					currentClass: 1,
					nextClass: 5,
					goalClass: 3,
					status: 1,
					isEditting: false
				},
				{
					pID: 2,
					planetName: "testDone",
					systemName: "testDoneSystem",
					currentClass: 3,
					nextClass: 3,
					goalClass: 3,
					status: 3,
					isEditting: false
				},
				{
					pID: 3,
					planetName: "testColonized",
					systemName: "testColonizedSystem",
					currentClass: 3,
					nextClass: 3,
					goalClass: 3,
					status: 4,
					isEditting: false
				}, 
				*/
			],
			
		};
		
		$scope.Constants = 
		{	
			planetClassIDs : [
				{
					Class: "Arctic",
					ID: 1
				},
				{
					Class: "Arid",
					ID: 2
				},
				{
					Class: "Continental",
					ID: 3
				},
				{
					Class: "Desert",
					ID: 4
				},
				{
					Class: "Ocean",
					ID: 5
				},
				{
					Class: "Tropical",
					ID: 6
				},
				{
					Class: "Tundra",
					ID: 7
				}
			],
			
			actionClassIDs : [
				{
					Class: "Idle",
					ID: 1
				},
				{
					Class: "Terraforming",
					ID: 2
				},
				{
					Class: "Done",
					ID: 3
				},
				{
					Class: "Colonized",
					ID: 4
				}
			]	
			
		}
		
		
		$scope.GetPlanetClassByID = function(classID) {
			for( var i=0; i< $scope.Constants.planetClassIDs.length; i++) {
				if(classID == $scope.Constants.planetClassIDs[i].ID) {
					return $scope.Constants.planetClassIDs[i].Class;
				}
			}
		}
		
		$scope.GetPlanetIDByClass = function(pClass) {
			for( var i=0; i< $scope.Constants.planetClassIDs.length; i++) {
				if(pClass == $scope.Constants.planetClassIDs[i].Class) {
					return $scope.Constants.planetClassIDs[i].ID;
				}
			}
		}
		
		$scope.GetActionClassByID = function(classID) {
			for( var i=0; i< $scope.Constants.actionClassIDs.length; i++) {
				if(classID == $scope.Constants.actionClassIDs[i].ID) {
					return $scope.Constants.actionClassIDs[i].Class;
				}
			}
		}
		
		$scope.GetActionIDByClass = function(aClass) {
			for( var i=0; i< $scope.Constants.actionClassIDs.length; i++) {
				if(aClass == $scope.Constants.actionClassIDs[i].Class) {
					return $scope.Constants.actionClassIDs[i].ID;
				}
			}
		}
		
		// adds a new planet to the terraformTableData
		$scope.AddPlanet = function(nPlanet) {
			$scope.userData.terraformTableData.push({
					pID: GetNextPlanetID(),
					planetName: nPlanet.planetName,
					systemName: nPlanet.systemName,
					currentClass: parseInt(nPlanet.currentClass),
					nextClass: GetNextPlanetClass(parseInt(nPlanet.currentClass), parseInt(nPlanet.goalClass)),
					goalClass: parseInt(nPlanet.goalClass),
					status: GetNewPlanetStatus(nPlanet),
			});
		}
		
		// runs when the back button is pressed
		$scope.BackButtonAction = function(planetObject) {
			
			switch($scope.GetActionClassByID(planetObject.status)) {
				case "Terraforming":
					planetObject.status = $scope.GetActionIDByClass("Idle");
					break;
				case "Colonized":
					planetObject.status = $scope.GetActionIDByClass("Done");
					break;
			}
	
		}
		
		// runs when the next button is pressed
		$scope.NextButtonAction = function(planetObject) {
			
			switch($scope.GetActionClassByID(planetObject.status)) {
				case "Terraforming":
					OnTerraformingEnd(planetObject);
					break;
				case "Idle":
					planetObject.status = $scope.GetActionIDByClass("Terraforming");
					break;
				case "Done":
					planetObject.status = $scope.GetActionIDByClass("Colonized");
					break;
			}
		}
		
		// called when an editted planet is saved
		 $scope.SaveEdittedPlanet = function(edittedPlanetObject) {
			 edittedPlanetObject.nextClass = GetNextPlanetClass(edittedPlanetObject.currentClass, edittedPlanetObject.goalClass);
			 
			 // if the goal matches the current class, only Done or Colonized
			 if(edittedPlanetObject.currentClass == edittedPlanetObject.goalClass) {
				 if($scope.GetActionClassByID(edittedPlanetObject.status) != "Done" && $scope.GetActionClassByID(edittedPlanetObject.status) != "Colonized") {
					 edittedPlanetObject.status = $scope.GetActionIDByClass("Done");
				 }
			// otherwise if the don't match, use Idle or terrforming, default to Idle
			 } else {
				  if($scope.GetActionClassByID(edittedPlanetObject.status) != "Idle" && $scope.GetActionClassByID(edittedPlanetObject.status) != "Terraforming") {
					 edittedPlanetObject.status = $scope.GetActionIDByClass("Idle");
				 }
			 }			 
			 
			 edittedPlanetObject.isEditting = false;
		 }
		
		
		/*
		 *
		 *       Below are helper functions for the UI
		 *
		 */
		 
		 
		 var OnTerraformingEnd = function(planetObject) {
				planetObject.currentClass = planetObject.nextClass
				if(planetObject.currentClass == planetObject.goalClass) {
					planetObject.status = $scope.GetActionIDByClass("Done");
				} else {
					planetObject.status = $scope.GetActionIDByClass("Idle");
					planetObject.nextClass = GetNextPlanetClass(planetObject.currentClass, planetObject.goalClass)
				}
		}
		 
		 //returns the next unique planet ID
		var GetNextPlanetID = function() {
			var nPID = 0;
			for( var i=0; i< $scope.userData.terraformTableData.length; i++) {
				if(nPID <= $scope.userData.terraformTableData[i].pID) {
					nPID = $scope.userData.terraformTableData[i].pID
				}
			}
			
			return nPID+1;
		}
		
		//returns the correct status for a new planet
		var GetNewPlanetStatus = function(nPlanet) {
			if(nPlanet.currentClass == nPlanet.goalClass) {
				return $scope.GetActionIDByClass("Done");
			}
			
			return $scope.GetActionIDByClass("Idle");
		}
		
		
		/*
		 *
		 *		 Below are the Map Functions to determine where to colonize to next
		 *
		 */
		 
		//The main function that is called to determine this
		var GetNextPlanetClass = function(currentClass, goalClass) {
			switch($scope.GetPlanetClassByID(currentClass)) {
				case "Arctic":
					return $scope.GetPlanetIDByClass(GetNextStartForArctic($scope.GetPlanetClassByID(goalClass)));
					break;
				case "Arid":
					return $scope.GetPlanetIDByClass(GetNextStartForArid($scope.GetPlanetClassByID(goalClass)));
					break;
				case "Continental":
					return $scope.GetPlanetIDByClass(GetNextStartForContinental($scope.GetPlanetClassByID(goalClass)));
					break;
				case "Desert":
					return $scope.GetPlanetIDByClass(GetNextStartForDesert($scope.GetPlanetClassByID(goalClass)));
					break;
				case "Ocean":
					return $scope.GetPlanetIDByClass(GetNextStartForOcean($scope.GetPlanetClassByID(goalClass)));
					break;
				case "Tropical":
					return $scope.GetPlanetIDByClass(GetNextStartForTropical($scope.GetPlanetClassByID(goalClass)));
					break;
				case "Tundra":
					return $scope.GetPlanetIDByClass(GetNextStartForTundra($scope.GetPlanetClassByID(goalClass)));
					break;
			}
		}
		
		//the function for the Artic class
		var GetNextStartForArctic = function(goalClass) {
			switch(goalClass)
			{
				case "Arid":
					return "Tundra";
					break;
				case "Continental":
					return "Ocean";
					break;
				case "Desert":
					return "Tundra";
					break;
				case "Ocean":
					return "Ocean";
					break;
				case "Tropical":
					return "Ocean";
					break;
				case "Tundra":
					return "Tundra";
					break;
			}
		}
		
		//the function for the Arid class
		var GetNextStartForArid = function(goalClass) {
			switch(goalClass)
			{
				case "Arctic":
					return "Tundra";
					break;
				case "Continental":
					return "Desert";
					break;
				case "Desert":
					return "Desert";
					break;
				case "Ocean":
					return "Tundra";
					break;
				case "Tropical":
					return "Desert";
					break;
				case "Tundra":
					return "Tundra";
					break;
			}
		}
		
		//the function for the Continental class
		var GetNextStartForContinental = function(goalClass) {
			switch(goalClass)
			{
				case "Arctic":
					return "Ocean";
					break;
				case "Arid":
					return "Tropical";
					break;
				case "Desert":
					return "Tropical";
					break;
				case "Ocean":
					return "Ocean";
					break;
				case "Tropical":
					return "Tropical";
					break;
				case "Tundra":
					return "Ocean";
					break;
			}
		}
		
		//the function for the Desert class
		var GetNextStartForDesert = function(goalClass) {
			switch(goalClass)
			{
				case "Arctic":
					return "Arid";
					break;
				case "Arid":
					return "Arid";
					break;
				case "Continental":
					return "Tropical";
					break;
				case "Ocean":
					return "Tropical";
					break;
				case "Tropical":
					return "Tropical";
					break;
				case "Tundra":
					return "Arid";
					break;
			}
		}
		
		//the function for the Ocean class
		var GetNextStartForOcean = function(goalClass) {
			switch(goalClass)
			{
				case "Arctic":
					return "Arctic";
					break;
				case "Arid":
					return "Arctic";
					break;
				case "Continental":
					return "Continental";
					break;
				case "Desert":
					return "Tropical";
					break;
				case "Tropical":
					return "Tropical";
					break;
				case "Tundra":
					return "Arctic";
					break;
			}
		}
		
		//the function for the Tropical class
		var GetNextStartForTropical = function(goalClass) {
			switch(goalClass)
			{
				case "Arctic":
					return "Ocean";
					break;
				case "Arid":
					return "Desert";
					break;
				case "Continental":
					return "Continental";
					break;
				case "Desert":
					return "Desert";
					break;
				case "Ocean":
					return "Ocean";
					break;
				case "Tundra":
					return "Ocean";
					break;
			}
		}
		
		//the function for the Tundra class
		var GetNextStartForTundra = function(goalClass) {
			switch(goalClass)
			{
				case "Arctic":
					return "Arctic";
					break;
				case "Arid":
					return "Arid";
					break;
				case "Continental":
					return "Arctic";
					break;
				case "Desert":
					return "Arid";
					break;
				case "Ocean":
					return "Arctic";
					break;
				case "Tropical":
					return "Arid";
					break;
			}
		}
		
		
		/*
		 *
		 *		 These functions are used to load / Save data form the SaveDataPipeSvc
		 *
		 */
		
		//below is the varible for the ticket service that will save the userdata to the SaveDataPipeSvc every second
		var saveFunction = function() {
			if(AutoSaveSvc.IsTerraformingAutoSaveOn()) {
				SaveDataPipeSvc.SetTerraformingNotepadSaveData($scope.userData); 
			}
		}
		
		// loads the save data if there is any, otherwise load none.
		var onInit = function() {
			var testLoad = SaveDataPipeSvc.GetTerraformingNotepadSaveData();
			if(testLoad == null) {
				$scope.userData.terraformTableData = [];
			} else {
				$scope.userData = null;
				$scope.userData = testLoad;
			}
			
			AutoSaveSvc.ActivateTerraformingAutoSaveOn();
		}
		
		var saveDataTicker = $interval(saveFunction, 1000);
		
		onInit();
		
		
	}
]);