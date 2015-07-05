angular.module('app.routes', ['ngRoute'])
	.config(function($routeProvider, $locationProvider){
		$routeProvider
			.when('/', {
				templateUrl: 'app/views/pages/home.html'
			})
			.when('/login', {
				templateUrl: 'app/views/pages/login.html',
				controller: 'mainController',
				controllerAs: 'login',
			})
			.when('/users/create', {
				templateUrl: 'app/views/pages/users/single.html',
				controller: 'userCreateController',
				controllerAs: 'user',
			})
			.when('/user', {
				templateUrl: 'app/views/pages/users/myvotes.html',
				controller: 'allMyVotesController',
				controllerAs: 'allMyVotes',
			})
			.when('/vote/create', {
				templateUrl: 'app/views/pages/votes/newvote.html',
				controller: 'createVoteController',
				controllerAs: 'newVote',
			})
			.when('/vote/edit/:voteId', {
				templateUrl: 'app/views/pages/votes/newvote.html',
				controller: 'editVoteController',
				controllerAs: 'newVote',
			})
			.when('/vote/:voteId', {
				templateUrl: 'app/views/pages/votes/viewvote.html',
				controller: 'viewVoteController',
				controllerAs: 'viewVote',
			});
			$locationProvider.html5Mode(true);
	})