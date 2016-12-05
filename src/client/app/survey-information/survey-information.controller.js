(function() {
    'use strict';

    angular
        .module('scsApp.surveyInformation')
        .controller('SurveyInformationController', SurveyInformationController);

    SurveyInformationController.$inject = ['userProgressService'];

    /* @ngInject */
    function SurveyInformationController(userProgressService) {
        var vm = this;
        vm.displayNavigation = false;

        vm.canFollowUp = false;
        vm.followUp = {};
        vm.saveFollowUp = saveFollowUp;
        vm.followUpIsSaved = false;
        vm.saveFollowUpLabel = 'Save';

        activate();

        ////////////////

        function activate() {
            userProgressService.getCurrentPhaseData().
            then(function(data) {
                vm.title = data.title;
                vm.description = data.description;

                vm.canFollowUp =
                    typeof(data.followup) !== 'undefined' ? true : false;

                if (vm.canFollowUp) {
                    vm.emailPrompt = data.followup.email;
                    vm.socialPrompt = data.followup.social;
                }

                if (data.nextSteps) {
                    vm.nextSteps = data.nextSteps;
                    userProgressService.changeSurveyPath(vm.nextSteps);

                    vm.displayNavigation = vm.nextSteps &&
                        (vm.nextSteps.length > 0);
                }
                userProgressService.validateCurrentPhase();
            });
        }

        function saveFollowUp() {
            vm.followUpIsSaved = true;
            vm.saveFollowUpLabel = 'Saved!';
            userProgressService.saveUserInput(vm.followUp);
            userProgressService.submitUserInput();
        }
    }
})();
