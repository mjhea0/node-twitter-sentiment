/*global ko, $ */

function ViewModel() {
    'use strict';
	
    var self = this;
    // constants
    self.RESULTS_START_HTML = 'and the winner is ... <strong>';
    self.RESULTS_END_HTML = '</strong> ... with a score of ';

	self.choices = [];
    self.errors = {
        'sameInputError': 'Both choices are the same. Try again.',
        'requiredInputsError': 'You must enter a value for both choices.',
        'unknownError': 'An unknown error occurred.'
    };

    // on screen text
    self.error = ko.observable('');
    self.results = ko.observable('');

    // visual control
    self.isProcessing = ko.observable(false);
    self.hasResults = ko.observable(false);

    // utility
    self.getError = function (key) {
        return (key && self.errors[key]) || self.errors.unknownError;
    };

    // try again
    self.tryAgain = function () {
        self.error('');
        self.isProcessing(false);
        self.hasResults(false);
        self.results('');
        self.inputOne('');
        self.inputTwo('');
    };

    // form
    self.inputOne = ko.observable();
    self.inputTwo = ko.observable();
    self.formSubmit = function () {
        // some error handling
        if (!self.inputOne() || !self.inputTwo()) {
            self.error(self.getError('requiredInputsError'));
        } else if (self.inputOne() === self.inputTwo()) {
            self.error(self.getError('sameInputError'));
        } else {
            self.choices.push(self.inputOne());
            self.choices.push(self.inputTwo());
            self.getDecision();
            self.error('');
            self.isProcessing(true);
        }
    };

    // posting
    self.getDecision = function () {
        // send values to server side for processing, wait for callback, getting AJAXy
        $.post('/search', { 'choices': JSON.stringify(self.choices) }, function (data) {
            var results = JSON.parse(data);

            self.results(self.RESULTS_START_HTML + results.choice + self.RESULTS_END_HTML + results.score);
            self.hasResults(true);
            self.isProcessing(false);
        });
    };
}

ko.applyBindings(new ViewModel());