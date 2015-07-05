angular.module('barchart', [])
.directive('chart', function(){
	return {
		replace: true,
		transclude: true,
		templateUrl: '/app/chart.html',
		controller: function($scope, $element, $attrs){
			var H = parseInt($attrs.height, 10);
			var W = parseInt($attrs.width, 10);
			var numOfTicks = 6;


			var highest = 0;
			var count = 0;

			var borderWidth = 30;


			
			$scope.svgHeight = H+30;
			$scope.leftLimit = borderWidth;
			$scope.rightLimit = W;
			$scope.bottomLimit = H - borderWidth;
			this.svgHeight = H - borderWidth;
			this.getY = function(point){
				if(point.d > highest){
					highest = point.d;
					$scope.$broadcast('new-highest')
				}
				var heightSpacer = (H -30 - borderWidth ) / highest;

				$scope.ticks = [];
				var interval = highest / (numOfTicks -1);

				for(var i=0; i<numOfTicks;i++){
					$scope.ticks.push({
						text: interval * i,
						value: interval*i*heightSpacer +30
						})
				}

				return H - borderWidth - point.d*heightSpacer ;
			}

			this.getX = function(point){
				if(typeof point.num == 'undefined'){
					point.num = count++;
					$scope.$broadcast('new-width')
				}
				var widthSpacer = (W - borderWidth - 50) / (count -1);
				return point.num*widthSpacer +  borderWidth ;
			}

			$scope.points = [];
			this.setTick = function(point){
				$scope.points.push(point);
			}
		}
	};
})

.directive('datapoint', function(){
	return {
		replace: true,
		require: '^chart',
		scope: {
			d: '@',
			label: '@'
		},
	//	template: '<circle ng-attr-cx="{{cx}}" ng-attr-cy="{{cy}}" ng-attr-r="{{radius}}" ng-attr-stroke-width="{{strokeWidth}}" fill="#ffffff" stroke="{{stroke}}" />',
		template: '<rect  ng-attr-x="{{cx}}" ng-attr-y="{{cy}}" ng-attr-width="{{Rwidth}}" ng-attr-height="{{height - cy}}" fill="{{stroke}}" />',
		link: function(scope, element, attr, ctrl){
			scope.d = parseInt(scope.d, 10);
			console.log( "d" + scope.d);
			console.log(scope.label);
			scope.radius = 4;
			scope.Rwidth = 50;
			scope.strokeWidth = 3;
			scope.stroke = "#5b90bf";
			scope.height = ctrl.svgHeight;

			setY();
			setX();
			ctrl.setTick(scope);

			scope.$on('new-highest', setY);

			scope.$on('new-width', setX);

			function setY (){
				scope.cy = ctrl.getY(scope);
				console.log( "height" + scope.height);
				console.log( "cy" + scope.cy);
			}
			function setX (){
				scope.cx = ctrl.getX(scope);
				
			}
		}
	}
})