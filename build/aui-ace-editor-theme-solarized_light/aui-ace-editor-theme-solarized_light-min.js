AUI.add("aui-ace-editor-theme-solarized_light",function(a){define("ace/theme/solarized_light",["require","exports","module"],function(g,f,j){var i=g("pilot/dom"),h=".ace-solarized-light .ace_editor {\n  border: 2px solid rgb(159, 159, 159);\n}\n\n.ace-solarized-light .ace_editor.ace_focus {\n  border: 2px solid #327fbd;\n}\n\n.ace-solarized-light .ace_gutter {\n  width: 50px;\n  background: #e8e8e8;\n  color: #333;\n  overflow : hidden;\n}\n\n.ace-solarized-light .ace_gutter-layer {\n  width: 100%;\n  text-align: right;\n}\n\n.ace-solarized-light .ace_gutter-layer .ace_gutter-cell {\n  padding-right: 6px;\n}\n\n.ace-solarized-light .ace_print_margin {\n  width: 1px;\n  background: #e8e8e8;\n}\n\n.ace-solarized-light .ace_scroller {\n  background-color: #FDF6E3;\n}\n\n.ace-solarized-light .ace_text-layer {\n  cursor: text;\n  color: #586E75;\n}\n\n.ace-solarized-light .ace_cursor {\n  border-left: 2px solid #000000;\n}\n\n.ace-solarized-light .ace_cursor.ace_overwrite {\n  border-left: 0px;\n  border-bottom: 1px solid #000000;\n}\n \n.ace-solarized-light .ace_marker-layer .ace_selection {\n  background: #073642;\n}\n\n.ace-solarized-light .ace_marker-layer .ace_step {\n  background: rgb(198, 219, 174);\n}\n\n.ace-solarized-light .ace_marker-layer .ace_bracket {\n  margin: -1px 0 0 -1px;\n  border: 1px solid rgba(147, 161, 161, 0.50);\n}\n\n.ace-solarized-light .ace_marker-layer .ace_active_line {\n  background: #EEE8D5;\n}\n\n       \n.ace-solarized-light .ace_invisible {\n  color: rgba(147, 161, 161, 0.50);\n}\n\n.ace-solarized-light .ace_keyword {\n  color:#859900;\n}\n\n.ace-solarized-light .ace_keyword.ace_operator {\n  \n}\n\n.ace-solarized-light .ace_constant {\n  \n}\n\n.ace-solarized-light .ace_constant.ace_language {\n  color:#B58900;\n}\n\n.ace-solarized-light .ace_constant.ace_library {\n  \n}\n\n.ace-solarized-light .ace_constant.ace_numeric {\n  color:#D33682;\n}\n\n.ace-solarized-light .ace_invalid {\n  \n}\n\n.ace-solarized-light .ace_invalid.ace_illegal {\n  \n}\n\n.ace-solarized-light .ace_invalid.ace_deprecated {\n  \n}\n\n.ace-solarized-light .ace_support {\n  \n}\n\n.ace-solarized-light .ace_support.ace_function {\n  color:#268BD2;\n}\n\n.ace-solarized-light .ace_function.ace_buildin {\n  \n}\n\n.ace-solarized-light .ace_string {\n  color:#2AA198;\n}\n\n.ace-solarized-light .ace_string.ace_regexp {\n  color:#D30102;\n}\n\n.ace-solarized-light .ace_comment {\n  color:#93A1A1;\n}\n\n.ace-solarized-light .ace_comment.ace_doc {\n  \n}\n\n.ace-solarized-light .ace_comment.ace_doc.ace_tag {\n  \n}\n\n.ace-solarized-light .ace_variable {\n  \n}\n\n.ace-solarized-light .ace_variable.ace_language {\n  color:#268BD2;\n}\n\n.ace-solarized-light .ace_xml_pe {\n  \n}\n\n.ace-solarized-light .ace_meta {\n  \n}\n\n.ace-solarized-light .ace_meta.ace_tag {\n  \n}\n\n.ace-solarized-light .ace_meta.ace_tag.ace_input {\n  \n}\n\n.ace-solarized-light .ace_entity.ace_other.ace_attribute-name {\n  color:#93A1A1;\n}\n\n\n.ace-solarized-light .ace_collab.ace_user1 {\n     \n}";i.importCssString(h),f.cssClass="ace-solarized-light";});},"@VERSION@",{requires:["aui-ace-editor-base"],skinnable:false});