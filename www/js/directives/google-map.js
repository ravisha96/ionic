(function() {

    angular
        .module('myToiletApp')
        .directive('googleMap', GoogleMap);


    GoogleMap.$inject = [];

    function GoogleMap() {

        var directive = {
            scope: true,
            restrict: 'A',
            link: init
        };

        return directive;

        function init(scope, element, attr) {
            var self = this,
                map,
                mapOptions;

            scope.location = scope.$eval(attr.location);
            scope.location.marker = scope.location.marker || {};

            createMap.call(scope, element);

            if (scope.location.showCurrentLocation) {
            	drawMyCurrentLocation.call(scope);
                lookForNearestLocation.call(scope);
            }
        }

        /**
         * createMap methods enable google map and display the map in the dom element.
         */
        function createMap(element) {
        	var self = this,
            	map = self.location.map;

            self.myLatLng = new google.maps.LatLng(map.position.latitude, map.position.longitude);

            mapOptions = {
                zoom: map.zoom,
                center: self.myLatLng
            };

            self.map = new google.maps.Map(_.first(angular.element(element)), mapOptions);
        }

        /**
         * drawMyCurrentLocation methods create a marker of the current user location.
         */
        function drawMyCurrentLocation () {
        	var self = this,
        		marker = self.location.marker;

        	self.marker = new google.maps.Marker({
        		position: (marker.position) ? new google.maps.LatLng(marker.position.latitude, marker.position.longitude)  : self.myLatLng,
        		map: self.map,
        		title: marker.title,
        	}) 
        }

        function lookForNearestLocation () {
            var self = this;

           console.log(self.markers);
        }


        function callback(results, status) {
            console.log(results);
            debugger;
        }




    }

})();