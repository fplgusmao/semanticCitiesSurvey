(function() {
    'use strict';

    angular
        .module('scsApp.questionnaire')
        .controller('QuestionnaireController', QuestionnaireController);

    QuestionnaireController.$inject = ['userProgressService', '$scope'];

    /* @ngInject */
    function QuestionnaireController(userProgressService, $scope) {
        /* jshint validthis: true */
        var vm = this;

        vm.questions = [];
        vm.answers = [];
        vm.registerNewAnswer = registerNewAnswer;

        activate();

        ////////////////

        function activate() {
            userProgressService.getCurrentPhaseData().
            then(function(data) {
                vm.questions = data.questions;
            });

            var pastInput = userProgressService.getExistingUserInput();
            if (typeof(pastInput) !== 'undefined' &&
                !angular.equals({}, pastInput) &&
                typeof(pastInput.answers) !== 'undefined') {
                vm.answers = pastInput.answers;
            }
        }

        /**
         * @name registerNewAnswer
         * @desc Registers the given answer and applies, if any, the
         * answer's effect
         * @param {number} numberOfQuestion Index of the
         * question answered.
         * @param {Object} answer Answer to the given question
         * @returns {void}
         */
        function registerNewAnswer(numberOfQuestion, answer) {
            vm.answers[numberOfQuestion] = answer;
            userProgressService.saveUserInput({
                answers : vm.answers
            });

            userProgressService.validateCurrentPhase();

            if (answerHasEffect(vm.questions[numberOfQuestion],
                                answer.index)) {
                applyAnswerEffect(numberOfQuestion, answer.index);
            }
        }

        /**
         * @name answerHasEffect
         * @desc Checks if an answer to a given question has any
         * effect on the coming survey phases.
         * @param {Object} question Object of the question answered
         * @param {Object} chosenAnswerIndex Index of the answer
         * chosen by the user
         * @returns {boolean} Whether or not the answer has any effect
         */
        function answerHasEffect(question, chosenAnswerIndex) {
            if (question.answer.typeOfAnswer === 'choose-one') {
                //^^ only these type of answers have effect
                if (question.answer.answerOptions &&
                    question.answer.answerOptions[chosenAnswerIndex]
                    .effect) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Evaluates the validity of the questionnaire,
         * including if all the questions have been answered.
         * @returns {Boolean} Returns wether all the locally
         *                    registered answers make the
         *                    questionnaire valid or not
         */
        function areAllAnswersValid() {
            if (vm.answers.length !== vm.questions.length) {
                return false;
            }

            for (var i = 0; i < vm.answers.length; ++i) {
                if (!isAnswerValid(vm.answers[i])) {
                    return false;
                }
            }

            return true;
        }

        /**
         * Evaluates the validity of an answer
         * @param   {Object}  answer User's answer to some question
         * @returns {Boolean} Returns if the answer is value or not
         */
        function isAnswerValid(answer) {
            if (typeof(answer) === 'undefined' ||
                angular.equals({}, answer)) {
                return false;
            }

            return true;

            //  Idea: each type of answer should know how to
            //  check its own validity and report it to this
            //  controller
        }

        //////////////

        function applyAnswerEffect(questionNumber, chosenOptionNumber) {
            var q = vm.questions[questionNumber];
            var a = q.answer.answerOptions[chosenOptionNumber];

            if (a.effect) {
                userProgressService.changeSurveyPath(a.effect);
            }
        }
    }
})();
