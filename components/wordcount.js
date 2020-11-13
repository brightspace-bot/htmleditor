import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/menu/menu.js';
import 'tinymce/tinymce.js';
import { countAll, countCharacters, countCharactersWithoutSpaces, countWords } from '../wordcount/wordcount.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RequesterMixin, requestInstance } from '@brightspace-ui/core/mixins/provider-mixin.js';
import { formatNumber } from '@brightspace-ui/intl/lib/number.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

const wordCountType = {
	CHAR: 'char',
	CHARWITHOUTSPACES: 'charWithoutSpaces',
	PARAGRAPH: 'paragraph',
	WORD: 'word',
};

tinymce.PluginManager.add('d2l-wordcount', function(editor) {
	
	const wordCountInFooter = requestInstance(editor.getElement(), 'wordCountInFooter');
	const localize = requestInstance(editor.getElement(), 'localize');

	const root = editor.getElement().getRootNode();

	const countButton = document.createElement('button');
	countButton.id = 'd2l-wordcount-footer-button';
	countButton.value = wordCountType.WORD;

	const getButtonCount = (countType, text, isSelection) => {
		switch(countType) {
			case wordCountType.CHAR:
				return countCharacters(text);
			case wordCountType.CHARWITHOUTSPACES:
				return countCharactersWithoutSpaces(text);
			case wordCountType.PARAGRAPH:
				return isSelection ? _countSelectedParagraphs(editor) : _countParagraphs(editor, text);
			case wordCountType.WORD:
			default:
				return countWords(text);
		}
	}
	
	const getButtonLangTerm = (countType, isSelection) => {
		switch(countType) {
			case wordCountType.CHAR:			
				return isSelection ? 'wordcount.footer.selectioncharactercount' : 'wordcount.footer.charactercount';
			case wordCountType.CHARWITHOUTSPACES:
				return isSelection ? 'wordcount.footer.selectioncharactercountwithoutspaces' : 'wordcount.footer.charactercountwithoutspaces';
			case wordCountType.PARAGRAPH:
				return isSelection ? 'wordcount.footer.selectionparagraphcount' : 'wordcount.footer.paragraphcount';
			case wordCountType.WORD:
			default:
				return isSelection ? 'wordcount.footer.selectionwordcount' : 'wordcount.footer.wordcount';
		}
	}

	const openWordCountDialog = () => {
		let dialog = root.querySelector('d2l-htmleditor-wordcount-dialog');
		if (!dialog) dialog = root.appendChild(document.createElement('d2l-htmleditor-wordcount-dialog'));

		const text = editor.getContent({ source_view: true, format: 'text' });
		const counts = countAll(text);
		const paragraphCount = _countParagraphs(editor, text);

		dialog.counts = {
			wordCount: counts.wordCount,
			characterCount: counts.characterCount,
			characterCountWithoutSpaces: counts.characterCountWithoutSpaces,
			paragraphCount: paragraphCount
		};

		dialog.opened = true;
		dialog.opener = root.host;

		const isSelection = editor.selection && !editor.selection.isCollapsed();

		if (isSelection) {
			const selectedText = editor.selection.getContent({ source_view: true, format: 'text' });
			const selectedCounts = countAll(selectedText);
			const selectedParagraphCount = _countSelectedParagraphs(editor, selectedText);

			dialog.selectedCounts = {
				wordCount: selectedCounts.wordCount,
				characterCount: selectedCounts.characterCount,
				characterCountWithoutSpaces: selectedCounts.characterCountWithoutSpaces,
				paragraphCount: selectedParagraphCount
			}
		}

		if (wordCountInFooter) dialog.countType = countButton.value;

		dialog.addEventListener('d2l-htmleditor-wordcount-select-option', (e) => {
			if (!e.detail) return;

			if (wordCountInFooter) {
				const countType = e.detail.selectedCountType;		
				countButton.value = countType;

				let count;
				switch(countType){
					case wordCountType.CHAR:			
						count = isSelection ? e.detail.selectedCounts.characterCount : e.detail.counts.characterCount;
						break;
					case wordCountType.CHARWITHOUTSPACES:
						count = isSelection ? e.detail.selectedCounts.characterCountWithoutSpaces : e.detail.counts.characterCountWithoutSpaces;
						break;
					case wordCountType.PARAGRAPH:
						count = isSelection ? e.detail.selectedCounts.paragraphCount : e.detail.counts.paragraphCount;
						break;
					case wordCountType.WORD:
					default:
						count = isSelection ? e.detail.selectedCounts.wordCount : e.detail.counts.wordCount;
						break;
				}

				countButton.textContent = localize(getButtonLangTerm(countType, Object.keys(e.detail.selectedCountType) !== 0), { count: count });
			}
		});
	}

	editor.ui.registry.addButton('d2l-wordcount', {
		tooltip: localize('preview.tooltip'),
		icon: 'preview',
		onAction: openWordCountDialog
	});

	if (!wordCountInFooter) return;
	
	countButton.onclick = openWordCountDialog;

	editor.on('init', () => {
		const statusBar = root.querySelector('.tox-statusbar');
		const statusBarResizeHandler = statusBar.querySelector('.tox-statusbar__resize-handle');

		statusBar.insertBefore(countButton, statusBarResizeHandler);
	});

	const onInputDelay = 100;
	let lastRunTime = Date.now();
	editor.on('change selectionchange textInput input', (e) => {
		// Don't debounce on selectionchange because it leaves quick selections with
		// inaccurate counts (selection happens too fast)
		if (e.type !== 'selectionchange' && Date.now() < (lastRunTime + onInputDelay)) return;

		const isSelection = editor.selection && !editor.selection.isCollapsed();
			
		const text = isSelection
			? editor.selection.getContent({ source_view: true, format: 'text' })
			: editor.getContent({ source_view: true, format: 'text' });
		
		countButton.textContent = localize(getButtonLangTerm(countButton.value, isSelection), { count: getButtonCount(countButton.value, text, isSelection) });
		lastRunTime = Date.now();
	});

});

class WordCountDialog extends RequesterMixin(RtlMixin(LitElement)) {
	
	static get properties() {
		return {		
			counts: { type: Object },
			countType: { type: String },
			opened: { type: Boolean, reflect: true },
			opener: { type: Object }
		};
	}

	static get styles() {
		return [
			selectStyles,
			css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-wordcount-counts {
				display: flex;
				justify-content: space-between
			}
			.d2l-wordcount-counts-num {
				font-size: 150%;
				font-weight: bold;
			}
			.d2l-wordcount-counts-label {
				color: var(--d2l-color-galena);
			}
			.d2l-wordcount-option-button {
				float: right
			}
		`];
	}

	constructor() {
		super();
		this.counts = {};
		this.countType = wordCountType.WORD;
		this.opened = false;
		this.selectedCounts = {};
	}

	connectedCallback() {
		super.connectedCallback();
		this._localize = this.requestInstance('localize');
		this._wordCountInFooter = this.requestInstance('wordCountInFooter');
	}

	_handleDialogClosed() {
		this.opened = false;
	}

	render() {
		return html`
			<d2l-dialog title-text="${this._localize('wordcount.dialog.title')}" ?opened="${this.opened}" @d2l-dialog-close=${(this._handleDialogClosed)}>
				${this._renderWordCountInfo()}
				<d2l-button slot="footer" primary data-dialog-action>${this._localize('wordcount.dialog.closebutton')}</d2l-button>
				${this._wordCountInFooter ? this._renderCountSelectionDropdown() : ''}
			</d2l-dialog>`;
	}

	_getCountOptionText(countType) {
		switch(countType) {
			case wordCountType.CHAR:
				return this._localize('wordcount.footerselectorlabel.character');
			case wordCountType.CHARWITHOUTSPACES:
				return this._localize('wordcount.footerselectorlabel.characterwithoutspaces');
			case wordCountType.PARAGRAPH:
				return this._localize('wordcount.footerselectorlabel.paragraph');
			case wordCountType.WORD:
			default:
				return this._localize('wordcount.footerselectorlabel.word');
		}
	}

	_renderWordCountInfo() {
		return html`
			<div class="d2l-wordcount-counts">
				<div>
					<div class="d2l-wordcount-counts-num">${formatNumber(this.counts.wordCount)}</div>
					<div class="d2l-wordcount-counts-label">${this._localize('wordcount.dialog.wordcount', { count: this.counts.wordCount })}</div>
				</div>
				<div>
					<div class="d2l-wordcount-counts-num">${formatNumber(this.counts.characterCount)}</div>
					<div class="d2l-wordcount-counts-label">${this._localize('wordcount.dialog.charactercount', { count: this.counts.characterCount })}</div>
				</div>
				<div>
					<div class="d2l-wordcount-counts-num">${formatNumber(this.counts.characterCountWithoutSpaces)}</div>
					<div class="d2l-wordcount-counts-label">${this._localize('wordcount.dialog.charactercountwithoutspaces', { count: this.counts.characterCountWithoutSpaces })}</div>
				</div>
				<div>
					<div class="d2l-wordcount-counts-num">${formatNumber(this.counts.paragraphCount)}</div>
					<div class="d2l-wordcount-counts-label">${this._localize('wordcount.dialog.paragraphcount', { count: this.counts.paragraphCount })}</div>
				</div>
			</div>`;
	}

	_renderCountSelectionDropdown() {
		return html`
			<d2l-dropdown-button-subtle slot="footer" id="d2l-wordcount-option" class="d2l-wordcount-option-button" text="${this._getCountOptionText(this._countType)}">
				<d2l-dropdown-menu>
					<d2l-menu>
						<d2l-menu-item
							text=${this._localize('wordcount.footerselector.wordcount')}
							@d2l-menu-item-select="${() => this._setSelectedCountOption(wordCountType.WORD)}">
						</d2l-menu-item>
						<d2l-menu-item
							text=${this._localize('wordcount.footerselector.charactercount')}
							@d2l-menu-item-select="${() => this._setSelectedCountOption(wordCountType.CHAR)}">
						</d2l-menu-item>
						<d2l-menu-item
							text=${this._localize('wordcount.footerselector.charactercountwithoutspaces')}
							@d2l-menu-item-select="${() => this._setSelectedCountOption(wordCountType.CHARWITHOUTSPACES)}">
						</d2l-menu-item>
						<d2l-menu-item
							text=${this._localize('wordcount.footerselector.paragraphs')}
							@d2l-menu-item-select="${() => this._setSelectedCountOption(wordCountType.PARAGRAPH)}">
						</d2l-menu-item>
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown-button-subtle>`;
	}

	_setSelectedCountOption(countType) {
		this._countType = countType;

		const selectorButton = this.shadowRoot.querySelector('#d2l-wordcount-option');
		selectorButton.text = this._getCountOptionText(countType)

		this.dispatchEvent(new CustomEvent(
			'd2l-htmleditor-wordcount-select-option', {
				bubbles: true,
				detail: {
					counts: this.counts,
					selectedCounts: this.selectedCounts,
					selectedCountType: countType
				}
			}
		));
	}
}

function _countParagraphs(editor, text) {	
	if (text.length === 0) return 0;
	
	// When the editor is "empty", it actually contains a single line feed character.
	// As soon as any other text is added, this is removed, so we likely shouldn't count this.
	if (text.length === 1 && text.charCodeAt(0) === 10) return 0;

	return editor.getBody().getElementsByTagName("p").length;
}

function _countSelectedParagraphs(editor) {
	if (!editor.selection || editor.selection.isCollapsed()) return 0;

	const html = editor.selection.getContent({ format: 'html' });
	const template = document.createElement('template');
	template.insertAdjacentHTML('afterbegin', html);

	let paragraphCount = template.getElementsByTagName("p").length;

	// If the editor has a  selection and there's HTML present
	// we've likely selected text only and haven't managed to capture
	// a paragraph tag - this means we still have 1 paragraph.
	if (paragraphCount === 0 && html.length !== 0) paragraphCount = 1;

	return paragraphCount;
}

customElements.define('d2l-htmleditor-wordcount-dialog', WordCountDialog);
