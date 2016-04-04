(function() {
    var app = angular.module('Showcase-PhoneGap');

    app.filter('milliToSeconds', ['$filter', function ($filter) {
        return function(value, intDecimals) {
            var decimals = intDecimals || 0;
            return $filter('decimalTransform')(value, decimals, 0.001);
        };
    }]);
})();
