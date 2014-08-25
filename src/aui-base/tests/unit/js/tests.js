YUI.add('aui-base-tests', function(Y) {

    var entityCharacters = ['!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~'],
        entityNames = ['', '', '', '', '', '&amp;', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '&lt;', '', '&gt;', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        entityNumbers = ['&#33;', '&#34;', '&#35;', '&#36;', '&#37;', '&#38;', '&#39;', '&#40;', '&#41;', '&#42;', '&#43;', '&#44;', '&#45;', '&#46;', '&#47;', '&#48;', '&#49;', '&#50;', '&#51;', '&#52;', '&#53;', '&#54;', '&#55;', '&#56;', '&#57;', '&#58;', '&#59;', '&#60;', '&#61;', '&#62;', '&#63;', '&#64;', '&#65;', '&#66;', '&#67;', '&#68;', '&#69;', '&#70;', '&#71;', '&#72;', '&#73;', '&#74;', '&#75;', '&#76;', '&#77;', '&#78;', '&#79;', '&#80;', '&#81;', '&#82;', '&#83;', '&#84;', '&#85;', '&#86;', '&#87;', '&#88;', '&#89;', '&#90;', '&#91;', '&#92;', '&#93;', '&#94;', '&#95;', '&#96;', '&#97;', '&#98;', '&#99;', '&#100;', '&#101;', '&#102;', '&#103;', '&#104;', '&#105;', '&#106;', '&#107;', '&#108;', '&#109;', '&#110;', '&#111;', '&#112;', '&#113;', '&#114;', '&#115;', '&#116;', '&#117;', '&#118;', '&#119;', '&#120;', '&#121;', '&#122;', '&#123;', '&#124;', '&#125;', '&#126;'],
        escapedEntities = ['&amp;', '&lt;', '&gt;', '&#034;', '&#039;', '&#047;', '&#096;'],
        numbersToPad = [1, 10, 2.5, 6.789, 123.4, 3000.3102, .5, .10001, 500000.0],
        symbolEntities = ['&','<','>','"','\'','/','`'],
        uncamelizedStrings = [
            'lorem-ipsum-dolor-sit-amet',
            'LorEm-Ipsum-dolor-sit-AMET',
            'Lorem-Ipsum-doLOR. sit-amet +1',
            'lorem-ipsum-dolor-sit-amet, LOREM-ipsum-D&OLOR',
            'Lorem-ipsum-dolor-sit-amet. lorem-ipsum-dolor-sit-amet, lorem-Ipsum-Dolor-Sit-Amet',
        ];

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('aui-base');

    suite.add(new Y.Test.Case({

        getPrecisionPrePostDecimal: function(number) {
            var split = number.toString().split('.');

            return {
                pre: split[0].length,
                post: split[1] ? split[1].length : 0
            };
        },

        'should unescape symbols as HTML entities': function() {
            var escaped = [];

            for (var i = 0; i < symbolEntities.length; i++) {
                escaped.push(Y.Lang.String.unescapeHTML(symbolEntities[i]));
            }

            for (var j = 0; j < escapedEntities.length; j++) {
                Assert.areEqual(escaped[i], escapedEntities[i]);
            }
        },

        'should escape HTML entities as symbols': function() {
            var symbols = [];

            for (var i = 0; i < escapedEntities.length; i++) {
                symbols.push(Y.Lang.String.unescapeHTML(escapedEntities[i]));
            }

            for (var j = 0; j < symbolEntities.length; j++) {
                Assert.areEqual(symbols[i], symbolEntities[i]);
            }
        },

        'should camelize strings correctly': function() {
            for (var i = 0; i < uncamelizedStrings.length; i++) {
                var toBeCamelized = uncamelizedStrings[i],
                    camelized = Y.Lang.String.camelize(toBeCamelized),
                    capitalIndices = [],
                    character = null,
                    dashCount = 0;

                //find the dash and capitalized indicies
                for(var j = 0; j < toBeCamelized.length; j++) {
                    character = toBeCamelized[j];

                    if (character === '-') {
                        capitalIndices.push(j - dashCount);

                        dashCount++;
                    }
                    else if (character.toUpperCase() === character) {
                        capitalIndices.push(j - dashCount);
                    }
                }

                //ensure the result is camelized
                for (var k = 0; k < camelized.length; k++) {
                    character = camelized[k];

                    if (capitalIndices.indexOf(k) === -1) {
                        Assert.areSame(character.toLowerCase(), character);
                    }
                    else {
                        Assert.areSame(character.toUpperCase(), character);
                    }
                }
            }
        },

        'should pad numbers correctly': function() {
            for (var i = 0; i < numbersToPad.length; i++) {
                var toBePadded = numbersToPad[i],
                    toBePaddedLengths = this.getPrecisionPrePostDecimal(toBePadded),
                    length = null,
                    padded = null,
                    paddedLengths = null
                    precision = null;

                for (var j = 0; j < 20; j++) {
                    length = Math.max(toBePaddedLengths.post, j);
                    precision = Math.max(toBePaddedLengths.pre, j);
                    padded = Y.Lang.String.padNumber(toBePadded, precision, length);
                    paddedLengths = this.getPrecisionPrePostDecimal(padded);

                    Assert.isTrue(Y.Lang.isString(padded));
                    Assert.isTrue(Y.Lang.isNumber(parseFloat(toBePadded)));
                    Assert.areEqual(toBePadded, parseFloat(padded));
                    Assert.areEqual(paddedLengths.pre, precision);
                    Assert.areEqual(paddedLengths.post, length);
                }
            }
        },

        'should unescape HTML entities correctly': function() {
            var entityCharactersLength = entityCharacters.length;
            var entityName;

            Assert.isTrue((entityCharactersLength == entityNumbers.length) && (entityCharacters.length == entityNames.length))

            for (var i = 0; i < entityCharactersLength; i++) {
                Assert.areEqual(Y.Lang.String.unescapeEntities(entityNumbers[i]), entityCharacters[i]);

                entityName = entityNames[i];
                if (entityName != '') {
                    Assert.areEqual(Y.Lang.String.unescapeEntities(entityName), entityCharacters[i]);
                }
            }
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['test', 'aui-base']
});
