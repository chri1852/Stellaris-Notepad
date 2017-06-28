StellarisNotepadApp.service("AutoSaveSvc", function() {
	
	var MainAutoSaveOn = false;
	
	var TerraformingAutoSaveOn = false;
	
	var AboutAutoSaveOn = false;
	
	return { 
	
		ActivateMainAutoSave: function() {
			MainAutoSaveOn = true;
			TerraformingAutoSaveOn = false;
			AboutAutoSaveOn = false;
		},
		
		ActivateTerraformingAutoSaveOn: function() {
			MainAutoSaveOn = false;
			TerraformingAutoSaveOn = true;
			AboutAutoSaveOn = false;
		},
		
		ActivateAboutAutoSaveOn: function() {
			MainAutoSaveOn = false;
			TerraformingAutoSaveOn = false;
			AboutAutoSaveOn = true;
		},
		
		IsMainAutoSaveOn: function() {
			return MainAutoSaveOn;
		},
		
		IsTerraformingAutoSaveOn: function() {
			return TerraformingAutoSaveOn;
		},
		
		IsAboutAutoSaveOn: function() {
			return AboutAutoSaveOn;
		},
	
	}

});