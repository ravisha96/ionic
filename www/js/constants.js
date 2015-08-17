(function() {

    angular
        .module('myToiletApp')
        .constant('Constants', {
            MODE: {
                FREE: 'FREE',
                PAID: 'PAID',
                GAS_STAION: 'GAS',
                MALLS: 'SHOPPING'
            },
            VIEW: {
                MAP: 'maps',
                LIST: 'list'
            }
        });

})();