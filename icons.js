import { val as accessibilityCheck } from '@brightspace-ui/core/generated/icons/html-editor/accessibility-check.js';
import { val as alignCenter } from '@brightspace-ui/core/generated/icons/html-editor/align-center.js';
import { val as alignFull } from '@brightspace-ui/core/generated/icons/html-editor/align-full.js';
import { val as alignLeft } from '@brightspace-ui/core/generated/icons/html-editor/align-left.js';
import { val as alignRight } from '@brightspace-ui/core/generated/icons/html-editor/align-right.js';
import { val as bold } from '@brightspace-ui/core/generated/icons/html-editor/bold.js';
//import { val as cut } from '@brightspace-ui/core/generated/icons/html-editor/cut.js';
import { val as directionLtr } from '@brightspace-ui/core/generated/icons/html-editor/direction-ltr.js';
import { val as directionRtl } from '@brightspace-ui/core/generated/icons/html-editor/direction-rtl.js';
//import { val as equationChemistry } from '@brightspace-ui/core/generated/icons/html-editor/equation-graphical-chemistry.js';
//import { val as equationGraphical } from '@brightspace-ui/core/generated/icons/html-editor/equation-graphical.js';
//import { val as equationLatex } from '@brightspace-ui/core/generated/icons/html-editor/equation-latex.js';
//import { val as equationMathML } from '@brightspace-ui/core/generated/icons/html-editor/equation-mathml.js';
//import { val as image } from '@brightspace-ui/core/generated/icons/html-editor/image.js';
import { val as indentDecrease } from '@brightspace-ui/core/generated/icons/html-editor/indent-decrease.js';
import { val as indentIncrease } from '@brightspace-ui/core/generated/icons/html-editor/indent-increase.js';
//import { val as insertAttributes } from '@brightspace-ui/core/generated/icons/html-editor/insert-attributes.js';
//import { val as insertEmoticon } from '@brightspace-ui/core/generated/icons/html-editor/insert-emoticon.js';
import { val as italic } from '@brightspace-ui/core/generated/icons/html-editor/italic.js';
//import { val as link } from '@brightspace-ui/core/generated/icons/html-editor/link.js';
import { val as listBullet } from '@brightspace-ui/core/generated/icons/html-editor/list-bullet.js';
import { val as listOrdered } from '@brightspace-ui/core/generated/icons/html-editor/list-ordered.js';
//import { val as media } from '@brightspace-ui/core/generated/icons/html-editor/media.js';
//import { val as newLine } from '@brightspace-ui/core/generated/icons/html-editor/new-line.js';
//import { val as paste } from '@brightspace-ui/core/generated/icons/html-editor/paste.js';
import { val as sourceEditor } from '@brightspace-ui/core/generated/icons/html-editor/source-editor.js';
//import { val as spellcheck } from '@brightspace-ui/core/generated/icons/html-editor/spellcheck.js';
import { val as strikethrough } from '@brightspace-ui/core/generated/icons/html-editor/strikethrough.js';
import { val as subscript } from '@brightspace-ui/core/generated/icons/html-editor/subscript.js';
import { val as superscript } from '@brightspace-ui/core/generated/icons/html-editor/superscript.js';
import { val as symbol } from '@brightspace-ui/core/generated/icons/html-editor/symbol.js';
import { val as tableCellMerge } from '@brightspace-ui/core/generated/icons/html-editor/table-cell-merge.js';
import { val as tableCellProperties } from '@brightspace-ui/core/generated/icons/html-editor/table-cell-properties.js';
import { val as tableCellSplit } from '@brightspace-ui/core/generated/icons/html-editor/table-cell-split.js';
import { val as tableColumnInsertAfter } from '@brightspace-ui/core/generated/icons/html-editor/table-column-insert-after.js';
import { val as tableColumnInsertBefore } from '@brightspace-ui/core/generated/icons/html-editor/table-column-insert-before.js';
import { val as tableColumnRemove } from '@brightspace-ui/core/generated/icons/html-editor/table-column-remove.js';
import { val as tableDelete } from '@brightspace-ui/core/generated/icons/html-editor/table-delete.js';
//import { val as tableProperties } from '@brightspace-ui/core/generated/icons/html-editor/table-properties.js';
import { val as tableRowCopy } from '@brightspace-ui/core/generated/icons/html-editor/table-row-copy.js';
import { val as tableRowCut } from '@brightspace-ui/core/generated/icons/html-editor/table-row-cut.js';
import { val as tableRowInsertAfter } from '@brightspace-ui/core/generated/icons/html-editor/table-row-insert-after.js';
import { val as tableRowInsertBefore } from '@brightspace-ui/core/generated/icons/html-editor/table-row-insert-before.js';
import { val as tableRowPasteAbove } from '@brightspace-ui/core/generated/icons/html-editor/table-row-paste-above.js';
import { val as tableRowPasteBelow } from '@brightspace-ui/core/generated/icons/html-editor/table-row-paste-below.js';
import { val as tableRowProperties } from '@brightspace-ui/core/generated/icons/html-editor/table-row-properties.js';
import { val as tableRowRemove } from '@brightspace-ui/core/generated/icons/html-editor/table-row-remove.js';
import { val as underline } from '@brightspace-ui/core/generated/icons/html-editor/underline.js';

/*
svgs that we don't have... (may be more depending on what features we decide to include)

- insert hr
- insert isf
- insert quicklink
- fullscreen
- preview
- palette
- undo
- redo
*/

const icons = {
	'accessibility-check': accessibilityCheck,
	'align-center': alignCenter,
	'align-full': alignFull,
	'align-left': alignLeft,
	'align-right': alignRight,
	'bold': bold,
	'direction-ltr': directionLtr,
	'direction-rtl': directionRtl,
	'indent-decrease': indentDecrease,
	'indent-increase': indentIncrease,
	'italic': italic,
	'list-bullet': listBullet,
	'list-ordered': listOrdered,
	'source-editor': sourceEditor,
	'strikethrough': strikethrough,
	'subscript': subscript,
	'superscript': superscript,
	'symbol': symbol,
	'table-cell-merge': tableCellMerge,
	'table-cell-properties': tableCellProperties,
	'table-cell-split': tableCellSplit,
	'table-column-insert-after': tableColumnInsertAfter,
	'table-column-insert-before': tableColumnInsertBefore,
	'table-column-remove': tableColumnRemove,
	'table-delete': tableDelete,
	'table-row-copy': tableRowCopy,
	'table-row-cut': tableRowCut,
	'table-row-insert-after': tableRowInsertAfter,
	'table-row-insert-before': tableRowInsertBefore,
	'table-row-paste-above': tableRowPasteAbove,
	'table-row-paste-below': tableRowPasteBelow,
	'table-row-properties': tableRowProperties,
	'table-row-remove': tableRowRemove,
	'underline': underline
};

Object.keys(icons).forEach((key,index) => {
	icons[key] = icons[key].replace( /fill="#494c4e"/g, 'fill-rule="nonzero"');
});

export { icons };
