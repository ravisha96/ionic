(function() {
    /**
     * MyToiletApp Module
     *
     * Description
     */
    angular
        .module('myToiletApp')
        .controller('LocationMapCtrl', LocationMap);

    LocationMap.$inject = ['$scope', 'LocationFactory', 'uiGmapGoogleMapApi', '$q', '$rootScope', '$stateParams', '$state'];

    function LocationMap($scope, location, googleMap, $q, $rootScope, $stateParams, $state) {

        $scope.map = {
            markers: []
        };

        $scope.map.isLoading = false;

        $rootScope.$on('searchClicked', drawSearchedLocation);

        $scope.$watch('locationsearch', function(o, n) {
            locationsearch = n;
        });

        $scope.test = function(event, index) {
            var loc = $scope.map.markers[index].coords;

            window.open('geo://?q=' + loc.latitude + ',' + loc.longitude, '_system');
        }

        /**
         * If url has a id params, draw the markers by location id.
         */
        // document.addEventListener("deviceready", function(){
        if (!$scope.map.isLoading) {

            if ($state.current.name == 'app.home.maps') {
                drawMarkersForMapView();
            } else if ($state.current.name == 'app.home.maplist') {
                drawMarkersForListView();
            }

            if ($stateParams.lid) {
                drawLocationById(parseInt($stateParams.lid));
            }
        }
        // }, false);


        function drawMarkersForMapView() {
            var distance;
            $scope.map.isLoading = true;
            location.reverseGeoCoding(location.addressComponent.locality1).then(function(response) {

                location.getAllLocations(response.results.longName).then(function(response) {
                    // Cache the locations in service..
                    udpateMapCordinates.call(location.coordinate);
                    _.forEach(response.data, function(toilet) {
                        toilet.mode = 'http://findatoilet.in/admin/img/marker-' + toilet.mode + '.png';
                    });

                    $scope.map.markers = response.data;
                });
            });
        }

        function clickMe(event) {
            console.log(event);
        }

        /**
         * drawMarkersForListView methods draw all the markers in the user map.
         * @return {type} [description]
         */
        function drawMarkersForListView() {
            var distance;
            $scope.map.isLoading = true;
            location.reverseGeoCoding(location.addressComponent.postalCode).then(function(response) {

                location.getAllLocations(response.results.longName).then(function(response) {
                    // No data found message should, be displayed
                    if (response.data.length === 0) {
                        $scope.msg = true;
                        return;
                    }

                    // Cache the locations in service..
                    location.list = response.data;
                    distance = location.distanceCalculator([location.coordinate], location.list, ['coords', 'coords']);
                    distance.then(function(distance) {
                        $scope.map.isLoading = false;
                        $scope.map.markers = distance;
                        $scope.$apply();
                    })
                });
            });
        }

        /**
         * drawMyLocation method draw current location of the users.
         */
        function drawMyLocation() {
            setMapCordinates(updateMarkerCordinates);
        }

        /**
         * drawLocationById methods draw the markers with the location id selected by the user.
         * @param  {int} lid location id.
         */
        function drawLocationById(lid) {
            var position = location.getLocationById(lid);
            udpateMapCordinates.call(position);
            $scope.map.markers = [position];
        }


        /**
         * searchLocations method search all stored location.
         * @return {[type]} [description]
         */
        function drawSearchedLocation(event) {
            location.getAllLocations($scope.locationsearch).then(function (response) {
                udpateMapCordinates.call(_.first(response.data));
                $scope.map.markers = response.data;
            });
        }

        /**
         * setMapCordinates
         */
        function setMapCordinates(callback) {

            location.getCurrentLocation().then(function(position) {
                udpateMapCordinates.call(position);

                // If callback defined set the scope of the callback to map
                if (callback.constructor === Function) {
                    callback.call(position);
                }
            });
        }


        /**
         * udpateMapCordinates method focus the area in the map.
         */
        function udpateMapCordinates() {
            var self = this;
            $scope.map = {
                id: parseInt(Math.expm1(Math.random()).toString().slice('2')),
                zoom: 12,
                center: {
                    latitude: self.coords.latitude,
                    longitude: self.coords.longitude
                },
                options: {
                    draggable: true
                },
                bounds: {},
                scrollwheel: false
            };
        }



        /**
         * updateMarkerCordinates method draw the markers based on the cordinates provided
         */
        function updateMarkerCordinates() {
            var self = this;
            $scope.marker = {
                id: 0,
                coords: {
                    latitude: self.coords.latitude,
                    longitude: self.coords.longitude
                },
                options: {
                    draggable: true
                }
            };
        }
    }


})()