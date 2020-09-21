import { val as accessibilityCheck } from '@brightspace-ui/core/generated/icons/tier1/resize-right.js';

const icons = {
	'resize-handle': accessibilityCheck
};

Object.keys(icons).forEach((key) => {
	icons[key] = icons[key].replace(/fill="#494c4e"/g, 'fill-rule="nonzero"');
});

export { icons };
