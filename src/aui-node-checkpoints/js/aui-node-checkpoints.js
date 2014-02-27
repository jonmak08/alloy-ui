/**
 * The Node Scroll Checkpoint Utility - Execute a function whenever you scroll to an element.
 *
 * @module aui-arraysort
 */
var AArray = A.Array;

var CHECKPOINTS = {};
var CONTEXTS = {};

var DOC = A.getDoc();
var WIN = A.getWin();

var getNodeOffsetByAxis = function(node, axis) {
	var offset = {
		vertical: function() {
			return node.get('offsetTop');
		},
		horizontal: function() {
			return node.get('offsetLeft');
		}
	};

	return offset[axis]();
};

var isWin = function(node) {
	return (A.one(node) === WIN);
};

var Checkpoint = function() {
	this.init.apply(this, arguments);
};

Checkpoint.get = function(id) {
	return CHECKPOINTS[id];
};

Checkpoint.register = function(object) {
	var id = A.stamp(object);

	if (!id) {
		CONTEXTS[id] = object;
	}

	return id;
};

Checkpoint.remove = function(id) {
	if (CHECKPOINTS[id]) {
		delete CHECKPOINTS[id];
	}
};

Checkpoint.DEFAULTS = {
	axis: 'vertical',
	enabled: true,
	triggerAtTheEnd: false,
	offset: 0
};

Checkpoint.prototype.init = function(node, callback, options) {
	var instance = this;

	A.mix(options, Checkpoint.DEFAULTS);

	instance._axis = options.axis;
	instance._callback = callback;
	instance._context = options._context;
	instance._enabled = options.enabled;
	instance._node = A.one(node._node);
	instance._triggerAtTheEnd = options.triggerAtTheEnd;
	instance._offset = options.offset;
	instance._reachedCheckpoint = instance.reachedCheckpoint();

	instance.register();
};

Checkpoint.prototype.crossed = function() {
	var instance = this;

	var reachedCheckpoint = instance.reachedCheckpoint();

	var crossed = (reachedCheckpoint !== instance._reachedCheckpoint);

	instance._reachedCheckpoint = reachedCheckpoint;

	return crossed;
};

Checkpoint.prototype.destroy = function() {
	var instance = this;

	var context = instance._context;

	context.removeCheckpoint(instance);
};

Checkpoint.prototype.disable = function() {
	var instance = this;

	instance._enabled = false;
};

Checkpoint.prototype.enable = function() {
	var instance = this;

	instance._enabled = true;

	instance.refresh();
};

Checkpoint.prototype.getContext = function() {
	var instance = this;

	return instance._context;
};

Checkpoint.prototype.getContextScroll = function() {
	var instance = this;

	var context = instance._context;

	return context.getScrollDirectionByAxis(instance._axis);
};

Checkpoint.prototype.getNode = function() {
	var instance = this;

	return instance._node;
};

Checkpoint.prototype.getOffset = function() {
	var instance = this;

	return instance._offset;
};

Checkpoint.prototype.reachedCheckpoint = function() {
	var instance = this;

	var scrollPosition = instance._getScrollPosition();

	var triggerPosition = instance._getTriggerPosition();

	var reachedCheckpoint = (scrollPosition >= triggerPosition);

	return reachedCheckpoint;
};

Checkpoint.prototype.refresh = function() {
	var instance = this;

	if (instance._triggerPosition) {
		delete instance._triggerPosition;
	}

	instance._context.refresh();

	instance.crossed();
};

Checkpoint.prototype.register = function() {
	var instance = this;

	instance.id = Checkpoint.register(instance);
};

Checkpoint.prototype.setOffset = function(offset) {
	var instance = this;

	instance._offset = offset;
};

Checkpoint.prototype.triggerCallback = function() {
	var instance = this;

	instance._callback(instance._getDirection());
};

Checkpoint.prototype.update = function() {
	var instance = this;

	if (instance._enabled && instance.crossed()) {
		instance.triggerCallback();
	}
};

Checkpoint.prototype._getDirection = function() {
	var instance = this;

	var axis = instance._axis;

	var direction;

	if (instance._triggerAtTheEnd) {
		var scrollDirection = {
			horizontal: 'left',
			vertical: 'down'
		};

		direction = scrollDirection[axis];
	}
	else {
		direction = instance._context.getScrollDirectionByAxis(axis);
	}

	return direction;
};

Checkpoint.prototype._getScrollPosition = function() {
	var instance = this;

	var scrollPosition = instance._context.getScrollByAxis(instance._axis);

	return scrollPosition;
};

Checkpoint.prototype._getTriggerPosition = function() {
	var instance = this;

	var axis = instance._axis;

	var triggerPosition = instance._triggerPosition;

	if (!triggerPosition) {
		if (instance._triggerAtTheEnd) {
			triggerPosition = instance._context.getTriggerPositionByAxis(axis);
		}
		else {
			var offsetByAxis = getNodeOffsetByAxis(instance._node, axis);

			var contextNodeOffset = instance._context.getOffsetByAxis(axis);

			triggerPosition = offsetByAxis - contextNodeOffset;
		}

		triggerPosition -= instance._offset;

		instance._triggerPosition = triggerPosition;
	}

	return triggerPosition;
};

var Context = function() {
	this.init.apply(this, arguments);
};

Context.get = function(options) {
	options = options || {};

	options = A.mix(options, Context.DEFAULTS);

	var id = A.stamp(options.node);

	var context = Context.getById(id);

	if (!context) {
		context = new Context(options);

		CONTEXTS[id] = context;
	}

	return context;
};

Context.getById = function(id) {
	return CONTEXTS[id];
};

Context.DEFAULTS = {
	enabled: true,
	node: WIN
};

Context.prototype.init = function(options) {
	var instance = this;

	var node = options.node;

	instance._checkpoints = [];
	instance._enabled = options.enabled;
	instance._newScroll = instance._scroll;
	instance._node = node;
	instance._offset = {};
	instance._scroll = instance.getScroll();
	instance._triggerPosition = {};

	instance.bindUI(node);
};

Context.prototype.bindUI = function(node) {
	var instance = this;

	if (instance._handles) {
		instance._detachHandles();
	}

	if (instance._enabled) {
		var scrollHandler = node.on('scroll', instance._onScroll, instance);
		var resizeHandler = instance._getResizeHandler();

		instance._handles = [resizeHandler, scrollHandler];
	}
};

Context.prototype.destroy = function() {
	var instance = this;

	instance._detachHandles();
};

Context.prototype.addCheckpoint = function(checkpoint) {
	var instance = this;

	A.stamp(checkpoint);

	instance._checkpoints.push(checkpoint);
};

Context.prototype.enable = function() {
	var instance = this;

	instance._enabled = true;
};

Context.prototype.disable = function() {
	var instance = this;

	instance._enabled = false;
};

Context.prototype.getOffsetByAxis = function(axis) {
	var instance = this;

	var offsetByAxis = instance._offset[axis];

	var node = instance._node;

	if (!offsetByAxis) {
		offsetByAxis = isWin(node) ? 0 : getNodeOffsetByAxis(node, axis);

		instance._offset[axis] = offsetByAxis;
	}

	return offsetByAxis;
};

Context.prototype.getScroll = function() {
	var instance = this;

	return {
		horizontal: instance._getScrollHorizontal(),
		vertical: instance._getScrollVertical()
	};
};

Context.prototype.getNode = function() {
	var instance = this;

	return instance._node;
};

Context.prototype.getTriggerPositionByAxis = function(axis) {
	var instance = this;

	var triggerPositionByAxis = instance._triggerPosition[axis];

	if (!triggerPositionByAxis) {
		var node = instance._node;

		var triggerPosition;

		if (isWin(node)) {
			triggerPosition = {
				horizontal: function() {
					return DOC.width() - node.width();
				},
				vertical: function() {
					return DOC.height() - node.height();
				}
			};
		}
		else {
			triggerPosition = {
				horizontal: function() {
					return node.get('scrollWidth') - node.outerWidth();
				},
				vertical: function() {
					return node.get('scrollHeight') - node.outerHeight();
				}
			};

		}

		triggerPositionByAxis = triggerPosition[axis]();

		instance._triggerPosition[axis] = triggerPositionByAxis;
	}

	return triggerPositionByAxis;
};

Context.prototype.getScrollByAxis = function(axis) {
	var instance = this;

	var node = instance._node;

	var scroll = {
		horizontal: function() {
			return node.get('scrollLeft');
		},
		vertical: function() {
			return node.get('scrollTop');
		}
	};

	var scrollByAxis = scroll[axis]();

	if (instance._triggerAtTheEnd) {
		var triggerPosition = instance.getTriggerPositionByAxis(axis);

		if (scrollByAxis > triggerPosition) {
			scrollByAxis = triggerPosition;
		}
	}

	return scrollByAxis;
};

Context.prototype.getScrollDirectionByAxis = function(axis) {
	var instance = this;

	var scrollDelta = instance._getScrollDeltaByAxis(axis);

	var scrollDirection = {
		horizontal: function() {
			return (scrollDelta > 0) ? 'right' : 'left';
		},
		vertical: function() {
			return (scrollDelta > 0) ? 'down' : 'up';
		}
	};

	return scrollDirection[axis]();
};

Context.prototype.refresh = function() {
	var instance = this;

	instance._offset = {};

	instance._triggerPosition = {};
};

Context.prototype.removeCheckpoint = function(checkpoint) {
	var instance = this;

	AArray.removeItem(instance._checkpoints, checkpoint);
};

Context.prototype._checkpointsInvoke = function(methodName) {
	var instance = this;

	AArray.invoke(instance._checkpoints, methodName);
};

Context.prototype._detachHandles = function() {
	var instance = this;

	AArray.invoke(instance._handles, 'detach');
};

Context.prototype._getResizeHandler = function() {
	var instance = this;

	var node = instance._node;

	var refreshFn = A.bind(instance._checkpointsInvoke, instance, 'refresh');

	var resizeHandler;

	if (isWin(node)) {
		resizeHandler = node.on('resize', A.debounce(refreshFn, 400));
	}
	else {
		resizeHandler = node.on('resize:end', refreshFn);
	}

	return resizeHandler;
};

Context.prototype._getScrollDeltaByAxis = function(axis) {
	var instance = this;

	var delta = instance._newScroll[axis] - instance._scroll[axis];

	return delta;
};

Context.prototype._getScrollHorizontal = function() {
	var instance = this;

	var node = instance._node;

	var horizontal = node.get('scrollLeft');

	if (instance._triggerAtTheEnd) {
		var limit = instance.getTriggerPositionByAxis('horizontal');

		if (horizontal > limit) {
			horizontal = limit;
		}
	}

	return horizontal;
};

Context.prototype._getScrollVertical = function() {
	var instance = this;

	var node = instance._node;

	var vertical = node.get('scrollTop');

	if (instance._triggerAtTheEnd) {
		var limit = instance.getTriggerPositionByAxis('vertical');

		if (vertical > limit) {
			vertical = limit;
		}
	}

	return vertical;
};

Context.prototype._onScroll = function() {
	var instance = this;

	instance._newScroll = instance.getScroll();

	instance._checkpointsInvoke('update');

	instance._scroll = instance._newScroll;
};

A.Node.prototype.checkpoint = function(callback, options) {
	options = options || {};

	var context = options._context;

	if (!context) {
		var contextOptions = options.context;

		if (contextOptions) {
			var contextNode = A.one(contextOptions);

			if (contextNode) {
				contextOptions = {
					node: contextNode
				};
			}
		}

		context = Context.get(contextOptions);
	}

	options._context = context;

	var checkpoint = new Checkpoint(this, callback, options);

	context.addCheckpoint(checkpoint);
};

// Duplicate the pattern from `Y.NodeList.prototype.plug`
A.NodeList.prototype.checkpoint = function() {
	var args = arguments;

	A.NodeList.each(this, function(node) {
		A.Node.prototype.checkpoint.apply(A.one(node), args);
	});

	return this;
};

A.Node.Checkpoint = Checkpoint;