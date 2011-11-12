AUI.add("aui-ace-editor-theme-vibrant_ink",function(a){define("ace/theme/vibrant_ink",["require","exports","module"],function(g,f,j){var i=g("pilot/dom"),h=".ace-vibrant-ink .ace_editor {\n  border: 2px solid rgb(159, 159, 159);\n}\n\n.ace-vibrant-ink .ace_editor.ace_focus {\n  border: 2px solid #327fbd;\n}\n\n.ace-vibrant-ink .ace_gutter {\n  width: 50px;\n  background: #e8e8e8;\n  color: #333;\n  overflow : hidden;\n}\n\n.ace-vibrant-ink .ace_gutter-layer {\n  width: 100%;\n  text-align: right;\n}\n\n.ace-vibrant-ink .ace_gutter-layer .ace_gutter-cell {\n  padding-right: 6px;\n}\n\n.ace-vibrant-ink .ace_print_margin {\n  width: 1px;\n  background: #e8e8e8;\n}\n\n.ace-vibrant-ink .ace_scroller {\n  background-color: #0F0F0F;\n}\n\n.ace-vibrant-ink .ace_text-layer {\n  cursor: text;\n  color: #FFFFFF;\n}\n\n.ace-vibrant-ink .ace_cursor {\n  border-left: 2px solid #FFFFFF;\n}\n\n.ace-vibrant-ink .ace_cursor.ace_overwrite {\n  border-left: 0px;\n  border-bottom: 1px solid #FFFFFF;\n}\n \n.ace-vibrant-ink .ace_marker-layer .ace_selection {\n  background: #6699CC;\n}\n\n.ace-vibrant-ink .ace_marker-layer .ace_step {\n  background: rgb(198, 219, 174);\n}\n\n.ace-vibrant-ink .ace_marker-layer .ace_bracket {\n  margin: -1px 0 0 -1px;\n  border: 1px solid #99CC99;\n}\n\n.ace-vibrant-ink .ace_marker-layer .ace_active_line {\n  background: #333333;\n}\n\n       \n.ace-vibrant-ink .ace_invisible {\n  color: #404040;\n}\n\n.ace-vibrant-ink .ace_keyword {\n  color:#FF6600;\n}\n\n.ace-vibrant-ink .ace_keyword.ace_operator {\n  \n}\n\n.ace-vibrant-ink .ace_constant {\n  \n}\n\n.ace-vibrant-ink .ace_constant.ace_language {\n  color:#339999;\n}\n\n.ace-vibrant-ink .ace_constant.ace_library {\n  \n}\n\n.ace-vibrant-ink .ace_constant.ace_numeric {\n  color:#99CC99;\n}\n\n.ace-vibrant-ink .ace_invalid {\n  color:#CCFF33;\n  background-color:#000000;\n}\n\n.ace-vibrant-ink .ace_invalid.ace_illegal {\n  \n}\n\n.ace-vibrant-ink .ace_invalid.ace_deprecated {\n  color:#CCFF33;\n  background-color:#000000;\n}\n\n.ace-vibrant-ink .ace_support {\n  \n}\n\n.ace-vibrant-ink .ace_support.ace_function {\n  color:#FFCC00;\n}\n\n.ace-vibrant-ink .ace_function.ace_buildin {\n  \n}\n\n.ace-vibrant-ink .ace_string {\n  color:#66FF00;\n}\n\n.ace-vibrant-ink .ace_string.ace_regexp {\n  color:#44B4CC;\n}\n\n.ace-vibrant-ink .ace_comment {\n  color:#9933CC;\n}\n\n.ace-vibrant-ink .ace_comment.ace_doc {\n  \n}\n\n.ace-vibrant-ink .ace_comment.ace_doc.ace_tag {\n  \n}\n\n.ace-vibrant-ink .ace_variable {\n  \n}\n\n.ace-vibrant-ink .ace_variable.ace_language {\n  \n}\n\n.ace-vibrant-ink .ace_xml_pe {\n  \n}\n\n.ace-vibrant-ink .ace_meta {\n  \n}\n\n.ace-vibrant-ink .ace_meta.ace_tag {\n  \n}\n\n.ace-vibrant-ink .ace_meta.ace_tag.ace_input {\n  \n}\n\n.ace-vibrant-ink .ace_entity.ace_other.ace_attribute-name {\n  font-style:italic;\ncolor:#99CC99;\n}\n\n\n.ace-vibrant-ink .ace_collab.ace_user1 {\n     \n}";i.importCssString(h),f.cssClass="ace-vibrant-ink";});},"@VERSION@",{requires:["aui-ace-editor-base"],skinnable:false});