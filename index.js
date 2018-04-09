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

const SKILL_NAME = "I'm Hungry";
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = "You can say tell me a space fact, or, you can say exit... What can I help you with?";
const HELP_REPROMPT = "What can I help you with?";

const STOP_MESSAGE = "Goodbye!";

const FAVORITE_FOOD_PROMPT = "What's your favorite food?"

const preferenceMsgs = [
    "Would you like to ",
    "Would you prefer to ",
    "Would you rather ",
    "Do you want to ",
    "Are you thinking you'll ",
];

const makeOrBuyMsgs = [
    "make your own food, or get it from a restaurant?",
    "prepare your food, or get it from somewhere?",
    "cook, or do you want to pay someone else to do it?"
];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const handlers = {
    // Open 'I'm Hungry'
    'LaunchRequest': function () {
        this.attributes['method'] = "";
        this.attributes['food'] = "";

        const MAKE_OR_BUY_MESSAGE = preferenceMsgs[Math.floor(Math.random() * preferenceMsgs.length)] + makeOrBuyMsgs[Math.floor(Math.random() * makeOrBuyMsgs.length)];
        const IM_STARVING_MESSAGE = "I'm sorry to hear that. Maybe I can help! " + MAKE_OR_BUY_MESSAGE;
        this.response.speak(MAKE_OR_BUY_MESSAGE).listen(MAKE_OR_BUY_MESSAGE);
        this.emit(':responseReady');
    },

    'MakeIntent': function () {
        this.attributes['method'] = "make";
        this.response.speak("You wanna make it yourself, huh?").listen();
        this.emit(':responseReady');
    },

    'BuyIntent': function () {
        this.attributes['method'] = "buy";
        this.response.speak("Big spender over here. Delivery or eat there?").listen();
        this.emit(':responseReady');
    },

    'DeliveryIntent': function () {
        this.attributes['method'] = "order";
        this.response.speak("DELIVERY!").listen();
        this.emit(':responseReady');
    },

    'FavoriteFoodIntent': function() {
        var response = "";

        var food = this.event.request.intent.slots.foodType.value;
        this.attributes['food'] = food;

        if (this.attributes['method'] === "order" && this.attributes['food'] === "pizza") {
            response = "YOU WANT SOME PIZZA MY GUY? I can order a pizza for you from Domino's if you want.";
        }
        else {
            response = "Really? You like " + food + "? Well, okay.";
        }

        this.response.speak(response).listen();
        this.emit(':responseReady');
    },

    'StatusIntent': function() {
        var status = "You want";

        if (this.attributes['method'] !== "") {
            status += " to " + this.attributes['method'];
        }
        if (this.attributes['food'] !== "") {
            status += this.attributes['food'];
        }
        this.response.speak(status).listen();
        this.emit(':responseReady');
    },

/*
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

        this.response.listen('What is the capital of ' + currentState);
        this.emit(':responseReady');
    },


    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
*/
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
