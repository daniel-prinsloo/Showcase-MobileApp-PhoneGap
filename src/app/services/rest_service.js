(function () {
    var app = angular.module('Showcase-PhoneGap');
    app.service('rest_service', ['$http', '$q',
        function ($http, $q) {
            this.getCall = function (url) {
                var deferred = $q.defer();
                    $http.get(url, { responseType: 'arraybuffer' }).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (data, status) {
                        return deferred.reject(data, status);
                });
                return deferred.promise;
            };
        }
    ]);
})();