StellarisNotepadApp.service("SaveDataPipeSvc", function() {
	// save location for the terraforming notepad
	var TerraformingNotepadSaveData = null;
	
	// save location for all current save data
	var MainSaveDataList = null;
	
	return { 
		GetTerraformingNotepadSaveData: function() {
			return TerraformingNotepadSaveData;
		},
		SetTerraformingNotepadSaveData: function(value) {
			TerraformingNotepadSaveData = null;
			TerraformingNotepadSaveData = value;
		},
		
		GetMainSaveDataList: function() {
			return MainSaveDataList;
		},
		SetMainSaveDataList: function(value) {
			MainSaveDataList = null;
			MainSaveDataList = value;
		}
	}
});