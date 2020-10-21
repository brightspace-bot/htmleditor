import './components/quicklink.js';
import './components/equation.js';
import '@brightspace-ui/core/components/colors/colors.js';
import 'tinymce/tinymce.js';
import 'tinymce/icons/default/icons.js';
import 'tinymce/plugins/autosave/plugin.js';
import 'tinymce/plugins/charmap/plugin.js';
import 'tinymce/plugins/code/plugin.js';
import 'tinymce/plugins/directionality/plugin.js';
import 'tinymce/plugins/emoticons/plugin.js';
import 'tinymce/plugins/emoticons/js/emojis.js';
import 'tinymce/plugins/fullpage/plugin.js';
import 'tinymce/plugins/fullscreen/plugin.js';
import 'tinymce/plugins/hr/plugin.js';
import 'tinymce/plugins/image/plugin.js';
import 'tinymce/plugins/imagetools/plugin.js';
import 'tinymce/plugins/lists/plugin.js';
import 'tinymce/plugins/preview/plugin.js';
import 'tinymce/plugins/table/plugin.js';
import 'tinymce/themes/silver/theme.js';
import { css, html, LitElement, unsafeCSS } from 'lit-element/lit-element.js';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';
import { icons } from './icons.js';
import { isfStyles } from './components/isf.js';
import { ProviderMixin } from '@brightspace-ui/core/mixins/provider-mixin.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { tinymceLangs } from './generated/langs.js';

// To update from new tinyMCE install
// 1. copy skins from installed node_modules/tinymce into tinymce/skins
// 2. copy new language packs from https://www.tiny.cloud/get-tiny/language-packages/ into tinymce/langs
// 3. copy new enterprise plugins into tinymce/plugins

// TODO: set powerpaste_word_import based on paste formatting config value (clean, merge, prompt)
// TODO: convert pasted local images if upload location provided (previously only allowed local images if provided)
// TODO: review whether pasted content needs prepcessing to avoid pasted image links getting converted to images
// TODO: configure paste_as_text if using tinyMCEs paste as text feature (fra editor sets to false if power paste enabled) - probably not needed
// TODO: provide a way for consumer to specify upload location for images, and configure images_upload_handler
// TODO: review whether we need to stop pasting of image addresses (see fra editor)
// TODO: refactor classic / inline if necessary (need Design discussion)
// TODO: review allow_script_urls (ideally we can turn this off)
// TODO: review auto-focus and whether it should be on the API

const editorTypes = {
	FULL: 'full',
	INLINE: 'inline',
	INLINE_LIMITED: 'inline-limited'
};

const context = JSON.parse(document.documentElement.getAttribute('data-he-context'));

const rootFontSize = window.getComputedStyle(document.documentElement, null).getPropertyValue('font-size');

const documentLang = (document.documentElement.getAttribute('lang') ?? 'en').replace('-', '_');

let tinymceLang = documentLang;
if (!tinymceLangs.includes(documentLang)) {
	const cultureIndex = tinymceLang.indexOf('_');
	if (cultureIndex !== -1) tinymceLang = tinymceLang.substring(0, cultureIndex);
	if (!tinymceLangs.includes(tinymceLang)) {
		tinymceLang = tinymceLangs.find((lang) => {
			return lang.startsWith(tinymceLang);
		});
		if (!tinymceLang) tinymceLang = 'en';
	}
}

const pathFromUrl = (url) => {
	return url.substring(0, url.lastIndexOf('/'));
};

const baseImportPath = pathFromUrl(import.meta.url);

const contentFragmentStyles = css`
	@import url("https://s.brightspace.com/lib/fonts/0.5.0/fonts.css");
	html {
		/* stylelint-disable-next-line function-name-case */
		font-size: ${unsafeCSS(rootFontSize)};
	}
	body {
		color: #494c4e;
		font-family: 'Lato', sans-serif;
		font-size: 0.95rem;
		font-weight: normal;
		letter-spacing: 0.01rem;
		line-height: 1.4rem;
	}
	table {
		font-family: 'Lato', sans-serif;
		font-size: inherit;
	}
`.cssText;

class HtmlEditor extends ProviderMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			autoSave: { type: Boolean, attribute: 'auto-save' },
			files: { type: Array },
			fullPage: { type: Boolean, attribute: 'full-page' },
			fullPageFontColor: { type: String, attribute: 'full-page-font-color' },
			fullPageFontFamily: { type: String, attribute: 'full-page-font-family' },
			fullPageFontSize: { type: String, attribute: 'full-page-font-size' },
			height: { type: String },
			html: { type: String },
			noFilter: { type: Boolean, attribute: 'no-filter' },
			noSpellchecker: { type: Boolean, attribute: 'no-spellchecker' },
			pasteLocalImages: { type: Boolean, attribute: 'paste-local-images' },
			type: { type: String },
			width: { type: String },
			_editorId: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			/* stylelint-disable-next-line selector-class-pattern */
			.tox-tinymce.tox-fullscreen {
				z-index: 1001;
			}
			/* stylelint-disable-next-line selector-class-pattern */
			.tox .tox-statusbar {
				border-top: none;
			}
			/* stylelint-disable-next-line selector-class-pattern */
			.tox .tox-statusbar__text-container {
				display: none;
			}
			/* stylelint-disable-next-line selector-class-pattern */
			:host([type="inline"]) .tox-tinymce .tox-toolbar-overlord > div:nth-child(2) {
				display: none;
			}
			/* stylelint-disable-next-line selector-class-pattern */
			:host([type="inline"]) .tox-tinymce.tox-fullscreen .tox-toolbar-overlord > div:nth-child(1) {
				display: none;
			}
			/* stylelint-disable-next-line selector-class-pattern */
			:host([type="inline"]) .tox-tinymce.tox-fullscreen .tox-toolbar-overlord > div:nth-child(2) {
				display: flex;
			}
			/* stylelint-disable-next-line selector-class-pattern */
			.tox-tinymce.tox-fullscreen .tox-statusbar__resize-handle {
				display: none;
			}
		`;
	}

	constructor() {
		super();
		this.autoSave = false;
		this.files = [];
		this.fullPage = false;
		this.height = '355px';
		this.noFilter = false;
		this.noSpellchecker = false;
		this.pasteLocalImages = false;
		this.type = editorTypes.FULL;
		this.width = '100%';
		this._editorId = getUniqueId();
		this._html = '';
		this._uploadImageCount = 0;
		if (context) {
			this.provideInstance('orgUnitId', context.orgUnitId);
			this.provideInstance('wmodeOpaque', context.wmodeOpaque);
		}
		setTimeout(() => {
			this.provideInstance('noFilter', this.noFilter);
		}, 0);
	}

	get html() {
		const editor = tinymce.EditorManager.get(this._editorId);
		if (editor) {
			return editor.getContent();
		} else {
			return this._html;
		}
	}

	set html(val) {
		const oldVal = this._html;
		if (oldVal !== val) {
			this._html = val;
			const editor = tinymce.EditorManager.get(this._editorId);
			if (editor) {
				editor.setContent(this._html);
			}
			this.requestUpdate('html', oldVal);
		}
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		requestAnimationFrame(() => {

			const textarea = this.shadowRoot.querySelector(`#${this._editorId}`);

			const fullPageConfig = {};
			if (this.fullPage) {
				if (this.fullPageFontColor) fullPageConfig.fullpage_default_text_color = this.fullPageFontColor;
				if (this.fullPageFontFamily) fullPageConfig.fullpage_default_font_family = this.fullPageFontFamily;
				if (this.fullPageFontSize) fullPageConfig.fullpage_default_font_size = this.fullPageFontSize;
			}

			const powerPasteConfig = {
				powerpaste_allow_local_images: this.pasteLocalImages,
				powerpaste_block_drop: !this.pasteLocalImages,
				powerpaste_word_import: context ? context.pasteFormatting : 'merge'
			};

			const autoSaveConfig = {
				autosave_ask_before_unload: this.autoSave,
				autosave_restore_when_empty: false,
				autosave_retention: '0s'
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
				content_css: `${baseImportPath}/tinymce/skins/content/default/content.css`,
				content_style: this.fullPage ? isfStyles : `${contentFragmentStyles} ${isfStyles}`,
				directionality: this.dir ? this.dir : 'ltr',
				extended_valid_elements: 'span[*]',
				external_plugins: {
					'a11ychecker': `${baseImportPath}/tinymce/plugins/a11ychecker/plugin.js`,
					'powerpaste': `${baseImportPath}/tinymce/plugins/powerpaste/plugin.js`
				},
				font_formats: 'Arabic Transparent=arabic transparent,sans-serif; Arial (Recommended)=arial,helvetica,sans-serif; Comic Sans=comic sans ms,sans-serif; Courier=courier new,courier,sans-serif; Ezra SIL=ezra sil,arial unicode ms,arial,sans-serif; Georgia=georgia,serif; SBL Hebrew=sbl hebrew,times new roman,serif; Simplified Arabic=simplified arabic,sans-serif; Tahoma=tahoma,sans-serif; Times New Roman=times new roman,times,serif; Traditional Arabic=traditional arabic,serif; Trebuchet=trebuchet ms,helvetica,sans-serif; Verdana=verdana,sans-serif; 돋움 (Dotum)=dotum,arial,helvetica,sans-serif; 宋体 (Sim Sun)=simsun; 細明體 (Ming Liu)=mingliu,arial,helvetica,sans-serif',
				fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
				height: this.height,
				images_upload_handler: (blobInfo, success, failure) => this._imageUploadHandler(blobInfo, success, failure),
				init_instance_callback: (editor) => {
					if (editor && editor.plugins && editor.plugins.autosave) {
						delete editor.plugins.autosave; // removing the autosave plugin prevents saving of content but retains the "ask_before_unload" behaviour
					}
				},
				// inline: this.type === editorTypes.INLINE || this.type === editorTypes.INLINE_LIMITED,
				language: tinymceLang,
				language_url: `/tinymce/langs/${tinymceLang}.js`,
				menubar: false,
				object_resizing : true,
				plugins: `a11ychecker ${this.autoSave ? 'autosave' : ''} charmap code directionality emoticons ${this.fullPage ? 'fullpage' : ''} fullscreen hr image ${this.pasteLocalImages ? 'imagetools' : ''} lists powerpaste preview table d2l-equation d2l-isf d2l-quicklink`,
				relative_urls: false,
				resize: true,
				setup: (editor) => {
					editor.ui.registry.addIcon('resize-handle', icons['resize-handle']);

					if (this.pasteLocalImages) editor.on('blur', () => editor.uploadImages());

					const createSplitButton = (name, icon, tooltip, cmd, items) => {
						editor.ui.registry.addSplitButton(name, {
							icon: icon,
							tooltip: tooltip,
							onAction: () => editor.execCommand(cmd),
							onItemAction: (api, value) => editor.execCommand(value),
							select: (value) => editor.queryCommandState(value),
							fetch: (callback) => {
								callback(items);
							}
						});
					};

					createSplitButton('d2l-inline', 'superscript', 'Superscript', 'superscript', [
						{ type: 'choiceitem', icon: 'superscript', text: 'Superscript', value: 'superscript' },
						{ type: 'choiceitem', icon: 'subscript', text: 'Subscript', value: 'subscript' },
						{ type: 'choiceitem', icon: 'strike-through', text: 'Strike-through', value: 'strikethrough' }
					]);

					createSplitButton('d2l-align', 'align-left', 'Left', 'justifyLeft', [
						{ type: 'choiceitem', icon: 'align-left', text: 'Left', value: 'justifyLeft' },
						{ type: 'choiceitem', icon: 'align-center', text: 'Center', value: 'justifyCenter' },
						{ type: 'choiceitem', icon: 'align-right', text: 'Right', value: 'justifyRight' },
						{ type: 'choiceitem', icon: 'align-justify', text: 'Justify', value: 'justifyFull' }
					]);

					createSplitButton('d2l-list', 'unordered-list', 'Bulleted List', 'insertUnorderedList', [
						{ type: 'choiceitem', icon: 'unordered-list', text: 'Bulleted List', value: 'insertUnorderedList' },
						{ type: 'choiceitem', icon: 'ordered-list', text: 'Numbered List', value: 'insertOrderedList' },
						{ type: 'choiceitem', icon: 'indent', text: 'Increase Indent', value: 'indent' },
						{ type: 'choiceitem', icon: 'outdent', text: 'Decrease Indent', value: 'outdent' }
					]);

					createSplitButton('d2l-dir', 'ltr', 'Left to Right', 'mceDirectionLTR', [
						{ type: 'choiceitem', icon: 'ltr', text: 'Left to Right', value: 'mceDirectionLTR' },
						{ type: 'choiceitem', icon: 'rtl', text: 'Right to Left', value: 'mceDirectionRTL' },
					]);

				},
				skin_url: `${baseImportPath}/tinymce/skins/ui/naked`,
				statusbar: true,
				target: textarea,
				toolbar: this._getToolbarConfig(),
				valid_elements: '*[*]',
				width: this.width,
				...autoSaveConfig,
				...fullPageConfig,
				...powerPasteConfig
			});

		});

	}

	render() {
		//if (this.type === editorTypes.INLINE || this.type === editorTypes.INLINE_LIMITED) {
		//	return html`<div id="${this._editorId}" .innerHTML="${this._html}"></div>`;
		//} else {
		return html`<textarea id="${this._editorId}" aria-hidden="true" tabindex="-1">${this._html}</textarea>`;
		//}
	}

	focus() {
		tinymce.EditorManager.get(this._editorId).focus();
	}

	_getToolbarConfig() {
		if (this.type === editorTypes.INLINE_LIMITED) {
			return 'bold italic underline | d2l-list d2l-isf emoticons';
		} else if (this.type === editorTypes.INLINE) {
			return [
				'bold italic underline | d2l-align d2l-list d2l-isf | fullscreen',
				'styleselect | bold italic underline d2l-inline forecolor a11ycheck | d2l-align d2l-list d2l-dir | d2l-isf d2l-quicklink | table d2l-equation | charmap emoticons hr | fontselect | fontsizeselect | preview code fullscreen'
			];
		} else {
			return 'styleselect | bold italic underline d2l-inline forecolor a11ycheck | d2l-align d2l-list d2l-dir | d2l-isf d2l-quicklink | table d2l-equation | charmap emoticons hr | fontselect | fontsizeselect | preview code fullscreen';
		}
	}

	_imageUploadHandler(blobInfo, success, failure) {
		this._uploadImageCount++;
		if (this._uploadImageCount === 1) { // only fire the upload started event on the first image being uploaded
			this.dispatchEvent(new CustomEvent(
				'd2l-htmleditor-image-upload-started', {
					bubbles: true
				}
			));
		}

		// Local image upload requires an LMS context for now
		if (!D2L.LP || !context || context.orgUnitId === null || context.maxFileSize === null) return;

		const fileName = blobInfo.filename().replace('blobid', 'pic');
		const blob = blobInfo.blob();
		blob.name = fileName;

		const uploadLocation = new D2L.LP.Web.Http.UrlLocation(
			`/d2l/lp/fileupload/${context.orgUnitId}?maxFileSize=${context.maxFileSize}`
		);

		D2L.LP.Web.UI.Html.Files.FileUpload.XmlHttpRequest.UploadFiles(
			[blob],
			{
				UploadLocation: uploadLocation,
				OnFileComplete: (uploadedFile) => {
					const location = `/d2l/lp/files/temp/${uploadedFile.FileId}/View`;

					this.files.push(
						new FileData( // eslint-disable-line no-use-before-define
							uploadedFile.FileSystemType,
							uploadedFile.FileId,
							uploadedFile.FileName,
							uploadedFile.Size,
							location
						)
					);

					success(location);

					this._uploadImageCount--;
					if (this._uploadImageCount <= 0) {
						this.dispatchEvent(new CustomEvent(
							'd2l-htmleditor-image-upload-completed', {
								bubbles: true
							}
						));
					}
				},
				OnAbort: (errorResponse) => failure(errorResponse),
				OnError: (errorResponse) => failure(errorResponse),
				OnProgress: () => { }
			}
		);
	}

}

class FileData {

	constructor(fileSystemType, id, fileName, size, location) {
		this.FileSystemType = fileSystemType;
		this.Id = id;
		this.FileName = fileName;
		this.Size = size;
		this.Location = location;
	}

}

customElements.define('d2l-htmleditor', HtmlEditor);
