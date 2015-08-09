(function() {

    angular
        .module('myToiletApp')
        .factory('LocationFactory', Location);


    Location.$inject = ['$http', '$q', '$cordovaGeolocation'];

    function Location($http, $q, $cordovaGeolocation) {

        var defaults = {
            getCurrentLocation: GetCurrentLocation,
            reverseGeoCoding: ReverseGeoCoding,
            getAllLocations: GetAllLocations,
            getLocationByName: GetLocationByName,
            getLocationById: GetLocationById,
            distanceCalculator: DistanceCalculator,
            list: null,
            coordinate: null,
            addressComponent: {
                postalCode: 'postal_code', 
                country: 'country',
                locality: 'administrative_area_level_1',
                district: 'administrative_area_level_2',
                locality: 'sublocality_level_1',
                subLocality: 'sublocality_lefvel_2',
                area: 'sublocality_level_3',
                name: 'route'
            }
        };
        


        return defaults;

        /**
         * DistanceCalculator methods calculate the distance between two locations, and
         * returns the nearest distance of all.
         *
         * @return {Object} returns a defered object, the object consist of the nearest
         * ascending order  
         */
        function DistanceCalculator(origin, destinations, property) {

            var property = property || [],
                $defer = $.Deferred(),
                distance = new google.maps.DistanceMatrixService();
            this.destinations = destinations;

            distance.getDistanceMatrix({
                origins: ConvertLatLangToGoogleCoords(origin, _.first(property)),
                destinations: ConvertLatLangToGoogleCoords(destinations, _.last(property)),
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false
            }, function(response, status) {
                if (status === google.maps.DistanceMatrixStatus.OK) {
                    
                    _.forEach(_.first(response.rows).elements, function (travel, index) {
                        destinations[index].driving = {
                            distance: travel.distance.text,
                            duration: travel.duration.text
                        }
                    });

                    $defer.resolve(destinations);
                
                } else {
                    $defer.reject(status);
                }

                callback(response, status, destinations)
            });

            return $defer.promise();
        }

        /**
         * ConvertLatLangToGoogleCoords method convert the string lat/lng to google
         * readeable lat/lng.
         * @return {object} Google Coordinates
         */
        function ConvertLatLangToGoogleCoords(coordinate, key) {
            var location = [];
            _.forEach(coordinate, function(coords) {
                coords = (key) ? coords[key] : coords;
                location.push(new google.maps.LatLng(parseFloat(coords.latitude), parseFloat(coords.longitude)));
            });

            return location;
        }

        function callback(response, status, destinations) {

            _.forEach(_.first(response.rows).elements, function (travel, index) {
                destinations[index].distance = travel.distance.text
            });
        }

        /**
         * getAllLocations method get all the stored longitude and latitude.
         * @return {object} list of all the locations.
         */
        function GetAllLocations(searchString) {
            return $http.get('http://www.findatoilet.in/admin/api/locations.php?query='+searchString);
        }


        /**
         * getCurrentLocation methods uses Html5 geolocation and send the current position of the user.
         * Furthur we use the location in google to create marker.
         * @return {object} coords.latitude and coords.longitude are two params returned by the methods.
         */
        function GetCurrentLocation() {

            // return $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: false});
            var $defer = $.Deferred();

            navigator.geolocation.getCurrentPosition(function(position) {

                if (position.coords) {

                    $defer.resolve(position);
                } else {

                    $defer.reject('not able to fetch cordinates');
                }

            });

            return $defer.promise();

        }

        /**
         * GetLocationByName methods get all the stored locations which matches the searched name.
         */
        function GetLocationByName(name) {

            if (!name) return;

            var regExp = new RegExp(name, 'ig'),
                locations = [];

            _.forEach(defaults.list, function(location) {
                if (regExp.test(location.name)) {
                    locations.push(location);
                }
            });

            return locations;

        }

        /**
         * GetLocationById methods return the location by unique id.
         * @param {[type]} id [description]
         */
        function GetLocationById(id) {
            return _.find(defaults.list, function(location) {
                return location.id === id;
            });
        }

        /**
         * getNearestLocations methods get the nearest location based on users current location.
         * @return {[type]} [description]
         */
        function GetNearestLocation() {

        }

        /**
         * AddressComponentOfCurrentLocation methods returns the specific details of the address passed. Like
         * postal code, country, area etc.
         *
         * @return {string} address component
         */
        function AddressComponentOfCurrentLocation(results, status, component) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    for (var i = 0; i < results[0].address_components.length; i++) {
                        var types = results[0].address_components[i].types;

                        for (var typeIdx = 0; typeIdx < types.length; typeIdx++) {
                            if (types[typeIdx] === component) {
                                return {
                                    longName: results[0].address_components[i].long_name,
                                    shortName: results[0].address_components[i].short_name 
                                }
                            }
                        }
                    }
                } else {
                    throw Error('No results found');
                }
            }
        }

        /**
         * reverseGeoCoding terminology used to get the location details based on the longitude and latitude.
         * @return {[type]} [description]
         */
        function ReverseGeoCoding(component) {
            var $defer = $.Deferred();

            GetCurrentLocation().then(function(position) {

                var infowindow = new google.maps.InfoWindow(),
                    geocoder = new google.maps.Geocoder(),
                    latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    defaults.coordinate = position;

                geocoder.geocode({
                    'latLng': latlng
                }, function(results, status) {
                    var results = (component) ? AddressComponentOfCurrentLocation(results, status, component) : results;
                    $defer.resolve(results);
                }, function(err) {
                    $defer.reject(err);
                });
            });

            return $defer.promise();
        }

    }

})();