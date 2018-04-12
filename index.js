/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';
const Alexa = require('alexa-sdk');

const APP_ID = "amzn1.ask.skill.d31ae1f1-5fa0-464d-80c5-3e6331ac9c72";
const SKILL_NAME = "I'm Hungry";

const suggestions = {
    "make":[
        "pizza",
        "tuna fish",
        "fried eggs",
        "peanut butter and jelly",
        "hamburgers",
        "steak",
        "pork chops",
        "bacon lettuce tomato",
    ],
    "eat":[
        "pizza",
        "tuna fish",
        "fried eggs",
        "peanut butter and jelly",
        "hamburgers",
        "steak",
        "pork chops",
        "bacon lettuce tomato",
    ],
    "order":[
        "pizza",
        "tuna fish",
        "fried eggs",
        "peanut butter and jelly",
        "hamburgers",
        "steak",
        "pork chops",
        "bacon lettuce tomato",
    ],
    "buy":[
        "pizza",
        "tuna fish",
        "fried eggs",
        "peanut butter and jelly",
        "hamburgers",
        "steak",
        "pork chops",
        "bacon lettuce tomato",
    ],
};

var tourney = [];

function startPromptMsgs() {
    return {
        "message":messages.preferenceMsgs[Math.floor(Math.random() * messages.preferenceMsgs.length)] + messages.makeOrBuyMsgs[Math.floor(Math.random() * messages.makeOrBuyMsgs.length)],
        "terminate":false,
    }
}

function finalResponseMsgs(method, food) {
    return "You want to " + method + " " + food + "? Sounds like a good idea! ";
}

function processResponseMsgs(food) {
    return "Feeling like some " + food + ", huh? Alright. ";
}

const messages = {
    "preferenceMsgs":[
        "Would you like to ",
        "Would you prefer to ",
        "Would you rather ",
        "Do you want to ",
        "Are you thinking you'll ",
    ],
    "makeOrBuyMsgs":[
        "make your own food, or get it from a restaurant? ",
        "prepare your food, or get it from somewhere? ",
        "cook, or do you want to pay someone else to do it? "
    ],
    "startResponseMsgs":"I'm sorry to hear that. Maybe I can help! ",
    "startPromptMsgs":startPromptMsgs,
    "processResponseMsgs":{
        "food":processResponseMsgs,
        "make":"You wanna make it yourself huh? A real go-getter, that's great! ",
        "buy":"Big spender over here. ",
        "order":"I get it. I like to stay home too. ",
        "eat":"Night out on the town, wow! ",
    },
    "processPromptMsgs":{
        "make":{
            "message":"Do you want some suggestions on what food to make? Otherwise, if you know, just tell me the food that you're interested in. ",
            "terminate":false,
        },
        "order":{
            "message":"Do you want some suggestions on what food to order? Otherwise, if you know, just tell me the food that you're interested in. ",
            "terminate":false,
        },
        "buy":{
            "message":"Do you want to sit down in the restaurant? Or do you want delivery? ",
            "terminate":false,
        },
        "eat":{
            "message":"Do you want some suggestions on what food to eat? Otherwise, if you know, just tell me the food that you're interested in. ",
            "terminate":false,
        }
    },
    "finalResponseMsgs":finalResponseMsgs,
    "finalPromptMsgs":{
        "make":{
            "message":"Do you need a recipe? If so, just say Alexa and then ask me for one. ",
            "terminate":true,
        },
        "order":{
            "message":"Do you want to order through Alexa?  If so, just say Alexa, order from Amazon Restaurants. ",
            "terminate":true,
        },
        "buy":{
            "message":"Do you want to know more about restaurants in the area? Just ask Alexa where the nearest restaurant is to you. ",
            "terminate":true,
        },
        "eat":{
            "message":"Do you want to know more about restaurants in the area? Just ask Alexa where the nearest restaurant is to you. ",
            "terminate":true,
        },
    },
};

function process (method, food) {
    var response = "";
    var prompt = "";

    if (food === "" && method === "") { //food and method both unknown
        response = messages.startResponseMsgs;
        prompt = messages.startPromptMsgs();
    }
    else if (food === "" && method !== "") { //food unknown, method known
        response = messages.processResponseMsgs[method];
        prompt = messages.processPromptMsgs[method];
    }
    else if (food !== "" && method !== "") { //food and method both known
        response = messages.finalResponseMsgs(method, food);
        prompt = messages.finalPromptMsgs[method]; //prompt includes command to terminate
    }
    else if (food !== "" && method === "") { //food known, method unknown
        response = messages.processResponseMsgs["food"](food);
        prompt = messages.startPromptMsgs();
    }
    else { //some impossible/strange error
        prompt = "How did you get here? ";
    }
    return [response, prompt];
}

function getNextQuestion(method,index) {
    var question = "";
    question += messages.preferenceMsgs[Math.floor(Math.random() * messages.preferenceMsgs.length)];
    question += method + " ";
    question += tourney[index];
    question += " or ";
    question += messages.preferenceMsgs[Math.floor(Math.random() * messages.preferenceMsgs.length)];
    question += method + " ";
    question += tourney[index + 1];
    question += "?";
    return question;
}

function removeLoser(index, food) {
    if (tourney[index] === food) {
        tourney.splice(index+1,1);
    }
    else if (tourney[index + 1] === food) {
        tourney.splice(index,1);
    }
    else {
        return index;
    }

    index++;

    if (index === tourney.length) {
        index = 0;
    }

    return index;
}

const handlers = {
    // Open 'I'm Hungry'
    'LaunchRequest': function () {
        this.attributes['response'] = ""; //string of last set response
        this.attributes['prompt'] = ""; //string of last set prompt
        this.attributes['state'] = ""; //process

        this.attributes['method'] = ""; //(make, buy, order) how they said that they want to get it.
        this.attributes['food'] = ""; //({foodItem}) what they said that they want to get.

        this.attributes['state'] = "process";

        var result, response, prompt, terminate;

        result = process(this.attributes['method'], this.attributes['food']);
        response = result[0];
        prompt = result[1].message;
        terminate = result[1].terminate;

        this.attributes['response'] = response;
        this.attributes['prompt'] = prompt;

        this.response.speak(this.attributes['response']+this.attributes['prompt']).listen(this.attributes['prompt']);
        this.emit(':responseReady');
    },

    //***PROCESSING STATE HANDLERS***
    'MakeIntent': function () { //set method to 'make'
        var method = "make";

        if (this.attributes['state'] === "process") {

            var response = "";
            var prompt = "";
            var terminate = false;

            if (this.attributes['method'] === "" || this.attributes['method'] === undefined) {
                this.attributes['method'] = method;
                var result = process(this.attributes['method'], this.attributes['food']);
                response = result[0];
                prompt = result[1].message;
                terminate = result[1].terminate;
            }
            else if (this.attributes['method'] === method) {
                response = "I already know that.";
            }
            else {
                response = "You have encountered an error. ";
                prompt = "You previously already said that you wanted to " + this.attributes['method'] + " your food. Are you trying to confuse me? ";
                terminate = true;
            }

            this.attributes['response'] = response;
            this.attributes['prompt'] = prompt;

            if (terminate) {
                this.response.speak(this.attributes['response']+this.attributes['prompt']);
            }
            else {
                this.response.speak(this.attributes['response']+this.attributes['prompt']).listen(this.attributes['prompt']);
            }

            this.emit(':responseReady');
        }
    },

    'BuyIntent': function () { //set method to 'buy'
        var method = "buy";

        if (this.attributes['state'] === "process") {

            var response = "";
            var prompt = "";
            var terminate = false;

            if (this.attributes['method'] === "" || this.attributes['method'] === undefined || this.attributes['method'] === method) {
                this.attributes['method'] = method;
                var result = process(this.attributes['method'], this.attributes['food']);
                response = result[0];
                prompt = result[1].message;
                terminate = result[1].terminate;
                this.attributes['method'] = "";
            }
            else {
                response = "You have encountered an error. ";
                prompt = "You previously already said that you wanted to " + this.attributes['method'] + " your food. Are you trying to confuse me? ";
                terminate = true;
            }

            this.attributes['response'] = response;
            this.attributes['prompt'] = prompt;

            if (terminate) {
                this.response.speak(this.attributes['response']+this.attributes['prompt']);
            }
            else {
                this.response.speak(this.attributes['response']+this.attributes['prompt']).listen(this.attributes['prompt']);
            }

            this.emit(':responseReady');
        }
    },

    'DeliveryIntent': function () { //set method to 'order'
        var method = "order";

        if (this.attributes['state'] === "process") {

            var response = "";
            var prompt = "";
            var terminate = false;

            if (this.attributes['method'] === "" || this.attributes['method'] === undefined) {
                this.attributes['method'] = method;
                var result = process(this.attributes['method'], this.attributes['food']);
                response = result[0];
                prompt = result[1].message;
                terminate = result[1].terminate;
            }
            else if (this.attributes['method'] === method) {
                response = "I already know that.";
            }
            else {
                response = "You have encountered an error. ";
                prompt = "You previously already said that you wanted to " + this.attributes['method'] + " your food. Are you trying to confuse me? ";
                terminate = true;
            }

            this.attributes['response'] = response;
            this.attributes['prompt'] = prompt;

            if (terminate) {
                this.response.speak(this.attributes['response']+this.attributes['prompt']);
            }
            else {
                this.response.speak(this.attributes['response']+this.attributes['prompt']).listen(this.attributes['prompt']);
            }

            this.emit(':responseReady');
        }
    },

    'SitIntent': function() {
            var method = "eat";

            if (this.attributes['state'] === "process") {

                var response = "";
                var prompt = "";
                var terminate = false;

                if (this.attributes['method'] === "" || this.attributes['method'] === undefined) {
                    this.attributes['method'] = method;
                    var result = process(this.attributes['method'], this.attributes['food']);
                    response = result[0];
                    prompt = result[1].message;
                    terminate = result[1].terminate;
                }
                else if (this.attributes['method'] === method) {
                    response = "I already know that.";
                }
                else {
                    response = "You have encountered an error. ";
                    prompt = "You previously already said that you wanted to " + this.attributes['method'] + " your food. Are you trying to confuse me? ";
                    terminate = true;
                }

                this.attributes['response'] = response;
                this.attributes['prompt'] = prompt;

                if (terminate) {
                    this.response.speak(this.attributes['response']+this.attributes['prompt']);
                }
                else {
                    this.response.speak(this.attributes['response']+this.attributes['prompt']).listen(this.attributes['prompt']);
                }

                this.emit(':responseReady');
            }
    },

    'FavoriteFoodIntent': function() {
/*
        if (this.attributes['method'] === "order" && this.attributes['food'] === "pizza") {
            response = "YOU WANT SOME PIZZA MY GUY? I can order a pizza for you from Domino's if you want.";
        }
*/
        var food = this.event.request.intent.slots.foodType.value;

        if (this.attributes['state'] === "process") {

            var response = "";
            var prompt = "";
            var terminate = false;

            if (this.attributes['food'] === "" || this.attributes['food'] === undefined) {
                this.attributes['food'] = food;
                var result = process(this.attributes['method'], this.attributes['food']);
                response = result[0];
                prompt = result[1].message;
                terminate = result[1].terminate;
            }
            else if (this.attributes['food'] === food) {
                response = "I already know that.";
            }
            else {
                response = "You have encountered an error. ";
                prompt = "You previously already said that you wanted to eat " + this.attributes['food'] + ". Are you trying to confuse me? ";
                terminate = true;
            }

            this.attributes['response'] = response;
            this.attributes['prompt'] = prompt;

            if (terminate) {
                this.response.speak(this.attributes['response']+this.attributes['prompt']);
            }
            else {
                this.response.speak(this.attributes['response']+this.attributes['prompt']).listen(this.attributes['prompt']);
            }

            this.emit(':responseReady');
        }
        else if (this.attributes['state'] === "quiz") {

            var method = this.attributes['method'];
            this.attributes['index'] = removeLoser(this.attributes['index'], food);
            if (tourney.length > 1) {
                var question = getNextQuestion(method,this.attributes['index']);
                this.response.speak(question).listen(question);
                this.emit(':responseReady');
            }
            else {
                this.attributes['food'] = tourney[0];
                var result = process(this.attributes['method'], this.attributes['food']);
                response = "The winner is " + tourney[0] + " ";
                prompt = result[1].message;
                terminate = result[1].terminate;
                this.attributes['response'] = response;
                this.attributes['prompt'] = prompt;
                this.response.speak(this.attributes['response']+this.attributes['prompt']);
                this.emit(':responseReady');
            }
        }

    },

    'StartQuizIntent': function() {
            if (this.attributes['state'] === "process") {
                this.attributes['state'] = "quiz";
                this.attributes['index'] = 0;

                var method = this.attributes['method'];
                tourney = JSON.parse(JSON.stringify(suggestions[method]));
                var question = getNextQuestion(this.attributes['method'],this.attributes['index']);
                var begin = "I will give you eight random options, and you can pick one winner at a time, tournament-style! ";
                this.response.speak(begin + question).listen(question);
                this.emit(':responseReady');
            }
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

    'AMAZON.HelpIntent': function () {
        this.response.speak("Goodbye.");
        this.emit(':responseReady');
    },

    // Cancel
    'AMAZON.CancelIntent': function () {
        this.response.speak("Goodbye.");
        this.emit(':responseReady');
    },

    // Stop
    'AMAZON.StopIntent': function () {
        this.response.speak("Goodbye.");
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
