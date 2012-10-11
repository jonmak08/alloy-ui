AUI.add('aui-parse-content', function(A) {
/**
 * The ParseContent Utility - Parse the content of a Node so that all of the
 * javascript contained in that Node will be executed according to the order
 * that it appears.
 *
 * @module aui-parse-content
 */

/*
* NOTE: The inspiration of ParseContent cames from the "Caridy Patino" Node Dispatcher Plugin
* 		http://github.com/caridy/yui3-gallery/blob/master/src/gallery-dispatcher/
*/

var L = A.Lang,
	isString = L.isString,

	DOC = A.config.doc,

	APPEND = 'append',
	DOCUMENT_ELEMENT = 'documentElement',
	FIRST_CHILD = 'firstChild',
	HEAD = 'head',
	HOST = 'host',
	INNER_HTML = 'innerHTML',
	PARSE_CONTENT = 'ParseContent',
	QUEUE = 'queue',
	SCRIPT = 'script',
	SEMICOLON = ';',
	SRC = 'src',

	SCRIPT_TYPES = {
		'': 1,
		'text/javascript': 1
	};

/**
 * A base class for ParseContent, providing:
 * <ul>
 *    <li>After plug ParseContent on a A.Node instance the javascript chunks will be executed (remote and inline scripts)</li>
 *    <li>All the javascripts within a content will be executed according to the order of apparition</li>
 * </ul>
 *
 * <p><strong>NOTE:</strong> For performance reasons on DOM manipulation,
 * ParseContent only parses the content passed to the
 * <a href="Node.html#method_setContent">setContent</a>,
 * <a href="Node.html#method_prepend">prepend</a> and
 * <a href="Node.html#method_append">append</a> methods.</p>
 *
 * Quick Example:<br/>
 *
 * <pre><code>node.plug(A.Plugin.ParseContent);</code></pre>
 *
 * Check the list of <a href="ParseContent.html#configattributes">Configuration Attributes</a> available for
 * ParseContent.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class ParseContent
 * @constructor
 * @extends Plugin.Base
 */
var ParseContent = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property ParseContent.NAME
		 * @type String
		 * @static
		 */
		NAME: PARSE_CONTENT,

		/**
		 * Static property provides a string to identify the namespace.
		 *
		 * @property ParseContent.NS
		 * @type String
		 * @static
		 */
		NS: PARSE_CONTENT,

		/**
		 * Static property used to define the default attribute
		 * configuration for the ParseContent.
		 *
		 * @property ParseContent.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			queue: {
				value: null
			}
		},

		EXTENDS: A.Plugin.Base,

		prototype: {
			/**
			 * Construction logic executed during ParseContent instantiation. Lifecycle.
			 *
			 * @method initializer
			 * @protected
			 */
			initializer: function(config) {
				var instance = this;

				ParseContent.superclass.initializer.apply(this, arguments);

				instance.set(
					QUEUE,
					new A.AsyncQueue()
				);

				instance._bindAOP();

				if (config && config.url) {
					instance._bindIOSuccess(config);
				}
			},

			/**
			 * Global eval the <data>data</data> passed.
			 *
			 * @method globalEval
			 * @param {String} data JavaScript String.
			 */
			globalEval: function(data) {
				var doc = A.getDoc();
				var head = doc.one(HEAD) || doc.get(DOCUMENT_ELEMENT);

				// NOTE: A.Node.create('<script></script>') doesn't work correctly on Opera
				var newScript = DOC.createElement(SCRIPT);

				newScript.type = 'text/javascript';

				if (data) {
					// NOTE: newScript.set(TEXT, data) breaks on IE, YUI BUG.
					newScript.text = L.trim(data);
				}

				head.appendChild(newScript).remove(); //removes the script node immediately after executing it
			},

			/**
			 * Extract the <code>script</code> tags from the string content and
			 * evaluate the chunks.
			 *
			 * @method parseContent
			 * @param {String} content HTML string
			 * @return {String}
			 */
			parseContent: function(content) {
				var instance = this;

				var output = instance._clean(content);

				instance._dispatch(output);

				return output;
			},

			/**
			 * Add inline script data to the queue.
			 *
			 * @method _addInlineScript
			 * @param {String} data The script content which should be added to the queue
			 * @protected
			 */
			_addInlineScript: function(data) {
				var instance = this;

				instance.get(QUEUE).add(
					{
						args: data,
						context: instance,
						fn: instance.globalEval,
						timeout: 0
					}
				);
			},

			/**
			 * Bind listeners on the <code>insert</code> and <code>setContent</code>
		     * methods of the Node instance where you are plugging the ParseContent.
		     * These listeners are responsible for intercept the HTML passed and parse
		     * them.
			 *
			 * @method _bindAOP
			 * @protected
			 */
			_bindAOP: function() {
				var instance = this;

				var cleanFirstArg = function(content) {
					var args = Array.prototype.slice.call(arguments);
					var output = instance.parseContent(content);

					// replace the first argument with the clean fragment
					args.splice(0, 1, output.fragment);

					return new A.Do.AlterArgs(null, args);
				};

				this.doBefore('insert', cleanFirstArg);
				this.doBefore('replaceChild', cleanFirstArg);

				var cleanArgs = function(content) {
					var output = instance.parseContent(content);

					return new A.Do.AlterArgs(null, [output.fragment]);
				};

				this.doBefore('replace', cleanArgs);
				this.doBefore('setContent', cleanArgs);
			},

			/**
			 * Bind a <code>success</code> listener to the host node that will
			 * <code>setContent</code> as the IO transaction's <code>responseText</code>.
			 *
			 * @method _bindIOSuccess
			 * @param {Object} data The config plugin config object.
			 * @protected
			 */
			_bindIOSuccess: function(data) {
				var instance = this;

				var node = instance.get(HOST);

				var url = data.url;

				var ioConfig = data.ioConfig || {};

				ioConfig.on = A.merge(
					{
						success: function(id, o) {
							node.setContent(o.responseText);
						}
					},
					ioConfig.on
				);

				A.io(url, ioConfig);
			},

			/**
			 * Create an HTML fragment with the String passed, extract all the script
		     * tags and return an Object with a reference for the extracted scripts and
		     * the fragment.
			 *
			 * @method clean
			 * @param {String} content HTML content.
			 * @protected
			 * @return {Object}
			 */
			_clean: function(content) {
				var output = {};
				var fragment = A.Node.create('<div></div>');

				// instead of fix all tags to "XHTML"-style, make the firstChild be a valid non-empty tag
				fragment.append('<div>_</div>');

				if (isString(content)) {
					// create fragment from {String}
					A.DOM.addHTML(fragment, content, APPEND);
				}
				else {
					// create fragment from {Y.Node | HTMLElement}
					fragment.append(content);
				}

				output.js = fragment.all(SCRIPT).filter(function(script) {
					return SCRIPT_TYPES[script.getAttribute('type').toLowerCase()];
				});

				output.js.each(
					function(node, i) {
						node.remove();
					}
				);

				// remove padding node
				fragment.get(FIRST_CHILD).remove();

				output.fragment = fragment.get('childNodes').toFrag();

				return output;
			},

			/**
			 * Loop trough all extracted <code>script</code> tags and evaluate them.
			 *
			 * @method _dispatch
			 * @param {Object} output Object containing the reference for the fragment and the extracted <code>script</code> tags.
			 * @protected
			 * @return {String}
			 */
			_dispatch: function(output) {
				var instance = this;

				var queue = instance.get(QUEUE);

				var scriptContent = [];

				output.js.each(function(node, i) {
					var src = node.get(SRC);

					if (src) {
						if (scriptContent.length) {
							instance._addInlineScript(scriptContent.join(SEMICOLON));

							scriptContent.length = 0;
						}

						queue.add({
							autoContinue: false,
							fn: function () {
								A.Get.script(src, {
									onEnd: function (o) {
										o.purge(); //removes the script node immediately after executing it
										queue.run();
									}
								});
							},
							timeout: 0
						});
					}
					else {
						var dom = node._node;

						scriptContent.push(dom.text || dom.textContent || dom.innerHTML || '');
					}
				});

				if (scriptContent.length) {
					instance._addInlineScript(scriptContent.join(SEMICOLON));
				}

				queue.run();
			}
		}
	}
);

A.namespace('Plugin').ParseContent = ParseContent;

}, '@VERSION@' ,{requires:['async-queue','aui-base','plugin','io'], skinnable:false});
