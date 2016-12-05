(function () {
    'use strict';

    angular
        .module('scsApp.mapInteractions')
        .directive('scsMap', scsMap);

    scsMap.$inject = ['mapService'];

    /* @ngInject */
    function scsMap(mapService) {
        // Instatiates a leaflet map.
        // Usage:
        //  <scs-map></scs-map>
        // Creates:
        //  <div id="map"></div>
        var directive = {
            bindToController: true,
            controller: MapController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            replace: true,
            template: '<div id="map"></div>',
            scope: {}
        };
        return directive;

        function link(scope, element, attrs, controller) {
            var mapHtmlElement = element[0];
            mapService.setMapTemplateElement(mapHtmlElement);
        }
    }

    MapController.$inject = [];

    /* @ngInject */
    function MapController() {
    }
})();
