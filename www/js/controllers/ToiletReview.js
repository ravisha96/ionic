(function() {

    angular
        .module('myToiletApp')
        .controller('ToiletReviewCtrl', ToiletReviewCtrl);


    ToiletReviewCtrl.$inject = ['$scope', 'LocationFactory', '$http', '$ionicLoading', 'Upload', '$cordovaCamera', '$cordovaFileTransfer', '$ionicPopup'];


    function ToiletReviewCtrl($scope, location, $http, $ionicLoading, upload, $cordovaCamera, $cordovaFileTransfer, $ionicPopup) {

        var options = {
                imageQuality: 20
            },
            vm = this;


        $scope.addNewToilet = addNewToilet;
        $scope.toilet = {
            name: null,
            openTime: null,
            closeTime: null,
            rating: null,
            image: null,
            mode: true
        };

        $scope.ratingsObject = {
            iconOn: 'ion-ios-star',
            iconOff: 'ion-ios-star-outline',
            iconOnColor: 'rgb(255, 148, 28)',
            iconOffColor: 'rgb(171, 171, 171)',
            rating: 0,
            minRating: 0,
            callback: function(rating) {
                $scope.toilet.rating = rating;
            }
        };

        /**
         * addNewToilet method add
         */
        function addNewToilet() {
            noImageFound();
            debugger;
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.quality = '30%';
            options.fileName = ($scope.toilet.image) ? $scope.toilet.image.substr($scope.toilet.image.lastIndexOf('/') + 1) : noImageFound();
            options.mimeType = "image/jpeg";
            options.params = validate();

            showLoader();
            options.chunkedMode = false;
            $cordovaFileTransfer.upload('http://www.findatoilet.in/admin/api/addLocation.php', $scope.toilet.image, options)
                .then(function(result) {
                    $ionicLoading.hide();
                    console.log(result);
                    // Success!
                }, function(err) {
                    $ionicLoading.hide();
                    console.log(err);
                    // Error
                }, function(progress) {
                    showLoader();
                    // constant progress updates
                });
        }

        function noImageFound() {
            var myPopup = $ionicPopup.show({
                title: 'Upload camera picture',
                subTitle: 'Verification purpose',
                buttons: [{
                    text: 'Cancel'
                }, {
                    text: '<b>Ok</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        takePicture();
                    }
                }, ]
            });
        }

        /**
         * validate method validates the user entered fields.
         * @return {[type]}          [description]
         */
        function validate() {
            return {
                name: ($scope.toilet.name) ? $scope.toilet.name : getCurrentLocationName(),
                openTime: $scope.toilet.openTime, // Nullable
                closeTime: $scope.toilet.closeTime, // Nullable
                mode: ($scope.toilet.mode) ? 'PAID' : 'FREE',
                rating: ($scope.toilet.rating) ? $scope.toilet.rating : 0,
                address: ($scope.toilet.address) ? $scope.toilet.address : getCurrentLocationName(),
                longitude: location.coordinate.lng(),
                latitude: location.coordinate.lat(),
                dateCreated: new Date()
            };
        }

        /**
         * getCurrentLocation method get current location of the user.
         * Create the marker on user screen.
         * @return {[type]} [description]
         */
        function getCurrentLocation() {
            location.fetchCurrentLocation().then(function(position) {
                $scope.map = {
                    id: parseInt(Math.expm1(Math.random()).toString().slice('2')),
                    zoom: 12,
                    center: {
                        latitude: position.lat(),
                        longitude: position.lng()
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
                        latitude: position.lat(),
                        longitude: position.lng()
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
                $scope.toilet.name = location.getSpecificAddressComponent(response.results, response.status, location.addressComponent.name).longName;
                $scope.toilet.address = location.getSpecificAddressComponent(response.results, response.status, location.addressComponent.address).longName;
            });
        }


        /**
         * showMyLocationOnMap method create the marker based on the current location of the user.
         * 'idle' event for the google map to get initialized and then draw the marker.
         * @return {[type]} [description]
         */
        function showMyLocationOnMap() {
            showLoader();
            location.fetchCurrentLocation().then(function(latLng) {

                var mapOptions = {
                    center: latLng,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                getCurrentLocationName();
                vm.map = new google.maps.Map(document.getElementById('gmap'), mapOptions);

                google.maps.event.addListenerOnce(vm.map, 'idle', function() {

                    var marker = new google.maps.Marker({
                        map: vm.map,
                        animation: google.maps.Animation.DROP,
                        position: latLng
                    });

                    $ionicLoading.hide();
                });

            }, function(error) {
                console.log("Could not get location");
            });
        }

        /**
         * showLoader method displays the loading icon.
         * @return {[type]} [description]
         */
        function showLoader() {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner>',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 1
            });
        }

     // google.maps.event.addDomListener(window, 'load', showMyLocationOnMap);
        showMyLocationOnMap();

    }



})();