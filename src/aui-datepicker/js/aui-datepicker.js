/**
 * The DatePicker Component
 *
 * @module aui-datepicker
 */

var Lang = A.Lang,

    clamp = function(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    ACTIVE_INPUT = 'activeInput',
    AUTO_HIDE = 'autoHide',
    CALENDAR = 'calendar',
    DATE = 'date',
    DATE_CLICK = 'dateClick',
    MULTIPLE = 'multiple',
    PANES = 'panes',
    SELECTION_CHANGE = 'selectionChange',
    SELECTION_MODE = 'selectionMode',
    TRIGGER = 'trigger';

/**
 * A base class for `DatePickerBase`.
 *
 * @class A.DatePickerBase
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 */

function DatePickerBase() {}

/**
 * Static property used to define the default attribute
 * configuration for the DatePickerBase.
 *
 * @property DatePickerBase.PANES
 * @type Array
 * @static
 */
DatePickerBase.PANES = [
    A.CalendarBase.ONE_PANE_TEMPLATE,
    A.CalendarBase.TWO_PANE_TEMPLATE,
    A.CalendarBase.THREE_PANE_TEMPLATE
];

/**
 * TODO. Wanna help? Please send a Pull Request.
 *
 * @property DatePickerBase.ATTRS
 * @type Object
 * @static
 */
DatePickerBase.ATTRS = {

    /**
     * Sets the initial visibility.
     *
     * @attribute autoHide
     * @default true
     * @type {Boolean}
     */
    autoHide: {
        validator: Lang.isBoolean,
        value: true
    },

    /**
     * Stores the configuration of the `Calendar` instance.
     *
     * @attribute calendar
     * @default {}
     * @writeOnce
     */
    calendar: {
        setter: '_setCalendar',
        value: {},
        writeOnce: true
    },

    /**
     * Defines how many panes should be rendered.
     *
     * @attribute panes
     * @default 1
     * @type Number
     * @writeOnce
     */
    panes: {
        setter: '_setPanes',
        validator: Lang.isNumber,
        value: 1,
        writeOnce: true
    },


    /**
     * Boolean indicating if use of the WAI-ARIA Roles and States
     * should be enabled.
     *
     * @attribute useARIA
     * @default true
     * @type Boolean
     */
    useARIA: {
        validator: A.Lang.isBoolean,
        value: true,
        writeOnce: 'initOnly'
    }
};

A.mix(DatePickerBase.prototype, {
    calendar: null,

    /**
     * Construction logic executed during DatePickerBase instantiation. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var instance = this;

        instance.after(SELECTION_CHANGE, instance._afterDatePickerSelectionChange);

        if (instance.get('useARIA')) {
            instance.plug(A.Plugin.Aria);
        }
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method clearSelection
     * @param silent
     */
    clearSelection: function(silent) {
        var instance = this;

        instance.getCalendar()._clearSelection(silent);

        if (instance.get('useARIA')) {
            instance.aria.setAttribute('label', '', instance.get('activeInput'));
        }
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method deselectDates
     * @param dates
     */
    deselectDates: function(dates) {
        var instance = this;

        instance.getCalendar().deselectDates(dates);
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method getCalendar
     */
    getCalendar: function() {
        var instance = this,
            calendar = instance.calendar,
            originalCalendarTemplate;

        if (!calendar) {
            // CalendarBase leaks a functionality to dinamically switch the
            // template. Therefore, switch it to respect panels configuration
            // attribute, then switch it back after calendar renders.
            originalCalendarTemplate = A.CalendarBase.CONTENT_TEMPLATE;
            A.CalendarBase.CONTENT_TEMPLATE =
                DatePickerBase.PANES[instance.get(PANES) - 1];

            // Initialize the popover instance before calendar renders since it
            // will use popober.bodyNode as render node.
            instance.getPopover();

            calendar = new A.Calendar(instance.get(CALENDAR));
            calendar.render(instance.popover.bodyNode);
            instance.calendar = calendar;

            calendar.after(
                SELECTION_CHANGE, instance._afterCalendarSelectionChange,
                instance);
            calendar.after(
                DATE_CLICK, instance._afterCalendarDateClick,
                instance);

            // Restore the original CalendarBase template.
            A.CalendarBase.CONTENT_TEMPLATE = originalCalendarTemplate;
        }

        return calendar;
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method selectDates
     * @param dates
     */
    selectDates: function(dates) {
        var instance = this;

        instance.getCalendar().selectDates(instance._normalizeDatesForCalendar(dates));
    },

    /**
     * Selects dates in the 'Calendar' while only allowing
     * the calendar to fire 'selectionChange' once.
     *
     * @method selectDatesFromInputValue
     * @param dates
     */
    selectDatesFromInputValue: function(dates) {
        var instance = this,
            calendar = instance.getCalendar();

        A.Array.each(
            dates,
            function(date) {
                calendar._addDateToSelection(date, true);
            }
        );

        calendar._fireSelectionChange();
    },

    /**
     * Renders the widget in an `<input>` node.
     *
     * @method useInputNode
     * @param node
     */
    useInputNode: function(node) {
        var instance = this,
            popover = instance.getPopover();

        popover.set(TRIGGER, node);

        if (!popover.get('visible')) {
            instance.set(ACTIVE_INPUT, node);

            instance.alignTo(node);
        }

        if (instance.get('useARIA')) {
            instance.aria.setAttribute('live', instance.get('live'), instance.get('activeInput'));
        }

        instance.clearSelection(true);

        instance.selectDatesFromInputValue(instance.getParsedDatesFromInputValue());
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method _afterCalendarDateClick
     * @protected
     */
    _afterCalendarDateClick: function() {
        var instance = this,
            calendar = instance.getCalendar(),
            date = instance.getSelectedDates(),
            selectionMode = calendar.get(SELECTION_MODE);

        if (instance.get(AUTO_HIDE) && (selectionMode !== MULTIPLE)) {
            instance.hide();
        }

        if (instance.get('useARIA')) {
            this.aria.setAttribute('label', date, instance.get('activeInput'));
        }
    },

    /**
     * Selects dates in the 'Calendar' while only allowing
     * the calendar to fire 'selectionChange' once.
     *
     * @method selectDatesFromInputValue
     * @param dates
     */
    selectDatesFromInputValue: function(dates) {
        var instance = this,
            calendar = instance.getCalendar();

        A.Array.each(
            dates,
            function(date) {
                calendar._addDateToSelection(date, true);
            }
        );

        calendar._fireSelectionChange();
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method _afterCalendarSelectionChange
     * @param event
     * @protected
     */
    _afterCalendarSelectionChange: function(event) {
        var instance = this,
            newDates,
            newSelection = event.newSelection,
            prevDates = instance.getSelectedDates() || [];

        newDates = newSelection.concat(prevDates);

        newDates = A.Array.dedupe(newDates);

        if (newDates.length !== prevDates.length || newSelection.length < prevDates.length) {
            instance.fire('selectionChange', {
                newSelection: newSelection
            });
        }
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method _afterDatePickerSelectionChange
     * @protected
     */
    _afterDatePickerSelectionChange: function() {
        var instance = this,
            calendar = instance.getCalendar(),
            selectionMode = calendar.get('selectionMode');

        instance._setCalendarToFirstSelectedDate();
    },

    /**
     * Checks if the given dates are referencing the same
     * day, month and year.
     *
     * @method _isSameDay
     * @param date1
     * @param date2
     * @protected
     */
    _isSameDay: function(date1, date2) {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method _onceUserInteractionRelease
     * @param event
     * @protected
     */
    _onceUserInteractionRelease: function(event) {
        var instance = this;

        instance.useInputNodeOnce(event.currentTarget);

        instance.alignTo(event.currentTarget);

        instance._userInteractionInProgress = false;
    },

    /**
     * Sets the first selected date in the `Calendar`.
     *
     * @method _setCalendarToFirstSelectedDate
     * @protected
     */
    _setCalendarToFirstSelectedDate: function() {
        var instance = this,
            dates = instance.getSelectedDates(),
            firstSelectedDate = dates[0];

        if (firstSelectedDate) {
            instance.getCalendar().set('date', firstSelectedDate);
        }
    },

    /**
     * Sets the `calendar` value by merging its object with another properties.
     *
     * @method _setCalendar
     * @param val
     * @protected
     */
    _setCalendar: function(val) {
        return A.merge({
            showNextMonth: true,
            showPrevMonth: true
        }, val);
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method _setPanes
     * @param val
     * @protected
     */
    _setPanes: function(val) {
        return clamp(val, 1, 3);
    }
}, true);

A.DatePickerBase = DatePickerBase;

/**
 * A base class for DatePicker.
 *
 * @class A.DatePicker
 * @extends A.Base
 * @uses A.DatePickerDelegate, A.DatePickerPopover, A.DatePickerBase
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 */
A.DatePicker = A.Base.create('datepicker', A.Base, [A.DatePickerDelegate, A.DatePickerPopover, A.DatePickerBase]);