import 'tinymce/tinymce.js';
import { css, LitElement } from 'lit-element/lit-element.js';
import { RequesterMixin, requestInstance } from '@brightspace-ui/core/mixins/provider-mixin.js';

tinymce.PluginManager.add('d2l-preview', function(editor) {

	// bail if no LMS context
	if (!D2L.LP) return;

	const localize = requestInstance(editor.getElement(), 'localize');
	const orgUnitId = requestInstance(editor.getElement(), 'orgUnitId');

	editor.ui.registry.addButton('d2l-preview', {
		tooltip: localize('preview.tooltip'),
		icon: 'preview',
		onAction: () => {
			const root = editor.getElement().getRootNode();

			let dialog = root.querySelector('d2l-htmleditor-preview-dialog');
			if (!dialog) dialog = root.appendChild(document.createElement('d2l-htmleditor-preview-dialog'));

			dialog.htmlInfo = {
				id: 'preview',
				html: root.host.html,
				htmlOrgUnitId: orgUnitId,
				files: root.host.files
			};
			dialog.opener = root.host;
			dialog.opened = true;

		}
	});

});

class PreviewDialog extends RequesterMixin(LitElement) {

	static get properties() {
		return {
			opened: { type: Boolean, reflect: true },
			opener: { type: Object },
			htmlInfo: { type: Object }
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
		`;
	}

	constructor() {
		super();
		this.opened = false;
	}

	connectedCallback() {
		super.connectedCallback();
		this._fullPage = this.requestInstance('fullPage');
		this._noFilter = this.requestInstance('noFilter');
		this._orgUnitId = this.requestInstance('orgUnitId');
	}

	render() {
	}

	async updated(changedProperties) {
		super.updated(changedProperties);

		if (!changedProperties.has('opened')) return;

		if (this.opened) {

			await (new Promise((resolve) => {

				const previewResult = D2L.LP.Web.UI.Desktop.MasterPages.Dialog.OpenWithParam(
					this.opener,
					new D2L.LP.Web.Http.UrlLocation(`/d2l/lp/htmleditor/${this._fullPage ? 'fullpagepreview' : 'inlinepreview'}?ou=${this._orgUnitId}`),
					{
						editor: this.htmlInfo,
						filter: this._noFilter ? 0 : 1
					}
				);

				previewResult.AddReleaseListener(resolve);
				previewResult.AddListener(resolve);

			}));

			this.opened = false;

		}

	}

}
customElements.define('d2l-htmleditor-preview-dialog', PreviewDialog);
