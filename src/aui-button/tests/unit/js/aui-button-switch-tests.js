YUI.add('aui-button-switch-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-button-switch');

    suite.add(new Y.Test.Case({
        name: 'Button Switch',

        init: function() {
            this._container = Y.one('#container');
        },

        setUp: function() {
            this._buttonSwitch = new Y.ButtonSwitch().render('#container');
        },

        tearDown: function() {
            this._buttonSwitch && this._buttonSwitch.destroy();
        },

        'should set the inner labels': function () {
            var buttonSwitch = this._buttonSwitch,
                content = buttonSwitch.get('content');

            Y.Assert.areEqual(content.one('.button-switch-inner-label-left').getHTML(), '');
            Y.Assert.areEqual(content.one('.button-switch-inner-label-right').getHTML(), '');

            buttonSwitch.set('innerLabelLeft', 'left');
            buttonSwitch.set('innerLabelRight', 'right');

            Y.Assert.areEqual(content.one('.button-switch-inner-label-left').getHTML(), 'left');
            Y.Assert.areEqual(content.one('.button-switch-inner-label-right').getHTML(), 'right');
        },

        'should activate on click': function () {
            var buttonSwitch = this._buttonSwitch,
                content = buttonSwitch.get('content');

            Y.Assert.isFalse(buttonSwitch.get('activated'));
            Y.Assert.isTrue(content.one('.button-switch-inner-label-left').hasClass('hide'));
            Y.Assert.isFalse(content.one('.button-switch-inner-label-right').hasClass('hide'));

            content.simulate('click');

            Y.Assert.isTrue(buttonSwitch.get('activated'));
            Y.Assert.isFalse(content.one('.button-switch-inner-label-left').hasClass('hide'));
            Y.Assert.isTrue(content.one('.button-switch-inner-label-right').hasClass('hide'));
        },

        'should deactivate on click when the switch button start as activated': function () {
            var content;

            this._buttonSwitch = new Y.ButtonSwitch({activated: true}).render('#container');
            content = this._buttonSwitch.get('content');

            Y.Assert.isTrue(this._buttonSwitch.get('activated'));
            Y.Assert.isFalse(content.one('.button-switch-inner-label-left').hasClass('hide'));
            Y.Assert.isTrue(content.one('.button-switch-inner-label-right').hasClass('hide'));

            content.simulate('click');

            Y.Assert.isFalse(this._buttonSwitch.get('activated'));
            Y.Assert.isTrue(content.one('.button-switch-inner-label-left').hasClass('hide'));
            Y.Assert.isFalse(content.one('.button-switch-inner-label-right').hasClass('hide'));
        },

        'should set the position of inner circle even when the container not visible': function () {
            var buttonSwitch = this._buttonSwitch,
                content = buttonSwitch.get('content');

            this._container.addClass('hide');
            buttonSwitch.set('activated', true);
            Y.Assert.isFalse(content.one('.button-switch-inner-circle').hasClass('button-switch-left'));
            Y.Assert.isTrue(content.one('.button-switch-inner-circle').hasClass('button-switch-right'));

            buttonSwitch.set('activated', false);
            Y.Assert.isTrue(content.one('.button-switch-inner-circle').hasClass('button-switch-left'));
            Y.Assert.isFalse(content.one('.button-switch-inner-circle').hasClass('button-switch-right'));
        },

        'should activate on key enter interaction': function () {
            var buttonSwitch = this._buttonSwitch,
                content = buttonSwitch.get('content');

            Y.Assert.isFalse(buttonSwitch.get('activated'));
            Y.Assert.isTrue(content.one('.button-switch-inner-label-left').hasClass('hide'));
            Y.Assert.isFalse(content.one('.button-switch-inner-label-right').hasClass('hide'));

            buttonSwitch.get('content').simulate('keydown', {
                keyCode: 13
            });

            Y.Assert.isTrue(buttonSwitch.get('activated'));
            Y.Assert.isFalse(content.one('.button-switch-inner-label-left').hasClass('hide'));
            Y.Assert.isTrue(content.one('.button-switch-inner-label-right').hasClass('hide'));
        },

        'should activate on key space interaction': function () {
            var buttonSwitch = this._buttonSwitch,
                content = buttonSwitch.get('content');

            Y.Assert.isFalse(buttonSwitch.get('activated'));
            Y.Assert.isTrue(content.one('.button-switch-inner-label-left').hasClass('hide'));
            Y.Assert.isFalse(content.one('.button-switch-inner-label-right').hasClass('hide'));

            buttonSwitch.get('content').simulate('keydown', {
                keyCode: 32
            });

            Y.Assert.isTrue(buttonSwitch.get('activated'));
            Y.Assert.isFalse(content.one('.button-switch-inner-label-left').hasClass('hide'));
            Y.Assert.isTrue(content.one('.button-switch-inner-label-right').hasClass('hide'));
        },

        'should activate on key rightarrow interaction': function () {
            var buttonSwitch = this._buttonSwitch,
                content = buttonSwitch.get('content');

            Y.Assert.isFalse(buttonSwitch.get('activated'));
            Y.Assert.isTrue(content.one('.button-switch-inner-label-left').hasClass('hide'));
            Y.Assert.isFalse(content.one('.button-switch-inner-label-right').hasClass('hide'));

            buttonSwitch.get('content').simulate('keydown', {
                keyCode: 39
            });

            Y.Assert.isTrue(buttonSwitch.get('activated'));
            Y.Assert.isFalse(content.one('.button-switch-inner-label-left').hasClass('hide'));
            Y.Assert.isTrue(content.one('.button-switch-inner-label-right').hasClass('hide'));
        },

        'should deactivate on key leftarrow interaction': function () {
            var buttonSwitch = this._buttonSwitch,
                content = buttonSwitch.get('content');

            buttonSwitch.set('activated', true);
            Y.Assert.isTrue(buttonSwitch.get('activated'));
            Y.Assert.isFalse(content.one('.button-switch-inner-label-left').hasClass('hide'));
            Y.Assert.isTrue(content.one('.button-switch-inner-label-right').hasClass('hide'));

            buttonSwitch.get('content').simulate('keydown', {
                keyCode: 37
            });

            Y.Assert.isFalse(buttonSwitch.get('activated'));
            Y.Assert.isTrue(content.one('.button-switch-inner-label-left').hasClass('hide'));
            Y.Assert.isFalse(content.one('.button-switch-inner-label-right').hasClass('hide'));
        },

        'should toggle on interaction': function () {
            var buttonSwitch = this._buttonSwitch,
                content = buttonSwitch.get('content');

            Y.Assert.isFalse(buttonSwitch.get('activated'));
            Y.Assert.isTrue(content.one('.button-switch-inner-label-left').hasClass('hide'));
            Y.Assert.isFalse(content.one('.button-switch-inner-label-right').hasClass('hide'));

            content.simulate('click');
            Y.Assert.isTrue(buttonSwitch.get('activated'));
            Y.Assert.isFalse(content.one('.button-switch-inner-label-left').hasClass('hide'));
            Y.Assert.isTrue(content.one('.button-switch-inner-label-right').hasClass('hide'));

            content.simulate('click');
            Y.Assert.isFalse(buttonSwitch.get('activated'));
            Y.Assert.isTrue(content.one('.button-switch-inner-label-left').hasClass('hide'));
            Y.Assert.isFalse(content.one('.button-switch-inner-label-right').hasClass('hide'));
        },

        'shouuld have role="switch" attribute in the button': function() {
            var buttonSwitch = this._buttonSwitch,
                content = buttonSwitch.get('content');

            Y.Assert.isTrue(content.getAttribute('role') == 'switch');
        },

        'should toggle aria-checked attribute on interaction': function() {
            var buttonSwitch = this._buttonSwitch,
                content = buttonSwitch.get('content');

            Y.Assert.isFalse(buttonSwitch.get('activated'));
            Y.Assert.isFalse(content.getAttribute('aria-checked') == 'true');

            content.simulate('click');
            Y.Assert.isTrue(buttonSwitch.get('activated'));
            Y.Assert.isTrue(content.getAttribute('aria-checked') == 'true');

            content.simulate('click');
            Y.Assert.isFalse(buttonSwitch.get('activated'));
            Y.Assert.isFalse(content.getAttribute('aria-checked') == 'true');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['aui-button-switch', 'aui-node', 'node-event-simulate', 'node-screen', 'test']
});