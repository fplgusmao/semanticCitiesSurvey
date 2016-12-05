(function() {
    'use strict';

    angular
        .module('scsApp.layout')
        .controller('ShellController', ShellController);

    ShellController.$inject = ['$scope', 'userProgressService'];

    /* @ngInject */
    function ShellController($scope, userProgressService) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            userProgressService.loadInitialPhase();
        }
    }
})();
