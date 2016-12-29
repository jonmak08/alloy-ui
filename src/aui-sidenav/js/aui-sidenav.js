/**
 * The SideNav Utility
 *
 * @module aui-sidenav
 */

var Lang = A.Lang,
    isObject = Lang.isObject,
    COLLAPSED = 'collapsed',
    CONTAINER = 'container',
    CONTENT = 'content',
    CUBIC_BEZIER = 'cubic-bezier(0, 0.1, 0, 1.0)',
    EXPANDED = 'expanded',
    GUTTER = 'gutter',
    GUTTERNODE = 'gutterNode',
    POSITION = 'position',
    SIDE_NAV = 'SideNav',
    TOGGLE = 'toggle',
    TRANSITION = 'transition',
    TYPE = 'type',
    WIDTH = 'width';
    // BREAKPOINT: 'breakpoint',
    // POSITION: 'position',
    // GUTTER: 'gutter';

var toInt = function(str) {
    return parseInt(str, 10) || 0;
};


/**
 *
 * A base class for SideNav:
 *
 * @class A.SideNav
 * @extends A.Base
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 */
var SideNav = A.Component.create({
    /**
     * Static property provides a string to identify the class.
     *
     * @property SideNav.NAME
     * @type String
     * @static
     */
    NAME: SIDE_NAV,

    /**
     * Static property used to define the default attribute
     * configuration for the SideNav.
     *
     * @property SideNav.ATTRS
     * @type Object
     * @static
     */
    ATTRS: {
        /**
         * Node or Selector for container.
         *
         * @attribute container
         * @default '#sidenav-container'
         * @type {Node | String}
         */
        container: {
            setter: A.one
        },

        /**
         * Node or Selector for content.
         *
         * @attribute content
         * @default '#sidenav-content'
         * @type {Node | String}
         */
        content: {
            setter: A.one
        },

        /**
         * Gutter defines the gutter between the sidbar and main content.
         *
         * @attribute gutter
         * @default '15'
         * @type string
         */
        gutter: {
            value: '15px'
        },

        /**
         * GutterNode Node selector for gutter
         *
         * @attribute gutter
         * @default '15'
         * @type {int}
         */
        gutterNode: {
            setter: A.one
        },

        /**
        * position (left,right) of the side navigation
        * @attribute position
        * @default 'left'
        * @type String
        */
        position: {
            value: 'left'
        },

        /**
         * Node or Selector for toggler. Required.
         *
         * @attribute toggle
         * @default '#toggleBtn'
         * @type {Node | String}
         */
        toggle: {
            setter: A.one
        },

        /**
         * Transition definition such as duration and type of easing effect
         *
         * @attribute transition
         * @default 0.4
         * @type Object
         */
        transition: {
            validator: isObject,
            value: {
                duration: 0.4,
                easing: CUBIC_BEZIER
            }
        },

        /**
        * type of sidenav (relative, fixed, fixed-push) of the side navigation
        * @attribute type
        * @default 'relative'
        * @type String
        */
        type: {
            value: 'push'
        },

        /**
        * width of the side navigation
        * @attribute width
        * @default '225px'
        * @type String
        */
        width: {
            width: '225px'
        },
    },

    /**
     * Static property used to define which component it extends.
     *
     * @property CharCounter.EXTENDS
     * @type Object
     * @static
     */
    EXTENDS: A.Base,

    prototype: {

        initializer: function() {
            var instance = this,
                current = true,
                position = instance.get(POSITION),
                toggler = A.one(instance.get(TOGGLE)),
                type = instance.get(TYPE);

            instance.bindUI();
            instance.syncUI();


            if (type == 'push') {
                if (position == 'left'){
                    toggler.on(
                        'click',
                        function() {
                            if (current == true) {
                                instance.hidePush();
                                current = false;

                            }else{
                                instance.showPush();
                                current = true;
                            }
                        }
                    )
                }else{
                    toggler.on(
                        'click',
                        function() {
                            if(current == true) {
                                instance.hideIsRightPush();
                                current = false;
                            }else{
                                instance.showIsRightPush();
                                current = true;
                            }
                        }
                    )
                }
            }else{
                if (position == 'left'){
                    toggler.on(
                        'click',
                        function() {
                            if (current == true) {
                                instance.hide();
                                current = false;

                            }else{
                                instance.show();
                                current = true;
                            }
                        }
                    )
                }else{
                    toggler.on(
                        'click',
                        function() {
                            if(current == true) {
                                instance.hideIsRight();
                                current = false;
                            }else{
                                instance.showIsRight();
                                current = true;
                            }
                        }
                    )
                }
            }
        },

        bindUI: function(){
            var instance = this,
                setWidth = instance.get(WIDTH),
                setGutter = instance.get(GUTTER);
                containerNode = A.one(instance.get(CONTAINER)),
                gutterNode = A.one(instance.get(GUTTERNODE)),

            containerNode.setStyle('width', setWidth);
            gutterNode.setStyle('width', setGutter);
            console.log('bindUI');
        },

        renderUI: function() {

        },

        syncUI: function() {
            // var instance = this,
            //     container_node = A.one(instance.get(CONTAINER)),
            //     content_node = A.one(instance.get(CONTENT)),
            //     screen_size = A.one(instance.get(CONTAINER)).get('winWidth');

            // if (screen_size < 480) {
            //     container_node.addClass('collapsed');
            //     content_node.addClass('smallscreen');
            // }

        },

        hide: function() {
            var instance = this,
                node = A.one(instance.get(CONTAINER));
            node.addClass('closed');
            node.setStyle('overflow-x', 'hidden');
        },

        show: function() {
            var instance = this,
                node = A.one(instance.get(CONTAINER));
                node.removeClass('closed');
        },

        hidePush: function() {
            var instance = this,
                container_node = A.one(instance.get(CONTAINER));
                content_node = A.one(instance.get(CONTENT));
            container_node.addClass('closed');
            content_node.addClass('expanded');
            console.log(container_node);
            console.log(content_node);
        },

        showPush: function() {
            var instance = this,
                container_node = A.one(instance.get(CONTAINER));
                content_node = A.one(instance.get(CONTENT));
            container_node.removeClass('closed');
            content_node.removeClass('expanded');
            console.log(container_node);
            console.log(content_node);
        },

        hideIsRight: function() {
            var instance = this,
                node = A.one(instance.get(CONTAINER));
            node.addClass('right-closed');
        },

        showIsRight: function() {
            var instance = this,
                node = A.one(instance.get(CONTAINER));
            node.removeClass('right-closed');
        },

        hideIsRightPush: function() {
            var instance = this,
                container_node = A.one(instance.get(CONTAINER));
                content_node = A.one(instance.get(CONTENT));
            container_node.addClass('right-closed');
            content_node.addClass('expanded-right');
        },

        showIsRightPush: function() {
            var instance = this,
                container_node = A.one(instance.get(CONTAINER));
                content_node = A.one(instance.get(CONTENT));
            container_node.removeClass('right-closed');
            content_node.removeClass('expanded-right');
        }
    }
});

A.SideNav = SideNav;
