StellarisNotepadApp.filter('TerraformingActionFilter', function() {
	return function(items, filterObject) {
		var filtered = [];
		
		// if there is nothing to filter return
		if(items == null) {
			return filtered;
		}
		
		for(var i=0; i<items.length; i++) {
			
			var addItem = false;
			
			// first check the action filter
			switch(items[i].status) {
				case 1:
					if(filterObject.IdleFilter){ addItem = true; }
					break;
				case 2:
					if(filterObject.TerraformingFilter){ addItem = true; }
					break;
				case 3:
					if(filterObject.DoneFilter){ addItem = true; }
					break;
				case 4:
					if(filterObject.ColonizedFilter){ addItem = true; }
					break;	
			}
			
			// now the planetName filter
			if(addItem == true) {
				if(items[i].planetName.toLowerCase().indexOf(filterObject.planetNameFilter.toLowerCase()) < 0) {
					addItem = false;
				}
			}
			
			// now the system filter
			if(addItem == true) {
				if(items[i].systemName.toLowerCase().indexOf(filterObject.systemNameFilter.toLowerCase()) < 0) {
					addItem = false;
				}
			}
			
			// if everything passes, add the item
			if(addItem) {
				filtered.push(items[i]);
			}
		}
		
		return filtered;
	};
});