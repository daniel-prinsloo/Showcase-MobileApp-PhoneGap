(function() {
    var app = angular.module('Showcase-PhoneGap');
    app.controller('network_overhead_controller', ['$q', '$scope', '$timeout','rest_service', function($q, $scope, $timeout, rest_service) {
        $scope.calls = [];
        $scope.timer = {};
        
        $scope.openWebsite = function(url){
            window.open(url, '_system');
        };
        
        $scope.networkTestLoop = function(url){
            $scope.timer = {};
            $scope.timer.startTime = Date.now();
            rest_service.getCall(url).then(function(){
                $scope.timer.endTime = Date.now();
                var call = {
                    count:$scope.counter + 1,
                    time: ($scope.timer.endTime - $scope.timer.startTime)
                };
                // $scope.calls.unshift({
                //     count:$scope.counter + 1,
                //     time: ($scope.timer.endTime - $scope.timer.startTime)
                // });
                $timeout(function() {
                    $scope.average = call.time;
                    for(var i=0; i < $scope.calls.length; i++) {
                        $scope.average += $scope.calls[i].time;
                    }
                    call.badgeTypeStyle = 'badge-green';
                    if ($scope.counter === 0) {
                        call.average = call.time;                        
                    } else {
                        call.average = Math.round($scope.average / ($scope.counter + 1));
                        if (call.average - call.time < 0) {
                            call.badgeTypeStyle = 'badge-red';
                        }
                    }                    
                    //console.log($scope.counter + ' ' + $scope.average);
                    $scope.calls.unshift(call);
                    $scope.counter++;
                    if ($scope.counter < 10) {
                        $scope.networkTestLoop(url);
                    }                    
                },100);
            });
        };
        
        $scope.startNetworkTest = function(url){
            $scope.calls = [];
            $scope.networkTestLoop(url);
            $scope.counter = 0;
        };
        
        $scope.getTotal = function() {
            var total = 0;
            for(var i=0; i < $scope.calls.length; i++) {
                total += $scope.calls[i].time;
            }
            return total;
        }
        
        $scope.getAverage = function() {
            var average = 0;
            for(var i=0; i < $scope.calls.length; i++) {
                average += $scope.calls[i].time;
            }
            return Math.round(average / $scope.calls.length);
        }
    }]);
})();