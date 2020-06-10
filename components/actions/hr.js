import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

// TODO: localize
// TODO: decide if we use this or the native browser cmd

const defaultProperties = {
	width: {value: 100, units: '%'},
	hasShadow: true
};

class Dialog extends RtlMixin(LitElement) {

	static get properties() {
		return {
			htmlData: { type: Object },
			opened: { type: Boolean, reflect: true }
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
		this.opened = false;
		this.htmlData = defaultProperties;
	}

	render() {
		const height = (this.htmlData.height ? this.htmlData.height : '');
		const width = (this.htmlData.width && this.htmlData.width.value) ? this.htmlData.width.value : defaultProperties.width.value;
		const units = (this.htmlData.width && this.htmlData.width.units === 'px') ? 'px' : defaultProperties.width.units;
		return html`<d2l-dialog width="400" title-text="Horizontal Rule" ?opened="${this.opened}" @d2l-dialog-close="${this._handleClose}">
			<div class="d2l-htmleditor-hr-dialog-width">
				<d2l-input-text label="Width" .value="${width}"></d2l-input-text>
				<label>
					<span class="d2l-input-label">Width Type</span>
					<select class="d2l-input-select" .value="${units}">
						<option>%</option>
						<option>px</option>
					</select>
				</label>
			</div>
			<div class="d2l-htmleditor-hr-dialog-height">
				<d2l-input-text label="Height" .value="${height}"></d2l-input-text>
			</div>
			<div class="d2l-htmleditor-hr-dialog-shadow">
				<d2l-input-checkbox ?checked="${this.htmlData.hasShadow}">Display Shadow</d2l-input-checkbox>
			</div>
			<d2l-button slot="footer" primary data-dialog-action="insert">Create</d2l-button>
			<d2l-button slot="footer" data-dialog-action="">Cancel</d2l-button>
		</d2l-dialog>`;
	}

	_handleClose(e) {
		this.opened = false;

		let width = this.shadowRoot.querySelector('.d2l-htmleditor-hr-dialog-width d2l-input-text').value;
		if (!Number.isInteger(Number.parseInt(width, 10))) width = defaultProperties.width.value;
		let widthUnits = this.shadowRoot.querySelector('.d2l-htmleditor-hr-dialog-width select').value;
		if (widthUnits !== 'px') widthUnits = defaultProperties.width.units;
		let height = this.shadowRoot.querySelector('.d2l-htmleditor-hr-dialog-height d2l-input-text').value;
		if (!Number.isInteger(Number.parseInt(height, 10))) height = '';
		const shadow = this.shadowRoot.querySelector('d2l-input-checkbox').checked;

		this.dispatchEvent(new CustomEvent(
			'd2l-htmleditor-hr-dialog-close', {
				bubbles: true,
				detail: { action: e.detail.action, html: `<hr style="width: ${width}${widthUnits}; height: ${height}px; color: #ffffff; border-style: ${shadow ? 'inset' : 'solid'}; border-width: 1px; border-color: #cccccc;" />` }
			}
		));
	}

}

customElements.define('d2l-htmleditor-hr-dialog', Dialog);
