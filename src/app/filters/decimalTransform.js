(function() {
    var app = angular.module('Showcase-PhoneGap');

    app.filter('decimalTransform', [function() {
        return function(value, decimals, inTransform) {
            var transform = inTransform || 1;
            value = Number(value) * transform;
            var returnValue = Number(value.toPrecision(decimals + 1));
            return returnValue;
        };
    }]);
})();
