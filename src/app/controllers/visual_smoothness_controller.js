(function() {
    var app = angular.module('Showcase-PhoneGap');
    app.controller('visual_smoothness_controller', ['$q','$scope','$timeout', function($q, $scope, $timeout) {
        $scope.listItems = [];
        $scope.max = 100;
        $scope.started = false;
        
        $scope.timeTick = function() {
           $timeout(
                function() {
                    $scope.listItems.unshift($scope.counter);
                    if ($scope.started) 
                        $scope.timeTick();
                    $scope.counter++;
                },
                1
            );
        };
        
        $scope.startTest = function() {
            $scope.listItems = [];
            $scope.started = true;
            $scope.counter = 1;
            $scope.timeTick();
        };
        
        $scope.stopTest = function() {
            $scope.started = false;
        };
        
    }]);
})();