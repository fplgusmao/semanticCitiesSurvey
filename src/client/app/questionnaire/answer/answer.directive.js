(function () {
    'use strict';

    angular
        .module('scsApp.questionnaire')
        .directive('scsAnswer', scsAnswer);

    scsAnswer.$inject = [];

    /* @ngInject */
    function scsAnswer() {
        // Displays the answer's content according to its type
        // Usage:
        //  <scs-answer
        //       question-number:"number"
        //       question:"object"
        //       register-answer:"function">
        //  </scs-answer>
        // Creates: a different template depending on the type of
        // answer associated with the specified question
        var directive = {
            bindToController: true,
            controller: AnswerController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            scope: {
                questionNumber : '=',
                question : '=',
                savedAnswer: '=',
                registerAnswer : '&'
            },
            template : '<ng-include src="getTemplateUrl()">'
            //^^ hack to dynamically load a template
        };
        return directive;

        function link(scope, element, attrs, controller) {
            scope.getTemplateUrl = getTemplateUrl;

            /**
             * @name getTemplateUrl
             * @desc Returns the Url to the correct template,
             * depending on the type of answer for the current
             * question.
             * @returns {String} Url to the answer's template
             */
            function getTemplateUrl() {
                return 'app/questionnaire/' +
                    'answer/answer-templates/' +
                    scope.vm.question.answer.typeOfAnswer +
                    '-answer-type.html';
            }
        }
    }

    AnswerController.$inject = [];

    /* @ngInject */
    function AnswerController() {
        var vm = this;

        vm.answerQuestion = answerQuestion;
        if (typeof(savedAnswer) === 'undefined') {
            vm.userAnswer = {};
        } else {
            vm.userAnswer = vm.savedAnswer;
        }

        ////////////////

        /**
         * @name answerQuestion
         * @desc Registers the locally saved answer as the answer to
         * the current question.
         * @returns {void}
         */
        function answerQuestion() {
            vm.registerAnswer()(
                vm.questionNumber,
                vm.userAnswer
            );
        }
    }
})();
