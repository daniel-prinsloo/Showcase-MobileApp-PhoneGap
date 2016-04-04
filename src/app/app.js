(function() {
    angular.module('templates', []);
    var app = angular.module('Showcase-PhoneGap', [
        'templates',
        'ngRoute',
        'mobile-angular-ui',
        'timer'
    ]);
    app.config(function($routeProvider) {
        var viewPath = 'app/views/';
        $routeProvider.when('/', {templateUrl: viewPath + 'intro.html',  reloadOnSearch: false});
        $routeProvider.when('/cpu_test', {templateUrl: viewPath + 'cpu_test.html',  reloadOnSearch: false});
        $routeProvider.when('/animations', {templateUrl: viewPath + 'animations.html',  reloadOnSearch: false});
        $routeProvider.when('/network_overhead', {templateUrl: viewPath + 'network_overhead.html',  reloadOnSearch: false});
        $routeProvider.when('/visual_interface', {templateUrl: viewPath + 'visual_interface.html',  reloadOnSearch: false});
    });
})();