YUI.add('aui-base-tests', function(Y) {

    var escapedEntities = ['&amp;', '&lt;', '&gt;', '&#034;', '&#039;', '&#047;', '&#096;'],
        symbolEntities = ['&','<','>','"','\'','/','`'];

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('aui-base');

    suite.add(new Y.Test.Case({

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
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['test', 'aui-base']
});
