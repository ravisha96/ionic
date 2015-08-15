(function() {

    angular
        .module('myToiletApp')
        .factory('OverlayViewFactory', Location);


    Location.$inject = ['$http', '$q', '$cordovaGeolocation'];

    function OverlayView() {
        this.container = $('<div class="map-info-window"></div>');
        this.layer = null;
        this.marker = null;
        this.position = null;
    }

    OverlayView.prototype = Object.create(new google.maps.OverlayView());


    OverlayView.prototype.onAdd = function() {
        this.layer = $(this.getPanes().floatPane);
        this.layer.append(this.container);
        this.container.find('.map-info-close').on('click', _.bind(function() {
            // Close info window on click
            this.close();
        }, this));
    };


    OverlayView.prototype.draw = function() {
        var markerIcon = this.marker.getIcon(),
            cHeight = this.container.outerHeight() + markerIcon.scaledSize.height + 10,
            cWidth = this.container.width() / 2 + markerIcon.scaledSize.width / 2;
        this.position = this.getProjection().fromLatLngToDivPixel(this.marker.getPosition());
        this.container.css({
            'top': this.position.y - cHeight,
            'left': this.position.x - cWidth
        });
    };

    OverlayView.prototype.onRemove = function() {
        this.container.remove();
    };

    OverlayView.prototype.setContent = function(html) {
        this.container.html(html);
    };

    OverlayView.prototype.open = function(map, marker){
        this.marker = marker;
        this.setMap(map);
    };

    OverlayView.prototype.close = function(){
        this.setMap(null);
    };

})();