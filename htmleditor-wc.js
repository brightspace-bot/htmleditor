import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeStaticMixin } from '@brightspace-ui/core/mixins/localize-static-mixin.js';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';
import { tinymceStyles } from './skins/skin.js';
import './components/toolbar/toggle-button.js';
import 'tinymce/tinymce.js';
import 'tinymce/themes/silver/theme.js';

const registerPlugin = (name, command) => {
	tinymce.PluginManager.add(name, function(editor, url) {
		const elem = editor.getElement().getRootNode().querySelector(`[command="${command}"]`);
		elem.addEventListener('click', () => {
			editor.execCommand(command);
		});
		editor.on('NodeChange', (args) => {
			elem.active = editor.queryCommandState(command);
		});
	});
};

registerPlugin('d2l-bold', 'bold');
registerPlugin('d2l-italic', 'italic');
registerPlugin('d2l-underline', 'underline');

class HtmlEditor extends LocalizeStaticMixin(LitElement) {

	static get properties() {
		return {
			inline: { type: Boolean },
			noSpellchecker: { type: Boolean, attribute: 'no-spellchecker'},
			_editorId: { type: String }
		};
	}

	static get styles() {
		return [tinymceStyles, css`
			:host {
			}
			:host([hidden]) {
				display: none;
			}
		`];
	}

	static get resources() {
		return {
			'ar': { bold: 'Bold', italic: 'Italic', underline: 'Underline' },
			'da': { bold: 'Bold', italic: 'Italic', underline: 'Underline' },
			'de': { bold: 'Bold', italic: 'Italic', underline: 'Underline' },
			'en': { bold: 'Bold', italic: 'Italic', underline: 'Underline' },
			'es': { bold: 'Bold', italic: 'Italic', underline: 'Underline' },
			'fr': { bold: 'Bold', italic: 'Italic', underline: 'Underline' },
			'ja': { bold: 'Bold', italic: 'Italic', underline: 'Underline' },
			'ko': { bold: 'Bold', italic: 'Italic', underline: 'Underline' },
			'nl': { bold: 'Bold', italic: 'Italic', underline: 'Underline' },
			'pt': { bold: 'Bold', italic: 'Italic', underline: 'Underline' },
			'sv': { bold: 'Bold', italic: 'Italic', underline: 'Underline' },
			'tr': { bold: 'Bold', italic: 'Italic', underline: 'Underline' },
			'tr-tr': { bold: 'Bold', italic: 'Italic', underline: 'Underline' },
			'zh': { bold: 'Bold', italic: 'Italic', underline: 'Underline' },
			'zh-cn': { bold: 'Bold', italic: 'Italic', underline: 'Underline' },
			'zh-tw': { bold: 'Bold', italic: 'Italic', underline: 'Underline' }
		};
	}

	constructor() {
		super();
		this.inline = false;
		this.noSpellchecker = false;
		this._editorId = getUniqueId();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		requestAnimationFrame(() => {

			const textarea = this.shadowRoot.querySelector(`#${this._editorId}`);
			const locale = 'en-US';

			// TODO: figure out why we need to wait a frame before calling init
			// TODO: consider whether inline should be a separate component, general organization of features
			// TODO: review allow_script_urls (ideally we can turn this off)
			// TODO: resolve languages (maybe dynamic import)
			// TODO: review resize (monolith specifies both, but this would require enabling statusbar)
			// TODO: deal with fact that tinyMCE inline content styles conflict with prismjs styles
			// TODO: review auto-focus and whether it should be on the API
			// TODO: deal with unsafe
			// TODO: fullpage documents (and styles)
			// TODO: other plugins: d2l_image d2l_isf d2l_equation fullscreen d2l_link d2l_equation d2l_code d2l_preview smallscreen a11ycheck
			// TODO: get enterprise plugins a11ychecker(a11ycheck)
			// NOTE: text style menu: strikethrough superscript subscript
			// NOTE: insert menu: charmap hr d2l_attributes d2l_emoticons
			// NOTE: format menu: numlist indent outdent alignleft alignright aligncenter alignjustify ltr rtl
			// QUESTION: why to class-stream, assignment-editor, and rubric editor turn off object-resizing?
			// QUESTION: our character map and horizontal rule may be better, do we use tiny's?
			// QUESTION: do we want to expose our D2L typography classes in the format menu?
			// QUESTION: do we want style menu like default tiny, or simpler like what we've used previously?
			// QUESTION: stay with previously used font-size formats for backward compat?

			tinymce.init({
				a11ychecker_allow_decorative_images: true,
				allow_html_in_named_anchor: true,
				allow_script_urls: true,
				branding: false,
				browser_spellcheck: !this.noSpellchecker,
				convert_urls: false,
				content_css: '/skins/content/default/content.css',
				directionality: this.dir ? this.dir : 'ltr',
				extended_valid_elements: 'span[*]',
				fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
				inline: this.inline,
				language: locale !== 'en-US' ? locale : null,
				language_url: `/langs/${locale}.js`,
				menubar: false,
				object_resizing : true,
				plugins: 'd2l-bold d2l-italic d2l-underline',
				relative_urls: false,
				skin_url: '/skins',
				statusbar: false,
				target: textarea,
				toolbar: false,
				valid_elements: '*[*]'
			});

		});

	}

	focus() {
		tinymce.EditorManager.get(this._editorId).focus();
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

		if (this.inline) {
			return html`<div id="${this._editorId}">${this._originalContent}</div>`;
		} else {
			return html`
				<div>
					<d2l-htmleditor-toggle-button command="bold" text="${this.localize('bold')}"></d2l-htmleditor-toggle-button>
					<d2l-htmleditor-toggle-button command="italic" text="${this.localize('italic')}"></d2l-htmleditor-toggle-button>
					<d2l-htmleditor-toggle-button command="underline" text="${this.localize('underline')}"></d2l-htmleditor-toggle-button>
				</div>
				<textarea id="${this._editorId}">${this._originalContent}</textarea>
			`;
		}
	}
}
customElements.define('d2l-htmleditor', HtmlEditor);
