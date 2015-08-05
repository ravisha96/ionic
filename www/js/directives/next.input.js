(function () {

	angular
        .module('myToiletApp')
        .directive('nextInput', NextInput);


    NextInput.$inject = ['$timeout'];

    function NextInput ($timeout) {

    	var directive  = {
    		restrict: 'A',
	        scope: {
	             'returnClose': '=',
	             'onReturn': '&'
	        },
	        link: link 
    	}

    	return directive;


    	function link (scope, element, attr) {
    		element.bind('keydown', function(e){
                if(e.which == 13){
                    if(scope.returnClose){
                        element[0].blur();
                    }
                    if(scope.onReturn){
                        cordova.plugins.Keyboard.close();
                        scope.$emit('searchClicked');
                        $timeout(function(){
                            scope.onReturn();
                        });                        
                    }
                } 
            }); 
    	}

    }


})();