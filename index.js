/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const SKILL_NAME = 'Space Facts';
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const FAVORITE_FOOD_PROMPT = "What's your favorite food?"


//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================
const data = [
    'A year on Mercury is just 88 days long.',
    'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
    'Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.',
    'On Mars, the Sun appears about half the size as it does on Earth.',
    'Earth is the only planet not named after a god.',
    'Jupiter has the shortest day of all the planets.',
    'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
    'The Sun contains 99.86% of the mass in the Solar System.',
    'The Sun is an almost perfect sphere.',
    'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
    'Saturn radiates two and a half times more energy into space than it receives from the sun.',
    'The temperature inside the Sun can reach 15 million degrees Celsius.',
    'The Moon is moving approximately 3.8 cm away from our planet every year.',
];

const preferenceMsgs = [
    "Would you like to ",
    "Would you prefer to ",
    "Would you rather ",
    "Do you want to ",
];

const makeOrBuyMsgs = [
    "make your own food, or get it from a restaurant?",
    "prepare your food, or get it from somewhere?",
    "cook, or do you want to pay someone else to do it?"
];

var flashcardsDictionary = [

];

const PREFERENCE_MESSAGES_LENGTH = preferenceMsgs.length;

var DECK_LENGTH = flashcardsDictionary.length;

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const handlers = {
    // Open 'I'm Hungry'
    'LaunchRequest': function () {

        const MAKE_OR_BUY_MESSAGE = preferenceMsgs[Math.floor(Math.random() * preferenceMsgs.length)] + makeOrBuyMsgs[Math.floor(Math.random() * makeOrBuyMsgs.length)];
        const IM_STARVING_MESSAGE = "I'm sorry to hear that. Maybe I can help! " + MAKE_OR_BUY_MESSAGE;
        this.response.speak(IM_STARVING_MESSAGE).listen(MAKE_OR_BUY_MESSAGE);
        this.emit(':responseReady');
    },

    'MakeIntent': function () {
        this.response.speak("You wanna make it yourself, huh?");
        this.emit(':responseReady');
    },


    'HelloIntent': function () {
        this.response.speak("Oh, hey. I didn't see you there.");
        this.emit(':responseReady');
    },



    // User gives an answer
    'AnswerIntent': function() {
        this.response.speak("Python is our most popular language.");
        this.emit(':responseReady');
    },

    'FavoriteFoodIntent': function() {
        var favoriteFood = this.event.request.intent.slots.foodType.value;
        this.response.speak("Really? You like " + favoriteFood + "? Well, okay.");
        this.emit(':responseReady');
    },



    'GetNewFactIntent': function () {
        const factArr = data;
        const factIndex = Math.floor(Math.random() * factArr.length);
        const randomFact = factArr[factIndex];
        const speechOutput = GET_FACT_MESSAGE + randomFact;

        this.response.cardRenderer(SKILL_NAME, randomFact);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },

    // Test my {language} knowledge
    'AskQuestion': function() {
        //var currentFlashcardIndex = this.attributes.flashcards.languages[currentLanguage].currentFlashcardIndex;
        //var currentState = flashcardsDictionary[currentFlashcardIndex].question;

        this.response.listen('What is the capital of ' /*currentState*/);
        this.emit(':responseReady');
    },


    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },

    // Cancel
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },

    // Stop
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },

    // Save state
    'SessionEndedRequest': function() {
        console.log('session ended!');
        this.emit(':saveState', true);
    }
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
