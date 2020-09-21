import { val as resizeHandle } from '@brightspace-ui/core/generated/icons/tier1/resize-right.js';

const icons = {
	'resize-handle': resizeHandle
};

Object.keys(icons).forEach((key) => {
	icons[key] = icons[key].replace(/fill="#494c4e"/g, 'fill-rule="nonzero"');
});

export { icons };
