/**
 * The Button Switch module.
 *
 * @module aui-button-switch
 */

var CSS_BUTTON_SWITCH = A.getClassName('button', 'switch'),
    CSS_BUTTON_SWITCH_LEFT = A.getClassName('button', 'switch', 'left'),
    CSS_BUTTON_SWITCH_RIGHT = A.getClassName('button', 'switch', 'right'),
    CSS_INNER_CIRCLE = A.getClassName('button', 'switch', 'inner', 'circle'),
    CSS_INNER_LABEL_LEFT = A.getClassName('button', 'switch', 'inner', 'label', 'left'),
    CSS_INNER_LABEL_RIGHT = A.getClassName('button', 'switch', 'inner', 'label', 'right'),

    INNER_CIRCLE_THRESHOLD = 2,

    TPL_BUTTON_SWITCH = '<div class="' + CSS_BUTTON_SWITCH + '" tabindex="0">' +
        '<label class="' + CSS_INNER_LABEL_LEFT + '"></label>' +
        '<label class="' + CSS_INNER_LABEL_RIGHT + '"></label></div>',
    TPL_INNER_CIRCLE = '<span class="' + CSS_INNER_CIRCLE + '"></span>';

/**
 * The base class for Button Switch.
 *
 * @class A.ButtonSwitch
 * @extends A.Widget
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
A.ButtonSwitch = A.Base.create('button-switch', A.Widget, [], {

    /**
     * Bind the events on the ButtonSwitch UI. Lifecycle.
     *
     * @method bindUI
     * @protected
     */
    bindUI: function() {
        var aria = this.get('useARIA'),
            content = this.get('content');

        content.on('click', this._onButtonSwitchClick, this);
        content.on('key', this._onButtonSwitchKey, 'enter,space,37,39', this);
        this.after('activatedChange', this._afterActivatedChange, this);
        this.after('innerLabelLeftChange', this._afterInnerLabelLeftChange, this);
        this.after('innerLabelRightChange', this._afterInnerLabelRightChange, this);

        if (aria) {
            this._setAriaAttributes();
        }
    },

    /**
     * Renders the ButtonSwitch component instance. Lifecycle.
     *
     * @method renderUI
     * @protected
     */
    renderUI: function() {
        var content = this.get('content'),
            contentBox = this.get('contentBox');

        contentBox.append(content);
        this._uiSetActivate(this.get('activated'));
        this._uiSetInnerLabelLeft(this.get('innerLabelLeft'));
        this._uiSetInnerLabelRight(this.get('innerLabelRight'));
    },

    /**
     * Fires after `activated` attribute changes.
     *
     * @method _afterActivatedChange
     * @protected
     */
    _afterActivatedChange: function() {
        this._uiSetActivate(this.get('activated'));
    },

    /**
     * Fires after `innerLabelLeft` attribute changes.
     *
     * @method _afterInnerLabelLeftChange
     * @protected
     */
    _afterInnerLabelLeftChange: function(event) {
        this._uiSetInnerLabelLeft(event.newVal);
    },

    /**
     * Fires after `innerLabelRight` attribute changes.
     *
     * @method _afterInnerLabelRightChange
     * @protected
     */
    _afterInnerLabelRightChange: function(event) {
        this._uiSetInnerLabelRight(event.newVal);
    },

    /**
     * Returns the switch button instance.
     *
     * @method _getInnerCircle
     * @return {Node}
     * @protected
     */
    _getInnerCircle: function () {
        if (!this._innerCircle) {
            this._innerCircle = A.Node.create(TPL_INNER_CIRCLE);
            this.get('content').append(this._innerCircle);
        }

        return this._innerCircle;
    },

    /**
     * Fires when Button Switch is clicked.
     *
     * @method _onButtonSwitchClick
     * @protected
     */
    _onButtonSwitchClick: function() {
        this._onButtonSwitchInteraction();
    },

    /**
     * Fires after user interacts.
     *
     * @method _onButtonSwitchInteraction
     * @protected
     */
    _onButtonSwitchInteraction: function() {
        var activated = this.get('activated'),
            aria = this.get('useARIA'),
            content = this.get('content');

        this.set('activated', !activated);

        if (aria) {
            this.aria.setAttribute('checked', !activated, content);
        }
    },

    /**
     * Fires when space, enter, right, or left key is pressed.
     *
     * @method _onButtonSwitchKey
     * @protected
     */
    _onButtonSwitchKey: function() {
        var activated = this.get('activated');
            keyCode = event.keyCode;

        if ((keyCode == 32 || keyCode == 13) || (keyCode == 39 && !activated) || (keyCode == 37 && activated)) {
            this._onButtonSwitchInteraction();
        }
    },

    /**
     * Update the aria attributes for the button switch UI.
     *
     * @method _setAriaAttributes
     * @protected
     */
    _setAriaAttributes: function() {
        var activated = this.get('activated'),
            content = this.get('content'),
            role = this.get('role');

        this.plug(
            A.Plugin.Aria,
            {
                roleName: role,
                roleNode: content
            }
        )

        this.aria.setAttribute('checked', activated, content);
    },

    /**
     * Updates the ui according to the value of the `activated` attribute.
     *
     * @method _uiSetActivate
     * @protected
     */
    _uiSetActivate: function(activated) {
        var content = this.get('content'),
            buttonSwitchWidth = content.get('offsetWidth'),
            innerCircle = this._getInnerCircle(),
            innerCircleWidth = innerCircle.get('offsetWidth');

        content.one('.' + CSS_INNER_LABEL_RIGHT).toggleClass('hide', activated);
        content.one('.' + CSS_INNER_LABEL_LEFT).toggleClass('hide', !activated);
        content.toggleClass('activated', activated);

        if (!innerCircleWidth) {
            this._setInnerCirclePosition(activated);
        }
        else {
            innerCircle.removeClass(CSS_BUTTON_SWITCH_LEFT);
            innerCircle.removeClass(CSS_BUTTON_SWITCH_RIGHT);

            if (activated) {
                innerCircle.setStyle('left', INNER_CIRCLE_THRESHOLD + 'px');
                innerCircle.transition({
                    duration: 0.6,
                    left: buttonSwitchWidth - innerCircleWidth - INNER_CIRCLE_THRESHOLD + 'px'
                });
            }
            else {
                innerCircle.setStyle('left', buttonSwitchWidth - innerCircleWidth - INNER_CIRCLE_THRESHOLD + 'px');
                innerCircle.transition({
                    duration: 0.6,
                    left: INNER_CIRCLE_THRESHOLD + 'px'
                });
            }
        }
    },

    /**
     * Updates Inner Circle position with CSS classes.
     *
     * @method _setInnerCirclePosition
     * @param {Boolean} activated
     * @protected
     */
    _setInnerCirclePosition: function(activated) {
        var innerCircle = this._getInnerCircle();

        // Clear the styling, as it has higher precedence than css classes.
        innerCircle.setStyle('left', '');

        if (activated) {
            innerCircle.removeClass(CSS_BUTTON_SWITCH_LEFT);
            innerCircle.addClass(CSS_BUTTON_SWITCH_RIGHT);
        }
        else {
            innerCircle.removeClass(CSS_BUTTON_SWITCH_RIGHT);
            innerCircle.addClass(CSS_BUTTON_SWITCH_LEFT);
        }
    },

    /**
     * Updates the ui according to the value of the `innerLabelLeft` attribute.
     *
     * @method _uiSetInnerLabelLeft
     * @param {String} label
     * @protected
     */
    _uiSetInnerLabelLeft: function(label) {
        return this.get('content').one('.' + CSS_INNER_LABEL_LEFT).set('text', label);
    },

    /**
     * Updates the ui according to the value of the `innerLabelRight` attribute.
     *
     * @method _uiSetInnerLabelRight
     * @param {String} label
     * @protected
     */
    _uiSetInnerLabelRight: function(label) {
        return this.get('content').one('.' + CSS_INNER_LABEL_RIGHT).set('text', label);
    }
}, {

    /**
     * Static property used to define the default attribute configuration for
     * the ButtonSwitch.
     *
     * @property ATTRS
     * @type {Object}
     * @static
     */
    ATTRS: {

        /**
         * Determines if `ButtonSwitch` is active or not.
         *
         * @attribute activated
         * @type Boolean
         */
        activated: {
            value: false
        },

        /**
         * Node containing the contents of this field.
         *
         * @attribute content
         * @type Node
         */
        content: {
            validator: function(val) {
                return A.instanceOf(val, A.Node);
            },
            valueFn: function() {
                return A.Node.create(TPL_BUTTON_SWITCH);
            },
            writeOnce: 'initOnly'
        },

        /**
         * The label to be used on button left side.
         *
         * @attribute innerLabelLeft
         * @type String
         */
        innerLabelLeft: {
            value: '',
            validator: A.Lang.isString
        },

        /**
         * The label to be used on button right side.
         *
         * @attribute innerLabelRight
         * @type String
         */
        innerLabelRight: {
            value: '',
            validator: A.Lang.isString
        },

        /**
         * Attribute role = 'switch'.
         *
         * @attribute role
         * @type String
         */
        role: {
            value: 'switch',
            validator: A.Lang.isString
        },

        /**
        * Boolean indicating if use of the WAI-ARIA Roles and States should be enabled..
        *
        * @attribute useARIA
        * @default true
        * @type {Boolean}
        */
        useARIA: {
            validator: A.Lang.isBoolean,
            value: true,
            writeOnce: 'initOnly'
        }
    }
});
