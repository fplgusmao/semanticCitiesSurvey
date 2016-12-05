/* jshint -W079 */
var mockData = (function() {
    return {
        getMockPhases : getMockPhases,
        getMockQuestionnairePhaseData: getMockQuestionnairePhaseData,
        getMockAnswer : getMockAnswer,
        getMockStates : getMockStates,
        getMockMapView : getMockMapView,
        getMockMapInteractionPhases : getMockMapInteractionPhases,
        getMockLatLngs : getMockLatLngs
    };

    function getMockStates() {
        return [
            {
                state: 'dashboard',
                config: {
                    url: '/',
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }
        ];
    }

    function getMockPhases() {
        return [
            {//phase 0
                type : 'questionnaire',
                questions : [
                    { //question 0
                        questionBody : 'q0 ph0',
                        answer : {
                            typeOfAnswer : 'choose-one',
                            answerOptions : [
                                {optionBody : 'o0', effect : [1]},
                                {optionBody : 'o1', effect : [1, 2]},
                                {optionBody : 'o2', effect : [1, 2, 3]}
                            ]
                        }
                    }
                ]
            },
            {//phase 1
                type : 'questionnaire',
                questions : [
                    { //question 0
                        questionBody : 'q0 ph1',
                        answer : {
                            typeOfAnswer : 'choose-one',
                            answerOptions : [
                                {optionBody : 'o0', effect : [2]},
                                {optionBody : 'o1'},
                                {optionBody : 'o2', effect : [2]}
                            ]
                        }
                    },
                    { //question 1
                        questionBody : 'q1 ph1',
                        answer : {
                            typeOfAnswer : 'choose-one',
                            answerOptions : [
                                {optionBody : 'o0', effect : [3]},
                                {optionBody : 'o1'},
                                {optionBody : 'o2'}
                            ]
                        }
                    }
                ]
            },
            {//phase 2
                type : 'questionnaire',
                questions : [
                    { //question 0
                        questionBody : 'q0 ph2',
                        answer : {
                            typeOfAnswer : 'choose-one',
                            answerOptions : [
                                {optionBody : 'o0'},
                                {optionBody : 'o1'},
                                {optionBody : 'o2'}
                            ]
                        }
                    }
                ]
            },
            {//phase 3
                type : 'questionnaire',
                questions : [
                    { //question 0
                        questionBody : 'q0 ph3',
                        answer : {
                            typeOfAnswer : 'choose-one',
                            answerOptions : [
                                {optionBody : 'o0'},
                                {optionBody : 'o1'},
                                {optionBody : 'o2'}
                            ]
                        }
                    }
                ]
            }
        ];
    }

    function getMockQuestions() {
        var chooseMultipleEx = {
            questionBody : 'Example of multiple choice question',
            answer : {
                typeOfAnswer : 'choose-multiple',
                answerOptions : [
                    {optionBody : 'Option no. 0'},
                    {optionBody : 'Option no. 1'},
                    {optionBody : 'Option no. 2'},
                ]
            }
        };

        var chooseOneEx = {
            questionBody : 'Example of one choice question',
            answer : {
                typeOfAnswer : 'choose-one',
                answerOptions : [
                    {optionBody : 'Option no. 0'},
                    {optionBody : 'Option no. 1'},
                    {optionBody : 'Option no. 2'},
                ]
            }};

        var monthInputEx = {
            questionBody : 'Example of month input',
            answer : {
                typeOfAnswer : 'month-input'
            }
        };

        var numberInputEx = {
            questionBody : 'Example of number input',
            answer : {
                typeOfAnswer : 'number-input',
                minValue : 13,
                maxValue : 100,
                initValue : 18,
                supportText : 'years old'
            }
        };

        var selectDropdownEx = {
            questionBody : 'Example of select from dropdown',
            answer : {
                typeOfAnswer : 'select-dropdown',
                answerPrompt : 'Choose a country',
                selectOptions : [
                    {optionBody : 'USA'},
                    {optionBody : 'Portugal'},
                    {optionBody : 'UK'}
                ]
            }
        };

        var timeInputEx = {
            questionBody : 'Example of time input',
            answer : {
                typeOfAnswer : 'time-input',
                minValue : 1,
                maxValue : 100,
                initValue : 1
            }
        };

        return {
            chooseMultiple : chooseMultipleEx,
            chooseOne : chooseOneEx,
            monthInput : monthInputEx,
            numberInput : numberInputEx,
            selectDropdown : selectDropdownEx,
            timeInput : timeInputEx
        };
    }

    function getMockQuestionnairePhaseData() {
        return {
            type : 'questionnaire',
            questions : [
                {
                    questionBody : 'Question 1',
                    answer : {
                        typeOfAnswer : 'choose-one',
                        answerOptions : [
                            {optionBody : 'Answer no. 1', effect : [1, 2, 3]},
                            {optionBody : 'Answer no. 2', effect : [2, 3, 4]},
                            {optionBody : 'Answer no. 3', effect : [3, 4, 5]},
                        ]
                    }
                },
                {
                    questionBody : 'Question 2',
                    answer : {
                        typeOfAnswer : 'choose-one',
                        answerOptions : [
                            {optionBody : 'Answer no. 1', effect : [1, 2, 3]},
                            {optionBody : 'Answer no. 2', effect : [2, 3, 4]},
                            {optionBody : 'Answer no. 3', effect : [3, 4, 5]},
                        ]
                    }
                },
                {
                    questionBody : 'Question 3',
                    answer : {
                        typeOfAnswer : 'choose-multiple',
                        answerOptions : [
                            {optionBody : 'Answer no. 1'},
                            {optionBody : 'Answer no. 2'},
                            {optionBody : 'Answer no. 3'},
                        ]
                    }
                },
                {
                    questionBody : 'Question 4',
                    answer : {
                        typeOfAnswer : 'select-dropdown',
                        answerPrompt : 'Select a country',
                        answerOptions : [
                            {optionBody : 'Answer no. 1'},
                            {optionBody : 'Answer no. 2'},
                            {optionBody : 'Answer no. 3'},
                        ]
                    }
                }
            ]
        };
    }

    function getMockAnswer() {
        return {
            index : 1,
            body : 'mock'
        };
    }

    function getMockMapInteractionPhaseData() {
        return {
            type : 'mapInteraction',
            interactions : [
                {interactionType : 'mark-place', instructions : 'Just do it'},
                {interactionType : 'mark-places', instructions : 'Just do it, too'}
            ]
        };
    }

    function getMockMapView(n) {
        var mockMap = [
            {
                view : {
                    center : [38.745247, -9.162425],
                    zoomLevel : 13,
                    bounds : {
                        northEast : [38.825922, -9.316042],
                        southWest : [38.658712, -9.045160]
                    }
                },
                tiles : {
                    tilesUrl : 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png',
                    tilesAttribution : 'Map data &copy; <a href="http:' +
                    '//openstreetmap.org">OpenStreetMap</a> contributo' +
                    'rs, <ahref="http://creativecommons.org/licenses/b' +
                    'y-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http:' +
                    '//mapbox.com">Mapbox</a>',
                    id : 'examples.map-i875mjb7'
                },
                zoom : {
                    maxZoom : 16,
                    minZoom : 12
                }
            }, {
                view : {
                    center : [39.745247, -8.162425],
                    zoomLevel : 12,
                    bounds : {
                        northEast : [30.825922, -7.316042],
                        southWest : [30.658712, -7.045160]
                    }
                },
                tiles : {
                    tilesUrl : 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png',
                    tilesAttribution : 'Map data &copy; <a href="http:' +
                    '//openstreetmap.org">OpenStreetMap</a> contributo' +
                    'rs, <ahref="http://creativecommons.org/licenses/b' +
                    'y-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http:' +
                    '//mapbox.com">Mapbox</a>',
                    id : 'examples.map-i875mjb7'
                },
                zoom : {
                    maxZoom : 15,
                    minZoom : 11
                }
            }];

        return ((n && n < mockMap.length) ? mockMap[n] : mockMap[0]);
    }

    function getMockLatLngs() {
        return [38.745247, -9.162425];
    }

    function getMockMapInteractionPhases(n) {
        var phases = [
            {//0, point-a-place
                type : 'point-a-place',
                title : 'Mock Map',
                description : 'This is a mock phase',
                instructions : 'If you do nothing, nothing can go wrong',
                mapView : {
                    view : {
                        center : [38.745247, -9.162425],
                        zoomLevel : 13,
                        bounds : {
                            northEast : [38.825922, -9.316042],
                            southWest : [38.658712, -9.045160]
                        }
                    },
                    tiles : {
                        tilesUrl : 'http://{s}.tiles.mapbox.com/v3/' +
                        '{id}/{z}/{x}/{y}.png',
                        tilesAttribution : 'Map data &copy; <a href="http:' +
                        '//openstreetmap.org">OpenStreetMap</a> contributo' +
                        'rs, <ahref="http://creativecommons.org/licenses/b' +
                        'y-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http:' +
                        '//mapbox.com">Mapbox</a>',
                        id : 'examples.map-i875mjb7'
                    },
                    zoom : {
                        maxZoom : 16,
                        minZoom : 12
                    }
                },
                markerRadius : 150,
                markerDetails : {
                    color : '#0F496B',
                    fillColor : '#347296',
                    fillOpacity : 0.75
                }
            },
            {//1, point-multiple-places
                type : 'point-multiple-places',
                title : 'Mock Map',
                description : 'This is a mock phase',
                instructions : 'If you do nothing, nothing can go wrong',
                mapView : {
                    view : {
                        center : [38.745247, -9.162425],
                        zoomLevel : 13,
                        bounds : {
                            northEast : [38.825922, -9.316042],
                            southWest : [38.658712, -9.045160]
                        }
                    },
                    tiles : {
                        tilesUrl : 'http://{s}.tiles.mapbox.com/v3/' +
                        '{id}/{z}/{x}/{y}.png',
                        tilesAttribution : 'Map data &copy; <a href="http:' +
                        '//openstreetmap.org">OpenStreetMap</a> contributo' +
                        'rs, <ahref="http://creativecommons.org/licenses/b' +
                        'y-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http:' +
                        '//mapbox.com">Mapbox</a>',
                        id : 'examples.map-i875mjb7'
                    },
                    zoom : {
                        maxZoom : 16,
                        minZoom : 12
                    }
                },
                markerRadius : 150,
                markerDetails : {
                    color : '#0F496B',
                    fillColor : '#347296',
                    fillOpacity : 0.75
                }
            },
            {//2, draw-area
                type : 'draw-area',
                title : 'Draw Area',
                description : 'This is a mock phase',
                instructions : 'If you do nothing, nothing can go wrong',
                mapView : {
                    view : {
                        center : [38.745247, -9.162425],
                        zoomLevel : 13,
                        bounds : {
                            northEast : [38.825922, -9.316042],
                            southWest : [38.658712, -9.045160]
                        }
                    },
                    tiles : {
                        tilesUrl : 'http://{s}.tiles.mapbox.com/v3/' +
                        '{id}/{z}/{x}/{y}.png',
                        tilesAttribution : 'Map data &copy; <a href="http:' +
                        '//openstreetmap.org">OpenStreetMap</a> contributo' +
                        'rs, <ahref="http://creativecommons.org/licenses/b' +
                        'y-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http:' +
                        '//mapbox.com">Mapbox</a>',
                        id : 'examples.map-i875mjb7'
                    },
                    zoom : {
                        maxZoom : 16,
                        minZoom : 12
                    }
                }
            },
            {//3, draw-multiple-areas
                type : 'draw-multiple-areas',
                title : 'Draw Many Areas',
                description : 'This is a mock phase',
                instructions : 'If you do nothing, nothing can go wrong',
                mapView : {
                    view : {
                        center : [38.745247, -9.162425],
                        zoomLevel : 13,
                        bounds : {
                            northEast : [38.825922, -9.316042],
                            southWest : [38.658712, -9.045160]
                        }
                    },
                    tiles : {
                        tilesUrl : 'http://{s}.tiles.mapbox.com/v3/' +
                        '{id}/{z}/{x}/{y}.png',
                        tilesAttribution : 'Map data &copy; <a href="http:' +
                        '//openstreetmap.org">OpenStreetMap</a> contributo' +
                        'rs, <ahref="http://creativecommons.org/licenses/b' +
                        'y-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http:' +
                        '//mapbox.com">Mapbox</a>',
                        id : 'examples.map-i875mjb7'
                    },
                    zoom : {
                        maxZoom : 16,
                        minZoom : 12
                    }
                },
                subPhases : [
                    {
                        name : 'test 1',
                        areaNumber : 4
                    }, {
                        name : 'test 2',
                        areaNumber : 5
                    }
                ]
            },
            {//sub-phase draw-area
                type : 'draw-area',
                title : 'Draw Area',
                description : 'This is a mock phase',
                instructions : 'If you do nothing, nothing can go wrong',
                mapView : {
                    view : {
                        center : [38.745247, -9.162425],
                        zoomLevel : 13,
                        bounds : {
                            northEast : [38.825922, -9.316042],
                            southWest : [38.658712, -9.045160]
                        }
                    },
                    tiles : {
                        tilesUrl : 'http://{s}.tiles.mapbox.com/v3/' +
                        '{id}/{z}/{x}/{y}.png',
                        tilesAttribution : 'Map data &copy; <a href="http:' +
                        '//openstreetmap.org">OpenStreetMap</a> contributo' +
                        'rs, <ahref="http://creativecommons.org/licenses/b' +
                        'y-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http:' +
                        '//mapbox.com">Mapbox</a>',
                        id : 'examples.map-i875mjb7'
                    },
                    zoom : {
                        maxZoom : 16,
                        minZoom : 12
                    }
                }
            },
            {//sub-phase draw-area
                type : 'draw-area',
                title : 'Draw Area',
                description : 'This is a mock phase',
                instructions : 'If you do nothing, nothing can go wrong',
                mapView : {
                    view : {
                        center : [38.745247, -9.162425],
                        zoomLevel : 13,
                        bounds : {
                            northEast : [38.825922, -9.316042],
                            southWest : [38.658712, -9.045160]
                        }
                    },
                    tiles : {
                        tilesUrl : 'http://{s}.tiles.mapbox.com/v3/' +
                        '{id}/{z}/{x}/{y}.png',
                        tilesAttribution : 'Map data &copy; <a href="http:' +
                        '//openstreetmap.org">OpenStreetMap</a> contributo' +
                        'rs, <ahref="http://creativecommons.org/licenses/b' +
                        'y-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http:' +
                        '//mapbox.com">Mapbox</a>',
                        id : 'examples.map-i875mjb7'
                    },
                    zoom : {
                        maxZoom : 16,
                        minZoom : 12
                    }
                }
            },
        ];

        return phases[n];
    }
})();
