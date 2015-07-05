angular.module('userCtrl', ['voteService'])
	.controller('userCreateController', function(Vote){
		var vm = this;

		vm.type = 'create';

		vm.saveUser = function(){
			vm.processing = true;

			vm.message = '';
			Vote.createUser(vm.userData)
				.success(function(data){
					vm.processing = false;
					vm.userData = {};
					vm.message = data.message;
				})
		}
	})