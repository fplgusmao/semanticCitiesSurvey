(function () {
    'use strict';

    angular
        .module('scsApp.mapInteractions')
        .run(drawMultipleAreasRun);

    drawMultipleAreasRun.$inject = ['routerHelper'];

    /* @ngInject */
    function drawMultipleAreasRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state : 'draw-multiple-areas',
                config : {
                    url : '/step{phaseId:int}/draw-multiple-areas',
                    templateUrl : 'app/map-interactions/' +
                                  'draw-multiple-areas/' +
                                  'draw-multiple-areas.html',
                    controller : 'DrawMultipleAreasController',
                    controllerAs : 'vm',
                    title : 'Select area to draw'
                }
            }
        ];
    }
})();
