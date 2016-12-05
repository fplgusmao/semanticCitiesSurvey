(function () {
    'use strict';

    angular
        .module('scsApp.mapInteractions')
        .directive('scsMapSidebar', scsMapSidebar);

    scsMapSidebar.$inject = [];

    /* @ngInject */
    function scsMapSidebar() {
        var directive = {
            bindToController: true,
            controller: MapSidebarController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            transclude : true,
            replace : true,
            scope: {
                title : '=',
                description : '=',
                instructions : '='
            },
            templateUrl : 'app/map-interactions/layout/' +
            'scs-map-sidebar.html'
        };
        return directive;

        function link(scope, element, attrs, controller) {
        }
    }

    MapSidebarController.$inject = [];

    /* @ngInject */
    function MapSidebarController() {
    }
})();
