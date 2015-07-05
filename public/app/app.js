angular.module('userApp', [
	'ngAnimate',
	'app.routes',
	'authService',
	'mainCtrl',
	'userCtrl',
	'voteService',
	'allMyVotesCtrl',
	'barchart'
	])
.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptor')
})