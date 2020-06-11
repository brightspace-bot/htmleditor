import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import '../toolbar/button-toggle.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

// TODO: localize
// TODO: decide if we use this or the native browser cmd

class HorizontalRuleButton extends RtlMixin(LitElement) {

	static get properties() {
		return {
			_hasShadow: { type: Boolean },
			_height: { type: String },
			_opened: { type: Boolean },
			_width: { type: String },
			_widthUnits: { type: String }
		};
	}

	static get styles() {
		return [inputLabelStyles, selectStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			label,
			.d2l-input-label {
				display: inline-block;
			}
			.d2l-htmleditor-hr-dialog-height {
				display: block;
			}
			.d2l-htmleditor-hr-dialog-width > d2l-input-text {
				margin-right: 0.8rem;
			}
			:host([dir="rtl"]) .d2l-htmleditor-hr-dialog-width > d2l-input-text {
				margin-left: 0.8rem;
				margin-right: 0;
			}
			.d2l-htmleditor-hr-dialog-height > d2l-input-text,
			.d2l-htmleditor-hr-dialog-width > d2l-input-text {
				width: 4rem;
			}
			.d2l-htmleditor-hr-dialog-height,
			.d2l-htmleditor-hr-dialog-shadow {
				margin-top: 0.8rem;
			}
		`];
	}

	constructor() {
		super();
		this._hasShadow = true;
		this._height = '';
		this._opened = false;
		this._width = '100';
		this._widthUnits = '%';
	}

	async firstUpdated() {
		super.firstUpdated();
		const button = this.shadowRoot.querySelector('d2l-htmleditor-button-toggle');
		const editor = await this.getRootNode().host.getEditor();
		editor.on('NodeChange', () => {
			if (editor.selection) {
				const node = editor.selection.getNode();
				button.active = (node.tagName === 'HR');
			}
		});
	}

	render() {
		return html`
			<d2l-htmleditor-button-toggle @click="${this._openDialog}" text="Insert Line"></d2l-htmleditor-button-toggle>
			<d2l-dialog width="400" title-text="Horizontal Rule" ?opened="${this._opened}" @d2l-dialog-close="${this._handleClose}">
				<div class="d2l-htmleditor-hr-dialog-width">
					<d2l-input-text label="Width" .value="${this._width}"></d2l-input-text>
					<label>
						<span class="d2l-input-label">Width Type</span>
						<select class="d2l-input-select" .value="${this._widthUnits}">
							<option>%</option>
							<option>px</option>
						</select>
					</label>
				</div>
				<div class="d2l-htmleditor-hr-dialog-height">
					<d2l-input-text label="Height" .value="${this._height}"></d2l-input-text>
				</div>
				<div class="d2l-htmleditor-hr-dialog-shadow">
					<d2l-input-checkbox ?checked="${this._hasShadow}">Display Shadow</d2l-input-checkbox>
				</div>
				<d2l-button slot="footer" primary data-dialog-action="insert">Create</d2l-button>
				<d2l-button slot="footer" data-dialog-action="">Cancel</d2l-button>
			</d2l-dialog>
		`;
	}

	async _handleClose(e) {
		this._opened = false;
		if (e.detail.action !== 'insert') return;

		let width = this.shadowRoot.querySelector('.d2l-htmleditor-hr-dialog-width d2l-input-text').value;
		if (!Number.isInteger(Number.parseInt(width, 10))) width = '100';
		let widthUnits = this.shadowRoot.querySelector('.d2l-htmleditor-hr-dialog-width select').value;
		if (widthUnits !== 'px') widthUnits = '%';
		let height = this.shadowRoot.querySelector('.d2l-htmleditor-hr-dialog-height d2l-input-text').value;
		if (!Number.isInteger(Number.parseInt(height, 10))) height = '';
		const shadow = this.shadowRoot.querySelector('d2l-input-checkbox').checked;

		const html = `<hr style="width: ${width}${widthUnits}; height: ${height}px; color: #ffffff; border-style: ${shadow ? 'inset' : 'solid'}; border-width: 1px; border-color: #cccccc;" />`;
		const editor = await this.getRootNode().host.getEditor();
		editor.execCommand('mceInsertContent', false, html);
	}

	async _openDialog() {
		this._width = '100';
		this._widthUnits = '%';
		this._height = '';
		this._hasShadow = true;
		const editor = await this.getRootNode().host.getEditor();
		if (editor.selection) {
			const node = editor.selection.getNode();
			if (node.tagName === 'HR') {
				const width = node.style.width;
				if (width.indexOf('%') !== -1) {
					this._width = width.replace('%', '');
					this._widthUnits = '%';
				} else if (width.indexOf('px') !== -1) {
					this._width = width.replace('px', '');
					this._widthUnits = 'px';
				}
				const height = node.style.height;
				if (height === 'auto' || height.indexOf('px') === -1) {
					this._height = 0;
				} else {
					this._height = height.replace('px', '');
				}
				this._hasShadow = (node.style.borderStyle === 'inset');
			}
		}
		this._opened = true;
	}

}

customElements.define('d2l-htmleditor-button-hr', HorizontalRuleButton);
