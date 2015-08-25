// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('myToiletApp', ['ionic', 'starter.controllers', 'uiGmapgoogle-maps', 'ngCordova', 'ionic-ratings', 'ngFileUpload'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})
    .config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyDTfLrnNHX3BcdNDZ0MjhKu7S5yBZx2csY',
            v: '3.17',
            pan: '',
            libraries: 'weather,geometry,visualization'
        });
    })
    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $ionicConfigProvider.navBar.alignTitle('center');

        $urlRouterProvider.when('/app/home', '/app/home/maps');

        $stateProvider

        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })

        .state('app.home', {
            url: '/home',
            abstract: true,
            views: {
                'menuContent': {
                    controller: 'LocationMapCtrl',
                    templateUrl: 'templates/home.tpl.html'
                }
            }
        })

        .state('app.home.maps', {
            url: '/maps',
            controller: 'LocationMapViewCtrl',
            templateUrl: 'templates/map.tpl.html',
            controllerAs: 'vm'
        })

        .state('app.home.map', {
            url: '/map/:lid',
            controller: 'LocationMapCtrl',
            templateUrl: 'templates/map.tpl.html'
        })

        .state('app.home.mode', {
            url: '/toiletmode/:mode',
            controller: 'LocationMapCtrl',
            templateUrl: 'templates/map.tpl.html'
        })

        .state('app.home.maplist', {
            url: '/list',
            controller: 'LocationMapListViewCtrl',
            templateUrl: 'templates/maplist.tpl.html',
            controllerAs: 'vm'
        })

        .state('app.add', {
            url: '/addmap',
            views: {
                'menuContent': {
                    controller: 'AddNewToiletCtrl',
                    templateUrl: 'templates/add.toilet.html',
                }
            },
            controllerAs: 'vm'
        })

        .state('app.review', {
            url: '/toiletreview',
            views: {
                'menuContent': {
                    controller: 'ToiletReviewCtrl',
                    templateUrl: 'templates/toilet.review.html',
                }
            },
            controllerAs: 'vm'
        })

        .state('app.search', {
            url: '/search',
            views: {
                'menuContent': {
                    templateUrl: 'templates/search.html'
                }
            }
        })

        .state('app.browse', {
            url: '/browse',
            views: {
                'menuContent': {
                    templateUrl: 'templates/browse.html'
                }
            }
        })

        .state('app.playlists', {
            url: '/playlists',
            views: {
                'menuContent': {
                    templateUrl: 'templates/playlists.html',
                    controller: 'PlaylistsCtrl'
                }
            }
        })

        .state('app.single', {
            url: '/playlists/:playlistId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/playlist.html',
                    controller: 'PlaylistCtrl'
                }
            }
        });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    });