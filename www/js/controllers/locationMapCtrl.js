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

        $scope.map = {};

        $rootScope.$on('searchClicked', drawSearchedLocation);

        $scope.$watch('locationsearch', function (o, n) {
            locationsearch = n;
        });

        /**
         * If url has a id params, draw the markers by location id.
         */
        // document.addEventListener("deviceready", function(){
        
        if (!$scope.map.isLoading) {
            if ($stateParams.lid) {
                drawLocationById(parseInt($stateParams.lid));
            } else {
                drawAllMarkers();
            }
        }
        // }, false);



        /**
         * drawAllMarkers methods draw all the markers in the user map.
         * @return {type} [description]
         */
        function drawAllMarkers() {
            var distance;
            $scope.map.isLoading = true;
            location.reverseGeoCoding(location.addressComponent.postalCode).then(function (response) {

                location.getAllLocations(response.longName).then(function(response) {
                    // Cache the locations in service..
                    location.list = response.data;
                    distance = location.distanceCalculator([location.coordinate], location.list, ['coords', 'coords']);
                    distance.then(function (distance) {
                        $scope.map.isLoading = false;
                        $scope.map.markers = distance;
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
        function drawLocationById (lid) {
            var position = location.getLocationById(lid);
            udpateMapCordinates.call(position);
            $scope.map.markers = [position];
        }

        /**
         * searchLocations method search all stored location.
         * @return {[type]} [description]
         */
        function drawSearchedLocation(event) {

            var locations = location.getLocationByName($scope.locationsearch)
            udpateMapCordinates.call(_.first(locations));
            $scope.map.markers = locations;
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