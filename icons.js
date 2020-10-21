import { val as equationChemistry } from '@brightspace-ui/core/generated/icons/html-editor/equation-graphical-chemistry.js';
import { val as equationGraphical } from '@brightspace-ui/core/generated/icons/html-editor/equation-graphical.js';
import { val as equationLatex } from '@brightspace-ui/core/generated/icons/html-editor/equation-latex.js';
import { val as equationMathML } from '@brightspace-ui/core/generated/icons/html-editor/equation-mathml.js';
import { val as image } from '@brightspace-ui/core/generated/icons/html-editor/image.js';
import { val as link } from '@brightspace-ui/core/generated/icons/html-editor/link.js';
import { val as media } from '@brightspace-ui/core/generated/icons/html-editor/media.js';
import { val as resizeHandle } from '@brightspace-ui/core/generated/icons/tier1/resize-right.js';

const icons = {
	'equation-chemistry': equationChemistry,
	'equation-graphical': equationGraphical,
	'equation-latex': equationLatex,
	'equation-mathml': equationMathML,
	'image': image,
	'link': link,
	'media': media,
	'resize-handle': resizeHandle
};

Object.keys(icons).forEach((key) => {
	icons[key] = icons[key].replace(/fill="#494c4e"/g, 'fill-rule="nonzero"');
});

export { icons };
