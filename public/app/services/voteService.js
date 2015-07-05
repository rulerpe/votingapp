angular.module('voteService', [])
	.factory('Vote', function($http){
		var voteFactory = {};

		voteFactory.getUser = function(id){
			return $http.get('/api/users/' + id);
		};

		voteFactory.getAllUser = function(){
			return $http.get('/api/users');
		};

		voteFactory.createUser = function(userData){
			return $http.post('/api/users', userData);
		};

		voteFactory.createVote = function(voteData){
			return $http.post('/api/votes', voteData);
		};

		voteFactory.getVote = function(id){
			return $http.get('/api/votes/' + id);
		};

		voteFactory.getMyVotes = function(){
			return $http.get('/api/myvotes');
		};

		voteFactory.deleteVotes = function(id){
			return $http.delete('/api/votes/' + id);
		};

		voteFactory.userVote = function(id,choice){
			return $http.delete('/api/votes/' + id, choice);
		};

		voteFactory.editVote = function(id,voteData){
			
			return $http.put('/api/votes/' + id, voteData);
		};

		voteFactory.removeOption = function(id,oldOption){
			return $http.put('/api/votes/remove/' + id, oldOption);
		};
		voteFactory.vote = function(id,choice){
			console.log(choice);
			return $http.put('/api/pick/'+id, choice);
		}

		return voteFactory;
	})