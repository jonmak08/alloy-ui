YUI.add('aui-tabview-tests', function(Y) {

    //--------------------------------------------------------------------------
    // AUI TabView Unit Tests
    //--------------------------------------------------------------------------

    var suite = new Y.Test.Suite('aui-tabview'),
        myTabView,
        myOtherTabView;

    myTabView = new Y.TabView({
        srcNode: '#myTab'
    }).render();

    myOtherTabView = new Y.TabView({
        children: [
            {
                content: '<br><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
                    'Accusamus dicta aspernatur beatae fuga neque cupiditate laudantium itaque ' +
                    'pariatur deleniti tenetur modi voluptatem animi sunt eligendi nisi corporis ' +
                    'expedita quaerat facilis.</p>',
                label: 'Tab #1'
            },
            {
                content: '<br><p>Doloremque beatae rem voluptate nulla perspiciatis atque laudantium ' +
                    'nihil impedit molestiae fuga veritatis quibusdam nam maiores aliquid. Deserunt ' +
                    'dolorum quas temporibus enim ex nihil nemo perspiciatis. Nisi deserunt rem id ' +
                    'pariatur in nostrum?</p>',
                disabled: true,
                label: 'Tab #2'
            },
            {
                content: '<br><p>Aliquid ipsum asperiores alias temporibus autem impedit soluta ut id ' +
                    'iure explicabo veritatis consectetur debitis eaque recusandae odit quas nobis ' +
                    'maxime saepe. Incidunt amet obcaecati. Ducimus soluta unde repellat laboriosam ' +
                    'fuga modi rem itaque!</p>',
                label: 'Tab #3'
            }
        ],
        srcNode: '#myOtherTab'
    }).render();

    //--------------------------------------------------------------------------
    // Test Case for invalid fields
    //--------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name: 'Tabview Tests',

        /*
         * Tests: AUI-976
         */
        'verify active tab instantiated from markup': function() {
            var activeTab = myTabView.getActiveTab(),
                tabs = myTabView.getTabs();

            Y.Assert.areEqual(1, tabs.indexOf(activeTab), 'The active tab should be the second one.');
        },

        /*
         * Tests: AUI-976
         */
        'verify disabled tab instantiated from markup': function() {
            var disabledTabs = [],
                tabs = myTabView.getTabs();

            tabs.each(function(node) {
                if (node.hasClass('disabled')) {
                    disabledTabs.push(node);
                }
            });

            Y.Assert.areEqual(1, disabledTabs.length, 'Only one tab marked as disabled is expected.');
            Y.Assert.areEqual(2, tabs.indexOf(disabledTabs[0]), 'The disabled tab should be the third one.');
        },

        /*
         * Tests: AUI-976
         */
        'verify active tab instantiated from script': function() {
            var activeTab = myOtherTabView.getActiveTab(),
                tabs = myOtherTabView.getTabs();

            Y.Assert.areEqual(0, tabs.indexOf(activeTab), 'The active tab should be the first one.');
        },

        /*
         * Tests: AUI-976
         */
        'verify disabled tab instantiated from script': function() {
            var disabledTabs = [],
                tabs = myOtherTabView.getTabs();

            tabs.each(function(node) {
                if (node.hasClass('disabled')) {
                    disabledTabs.push(node);
                }
            });

            Y.Assert.areEqual(1, disabledTabs.length, 'Only one tab marked as disabled is expected.');
            Y.Assert.areEqual(1, tabs.indexOf(disabledTabs[0]),
                'The disabled tab should be the second one.');
        },

        /*
         * Tests: AUI-1362
         */
        'verify set aria-selected attribute on tab when tab is selected': function() {
            var defaultTab = myTabView.getActiveTab()._node.children[0],
                firstTab = myTabView.getTabs()._nodes[0],
                firstTabChild = Y.one(firstTab.children[0]);

            Y.Assert.areEqual(firstTab.getAttribute('aria-selected'), 'false');

            Y.one(firstTab).addClass('focused');

            firstTabChild.simulate('click');

            Y.Assert.areEqual(firstTab.getAttribute('aria-selected'), 'true');

            Y.one(defaultTab).simulate('click');
        },

        /*
         * Tests: AUI-1362
         */
        'verify space bar keypress properly selects cell': function() {
            var firstTab = myTabView.getTabs()._nodes[0],
                firstTabChild = Y.one(firstTab.children[0]);

            firstTabChild.simulate('keydown', {keyCode: 32});

            Y.Assert.areEqual(myTabView.getActiveTab()._node, firstTab);
        },
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['test', 'aui-tabview', 'node-event-simulate']
});
