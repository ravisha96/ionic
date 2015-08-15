(function() {
    /**
     * MyToiletApp Module
     *
     * Description
     */
    angular
        .module('myToiletApp')
        .controller('LocationMapViewCtrl', LocationMapView);

    LocationMapView.$inject = ['$scope', 'LocationFactory', '$q', '$cordovaGeolocation', '$ionicLoading'];

    function LocationMapView($scope, location, $q, $cordovaGeolocation, $ionicLoading) {

        var vm = this;

        /**
         * showMyLocationOnMap method create the marker based on the current location of the user.
         * 'idle' event for the google map to get initialized and then draw the marker.
         * @return {[type]} [description]
         */
        function showMyLocationOnMap() {
            $scope.showLoader();
            location.fetchCurrentLocation().then(function(latLng) {

                var mapOptions = {
                    center: latLng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                vm.map = new google.maps.Map(document.getElementById("gmap"), mapOptions);

                google.maps.event.addListenerOnce(vm.map, 'idle', function() {

                    var marker = new google.maps.Marker({
                        map: vm.map,
                        animation: google.maps.Animation.DROP,
                        position: latLng
                    });

                    showNearByToilets({
                        curLocation: marker
                    });
                });

            }, function(error) {
                console.log("Could not get location");
            });
        }

        /**
         * showNearByToilets method create the markers of the nearest toilet.
         * It positions/center/zoom the marker, by using google map LatLngBounds.
         * @return {[type]} [description]
         */
        function showNearByToilets(user) {
            var infoWindow, bounds = new google.maps.LatLngBounds(),
                marker;

            location.reverseGeoCoding(location.addressComponent.locality1).then(function(response) {

                location.getAllLocations("hauz khas").then(function(response) {

                    // Curernt location of the user. We don't want to attach the click event,
                    // hence its outside and response.data array item.
                    bounds.extend(user.curLocation.position);

                    _.forEach(response.data, function(response) {
                        marker = new google.maps.Marker(_.extend(response, {
                            position: new google.maps.LatLng(response.position.latitude, response.position.longitude),
                            map: vm.map,
                            title: response.name,
                            id: response.id
                        }));

                        // Extending the bounds area with each latlng.
                        bounds.extend(marker.position);

                        (function(marker, data) {
                            google.maps.event.addListener(marker, 'click', function(e) {
                                //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
                                if (!infoWindow) {
                                    infoWindow = new google.maps.InfoWindow();
                                }

                                google.maps.event.addListener(infoWindow, 'domready', stylingInfoWindow);

                                infoWindow.setContent(templateInfoWindow({
                                    content: data
                                }));
                                infoWindow.open(vm.map, marker);
                            });
                        })(marker, response.name);

                    });

                    vm.map.fitBounds(bounds);
                    $ionicLoading.hide();
                });
            });
        }


        /**
         * stylingInfoWindow method stylize the info-window.
         * @return {[type]} [description]
         */
        function stylingInfoWindow() {
            // Reference to the DIV which receives the contents of the infowindow using jQuery
            var iwOuter = $('.gm-style-iw');

            $('.gm-style-iw div').first().css('max-width', '260px')

            /* The DIV we want to change is above the .gm-style-iw DIV.
             * So, we use jQuery and create a iwBackground variable,
             * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
             */
            var iwBackground = iwOuter.prev();

            iwBackground.css({
                'top': '7px'
            })

            // Remove the background shadow DIV
            iwBackground.children(':nth-child(2)').css({
                'display': 'none'
            });

            // Remove the white background DIV
            iwBackground.children(':nth-child(4)').css({
                'display': 'none'
            });

            // Moves the shadow of the arrow 76px to the left margin 
            iwBackground.children(':first-child').css({
                'left': '76px',
                'display': 'none'
            });

            // Moves the arrow 76px to the left margin 
            iwBackground.children(':nth-child(3)').attr('style', function(i, s) {
                return s + 'left: 76px !important;'
            }).addClass('iw-arrow');

            // Changes the desired color for the tail outline.
            // The outline of the tail is composed of two descendants of div which contains the tail.
            // The .find('div').children() method refers to all the div which are direct descendants of the previous div. 
            iwBackground.children(':nth-child(3)').find('div').children().css({
                'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px',
                'z-index': '1'
            });


            // Taking advantage of the already established reference to
            // div .gm-style-iw with iwOuter variable.
            // You must set a new variable iwCloseBtn.
            // Using the .next() method of JQuery you reference the following div to .gm-style-iw.
            // Is this div that groups the close button elements.
            var iwCloseBtn = iwOuter.next();

            // Apply the desired effect to the close button
            iwCloseBtn.addClass('iw-close-btn');

            // The API automatically applies 0.7 opacity to the button after the mouseout event.
            // This function reverses this event to the desired value.
            iwCloseBtn.mouseout(function() {
                $(this).css({
                    opacity: '1'
                });
            });
        }


        /**
         * templateInfoWindow template for info-window
         * @param  {object} windows data to be displayed in info-window
         * @return {[type]}         [description]
         */
        function templateInfoWindow(windows) {
            return '<div id="iw-container">' +
                '<div class="iw-title"><div class="location-name ellipsis">' + windows.content + '</div> &nbsp; <i class="redirect-to-gmap ion-ios-location"></i></div>' +
                // '<div class="iw-content">' +
                // '<div class="iw-subTitle">History</div>' +
                // '<img src="images/vistalegre.jpg" alt="Porcelain Factory of Vista Alegre" height="115" width="83">' +
                // '<p>Founded in 1824, the Porcelain Factory of Vista Alegre was the first industrial unit dedicated to porcelain production in Portugal. For the foundation and success of this risky industrial development was crucial the spirit of persistence of its founder, José Ferreira Pinto Basto. Leading figure in Portuguese society of the nineteenth century farm owner, daring dealer, wisely incorporated the liberal ideas of the century, having become "the first example of free enterprise" in Portugal.</p>' +
                // '<div class="iw-subTitle">Contacts</div>' +
                // '<p>VISTA ALEGRE ATLANTIS, SA<br>3830-292 Ílhavo - Portugal<br>' +
                // '<br>Phone. +351 234 320 600<br>e-mail: geral@vaa.pt<br>www: www.myvistaalegre.com</p>' +
                // '</div>' +
                // '<div class="iw-bottom-gradient"></div>' +
                '</div>';
        }

        // google.maps.event.addDomListener(window, 'load', showMyLocationOnMap);
        showMyLocationOnMap();
        $scope.showLoader();

    }


})()