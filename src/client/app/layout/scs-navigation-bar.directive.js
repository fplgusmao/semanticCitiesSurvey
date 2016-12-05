(function () {
    'use strict';

    angular
        .module('scsApp.layout')
        .directive('scsNavigationBar', scsNavigationBar);

    scsNavigationBar.$inject = [];

    /* @ngInject */
    function scsNavigationBar() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: NavigationBarController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            replace: true,
            scope: {
                atBottom : '='
            },
            templateUrl : 'app/layout/scs-navigation-bar.html'
        };
        return directive;

        function link(scope, element, attrs, controller) {

        }
    }

    NavigationBarController.$inject = ['userProgressService'];

    /* @ngInject */
    function NavigationBarController(userProgressService) {
        /* jshint validthis:true */
        var loading = false;
        var vm = this;

        vm.goBack = goBack;
        vm.labelForGoBack = 'Back'; //default value
        vm.canGoBack = canGoBack;

        vm.advance = advance;
        vm.labelForAdvance = 'Next'; //default value
        vm.canAdvance = canAdvance;

        activate();

        ////////////////

        function activate() {
            updateLabels();
        }

        /**
         * Navigates to the previous point of progress
         */
        function goBack() {
            if (!canGoBack()) {
                return;
            }

            loading = true;
            vm.labelForGoBack = 'Loading...';
            userProgressService.goBack().
            then(function() {
                loading = false;
                updateLabels();
            });
        }

        /**
         * Tests wether it is possible for the user to navigate to
         * the previous point of progress
         * @returns {boolean} Wether the user can go back
         */
        function canGoBack() {
            return userProgressService.canGoBack() && !loading;
        }

        /**
         * Navigates to the next point of progress
         */
        function advance() {
            if (!canAdvance()) {
                return;
            }

            loading = true;
            vm.labelForAdvance = 'Loading...';
            userProgressService.advance().
            then(function() {
                loading = false;
                updateLabels();
            });
        }

        /**
         * Tests wether it is possible for the user to navigate to
         * the next point of progress
         * @returns {boolean} Wether the user can advance
         */
        function canAdvance() {
            return userProgressService.canAdvance() && !loading;
        }

        //////////////// - Helpers

        /**
         * Updates the labels (text) on the navigation buttons,
         * according to the current phase properties (e.g: "Cancel",
         * instead of "Back")
         */
        function updateLabels() {
            vm.labelForGoBack =
                userProgressService.getActionNameForBack();
            vm.labelForAdvance =
                userProgressService.getActionNameForAdvance();
        }
    }
})();
