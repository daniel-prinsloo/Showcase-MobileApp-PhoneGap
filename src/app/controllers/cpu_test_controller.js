(function() {
    var app = angular.module('Showcase-PhoneGap');
    app.controller('cpu_test_controller', ['$q','$scope','$timeout', '$interval', function($q, $scope, $timeout, $interval) {
        $scope.test = {result:undefined, calculating : undefined};
        $scope.clock = {startTime : undefined};
        var timer;
        
        $scope.isPrime = function(n) {
            //check if n is a multiple of 2
            if (n % 2 === 0) return false;
            //if not, then just check the odds
            for (var i = 3; i * i <= n; i += 2)
            {
                if (n % i === 0)
                    return false;
            }
            return true;
        };
        
        $scope.calculatePrimesProcess = function () {
            var deferred = $q.defer();
            $timeout(function() {
                $scope.clock.startTime = Date.now();
                var primeCount = 0;
                var counter = 1;
                while (primeCount < $scope.amountOfPrimes && !$scope.test.stopCalculation) {
                    if ($scope.isPrime(counter)) {
                        primeCount++;
                    }
                    counter++;
                }
                deferred.resolve();
            });        
            return deferred.promise;
        };
        
        $scope.calculatePrimes = function() {
            if (timer) {
                $interval.cancel(timer);
            }
            $scope.test.result = '';
            $scope.clock.timeDisplay = 0;
            
            $scope.test.calculating = true;
            $scope.test.stopCalculation = false;
            $scope.calculatePrimesProcess().then(function() {
                $timeout(function() {
                    var stopTime = Date.now();
                    $scope.test.result = (stopTime - $scope.clock.startTime) / 1000;
                    console.log('stop');
                    $scope.test.calculating = false;
                });
            });
        };
        
        $scope.forceStop = function () {
            $scope.test.stopCalculation = true;
            $scope.test.calculating = false;
        };
    }]);
})();