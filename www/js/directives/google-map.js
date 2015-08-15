(function() {

    angular
        .module('myToiletApp')
        .directive('gmap', GoogleMap);


    GoogleMap.$inject = [];

    function GoogleMap() {

        var directive = {
            scope: true,
            restrict: 'A',
            link: Link
        };

        return directive;



        function Link(scope, element, attr) {
            var self = this;

            self.scope = scope;
            self.element = element;
            self.attr = attr;
            self.gmap = scope.$eval(attr.options);

            drawMap();
        }

        function drawMap() {

            var options = {
                timeout: 10000,
                enableHighAccuracy: true
            };

            $cordovaGeolocation.getCurrentPosition(options).then(function(position) {

                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                var mapOptions = {
                    center: latLng,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

            }, function(error) {
                console.log("Could not get location");
            });

        };

    }

})();