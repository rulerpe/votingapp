angular.module('allMyVotesCtrl', ['voteService','barchart'])
	.controller('allMyVotesController', function(Vote){
		var vm = this;
		vm.processing = true;
		vm.myVotes = {};

		Vote.getMyVotes()
			.success(function(data){
				vm.processing = false;
				vm.myVotes = data;
			})

		vm.removeVote = function(id){
			Vote.deleteVotes(id);
		}
	})
	.controller('createVoteController', function(Vote){
		var vm = this;
		vm.type = "create"
		vm.voteData = {};
		vm.options = [{name:""}];
		vm.message = '';
		vm.optionsTemp = '';

		vm.addOption = function(){
			vm.options.push({name:""});
		};

		vm.removeOption = function(index){
			vm.options.splice(index,1);
		}
		
		vm.saveVote = function(){
			vm.processing = true;
			vm.options.forEach(function(value){
				vm.optionsTemp = vm.optionsTemp + value.name +',';
			})
			vm.voteData.options = vm.optionsTemp;
			Vote.createVote(vm.voteData)
				.success(function(data){
					vm.processing = false;
					vm.voteData = {};
					vm.message = data.message;
				})
		}
	})
	.controller('editVoteController', function($routeParams, Vote){
		var vm = this;
		vm.type = "edit";
		vm.voteData = {};
		vm.options =[];
		Vote.getVote($routeParams.voteId)
			.success(function(data){
				console.log(data);
				vm.voteData.name = data.name;
				vm.voteData.user = data.user;
				vm.options = data.options;
			})
		vm.message = '';
		vm.optionsTemp = '';

		vm.addOption = function(){
			vm.options.push({name:""});
		};

		vm.removeOption = function(index){
			vm.options.splice(index,1);
		}
		
		vm.saveVote = function(){
			vm.processing = true;
			vm.options.forEach(function(value){
				vm.optionsTemp = vm.optionsTemp + value.name +',';
			})
			vm.voteData.options = vm.optionsTemp;
			Vote.editVote($routeParams.voteId, vm.voteData)
				.success(function(data){
					vm.processing = false;
					vm.voteData = {};
					vm.message = data.message;
				})
		}

	})
	.controller('viewVoteController', function($routeParams, Vote){
		var vm = this;
		vm.voted = false;
		vm.voteData = {};
		Vote.getVote($routeParams.voteId)
		.success(function(data){
			console.log(data);
			vm.voteData.name = data.name;
			vm.voteData.user = data.user;
			vm.voteData.options = data.options.slice(0);
		})
		vm.message = '';

		vm.vote = function(option){
			var pick = {choice: option}
			vm.voted = true;
			Vote.vote($routeParams.voteId, pick)
				.success(function(data){
					vm.message = data.message;
				})
		}
	})
