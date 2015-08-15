(function() {

    angular
        .module('myToiletApp')
        .controller('AddNewToiletCtrl', AddNewToilet);


    AddNewToilet.$inject = ['$scope', 'LocationFactory', '$http'];


    function AddNewToilet($scope, location, $http) {

        $scope.location = {
            name: null
        };

        // document.addEventListener("deviceready", function(){
            getCurrentLocation();
            getCurrentLocationName();
        // }, false);

        $scope.ratingsObject = {
            iconOn: 'ion-ios-star',
            iconOff: 'ion-ios-star-outline',
            iconOnColor: 'rgb(255, 148, 28)',
            iconOffColor: 'rgb(171, 171, 171)',
            rating: 0,
            minRating: 0,
            callback: function(rating) {
                $scope.ratingsCallback(rating);
            }
        };

        $scope.ratingsCallback = function(rating) {
            console.log('Selected rating is : ', rating);
        };

        $scope.takePicture = function() {
            navigator.camera.getPicture(function(image) {
                console.log(image);
            });
        };

        $scope.addNewToilet = function() {
            $http.post('http://www.findatoilet.in/admin/api/addLocation.php', {
                name: $scope.location.name,
                openTime: $scope.location.openTime,
                closeTime: $scope.location.closeTime,
                mode: $scope.location.mode,
                address: $scope.location.address,
                longitude: location.coordinate.coords.longitude,
                latitude: location.coordinate.coords.latitude,
                mode: 'FREE',
                dateCreated: new Date()
            }).success(function(response) {
                console.log(response);
            })
        }


        /**
         * getCurrentLocation method get current location of the user.
         * Create the marker on user screen.
         * @return {[type]} [description]
         */
        function getCurrentLocation() {
            location.getCurrentLocation().then(function(position) {
                $scope.map = {
                    id: parseInt(Math.expm1(Math.random()).toString().slice('2')),
                    zoom: 12,
                    center: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    options: {
                        draggable: true
                    },
                    bounds: {},
                    scrollwheel: false
                };

                $scope.marker = {
                    id: 0,
                    coords: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    options: {
                        draggable: true
                    }
                };
            });
        }

        /**
         * getCurrentLocationName method get name of current location of user.
         * @return {[type]} [description]
         */
        function getCurrentLocationName() {
            location.reverseGeoCoding().then(function(response) {
                $scope.location.name = location.getSpecificAddressComponent(response.results, response.status, location.addressComponent.name).longName;
                $scope.location.address = location.getSpecificAddressComponent(response.results, response.status, location.addressComponent.address).longName;
            });
        }

    }



})();