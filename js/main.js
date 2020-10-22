function elementClick(element, id) {

    if (id == $('#element-to-edit').text()) {
        $('#' + id).css({
            'padding': '0px',
            'border': 'none'
        });
        $('#element-to-edit').text('');
    } else {
        $('#' + id).css({
            'padding': '10px',
            'border': '2px solid #ccc'
        });
        $('#element-to-edit').text(id);
    }
}

function randomID() {
    return Math.random().toString(36).substring(7);
}

var bodyElementsArray = [];
var bodyElementsHTML = "";

$(document).ready(function() {
    var colors = new Array("red", "yellow", "blue", "green", "black", "white");

    $('#work-area').on('keydown', function(e) {
        if (e.which == 13) {
            e.preventDefault();
            text = $('#work-area').val();
            var bodyElementsJSON = parseInput(text);

            bodyElementsArray.push(bodyElementsJSON);


            bodyElementsHTML = "";
            for (var i = 0; i < bodyElementsArray.length; i++) {

                bodyElementsHTML += renderElementsToHTML(bodyElementsArray[i]);
            }

            renderHTML();

        }
    });

    $("#enter-button").click(function() {

        text = $('#work-area').val();
        var bodyElementsJSON = parseInput(text);

        bodyElementsArray.push(bodyElementsJSON);

        bodyElementsHTML = "";
        for (var i = 0; i < bodyElementsArray.length; i++) {
            bodyElementsHTML += renderElementsToHTML(bodyElementsArray[i]);
        }

        renderHTML();


    });

    $('#clear-button').click(function(e) {
        $('#element-to-edit').text("");
    });

    $('#export-button').click(function(e) {
        $('#rendered-html').toggle();
    });

    $('#sample-1').click(function(e) {
        $('#work-area').val("can you add a heading with text \"Sukhpal Saini\"");
    });

    $('#sample-2').click(function(e) {
        $('#work-area').val("can you add an image with url \"https://www.blog.google/static/blog/images/google-200x200.7714256da16f.png\"");
    });


    var intent = ["add", "insert", "put"];
    var element = ["heading", "paragraph", "image", "link"];
    var styleChoices = ["color", "font-size"];
    var colorChoices = ["red", "blue", "green", "black", "white"];
    var unitChoices = ["px", "rem", "em", "vh", "vw"];
    var paddingChoices = ["padding"];
    var marginChoices = ["margin"];
    var paddingLeftChoices = ["padding-left", "left"];
    var paddingRightChoices = ["padding-right", "right"];

    function parseInput(inputText) {

        var partsJSON = "";
        var text = cleanText(inputText);


        if ($('#element-to-edit').text() != "") {
            partsJSON = parseProperties(text);
            var elementToUpdate = bodyElementsArray[findByID($('#element-to-edit').text())];
            mergePartsJSON(partsJSON, elementToUpdate);

            if (inputText.includes("center")) {
                if (elementToUpdate.element == "image") {
                    elementToUpdate["styles"]["margin"] = "auto";
                    elementToUpdate["styles"]["display"] = "block";
                } else {
                    elementToUpdate["styles"]["text-align"] = "center";
                }
            } else if (inputText.includes("color")) {
                elementToUpdate["styles"]["color"] = "center";
            }




            // if (inputText.includes("color")) {
            //      var color = "";
            //      for (var i = 0; i < res.length; i++) {
            //          if (colors.includes(res[i])) {
            //              color += res[i];
            //          }
            //      }

            //      $("#" + $('#element-to-edit').text()).css("color", color);
            //  } else if (inputText.includes("size")) {
            //      $("#" + $('#element-to-edit').text()).css("font-size", parseUnits(res));
            //  }




        } else {
            partsJSON = parseProperties(text);
        }
        return partsJSON;
    }


    function mergePartsJSON(partsJSONSource, partsJSONDest) {
        var resPartsJSON = partsJSONDest;

        console.log("now coming in");
        console.log(partsJSONSource);
        console.log(partsJSONDest);
        console.log("-------------");

        for (var i = 0; i < Object.keys(resPartsJSON).length; i++) {
            var keys = Object.keys(resPartsJSON);
            var val = resPartsJSON[keys[i]];

            console.log("json " + JSON.stringify(resPartsJSON));


            if (typeof val == "object") {
                var keys2 = Object.keys(resPartsJSON[keys[i]]);
                console.log("THE mofo KEY LIST 2 IS " + keys2);
                for (var j = 0; j < keys2.length; j++) {
                    console.log(resPartsJSON[keys[i]][keys2[j]]);

                    if (partsJSONSource[keys[i]][keys2[j]] != "") {
                        resPartsJSON[keys[i]][keys2[j]] = partsJSONSource[keys[i]][keys2[j]];
                    }
                }
            } else {

                resPartsJSON[keys[i]] = partsJSONDest[keys[i]];
            }


        }




        // if (partsJSONSource != null) {
        //     for (var key in resPartsJSON) {
        //         if (typeof resPartsJSON[key] == "object") {
        //             for (var key2 in resPartsJSON[key]) {
        //             	console.log("iedw " + JSON.stringify(resPartsJSON[key][key2]));
        //             	console.log("in ob ject " + JSON.stringify(partsJSONSource[key]));
        //                 resPartsJSON[key][key2] = partsJSONSource[key][key2];
        //             }
        //         } else {
        //             resPartsJSON[key] = partsJSONSource[key];
        //         }
        //     }
        // }

        console.log("final version looks like: " + JSON.stringify(resPartsJSON));
        return resPartsJSON;
    }

    function parseProperties(text) {
        var partsJSON = {
            "element": "",
            "text": "",
            "styles": {
                "font-size": "",
                "padding": "",
                "margin": "",
                "color": "",
                "display": "",
                "text-align": ""
            }
        };



        //will only support the first set of units found
        var unitsFound = parseUnits(text)[0];


        for (var i = 0; i < text.length; i++) {
            var curPart = text[i];
            console.log(curPart);


            //check text
            var sourceText = curPart.match(/".*"/g);

            if (sourceText != null) {
                partsJSON["text"] = sourceText[0].substring(1, sourceText[0].length - 1);
            }


            //check intent
            intentIndex = intent.indexOf(curPart);

            if (intentIndex >= 0) {
                partsJSON["intent"] = "add";
            }

            //check element
            elementIndex = element.indexOf(curPart);

            if (elementIndex >= 0) {
                partsJSON["element"] = curPart;
                partsJSON["id"] = randomID();
            }

            //check styles
            //check color

            colorIndex = colorChoices.indexOf(curPart);
            if (colorIndex >= 0) {

                partsJSON["styles"]["color"] = curPart;
            }

            //check padding
            paddingIndex = paddingChoices.indexOf(curPart);
            if (paddingIndex >= 0) {
                // console.log("units "+ unitsFound );
                if (unitsFound != null && unitsFound.length > 0) {
                    partsJSON["styles"]["padding"] = unitsFound;
                }
            }

            //check margin
            marginIndex = marginChoices.indexOf(curPart);
            if (marginIndex >= 0) {

                if (unitsFound != null && unitsFound.length > 0) {
                    partsJSON["styles"]["margin"] = unitsFound;
                }
            }
            console.log(partsJSON);
        }

        return partsJSON;
    }

    function parseUnits(text) {
        var units = [];

        for (var i = 0; i < text.length; i++) {
            var reg = "[0-9]*(px|rem|em|vh|vw)";
            var regexUnits = new RegExp(reg, "g");

            var unitsRegex = text[i].match(regexUnits);

            if (unitsRegex != null) {
                units.push(unitsRegex);
            }
        }
        return units;
    }

    function cleanText(text) {
        var res = text;
        res = res.toLowerCase();

        var myRegexp = /[^\s"]+|"([^"]*)"/gi;
        var resArray = [];

        do {
            var match = myRegexp.exec(res);
            if (match != null) {
                resArray.push(match[0]);
            }
        } while (match != null);

        for (var i = 0; i < resArray.length; i++) {
            if (stopWords.includes(resArray[i])) {
                resArray.splice(i, 1);
            }

        }
        return resArray;
    }

    function renderElementsToHTML(bodyElements) {
        var renderElementHTML = "";
        if (bodyElements.element != null) {
            if (bodyElements.element == "heading") {
                renderElementHTML = "<h1 id=\"" + bodyElements.id + "\" onclick=\"elementClick(this, this.id)\"" + " style=\"" + formatStyles(bodyElements.styles) + "\">" + bodyElements.text + "</h1>";

            } else if (bodyElements.element == "paragraph") {
                renderElementHTML = "<p id=\"" + bodyElements.id + "\" onclick=\"elementClick(this, this.id)\"" + " style=\"" + formatStyles(bodyElements.styles) + "\">" + bodyElements.text + "</p>";

            } else if (bodyElements.element == "image") {
                renderElementHTML = "<img id=\"" + bodyElements.id + "\" onclick=\"elementClick(this, this.id)\"" + " style=\"" + formatStyles(bodyElements.styles) + "\"" + " src='" + bodyElements.text + "'></img>";

            } else if (bodyElements.element == "link") {
                renderElementHTML = "<p id=\"" + bodyElements.id + "\" onclick=\"elementClick(this, this.id)\"" + " style=\"" + formatStyles(bodyElements.styles) + "\">" + bodyElements.text + "</p>";

            }
        }
        console.log(renderElementHTML);
        return renderElementHTML;
    }

    function renderHTML() {
        var outputHTML = "<!DOCTYPE html><html><head><title>Page Title</title></head><body>";
        outputHTML += bodyElementsHTML;
        outputHTML += "</body></html>";
        $('#demo-area').html(outputHTML);
        $('#rendered-html').text(outputHTML);
    }

    function findByID(id) {
        console.log(id);
        var index = -1;
        for (var i = 0; i < bodyElementsArray.length; i++) {
            if (bodyElementsArray[i].id == id) {
                index = i;
                break;
            }
        }

        console.log(index);
        return index;
    }


    function formatStyles(stylesJSON) {
        var stylesJSONResult = "";
        console.log(stylesJSON);
        Object.keys(stylesJSON).forEach(function(key) {
            if (stylesJSON[key] != "") {
                stylesJSONResult += key + ":" + stylesJSON[key] + "; ";
            } else {
                stylesJSONResult += key + ":''; ";
            };

        });

        return stylesJSONResult;
    }
});

var stopWords = new Array(
    'a',
    'about',
    'above',
    'across',
    'after',
    'again',
    'against',
    'all',
    'almost',
    'alone',
    'along',
    'already',
    'also',
    'although',
    'always',
    'among',
    'an',
    'and',
    'another',
    'any',
    'anybody',
    'anyone',
    'anything',
    'anywhere',
    'are',
    'area',
    'areas',
    'around',
    'as',
    'ask',
    'asked',
    'asking',
    'asks',
    'at',
    'away',
    'b',
    'back',
    'backed',
    'backing',
    'backs',
    'be',
    'became',
    'because',
    'become',
    'becomes',
    'been',
    'before',
    'began',
    'behind',
    'being',
    'beings',
    'best',
    'better',
    'between',
    'big',
    'both',
    'but',
    'by',
    'c',
    'came',
    'can',
    'cannot',
    'case',
    'cases',
    'certain',
    'certainly',
    'clear',
    'clearly',
    'come',
    'could',
    'd',
    'did',
    'differ',
    'different',
    'differently',
    'do',
    'does',
    'done',
    'down',
    'down',
    'downed',
    'downing',
    'downs',
    'during',
    'e',
    'each',
    'early',
    'either',
    'end',
    'ended',
    'ending',
    'ends',
    'enough',
    'even',
    'evenly',
    'ever',
    'every',
    'everybody',
    'everyone',
    'everything',
    'everywhere',
    'f',
    'face',
    'faces',
    'fact',
    'facts',
    'far',
    'felt',
    'few',
    'find',
    'finds',
    'first',
    'for',
    'four',
    'from',
    'full',
    'fully',
    'further',
    'furthered',
    'furthering',
    'furthers',
    'g',
    'gave',
    'general',
    'generally',
    'get',
    'gets',
    'give',
    'given',
    'gives',
    'go',
    'going',
    'good',
    'goods',
    'got',
    'great',
    'greater',
    'greatest',
    'group',
    'grouped',
    'grouping',
    'groups',
    'h',
    'had',
    'has',
    'have',
    'having',
    'he',
    'her',
    'here',
    'herself',
    'high',
    'high',
    'high',
    'higher',
    'highest',
    'him',
    'himself',
    'his',
    'how',
    'however',
    'i',
    'if',
    'important',
    'in',
    'interest',
    'interested',
    'interesting',
    'interests',
    'into',
    'is',
    'it',
    'its',
    'itself',
    'j',
    'just',
    'k',
    'keep',
    'keeps',
    'kind',
    'knew',
    'know',
    'known',
    'knows',
    'l',
    'large',
    'largely',
    'last',
    'later',
    'latest',
    'least',
    'less',
    'let',
    'lets',
    'like',
    'likely',
    'long',
    'longer',
    'longest',
    'm',
    'made',
    'make',
    'making',
    'man',
    'many',
    'may',
    'me',
    'member',
    'members',
    'men',
    'might',
    'more',
    'most',
    'mostly',
    'mr',
    'mrs',
    'much',
    'must',
    'my',
    'myself',
    'n',
    'necessary',
    'need',
    'needed',
    'needing',
    'needs',
    'never',
    'new',
    'new',
    'newer',
    'newest',
    'next',
    'no',
    'nobody',
    'non',
    'noone',
    'not',
    'nothing',
    'now',
    'nowhere',
    'number',
    'numbers',
    'o',
    'of',
    'off',
    'often',
    'old',
    'older',
    'oldest',
    'on',
    'once',
    'one',
    'only',
    'open',
    'opened',
    'opening',
    'opens',
    'or',
    'order',
    'ordered',
    'ordering',
    'orders',
    'other',
    'others',
    'our',
    'out',
    'over',
    'p',
    'part',
    'parted',
    'parting',
    'parts',
    'per',
    'perhaps',
    'place',
    'places',
    'point',
    'pointed',
    'pointing',
    'points',
    'possible',
    'present',
    'presented',
    'presenting',
    'presents',
    'problem',
    'problems',
    'put',
    'puts',
    'q',
    'quite',
    'r',
    'rather',
    'really',
    'right',
    'right',
    'room',
    'rooms',
    's',
    'said',
    'same',
    'saw',
    'say',
    'says',
    'second',
    'seconds',
    'see',
    'seem',
    'seemed',
    'seeming',
    'seems',
    'sees',
    'several',
    'shall',
    'she',
    'should',
    'show',
    'showed',
    'showing',
    'shows',
    'side',
    'sides',
    'since',
    'small',
    'smaller',
    'smallest',
    'so',
    'some',
    'somebody',
    'someone',
    'something',
    'somewhere',
    'state',
    'states',
    'still',
    'still',
    'such',
    'sure',
    't',
    'take',
    'taken',
    'than',
    'that',
    'the',
    'their',
    'them',
    'then',
    'there',
    'therefore',
    'these',
    'they',
    'thing',
    'things',
    'think',
    'thinks',
    'this',
    'those',
    'though',
    'thought',
    'thoughts',
    'three',
    'through',
    'thus',
    'to',
    'today',
    'together',
    'too',
    'took',
    'toward',
    'turn',
    'turned',
    'turning',
    'turns',
    'two',
    'u',
    'under',
    'until',
    'up',
    'upon',
    'us',
    'use',
    'used',
    'uses',
    'v',
    'very',
    'w',
    'want',
    'wanted',
    'wanting',
    'wants',
    'was',
    'way',
    'ways',
    'we',
    'well',
    'wells',
    'went',
    'were',
    'what',
    'when',
    'where',
    'whether',
    'which',
    'while',
    'who',
    'whole',
    'whose',
    'why',
    'will',
    'with',
    'within',
    'without',
    'work',
    'worked',
    'working',
    'works',
    'would',
    'x',
    'y',
    'year',
    'years',
    'yet',
    'you',
    'young',
    'younger',
    'youngest',
    'your',
    'yours',
    'z'
);