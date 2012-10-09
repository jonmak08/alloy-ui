AUI.add('aui-tree-node', function(A) {
/**
 * The TreeNode Utility
 *
 * @module aui-tree
 * @submodule aui-tree-node
 */

var L = A.Lang,
	isString = L.isString,
	isBoolean = L.isBoolean,

	ALWAYS_SHOW_HITAREA = 'alwaysShowHitArea',
	BLANK = '',
	BOUNDING_BOX = 'boundingBox',
	CHILDREN = 'children',
	CLEARFIX = 'clearfix',
	COLLAPSED = 'collapsed',
	CONTAINER = 'container',
	CONTENT = 'content',
	CONTENT_BOX = 'contentBox',
	EXPANDED = 'expanded',
	HELPER = 'helper',
	HIDDEN = 'hidden',
	HIT_AREA_EL = 'hitAreaEl',
	HITAREA = 'hitarea',
	ICON = 'icon',
	ICON_EL = 'iconEl',
	ID = 'id',
	LABEL = 'label',
	LABEL_EL = 'labelEl',
	LAST_SELECTED = 'lastSelected',
	LEAF = 'leaf',
	NODE = 'node',
	OVER = 'over',
	OWNER_TREE = 'ownerTree',
	PARENT_NODE = 'parentNode',
	RADIO = 'radio',
	RENDERED = 'rendered',
	SELECTED = 'selected',
	SPACE = ' ',
	TREE = 'tree',
	TREE_NODE = 'tree-node',

	concat = function() {
		return Array.prototype.slice.call(arguments).join(SPACE);
	},

	isTreeNode = function(v) {
		return ( v instanceof A.TreeNode );
	},

	isTreeView = function(v) {
		return ( v instanceof A.TreeView );
	},

	getCN = A.getClassName,

	CSS_HELPER_CLEARFIX = getCN(HELPER, CLEARFIX),
	CSS_TREE_COLLAPSED = getCN(TREE, COLLAPSED),
	CSS_TREE_CONTAINER = getCN(TREE, CONTAINER),
	CSS_TREE_CONTENT_BOX = getCN(TREE, CONTENT_BOX),
	CSS_TREE_EXPANDED = getCN(TREE, EXPANDED),
	CSS_TREE_HIDDEN = getCN(TREE, HIDDEN),
	CSS_TREE_HITAREA = getCN(TREE, HITAREA),
	CSS_TREE_ICON = getCN(TREE, ICON),
	CSS_TREE_LABEL = getCN(TREE, LABEL),
	CSS_TREE_NODE = getCN(TREE, NODE),
	CSS_TREE_NODE_CONTENT = getCN(TREE, NODE, CONTENT),
	CSS_TREE_NODE_HIDDEN_HITAREA = getCN(TREE, NODE, HIDDEN, HITAREA),
	CSS_TREE_NODE_LEAF = getCN(TREE, NODE, LEAF),
	CSS_TREE_NODE_OVER = getCN(TREE, NODE, OVER),
	CSS_TREE_NODE_SELECTED = getCN(TREE, NODE, SELECTED),

	HIT_AREA_TPL = '<div class="'+CSS_TREE_HITAREA+'"></div>',
	ICON_TPL = '<div class="'+CSS_TREE_ICON+'"></div>',
	LABEL_TPL = '<div class="'+CSS_TREE_LABEL+'"></div>',
	NODE_CONTAINER_TPL = '<ul></ul>',

	NODE_BOUNDING_TEMPLATE = '<li class="'+CSS_TREE_NODE+'"></li>',
	NODE_CONTENT_TEMPLATE = '<div class="'+concat(CSS_HELPER_CLEARFIX, CSS_TREE_NODE_CONTENT)+'"></div>';

/**
 * A base class for TreeNode, providing:
 * <ul>
 *	<li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *	<li>The node for the TreeView component</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>var instance = new A.TreeNode({
	boundingBox: ''
}).render();
 * </code></pre>
 *
 * Check the list of <a href="TreeNode.html#configattributes">Configuration Attributes</a> available for
 * TreeNode.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class TreeNode
 * @constructor
 * @extends TreeData
 */
var TreeNode = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property TreeNode.NAME
		 * @type String
		 * @static
		 */
		NAME: TREE_NODE,

		/**
		 * Static property used to define the default attribute
		 * configuration for the TreeNode.
		 *
		 * @property TreeNode.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {

			boundingBox: {
				valueFn: function() {
					return A.Node.create(NODE_BOUNDING_TEMPLATE);
				}
			},

			contentBox: {
				valueFn: function() {
					return A.Node.create(NODE_CONTENT_TEMPLATE);
				}
			},

			/**
			 * If true the TreeNode is draggable.
			 *
			 * @attribute draggable
			 * @default true
			 * @type boolean
			 */
			draggable: {
				value: true,
				validator: isBoolean
			},

			/**
			 * TreeView which contains the current TreeNode.
			 *
			 * @attribute ownerTree
			 * @default null
			 * @type TreeView
			 */
			ownerTree: {
				value: null
			},

			/**
			 * Label of the TreeNode.
			 *
			 * @attribute label
			 * @default ''
			 * @type String
			 */
			label: {
				value: BLANK,
				validator: isString
			},

			/**
			 * Whether the TreeNode is expanded by default.
			 *
			 * @attribute expanded
			 * @default false
			 * @type boolean
			 */
			expanded: {
				value: false,
				validator: isBoolean
			},

			/**
			 * Id of the TreeNode.
			 *
			 * @attribute id
			 * @default null
			 * @type String
			 */
			id: {
				validator: isString,
				valueFn: function() {
					return A.guid();
				}
			},

			/**
			 * Whether the TreeNode could have children or not (i.e. if any
			 * children is present the TreeNode is a leaf).
			 *
			 * @attribute leaf
			 * @default true
			 * @type boolean
			 */
			leaf: {
				value: true,
				setter: function(v) {
					// if has children it's not a leaf
					if (v && this.get(CHILDREN).length) {
						return false;
					}

					return v;
				},
				validator: isBoolean
			},

			/**
			 * Next sibling of the current TreeNode.
			 *
			 * @attribute nextSibling
			 * @default null
			 * @type TreeNode
			 */
			nextSibling: {
				getter: '_getSibling',
				value: null,
				validator: isTreeNode
			},

			/**
			 * Previous sibling of the current TreeNode.
			 *
			 * @attribute prevSibling
			 * @default null
			 * @type TreeNode
			 */
			prevSibling: {
				getter: '_getSibling',
				value: null,
				validator: isTreeNode
			},

			/**
			 * Parent node of the current TreeNode.
			 *
			 * @attribute parentNode
			 * @default null
			 * @type TreeNode
			 */
			parentNode: {
				value: null,
				validator: function(val) {
					return isTreeNode(val) || isTreeView(val);
				}
			},

			/**
			 * Label element to house the <code>label</code> attribute.
			 *
			 * @attribute labelEl
			 * @default Generated DOM element.
			 * @type Node | String
			 */
			labelEl: {
				setter: A.one,
				valueFn: function() {
					var label = this.get(LABEL);

					return A.Node.create(LABEL_TPL).html(label).unselectable();
				}
			},

			/**
			 * Hitarea element.
			 *
			 * @attribute hitAreaEl
			 * @default Generated DOM element.
			 * @type Node | String
			 */
			hitAreaEl: {
				setter: A.one,
				valueFn: function() {
					return A.Node.create(HIT_AREA_TPL);
				}
			},

			/**
			 * Always show the hitarea icon.
			 *
			 * @attribute alwaysShowHitArea
			 * @default true
			 * @type boolean
			 */
			alwaysShowHitArea: {
				value: true,
				validator: isBoolean
			},

			/**
			 * Icon element.
			 *
			 * @attribute iconEl
			 * @type Node | String
			 */
			iconEl: {
				setter: A.one,
				valueFn: function() {
					return A.Node.create(ICON_TPL);
				}
			},

			tabIndex: {
				value: null
			},

			rendered: {
				validator: isBoolean,
				value: false
			}
		},

		AUGMENTS: [A.TreeData],

		EXTENDS: A.Base,

		prototype: {
			/**
			 * Replaced BOUNDING_TEMPLATE with NODE_BOUNDING_TEMPLATE.
			 *
			 * @property BOUNDING_TEMPLATE
			 * @type String
			 * @protected
			 */
			BOUNDING_TEMPLATE: NODE_BOUNDING_TEMPLATE,
			/**
			 * Replaced CONTENT_TEMPLATE with NODE_CONTENT_TEMPLATE.
			 *
			 * @property CONTENT_TEMPLATE
			 * @type String
			 * @protected
			 */
			CONTENT_TEMPLATE: NODE_CONTENT_TEMPLATE,

			/**
			 * Construction logic executed during TreeNode instantiation. Lifecycle.
			 *
			 * @method initializer
			 * @protected
			 */
			initializer: function() {
				var instance = this;
				var boundingBox = instance.get(BOUNDING_BOX);

				boundingBox.setData(TREE_NODE, instance);

				// Sync the Widget TreeNode id with the BOUNDING_BOX id
				instance._syncTreeNodeBBId();

				instance._uiSetExpanded(instance.get(EXPANDED));
				instance._uiSetLeaf(instance.get(LEAF));
			},

			/**
			 * Bind the events on the TreeNode UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;

				instance.after('childrenChange', A.bind(instance._afterSetChildren, instance));
				instance.after('expandedChange', A.bind(instance._afterExpandedChange, instance));
				instance.after('idChange', instance._afterSetId, instance);
				instance.after('leafChange', A.bind(instance._afterLeafChange, instance));
			},

			render: function(container) {
				var instance = this;

				if (!instance.get(RENDERED)) {
					instance.renderUI();
					instance.bindUI();
					instance.syncUI();

					instance.set(RENDERED, true);
				}

				if (container) {
					instance.get(BOUNDING_BOX).appendTo(container);
				}
			},

			/**
			 * Create the DOM structure for the TreeNode. Lifecycle.
			 *
			 * @method renderUI
			 * @protected
			 */
			renderUI: function() {
				var instance = this;

				instance._renderBoundingBox();
				instance._renderContentBox();
			},

			/**
			 * Sync the TreeNode UI. Lifecycle.
			 *
			 * @method syncUI
			 * @protected
			 */
			syncUI: function() {
				var instance = this;

				instance._syncHitArea( instance.get( CHILDREN ) );
			},

			_afterExpandedChange: function(event) {
				var instance = this;

				instance._uiSetExpanded(event.newVal);
			},

			_afterLeafChange: function(event) {
				var instance = this;

				instance._uiSetLeaf(event.newVal);
			},

			/**
			 * Fires after set children.
			 *
			 * @method _afterSetChildren
			 * @param {EventFacade} event
			 * @protected
			 */
			_afterSetChildren: function(event) {
				var instance = this;

				instance._syncHitArea(event.newVal);
			},

			/**
			 * Render the <code>contentBox</code> node.
			 *
			 * @method _renderContentBox
			 * @protected
			 * @return {Node}
			 */
			_renderContentBox: function(v) {
				var instance = this;
				var contentBox = instance.get(CONTENT_BOX);

				if (!instance.isLeaf()) {
					var expanded = instance.get(EXPANDED);

					// add folder css classes state
					contentBox.addClass(
						expanded ? CSS_TREE_EXPANDED : CSS_TREE_COLLAPSED
					);

					if (expanded) {
						instance.expand();
					}
				}

				return contentBox;
			},

			/**
			 * Render the <code>boundingBox</code> node.
			 *
			 * @method _renderBoundingBox
			 * @protected
			 * @return {Node}
			 */
			_renderBoundingBox: function() {
				var instance = this;
				var boundingBox = instance.get(BOUNDING_BOX);
				var contentBox = instance.get(CONTENT_BOX);

				var nodeContainer = null;

				contentBox.append( instance.get(ICON_EL) );
				contentBox.append( instance.get(LABEL_EL) );

				boundingBox.append(contentBox);

				var nodeContainer = instance.get(CONTAINER);

				if (nodeContainer) {
					if (!instance.get(EXPANDED)) {
						nodeContainer.addClass(CSS_TREE_HIDDEN);
					}

					boundingBox.append(nodeContainer);
				}

				return boundingBox;
			},

			/**
			 * Render the node container.
			 *
			 * @method _createNodeContainer
			 * @protected
			 * @return {Node}
			 */
			_createNodeContainer: function() {
				var instance = this;

				// creating <ul class="aui-tree-container">
				var nodeContainer = instance.get(CONTAINER) || A.Node.create(NODE_CONTAINER_TPL);

				nodeContainer.addClass(CSS_TREE_CONTAINER);

				// when it's not a leaf it has a <ul> container
				instance.set(CONTAINER, nodeContainer);

				return nodeContainer;
			},

			/**
			 * Sync the hitarea UI.
			 *
			 * @method _syncHitArea
			 * @param {Array} children
			 * @protected
			 */
			_syncHitArea: function(children) {
				var instance = this;

				if (instance.get(ALWAYS_SHOW_HITAREA) || children.length) {
					instance.showHitArea();
				}
				else {
					instance.hideHitArea();

					instance.collapse();
				}
			},

			/*
			* Methods
			*/
			appendChild: function() {
				var instance = this;

				if (!instance.isLeaf()) {
					A.TreeNode.superclass.appendChild.apply(instance, arguments);
				}
			},

			/**
			 * Collapse the current TreeNode.
			 *
			 * @method collapse
			 */
			collapse: function() {
				var instance = this;

				instance.set(EXPANDED, false);
			},

			collapseAll: function() {
				var instance = this;

				A.TreeNode.superclass.collapseAll.apply(instance, arguments);

				// instance is also a node, so collapse itself
				instance.collapse();
			},

			/**
			 * Check if the current TreeNode contains the passed <code>node</code>.
			 *
			 * @method contains
			 * @param {TreeNode} node
			 * @return {boolean}
			 */
			contains: function(node) {
				return node.isAncestor(this);
			},

			/**
			 * Expand the current TreeNode.
			 *
			 * @method expand
			 */
			expand: function() {
				var instance = this;

				instance.set(EXPANDED, true);
			},

			expandAll: function() {
				var instance = this;

				A.TreeNode.superclass.expandAll.apply(instance, arguments);

				// instance is also a node, so expand itself
				instance.expand();
			},

			/**
			 * Get the depth of the current TreeNode.
			 *
			 * @method getDepth
			 * @return {Number}
			 */
			getDepth: function() {
				var depth = 0;
				var instance = this;
				var parentNode = instance.get(PARENT_NODE);

				while (parentNode) {
					++depth;
					parentNode = parentNode.get(PARENT_NODE);
				}

				return depth;
			},

			hasChildNodes: function() {
				var instance = this;

				return (!instance.isLeaf() &&
						A.TreeNode.superclass.hasChildNodes.apply(this, arguments));
			},

			/**
			 * Whether the current TreeNode is selected or not.
			 *
			 * @method isSelected
			 * @return {boolean}
			 */
			isSelected: function() {
				return this.get(CONTENT_BOX).hasClass(CSS_TREE_NODE_SELECTED);
			},

			/**
			 * Whether the current TreeNode is a leaf or not.
			 *
			 * @method isLeaf
			 * @return {boolean}
			 */
			isLeaf: function() {
				var instance = this;

				return instance.get(LEAF);
			},

			/**
			 * Whether the current TreeNode is ancestor of the passed <code>node</code> or not.
			 *
			 * @method isLeaf
			 * @return {boolean}
			 */
			isAncestor: function(node) {
				var instance = this;
				var parentNode = instance.get(PARENT_NODE);

				while (parentNode) {
					if (parentNode === node) {
						return true;
					}
					parentNode = parentNode.get(PARENT_NODE);
				}

				return false;
			},

			/**
			 * Toggle the current TreeNode, <code>collapsed</code> or <code>expanded</code>.
			 *
			 * @method toggle
			 */
			toggle: function() {
				var instance = this;

				if (instance.get(EXPANDED)) {
					instance.collapse();
				}
				else {
					instance.expand();
				}
			},

			/*
			* Select the current TreeNode.
			*
			* @method select
			*/
			select: function() {
				var instance = this;
				var ownerTree = instance.get(OWNER_TREE);

				if (ownerTree) {
					ownerTree.set(LAST_SELECTED, instance);
				}

				instance.get(CONTENT_BOX).addClass(CSS_TREE_NODE_SELECTED);

				instance.fire('select');
			},

			/*
			* Unselect the current TreeNode.
			*
			* @method unselect
			*/
			unselect: function() {
				var instance = this;

				instance.get(CONTENT_BOX).removeClass(CSS_TREE_NODE_SELECTED);

				instance.fire('unselect');
			},

			/*
			* Fires when <code>mouseover</code> the current TreeNode.
			*
			* @method over
			*/
			over: function() {
				this.get(CONTENT_BOX).addClass(CSS_TREE_NODE_OVER);
			},

			/*
			* Fires when <code>mouseout</code> the current TreeNode.
			*
			* @method over
			*/
			out: function() {
				this.get(CONTENT_BOX).removeClass(CSS_TREE_NODE_OVER);
			},

			/*
			* Show hitarea icon.
			*
			* @method showHitArea
			*/
			showHitArea: function() {
				var instance = this;
				var hitAreaEl = instance.get(HIT_AREA_EL);

				hitAreaEl.removeClass(CSS_TREE_NODE_HIDDEN_HITAREA);
			},

			/*
			* Hide hitarea icon.
			*
			* @method hideHitArea
			*/
			hideHitArea: function() {
				var instance = this;
				var hitAreaEl = instance.get(HIT_AREA_EL);

				hitAreaEl.addClass(CSS_TREE_NODE_HIDDEN_HITAREA);
			},

			/**
			 * Set the <code>boundingBox</code> id.
			 *
			 * @method _syncTreeNodeBBId
			 * @param {String} id
			 * @protected
			 */
			_syncTreeNodeBBId: function(id) {
				var instance = this;

				instance.get(BOUNDING_BOX).attr(
					ID,
					instance.get(ID)
				);
			},

			_getSibling: function(value, attrName) {
				var instance = this;

				var propName = '_' + attrName;
				var sibling = instance[propName];

				if (sibling !== null && !isTreeNode(sibling)) {
					sibling = null;
					instance[propName] = sibling;
				}

				return sibling;
			},

			_uiSetExpanded: function(val) {
				var instance = this;

				if (!instance.isLeaf()) {
					var container = instance.get(CONTAINER);
					var contentBox = instance.get(CONTENT_BOX);

					if (val) {
						contentBox.replaceClass(CSS_TREE_COLLAPSED, CSS_TREE_EXPANDED);

						if (container) {
							container.removeClass(CSS_TREE_HIDDEN);
						}
					}
					else {
						contentBox.replaceClass(CSS_TREE_EXPANDED, CSS_TREE_COLLAPSED);

						if (container) {
							container.addClass(CSS_TREE_HIDDEN);
						}
					}
				}
			},

			_uiSetLeaf: function(val) {
				var instance = this;
				var contentBox = instance.get(CONTENT_BOX);

				if (val) {
					instance.get(CONTAINER).remove();
					instance.get(HIT_AREA_EL).remove();
				}
				else {
					// append hitarea element
					contentBox.prepend( instance.get(HIT_AREA_EL) );

					// if has children append them to this model
					instance._createNodeContainer();

					instance._uiSetExpanded(instance.get(EXPANDED));
				}

				// add leaf css classes
				contentBox.toggleClass(CSS_TREE_NODE_LEAF, val);
			}
		}
	}
);

A.TreeNode = TreeNode;

/*
* TreeNodeIO
*/
var isFunction = L.isFunction,
	isObject = L.isObject,
	isValue = L.isValue,

	CACHE = 'cache',
	END = 'end',
	IO = 'io',
	LIMIT = 'limit',
	LOADED = 'loaded',
	LOADING = 'loading',
	PAGINATOR = 'paginator',
	START = 'start',
	TREE_NODE_IO = 'tree-node-io',

	EV_TREE_NODE_PAGINATOR_CLICK = 'paginatorClick',

	CSS_TREE_NODE_PAGINATOR = getCN(TREE, NODE, PAGINATOR),
	CSS_TREE_NODE_IO_LOADING = getCN(TREE, NODE, IO, LOADING),

	TPL_PAGINATOR = '<a class="'+CSS_TREE_NODE_PAGINATOR+'" href="javascript:void(0);">Load more results</a>';

/**
 * A base class for TreeNodeIO, providing:
 * <ul>
 *	<li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *	<li>Ajax support to load the children of the current TreeNode</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>var treeNodeIO = new A.TreeNodeIO({
 *  	label: 'TreeNodeIO',
 *  	cache: false,
 *  	io: {
 *  		url: 'assets/content.html'
 *  	}
 *  });
 * </code></pre>
 *
 * Check the list of <a href="TreeNodeIO.html#configattributes">Configuration Attributes</a> available for
 * TreeNodeIO.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class TreeNodeIO
 * @constructor
 * @extends TreeNode
 */
var TreeNodeIO = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property TreeNode.NAME
		 * @type String
		 * @static
		 */
		NAME: TREE_NODE_IO,

		/**
		 * Static property used to define the default attribute
		 * configuration for the TreeNode.
		 *
		 * @property TreeNode.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * IO options for the current TreeNode load the children.
			 *
			 * @attribute io
			 * @default Default IO Configuration.
			 * @type Object
			 */
			io: {
				lazyAdd: false,
				value: null,
				setter: function(v) {
					return this._setIO(v);
				}
			},

			/**
			 * Whether the current TreeNode IO transaction is loading.
			 *
			 * @attribute loading
			 * @default false
			 * @type boolean
			 */
			loading: {
				value: false,
				validator: isBoolean
			},

			/**
			 * Whether the current TreeNode has loaded the content.
			 *
			 * @attribute loaded
			 * @default false
			 * @type boolean
			 */
			loaded: {
				value: false,
				validator: isBoolean
			},

			/**
			 * Whether the current TreeNode should cache the loaded content or not.
			 *
			 * @attribute cache
			 * @default true
			 * @type boolean
			 */
			cache: {
				value: true,
				validator: isBoolean
			},

			leaf: {
				value: false,
				validator: isBoolean
			},

			paginator: {
				setter: function(val) {
					return A.merge(
						{
							alwaysVisible: false,
							autoFocus: true,
							element: A.Node.create(TPL_PAGINATOR),
							endParam: END,
							limitParam: LIMIT,
							start: 0,
							startParam: START
						},
						val
					);
				},
				validator: isObject
			}
		},

		EXTENDS: A.TreeNode,

		prototype: {
			/**
			 * Bind the events on the TreeNodeIO UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;

				A.TreeNodeIO.superclass.bindUI.apply(this, arguments);

				instance._bindPaginatorUI();

				instance._createEvents();
			},

			syncUI: function() {
				var instance = this;

				A.TreeNodeIO.superclass.syncUI.apply(this, arguments);

				instance._syncPaginatorUI();
			},

			/**
			 * Bind events to the paginator "show more" link.
			 *
			 * @method _bindPaginatorUI
			 * @protected
			 */
			_bindPaginatorUI: function() {
				var instance = this;
				var paginator = instance.get(PAGINATOR);

				if (paginator) {
					var handlePaginator = A.bind(instance._handlePaginatorClickEvent, instance);

					paginator.element.on('click', handlePaginator);
				}
			},

			/*
			* Methods
			*/
			createNodes: function(nodes) {
				var instance = this;

				A.Array.each(A.Array(nodes), function(node) {
					var newNode = instance.createNode.call(instance, node);

					instance.appendChild(newNode);
				});

				instance._syncPaginatorUI(nodes);
			},

			expand: function() {
				var instance = this;
				var cache = instance.get(CACHE);
				var io = instance.get(IO);
				var loaded = instance.get(LOADED);
				var loading = instance.get(LOADING);

				if (!cache) {
					// if cache is false on expand, always set LOADED to false
					instance.set(LOADED, false);
				}

				if (io && !loaded && !loading && !this.hasChildNodes()) {
					if (!cache) {
						// remove all children to reload
						instance.empty();
					}

					instance.initIO();
				}
				else {
					A.TreeNodeIO.superclass.expand.apply(this, arguments);
				}
			},

			/**
			 * Initialize the IO transaction setup on the <a
			 * href="TreeNode.html#config_io">io</a> attribute.
			 *
			 * @method initIO
			 */
			initIO: function() {
				var instance = this;
				var io = instance.get(IO);

				if (isFunction(io.cfg.data)) {
					io.cfg.data = io.cfg.data.call(instance, instance);
				}

				instance._syncPaginatorIOData(io);

				if (isFunction(io.loader)) {
					var loader = A.bind(io.loader, instance);

					// apply loader in the TreeNodeIO scope
					loader(io.url, io.cfg, instance);
				}
				else {
					A.io.request(io.url, io.cfg);
				}
			},

			/**
			 * IO Start handler.
			 *
			 * @method ioStartHandler
			 */
			ioStartHandler: function() {
				var instance = this;
				var contentBox = instance.get(CONTENT_BOX);

				instance.set(LOADING, true);

				contentBox.addClass(CSS_TREE_NODE_IO_LOADING);
			},

			/**
			 * IO Complete handler.
			 *
			 * @method ioCompleteHandler
			 */
			ioCompleteHandler: function() {
				var instance = this;
				var contentBox = instance.get(CONTENT_BOX);

				instance.set(LOADING, false);
				instance.set(LOADED, true);

				contentBox.removeClass(CSS_TREE_NODE_IO_LOADING);
			},

			/**
			 * IO Success handler.
			 *
			 * @method ioSuccessHandler
			 */
			ioSuccessHandler: function() {
				var instance = this;
				var io = instance.get(IO);
				var args = Array.prototype.slice.call(arguments);
				var length = args.length;

				// if using the first argument as the JSON object
				var nodes = args[1];

				// if using (event, id, o) yui callback syntax
				if (length >= 3) {
					var o = args[2];
					// try to convert responseText to JSON
					try {
						nodes = A.JSON.parse(o.responseText);
					}
					catch(e) {}
				}

				var formatter = io.formatter;

				if (formatter) {
					nodes = formatter(nodes);
				}

				instance.createNodes(nodes);

				instance.expand();
			},

			/**
			 * IO Failure handler.
			 *
			 * @method ioFailureHandler
			 */
			ioFailureHandler: function() {
				var instance = this;

				instance.set(LOADING, false);
				instance.set(LOADED, false);
			},

			/**
			 * Create custom events.
			 *
			 * @method _createEvents
			 * @private
			 */
			_createEvents: function() {
				var instance = this;

				instance.publish(
					EV_TREE_NODE_PAGINATOR_CLICK,
					{
						defaultFn: instance._defPaginatorClickFn,
						prefix: TREE_NODE_IO
					}
				);
			},

			/**
			 * Default paginatorClick event handler. Increment the
			 * <code>paginator.start</code> to the next <code>paginator.limit</code>.
			 *
			 * @method _defPaginatorClickFn
			 * @param {EventFacade} event The Event object
			 * @protected
			 */
			_defPaginatorClickFn: function(event) {
				var instance = this;
				var paginator = instance.get(PAGINATOR);

				if (isValue(paginator.limit)) {
					paginator.start += paginator.limit;
				}

				if (instance.get(IO)) {
					instance.initIO();
				}
			},

			/**
			 * Fires the paginatorClick event.
			 *
			 * @method _handlePaginatorClickEvent
			 * @param {EventFacade} event paginatorClick event facade
			 * @protected
			 */
			_handlePaginatorClickEvent: function(event) {
				var instance = this;
				var ownerTree = instance.get(OWNER_TREE);
				var output = instance.getEventOutputMap(instance);

				instance.fire(EV_TREE_NODE_PAGINATOR_CLICK, output);

				if (ownerTree) {
					ownerTree.fire(EV_TREE_NODE_PAGINATOR_CLICK, output);
				}

				event.halt();
			},

			/**
			 * If not specified on the TreeNode some attributes are inherited from the
			 * ownerTree by this method.
			 *
			 * @method _inheritOwnerTreeAttrs
			 * @protected
			 */
			_inheritOwnerTreeAttrs: function() {
				var instance = this;
				var ownerTree = instance.get(OWNER_TREE);

				if (ownerTree) {
					if (!instance.get(IO)) {
						instance.set(IO, A.clone(ownerTree.get(IO)));
					}

					if (!instance.get(PAGINATOR)) {
						var otPaginator = ownerTree.get(PAGINATOR);

						// make sure we are not using the same element passed to the ownerTree on the TreeNode
						if (otPaginator && otPaginator.element) {
							otPaginator.element = otPaginator.element.clone();
						}

						instance.set(PAGINATOR, otPaginator);
					}
				}
			},

			/**
			 * Setter for <a href="TreeNodeIO.html#config_io">io</a>.
			 *
			 * @method _setIO
			 * @protected
			 * @param {Object} v
			 * @return {Object}
			 */
			_setIO: function(v) {
				var instance = this;

				if (!v) {
					return null;
				}
				else if (isString(v)) {
					v = { url: v };
				}

				v = v || {};
				v.cfg = v.cfg || {};
				v.cfg.on = v.cfg.on || {};

				var defCallbacks = {
					start: A.bind(instance.ioStartHandler, instance),
					complete: A.bind(instance.ioCompleteHandler, instance),
					success: A.bind(instance.ioSuccessHandler, instance),
					failure: A.bind(instance.ioFailureHandler, instance)
				};

				A.each(defCallbacks, function(fn, name) {
					var userFn = v.cfg.on[name];

					if (isFunction(userFn)) {
						// wrapping user callback and default callback, invoking both handlers
						var wrappedFn = function() {
							fn.apply(instance, arguments);
							userFn.apply(instance, arguments);
						};

						v.cfg.on[name] = A.bind(wrappedFn, instance);
					}
					else {
						// get from defCallbacks map
						v.cfg.on[name] = fn;
					}

				});

				return v;
			},

			/**
			 * Adds two extra IO data parameter to the request to handle the
			 * paginator. By default these parameters are <code>limit</code> and
			 * <code>start</code>.
			 *
			 * @method _syncPaginatorIOData
			 * @protected
			 */
			_syncPaginatorIOData: function(io) {
				var instance = this;
				var paginator = instance.get(PAGINATOR);

				if (paginator && isValue(paginator.limit)) {
					var data = io.cfg.data || {};

					data[ paginator.limitParam ] = paginator.limit;
					data[ paginator.startParam ] = paginator.start;
					data[ paginator.endParam ] = (paginator.start + paginator.limit);

					io.cfg.data = data;
				}
			},

			/**
			 * Sync the paginator link UI.
			 *
			 * @method _syncPaginatorUI
			 * @protected
			 */
			_syncPaginatorUI: function(newNodes) {
				var instance = this;
				var children = instance.get(CHILDREN);
				var paginator = instance.get(PAGINATOR);

				if (paginator) {
					var hasMoreData = true;

					if (newNodes) {
						hasMoreData = (newNodes.length > 0);
					}

					var childrenLength = instance.getChildrenLength();
					var start = paginator.start;
					var total = paginator.total || childrenLength;

					var showPaginator = hasMoreData && (total > childrenLength);

					if (paginator.alwaysVisible || showPaginator) {
						instance.get(CONTAINER).append(
							paginator.element.show()
						);

						if (paginator.autoFocus) {
							try {
								paginator.element.focus();
							}
							catch(e) {}
						}
					}
					else {
						paginator.element.hide();
					}
				}
			}
		}
	}
);

A.TreeNodeIO = TreeNodeIO;

/*
* TreeNodeCheck
*/
var	CHECKBOX = 'checkbox',
	CHECKED = 'checked',
	CHECK_CONTAINER_EL = 'checkContainerEl',
	CHECK_EL = 'checkEl',
	CHECK_NAME = 'checkName',
	DOT = '.',
	NAME = 'name',
	TREE_NODE_CHECK = 'tree-node-check',

	CSS_TREE_NODE_CHECKBOX = getCN(TREE, NODE, CHECKBOX),
	CSS_TREE_NODE_CHECKBOX_CONTAINER = getCN(TREE, NODE, CHECKBOX, CONTAINER),
	CSS_TREE_NODE_CHECKED = getCN(TREE, NODE, CHECKED),

	CHECKBOX_CONTAINER_TPL = '<div class="'+CSS_TREE_NODE_CHECKBOX_CONTAINER+'"></div>',
	CHECKBOX_TPL = '<input class="'+CSS_TREE_NODE_CHECKBOX+'" type="checkbox" />';

/**
 * <p><img src="assets/images/aui-tree-nod-check/main.png"/></p>
 *
 * A base class for TreeNodeCheck, providing:
 * <ul>
 *	<li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *	<li>Checkbox support for the TreeNode</li>
 * </ul>
 *
 * Check the list of <a href="TreeNodeCheck.html#configattributes">Configuration Attributes</a> available for
 * TreeNodeCheck.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class TreeNodeCheck
 * @constructor
 * @extends TreeNodeIO
 */
var TreeNodeCheck = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property TreeNode.NAME
		 * @type String
		 * @static
		 */
		NAME: TREE_NODE_CHECK,

		/**
		 * Static property used to define the default attribute
		 * configuration for the TreeNode.
		 *
		 * @property TreeNode.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * Whether the TreeNode is checked or not.
			 *
			 * @attribute checked
			 * @default false
			 * @type boolean
			 */
			checked: {
				value: false,
				validator: isBoolean
			},

			/**
			 * Name of the checkbox element used on the current TreeNode.
			 *
			 * @attribute checkName
			 * @default 'tree-node-check'
			 * @type String
			 */
			checkName: {
				value: TREE_NODE_CHECK,
				validator: isString
			},

			/**
			 * Container element for the checkbox.
			 *
			 * @attribute checkContainerEl
			 * @default Generated DOM element.
			 * @type Node | String
			 */
			checkContainerEl: {
				setter: A.one,
				valueFn: function() {
					return A.Node.create(CHECKBOX_CONTAINER_TPL);
				}
			},

			/**
			 * Checkbox element.
			 *
			 * @attribute checkEl
			 * @default Generated DOM element.
			 * @type Node | String
			 */
			checkEl: {
				setter: A.one,
				valueFn: function() {
					var instance = this;

					var checkName = instance.get(CHECK_NAME);
					var id = concat(instance.get(ID), 'Checkbox');

					var attributes = {
						ID: id,
						NAME: checkName
					};

					return A.Node.create(CHECKBOX_TPL).attr(attributes);
				}
			}
		},

		EXTENDS: A.TreeNodeIO,

		prototype: {

			initializer: function() {
				var instance = this;

				instance._uiSetChecked(instance.get(CHECKED));
			},

			/*
			* Lifecycle
			*/
			renderUI: function() {
				var instance = this;

				A.TreeNodeCheck.superclass.renderUI.apply(instance, arguments);

				var labelEl = instance.get(LABEL_EL);
				var checkEl = instance.get(CHECK_EL);
				var checkContainerEl = instance.get(CHECK_CONTAINER_EL);

				checkEl.hide();

				checkContainerEl.append(checkEl);

				labelEl.placeBefore(checkContainerEl);

				if (instance.isChecked()) {
					instance.check();
				}
			},

			bindUI: function() {
				var instance = this;
				var contentBox = instance.get(CONTENT_BOX);
				var labelEl = instance.get(LABEL_EL);

				A.TreeNodeCheck.superclass.bindUI.apply(instance, arguments);

				instance.after('checkedChange', A.bind(instance._afterCheckedChange, instance));

				contentBox.delegate('click', A.bind(instance.toggleCheck, instance), DOT+CSS_TREE_NODE_CHECKBOX_CONTAINER);
				contentBox.delegate('click', A.bind(instance.toggleCheck, instance), DOT+CSS_TREE_LABEL);

				// cancel dblclick because of the check
				labelEl.swallowEvent('dblclick');
			},

			/**
			 * Check the current TreeNode.
			 *
			 * @method check
			 */
			check: function(originalTarget) {
				var instance = this;

				instance.set(CHECKED, true, {
					originalTarget: originalTarget
				});
			},

			/**
			 * Uncheck the current TreeNode.
			 *
			 * @method uncheck
			 */
			uncheck: function(originalTarget) {
				var instance = this;

				instance.set(CHECKED, false, {
					originalTarget: originalTarget
				});
			},

			/**
			 * Toggle the check status of the current TreeNode.
			 *
			 * @method toggleCheck
			 */
			toggleCheck: function() {
				var instance = this;
				var checkEl = instance.get(CHECK_EL);
				var checked = checkEl.attr(CHECKED);

				if (!checked) {
					instance.check();
				}
				else {
					instance.uncheck();
				}
			},

			/*
			* Whether the current TreeNodeCheck is checked.
			*
			* @method isChecked
			* @return boolean
			*/
			isChecked: function() {
				var instance = this;

				return instance.get(CHECKED);
			},

			_afterCheckedChange: function(event) {
				var instance = this;

				instance._uiSetChecked(event.newVal);
			},

			_uiSetChecked: function(val) {
				var instance = this;

				if (val) {
					instance.get(CONTENT_BOX).addClass(CSS_TREE_NODE_CHECKED);
					instance.get(CHECK_EL).attr(CHECKED, CHECKED);
				}
				else {
					instance.get(CONTENT_BOX).removeClass(CSS_TREE_NODE_CHECKED);
					instance.get(CHECK_EL).attr(CHECKED, BLANK);
				}
			}
		}
	}
);

A.TreeNodeCheck = TreeNodeCheck;

/*
* TreeNodeTask
*/
var	CHILD = 'child',
	TREE_NODE_TASK = 'tree-node-task',
	UNCHECKED = 'unchecked',

	isTreeNodeTask = function(node) {
		return node instanceof A.TreeNodeCheck;
	},

	CSS_TREE_NODE_CHILD_UNCHECKED = getCN(TREE, NODE, CHILD, UNCHECKED);

/**
 * <p><img src="assets/images/aui-treeNodeTask/main.png"/></p>
 *
 * A base class for TreeNodeTask, providing:
 * <ul>
 *	<li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *	<li>3 states checkbox support</li>
 *	<li>Automatic check/uncheck the parent status based on the children checked status</li>
 * </ul>
 *
 * Check the list of <a href="TreeNodeTask.html#configattributes">Configuration Attributes</a> available for
 * TreeNodeTask.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class TreeNodeTask
 * @constructor
 * @extends TreeNodeCheck
 */
var TreeNodeTask = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property TreeNode.NAME
		 * @type String
		 * @static
		 */
		NAME: TREE_NODE_TASK,

		EXTENDS: A.TreeNodeCheck,

		prototype: {
			/*
			* Methods
			*/
			check: function(originalTarget) {
				var instance = this;
				var contentBox = instance.get(CONTENT_BOX);

				originalTarget = originalTarget || instance;

				if (!instance.isLeaf()) {
					instance.eachChildren(function(child) {
						if (isTreeNodeTask(child)) {
							child.check(originalTarget);
						}
					});
				}

				instance.eachParent(
					function(parentNode) {
						if (isTreeNodeTask(parentNode) && !parentNode.isChecked()) {
							parentNode.get(CONTENT_BOX).addClass(CSS_TREE_NODE_CHILD_UNCHECKED);
						}
					}
				);

				contentBox.removeClass(CSS_TREE_NODE_CHILD_UNCHECKED);

				// invoke default check logic
				A.TreeNodeTask.superclass.check.call(this, originalTarget);
			},

			uncheck: function(originalTarget) {
				var instance = this;
				var contentBox = instance.get(CONTENT_BOX);

				originalTarget = originalTarget || instance;

				if (!instance.isLeaf()) {
					instance.eachChildren(function(child) {
						if (child instanceof A.TreeNodeCheck) {
							child.uncheck(originalTarget);
						}
					});
				}

				instance.eachParent(
					function(parentNode) {
						if (isTreeNodeTask(parentNode) && !parentNode.isChecked()) {
							parentNode.get(CONTENT_BOX).removeClass(CSS_TREE_NODE_CHILD_UNCHECKED);
						}
					}
				);

				contentBox.removeClass(CSS_TREE_NODE_CHILD_UNCHECKED);

				// invoke default uncheck logic
				A.TreeNodeTask.superclass.uncheck.call(this, originalTarget);
			}
		}
	}
);

A.TreeNodeTask = TreeNodeTask;

/*
* TreeNodeRadio
*/

var	TREE_NODE_RADIO = 'tree-node-radio',

	isTreeNodeRadio = function(node) {
		return node instanceof A.TreeNodeRadio;
	},

	CSS_NODE_RADIO = getCN(TREE, NODE, RADIO),
	CSS_NODE_RADIO_CHECKED = getCN(TREE, NODE, RADIO, CHECKED);

/**
 * <p><img src="assets/images/aui-treeNodeRadio/main.png"/></p>
 *
 * A base class for TreeNodeRadio, providing:
 * <ul>
 *	<li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *	<li>3 states checkbox support</li>
 *	<li>Automatic check/uncheck the parent status based on the children checked status</li>
 * </ul>
 *
 * Check the list of <a href="TreeNodeRadio.html#configattributes">Configuration Attributes</a> available for
 * TreeNodeRadio.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class TreeNodeRadio
 * @constructor
 * @extends TreeNodeTask
 */
var TreeNodeRadio = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property TreeNode.NAME
		 * @type String
		 * @static
		 */
		NAME: TREE_NODE_RADIO,

		EXTENDS: A.TreeNodeTask,

		prototype: {
			/*
			* Methods
			*/
			renderUI: function() {
				var instance = this;

				A.TreeNodeRadio.superclass.renderUI.apply(instance, arguments);

				instance.get(CONTENT_BOX).addClass(CSS_NODE_RADIO);
			},

			check: function() {
				var instance = this;

				instance._uncheckNodesRadio();

				A.TreeNodeRadio.superclass.check.apply(this, arguments);
			},

			_uiSetChecked: function(val) {
				var instance = this;

				if (val) {
					instance.get(CONTENT_BOX).addClass(CSS_NODE_RADIO_CHECKED);
					instance.get(CHECK_EL).attr(CHECKED, CHECKED);
				}
				else {
					instance.get(CONTENT_BOX).removeClass(CSS_NODE_RADIO_CHECKED);
					instance.get(CHECK_EL).attr(CHECKED, BLANK);
				}
			},

			_uncheckNodesRadio: function(node) {
				var instance = this;

				var children;

				if (node) {
					children = node.get(CHILDREN);
				}
				else {
					var ownerTree = instance.get(OWNER_TREE);

					if (ownerTree) {
						children = ownerTree.get(CHILDREN);
					}
					else {
						return;
					}
				}

				A.Array.each(
					children,
					function(value, index, collection) {
						if (!value.isLeaf()) {
							instance._uncheckNodesRadio(value);
						}

						if (isTreeNodeRadio(value)) {
							value.uncheck();
						}
					}
				);
			}
		}
	}
);

A.TreeNodeRadio = TreeNodeRadio;

/**
 * TreeNode types hash map.
 *
 * <pre><code>A.TreeNode.nodeTypes = {
 *  radio: A.TreeNodeRadio,
 *  task: A.TreeNodeTask,
 *  check: A.TreeNodeCheck,
 *  node: A.TreeNode,
 *  io: A.TreeNodeIO
 *};</code></pre>
 *
 * @for TreeNode
 * @property A.TreeNode.nodeTypes
 * @type Object
 */
A.TreeNode.nodeTypes = {
	radio: A.TreeNodeRadio,
	task: A.TreeNodeTask,
	check: A.TreeNodeCheck,
	node: A.TreeNode,
	io: A.TreeNodeIO
};

}, '@VERSION@' ,{skinnable:false, requires:['aui-tree-data','aui-io','json','querystring-stringify']});
