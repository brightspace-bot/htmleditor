import { val as link } from '@brightspace-ui/core/generated/icons/html-editor/link.js';
import { val as media } from '@brightspace-ui/core/generated/icons/html-editor/media.js';
import { val as resizeHandle } from '@brightspace-ui/core/generated/icons/tier1/resize-right.js';

const icons = {
	'link': link,
	'media': media,
	'resize-handle': resizeHandle
};

Object.keys(icons).forEach((key) => {
	icons[key] = icons[key].replace(/fill="#494c4e"/g, 'fill-rule="nonzero"');
});

export { icons };
