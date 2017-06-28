var StellarisNotepadApp = angular.module('StellarisNotepadApp', ['ngRoute', 'ngCookies'])
	.config(function ($routeProvider) {
		$routeProvider.when('/Main', 
		{
			templateUrl: 'templates/Main.html',
			controller: 'MainController'
		});
		$routeProvider.when('/TerraformingNotepad',
		{
			templateUrl: 'templates/TerraformingNotepad.html',
			controller: 'TerraformingNotepadController'
		});
		$routeProvider.when('/About',
		{
			templateUrl: 'templates/About.html',
			controller: 'AboutController'
		});
		$routeProvider.otherwise({redirectTo: '/Main'});
		
	});
