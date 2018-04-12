/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';
const Alexa = require('alexa-sdk');

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;
const SKILL_NAME = "I'm Hungry";

const STOP_MESSAGE = "Goodbye!";

const FAVORITE_FOOD_PROMPT = "What's your favorite food?"

//SESSION ATTRIBUTES
//method
//food


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

const methodResponseMsgs = {
    "make":"You wanna make it yourself, huh? A real go-getter, that's great! ",
}

const methodPromptMsgs = {
    "make":"Do you need a recipe? ",
}

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================


function methodProcess (method, food) {
    var response = "";
    var prompt = "";

    if (food === "") {
        response = methodResponseMsgs[method];
        prompt = "Do you know what food that you want to " + method + ", or do you want some suggestions? ";
    }
    else {
        response = "You want to " + method + " " + food + "? ";
        prompt = methodPromptMsgs[method];
    }

    return [response, prompt];
}

const handlers = {
    // Open 'I'm Hungry'
    'LaunchRequest': function () {
        this.attributes['prompt'] = "";
        this.attributes['state'] = ""; //assess,

        this.attributes['method'] = ""; //(make, buy, order) how they said that they want to get it.
        this.attributes['food'] = ""; //({foodItem}) what they said that they want to get.

        const MAKE_OR_BUY_MESSAGE = preferenceMsgs[Math.floor(Math.random() * preferenceMsgs.length)] + makeOrBuyMsgs[Math.floor(Math.random() * makeOrBuyMsgs.length)];
        const IM_STARVING_MESSAGE = "I'm sorry to hear that. Maybe I can help! " + MAKE_OR_BUY_MESSAGE;
        this.response.speak(IM_STARVING_MESSAGE).listen(MAKE_OR_BUY_MESSAGE);
        this.emit(':responseReady');
    },

    //***METHOD HANDLERS***
    'MakeIntent': function () { //set method to 'make'
        var method = "make";

        var response = "";
        var prompt = "";

        if (this.attributes['method'] === "") {
            this.attributes['method'] = method;
            var result = methodProcess(method, this.attributes['food']);
            response = result[0];
            prompt = result[1];
        }
        else {
            response = "You have encountered an error. ";
            prompt = "You previously already said that you wanted to " + this.attributes['method'] + " your food. Are you trying to confuse me? ";
        }

        this.response.speak(response+prompt).listen(prompt);
        this.emit(':responseReady');
    },

    'BuyIntent': function () {
        this.attributes['method'] = "buy";
        if
        this.response.speak("Big spender over here. Do you want delivery or do you want to eat there?").listen();
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
        var status = "";

        if (this.attributes['method'] === "" && this.attributes['food'] === "") {
            status += "I haven't learned anything about what you want, yet.";
        }
        else {
            status += "You want";
        }

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
