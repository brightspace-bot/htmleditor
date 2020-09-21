import { val as resizeHandle } from '@brightspace-ui/core/generated/icons/tier1/resize-right.js';

const icons = {
	'resize-handle': resizeHandle
};

Object.keys(icons).forEach((key) => {
	icons[key] = icons[key].replace(/fill="#494c4e"/g, 'fill-rule="nonzero"');
});

export { icons };

This PR enables tinyMCE's built-in resize handle, which is baked into its status-bar at the bottom of the editor.  Unfortunately this means overriding a couple of tinyMCE styles to hide those features.

* enable resize handle (vertical only for now)
* override status-bar styles to hide the element path and word count
* override the default resize-handle icon
