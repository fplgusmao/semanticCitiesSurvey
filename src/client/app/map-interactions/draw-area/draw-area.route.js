(function () {
    'use strict';

    angular
        .module('scsApp.mapInteractions')
        .run(drawAreaRun);

    drawAreaRun.$inject = ['routerHelper'];

    /* @ngInject */
    function drawAreaRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state : 'draw-area',
                config : {
                    url : '/step{phaseId:int}/draw-area',
                    templateUrl : 'app/' +
                    'map-interactions/draw-area/draw-area.html',
                    controller : 'DrawAreaController',
                    controllerAs : 'vm',
                    title : 'Draw on map'
                }
            }
        ];
    }
})();
