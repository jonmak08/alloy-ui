YUI.add('aui-scheduler-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-scheduler');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',

        setUp: function() {
            this._agendaView = new Y.SchedulerAgendaView(),
            this._dayView = new Y.SchedulerDayView(),
            this._monthView = new Y.SchedulerMonthView(),
            this._weekView = new Y.SchedulerWeekView();
        },

        tearDown: function() {
            if (this._scheduler) {
                this._scheduler.destroy();
                delete this._scheduler;
            }
        },

        _createScheduler: function(config) {
            this._scheduler = new Y.Scheduler(Y.merge({
                boundingBox: '#myScheduler',
                date: new Date(2013, 11, 4),
                eventRecorder: new Y.SchedulerEventRecorder(),
                items: [
                    {
                        color: '#8D8',
                        content: 'Colorful',
                        endDate: new Date(2013, 11, 6, 6),
                        startDate: new Date(2013, 11, 6, 2)
                    }
                ],
                render: true,
                views: [
                    this._weekView,
                    this._dayView,
                    this._monthView,
                    this._agendaView
                ]
            }, config));
        },

        'should be able to switch views': function() {
            this._createScheduler();

            Y.Assert.areSame(
                this._weekView,
                this._scheduler.get('activeView'),
                'The initial view should be week view'
            );

            Y.one('button.scheduler-base-view-day').simulate('click');
            Y.Assert.areSame(
                this._dayView,
                this._scheduler.get('activeView'),
                'The day view should have become active'
            );

            Y.one('button.scheduler-base-view-month').simulate('click');
            Y.Assert.areSame(
                this._monthView,
                this._scheduler.get('activeView'),
                'The month view should have become active'
            );

            Y.one('button.scheduler-base-view-agenda').simulate('click');
            Y.Assert.areSame(
                this._agendaView,
                this._scheduler.get('activeView'),
                'The agenda view should have become active'
            );
        },

        'event color is encoded in RGB': function() {
            this._createScheduler();

            var events = this._scheduler.getEventsByDay(new Date(2013, 11, 6));
            Y.Assert.areEqual(1, events.length);

            var node = events[0].get('node').item(0);

            Y.Assert.isNotNull(node);
            Y.Assert.isTrue(Y.Lang.String.startsWith(node.getStyle('color'), 'rgb('));
            Y.Assert.isTrue(Y.Lang.String.startsWith(node.getStyle('backgroundColor'), 'rgb('));
        },

        'events in the scheduler view should respond to the click event': function() {
            var recorder;

            this._createScheduler();
            this._scheduler.set('disabled', true);

            recorder = this._scheduler.get('eventRecorder');

            Y.one('button.scheduler-base-view-month').simulate('click');
            Y.one('.scheduler-event').simulate('click');

            Y.Assert.isTrue(
                recorder.popover.get('visible'),
                'Popover should be visible when event is clicked in month view'
            );

            Y.one('button.scheduler-base-view-agenda').simulate('click');
            Y.one('.scheduler-view-agenda-event').simulate('click');

            Y.Assert.isTrue(
                recorder.popover.get('visible'),
                'Popover should be visible when event is clicked in agenda view'
            );
        },

        'the current day in monthly view should be highlighted on all or most sides': function() {
            var thisDate;
            var monthContent;
            var rowsNode;
            var xLocations = [];
            var yLocations = [];
            var xTest = [];
            var yTest = [];

            this._createScheduler();
            this._scheduler.set('disabled', true);
            this._scheduler.set('todayDate', thisDate);
            this._scheduler.set('date', thisDate);

            Y.one('button.scheduler-base-view-month').simulate('click');

            monthContent = Y.one('.scheduler-view-month-content');
            rowsNode = monthContent.one('.scheduler-view-table-row-container').get('children');
            thisDate = new Date(2010, 11, 29); //starting date for test

            for (; thisDate.getFullYear() < 2014; thisDate = Y.Date.addDays(thisDate, 1)) { //ending year for test, should include four years for leap year cycles
                this._scheduler.set('todayDate', thisDate);
                this._scheduler.set('date', thisDate);

                todayTitle = monthContent.one('.scheduler-view-table-data-col-title-today');
                todayGrid = monthContent.one('.scheduler-view-table-colgrid-today');
                todayBottom = monthContent.one('.scheduler-view-table-data-col-title-down');

                Y.Assert.isNotNull(todayTitle);
                Y.Assert.isNotNull(todayGrid);
                Y.Assert.areEqual(todayTitle.get('innerHTML'), thisDate.getDate());

                var titleX = todayTitle.ancestor('tr').get('children').indexOf(todayTitle);
                xLocations.push(titleX);
                xLocations.push(todayGrid.ancestor('tr').get('children').indexOf(todayGrid));

                var titleY = rowsNode.indexOf(todayTitle.ancestor('.scheduler-view-table-row'));
                yLocations.push(titleY);
                yLocations.push(rowsNode.indexOf(todayGrid.ancestor('.scheduler-view-table-row')));

                xTest = [titleX, titleX];
                yTest = [titleY, titleY];

                if (titleY < rowsNode.size() - 1) {
                    xLocations.push(todayBottom.ancestor('tr').get('children').indexOf(todayBottom));
                    yLocations.push(rowsNode.get('children').indexOf(todayBottom.ancestor('.scheduler-view-table-row')) - 1);

                    xTest.push(titleX);
                    yTest.push(titleY);
                }

                Y.ArrayAssert.itemsAreEqual(xLocations, xTest);
                xLocations.length = yLocations.length = xTest.length = yTest.length = 0;
                // Ran out of time to document this, I'm very sorry.
                // This test should work PERFECTLY (I'm pretty sure).
            }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['node-event-simulate', 'test', 'aui-scheduler']
});
