## TODO

* figure out why we need to wait a frame before calling init
* consider whether inline should be a separate component, general organization of features
* review allow_script_urls (ideally we can turn this off)
* resolve languages (maybe dynamic import)
* review resize (monolith specifies both, but this would require enabling statusbar)
* deal with fact that tinyMCE inline content styles conflict with prismjs styles
* review auto-focus and whether it should be on the API
* deal with unsafe
* fullpage documents (and styles)
* other plugins: d2l_image d2l_isf d2l_equation fullscreen d2l_link d2l_equation d2l_code d2l_preview smallscreen a11ycheck

## Notes

* text style menu: strikethrough superscript subscript
* insert menu: charmap hr d2l_attributes d2l_emoticons
* format menu: numlist indent outdent alignleft alignright aligncenter alignjustify ltr rtl

## Questions

* why to class-stream, assignment-editor, and rubric editor turn off object-resizing?
* our character map and horizontal rule may be better, do we use tiny's?
* do we want to expose our D2L typography classes in the format menu?
* do we want style menu like default tiny, or simpler like what we've used previously?
* stay with previously used font-size formats for backward compat?
