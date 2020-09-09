import './components/actions/accessibility.js';
import './components/actions/code.js';
import './components/actions/fullscreen.js';
import './components/actions/hr.js';
import './components/actions/symbol.js';
import './components/actions/table.js';
import './components/toolbar/button.js';
import './components/toolbar/button-toggle.js';
import './components/toolbar/select.js';
import 'tinymce/tinymce.js';
import 'tinymce/icons/default/icons.js'; // annoying we would have to include this to avoid a 404
import 'tinymce/plugins/charmap/plugin.js';
import 'tinymce/plugins/fullpage/plugin.js';
import 'tinymce/themes/silver/theme.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { fonts, fontSizes, formats } from './components/actions/format.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';
import { LocalizeStaticMixin } from '@brightspace-ui/core/mixins/localize-static-mixin.js';
import { tinymceStyles } from './tinymce/skins/ui/oxide/skin.js';

// TODO: set powerpaste_word_import based on paste formatting config value (clean, merge, prompt)
// TODO: convert pasted local images if upload location provided (previously only allowed local images if provided)
// TODO: review whether pasted content needs prepcessing to avoid pasted image links getting converted to images
// TODO: configure paste_as_text if using tinyMCEs paste as text feature (fra editor sets to false if power paste enabled) - probably not needed
// TODO: provide a way for consumer to specify upload location for images, and configure images_upload_handler
// TODO: review whether we need to stop pasting of image addresses (see fra editor)
// TODO: localize & skin power paste
// TODO: localize and skin accessibility checker
// TODO: refactor classic / inline if necessary (need Design discussion)
// TODO: review allow_script_urls (ideally we can turn this off)
// TODO: review resize (monolith specifies both, but this would require enabling statusbar)
// TODO: content CSS (fragment and fullpage)
// TODO: review auto-focus and whether it should be on the API
// TODO: monolith intrgration (d2l_image d2l_isf d2l_equation fullscreen d2l_link d2l_equation d2l_code d2l_preview smallscreen)
// TODO: explore color picker (tinymce's dropdown picker will not work in shadow-dom, and we prefer ours)
// TODO: editor resize (ref monolith resize handler, updates editor size)

class HtmlEditor extends LocalizeStaticMixin(LitElement) {

	static get properties() {
		return {
			fullPage: { type: Boolean, attribute: 'full-page' },
			fullPageFontColor: { type: String, attribute: 'full-page-font-color' },
			fullPageFontFamily: { type: String, attribute: 'full-page-font-family' },
			fullPageFontSize: { type: String, attribute: 'full-page-font-size' },
			height: { type: String },
			inline: { type: Boolean },
			noSpellchecker: { type: Boolean, attribute: 'no-spellchecker'},
			width: { type: String },
			_editorId: { type: String },
			_fullscreen: { type: Boolean }
		};
	}

	static get styles() {
		return [tinymceStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-htmleditor-fullscreen {
				background-color: #ffffff;
				display: flex;
				flex-direction: column;
				height: 100vh;
				left: 0;
				position: fixed;
				top: 0;
				z-index: 1001;
			}
			.d2l-htmleditor-fullscreen .d2l-htmleditor-content {
				flex: auto;
			}
			/* stylelint-disable-next-line selector-class-pattern */
			.d2l-htmleditor-fullscreen .tox-tinymce {
				height: 100% !important;
			}
		`];
	}

	static get resources() {
		return {
			'ar': { bold: 'Bold', italic: 'Italic', underline: 'Underline', fontFamily: 'Font Family', undo: 'Undo', redo: 'redo' },
			'da': { bold: 'Bold', italic: 'Italic', underline: 'Underline', fontFamily: 'Font Family', undo: 'Undo', redo: 'redo' },
			'de': { bold: 'Bold', italic: 'Italic', underline: 'Underline', fontFamily: 'Font Family', undo: 'Undo', redo: 'redo' },
			'en': { bold: 'Bold', italic: 'Italic', underline: 'Underline', fontFamily: 'Font Family', undo: 'Undo', redo: 'redo' },
			'es': { bold: 'Bold', italic: 'Italic', underline: 'Underline', fontFamily: 'Font Family', undo: 'Undo', redo: 'redo' },
			'fr': { bold: 'Bold', italic: 'Italic', underline: 'Underline', fontFamily: 'Font Family', undo: 'Undo', redo: 'redo' },
			'ja': { bold: 'Bold', italic: 'Italic', underline: 'Underline', fontFamily: 'Font Family', undo: 'Undo', redo: 'redo' },
			'ko': { bold: 'Bold', italic: 'Italic', underline: 'Underline', fontFamily: 'Font Family', undo: 'Undo', redo: 'redo' },
			'nl': { bold: 'Bold', italic: 'Italic', underline: 'Underline', fontFamily: 'Font Family', undo: 'Undo', redo: 'redo' },
			'pt': { bold: 'Bold', italic: 'Italic', underline: 'Underline', fontFamily: 'Font Family', undo: 'Undo', redo: 'redo' },
			'sv': { bold: 'Bold', italic: 'Italic', underline: 'Underline', fontFamily: 'Font Family', undo: 'Undo', redo: 'redo' },
			'tr': { bold: 'Bold', italic: 'Italic', underline: 'Underline', fontFamily: 'Font Family', undo: 'Undo', redo: 'redo' },
			'tr-tr': { bold: 'Bold', italic: 'Italic', underline: 'Underline', fontFamily: 'Font Family', undo: 'Undo', redo: 'redo' },
			'zh': { bold: 'Bold', italic: 'Italic', underline: 'Underline', fontFamily: 'Font Family', undo: 'Undo', redo: 'redo' },
			'zh-cn': { bold: 'Bold', italic: 'Italic', underline: 'Underline', fontFamily: 'Font Family', undo: 'Undo', redo: 'redo' },
			'zh-tw': { bold: 'Bold', italic: 'Italic', underline: 'Underline', fontFamily: 'Font Family', undo: 'Undo', redo: 'redo' }
		};
	}

	constructor() {
		super();
		this._editorPromise = new Promise((resolve) => {
			this._resolveEditorPromise = resolve;
		});
		this.fullPage = false;
		this.height = '355px';
		this.inline = false;
		this.noSpellchecker = false;
		this.width = '100%';
		this._editorId = getUniqueId();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		requestAnimationFrame(() => {

			const textarea = this.shadowRoot.querySelector(`#${this._editorId}`);
			const locale = 'en-US';

			const fullPageConfig = {};
			if (this.fullPage) {
				if (this.fullPageFontColor) fullPageConfig.fullpage_default_text_color = this.fullPageFontColor;
				if (this.fullPageFontFamily) fullPageConfig.fullpage_default_font_family = this.fullPageFontFamily;
				if (this.fullPageFontSize) fullPageConfig.fullpage_default_font_size = this.fullPageFontSize;
			}

			const powerPasteConfig = {
				powerpaste_allow_local_images: true,
				powerpaste_block_drop : false,
				powerpaste_word_import: 'merge'
			};
			/*
			paste_preprocess: function(plugin, data) {
				// Stops Paste plugin from converting pasted image links to image
				data.content += ' ';
			},
			*/

			tinymce.init({
				a11ychecker_allow_decorative_images: true,
				allow_html_in_named_anchor: true,
				allow_script_urls: true,
				branding: false,
				browser_spellcheck: !this.noSpellchecker,
				convert_urls: false,
				content_css: '/tinymce/skins/content/default/content.css',
				directionality: this.dir ? this.dir : 'ltr',
				extended_valid_elements: 'span[*]',
				external_plugins: {
					'a11ychecker': '/tinymce/plugins/a11ychecker/plugin.js',
					'powerpaste': '/tinymce/plugins/powerpaste/plugin.js'
				},
				height: this.height,
				inline: this.inline,
				language: locale !== 'en-US' ? locale : null,
				language_url: `/tinymce/langs/${locale}.js`,
				menubar: false,
				object_resizing : true,
				plugins: `a11ychecker charmap powerpaste ${this.fullPage ? 'fullpage' : ''}`,
				relative_urls: false,
				setup: (editor) => {
					editor.on('init', () => {
						editor.undoManager.clear();
					});
					this._resolveEditorPromise(editor);
					this._editor = editor;
				},
				skin_url: '/tinymce/skins/ui/oxide',
				statusbar: false,
				target: textarea,
				toolbar: false,
				valid_elements: '*[*]',
				width: this.width,
				...fullPageConfig,
				...powerPasteConfig
			});

		});

	}

	render() {
		if (!this._originalContent) {
			const template = this.querySelector('template');
			if (this.inline) {
				this._originalContent = document.importNode(template.content, true);
			} else {
				const temp = document.createElement('div');
				temp.appendChild(document.importNode(template.content, true));
				this._originalContent = temp.innerHTML;
			}
		}

		const classes = {
			'd2l-htmleditor-fullscreen': this._fullscreen
		};

		if (this.inline) {
			return html`<div id="${this._editorId}">${this._originalContent}</div>`;
		} else {
			return html`
			<div class="${classMap(classes)}">
				<div>
					<d2l-htmleditor-button-toggle cmd="bold" text="${this.localize('bold')}"></d2l-htmleditor-button-toggle>
					<d2l-htmleditor-button-toggle cmd="italic" text="${this.localize('italic')}"></d2l-htmleditor-button-toggle>
					<d2l-htmleditor-button-toggle cmd="underline" text="${this.localize('underline')}"></d2l-htmleditor-button-toggle>
					<d2l-htmleditor-button-toggle cmd="strikethrough" text="Strikethrough"></d2l-htmleditor-button-toggle>
					<d2l-htmleditor-button-toggle cmd="subscript" text="Subscript"></d2l-htmleditor-button-toggle>
					<d2l-htmleditor-button-toggle cmd="superscript" text="Superscript"></d2l-htmleditor-button-toggle>
					<d2l-htmleditor-button-toggle cmd="insertUnorderedList" text="Unordered List"></d2l-htmleditor-button-toggle>
					<d2l-htmleditor-button-toggle cmd="insertOrderedList" text="Ordered List"></d2l-htmleditor-button-toggle>
					<d2l-htmleditor-button-toggle cmd="justifyLeft" text="Align Left"></d2l-htmleditor-button-toggle>
					<d2l-htmleditor-button-toggle cmd="justifyRight" text="Align Right"></d2l-htmleditor-button-toggle>
					<d2l-htmleditor-button-toggle cmd="justifyCenter" text="Align Center"></d2l-htmleditor-button-toggle>
					<d2l-htmleditor-button-toggle cmd="justifyFull" text="Align Justify"></d2l-htmleditor-button-toggle>
					<d2l-htmleditor-button cmd="indent" text="Indent"></d2l-htmleditor-button>
					<d2l-htmleditor-button cmd="outdent" text="Outdent"></d2l-htmleditor-button>
					<d2l-htmleditor-button-a11y></d2l-htmleditor-button-a11y>
					<d2l-htmleditor-button cmd="undo" text="${this.localize('undo')}"></d2l-htmleditor-button>
					<d2l-htmleditor-button cmd="redo" text="${this.localize('redo')}"></d2l-htmleditor-button>
					<d2l-htmleditor-select cmd="fontname" text="${this.localize('fontFamily')}" .options="${fonts}"></d2l-htmleditor-select>
					<d2l-htmleditor-select cmd="fontsize" text="Font Size" .options="${fontSizes}"></d2l-htmleditor-select>
					<d2l-htmleditor-select cmd="formatBlock" text="Format" .options="${formats}"></d2l-htmleditor-select>
					<d2l-htmleditor-button-symbol></d2l-htmleditor-button-symbol>
					<d2l-htmleditor-button cmd="insertHorizontalRule" text="Insert Line (native)"></d2l-htmleditor-button>
					<d2l-htmleditor-button-hr></d2l-htmleditor-button-hr>
					<d2l-htmleditor-button-code></d2l-htmleditor-button-code>
					<d2l-htmleditor-button-fullscreen></d2l-htmleditor-button-fullscreen>
					<d2l-htmleditor-button-table></d2l-htmleditor-button-table>
				</div>
				<div class="d2l-htmleditor-content">
					<textarea id="${this._editorId}">${this._originalContent}</textarea>
				</div>
			</div>
			`;
		}
	}

	focus() {
		tinymce.EditorManager.get(this._editorId).focus();
	}

	getEditor() {
		return this._editorPromise;
	}

}

customElements.define('d2l-htmleditor', HtmlEditor);
