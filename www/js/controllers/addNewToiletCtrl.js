(function() {

    angular
        .module('myToiletApp')
        .controller('AddNewToiletCtrl', AddNewToiletCtrl);


    AddNewToiletCtrl.$inject = ['$scope', 'LocationFactory', '$http', '$ionicLoading', 'Upload', '$cordovaCamera', '$cordovaFileTransfer'];


    function AddNewToiletCtrl($scope, location, $http, $ionicLoading, upload, $cordovaCamera, $cordovaFileTransfer) {

        var options = {
                imageQuality: 20
            },
            vm = this;


        $scope.addNewToilet = addNewToilet;
        $scope.takePicture = takePicture;
        $scope.toilet = {
            name: null,
            openTime: null,
            closeTime: null,
            rating: null,
            image: null,
            mode: 'FREE'
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

        function addNewToilet() {
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.quality = '30%';
            options.fileName = $scope.toilet.image.substr($scope.toilet.image.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            var params = new Object();
            options.params = {
                name: $scope.toilet.name,
                openTime: $scope.toilet.openTime,
                closeTime: $scope.toilet.closeTime,
                mode: $scope.toilet.mode,
                image: options.fileName,
                address: $scope.toilet.address,
                longitude: location.coordinate.lng(),
                latitude: location.coordinate.lat(),
                mode: $scope.toilet.mode,
                dateCreated: new Date()
            };
            options.chunkedMode = false;
            $cordovaFileTransfer.upload('http://www.findatoilet.in/admin/api/addLocation.php', $scope.toilet.image, options)
                .then(function(result) {
                    console.log(result);
                    // Success!
                }, function(err) {
                    console.log(err);
                    // Error
                }, function(progress) {
                    // constant progress updates
                });


            // $http.post('http://www.findatoilet.in/admin/api/addLocation.php', {
            //     name: $scope.toilet.name,
            //     openTime: $scope.toilet.openTime,
            //     closeTime: $scope.toilet.closeTime,
            //     mode: $scope.toilet.mode,
            //     image: $scope.toilet.image,
            //     address: $scope.toilet.address,
            //     longitude: location.coordinate.lng(),
            //     latitude: location.coordinate.lat(),
            //     mode: $scope.toilet.mode,
            //     dateCreated: new Date()
            // }).success(function(response) {
            //     console.log(response);
            // });
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

        function takePicture() {
            $cordovaCamera.getPicture({
                quality: options.imageQuality,
                destinationType: Camera.DestinationType.FILE_URL,
                sourceType: Camera.PictureSourceType.CAMERA
            }).then(function(imageData) {
                $scope.toilet.image = imageData;
                $scope.ftLoad = true;
            }, function(error) {
                console.log(error);
            });
        };

        google.maps.event.addDomListener(window, 'load', showMyLocationOnMap);
        showMyLocationOnMap();

    }



})();