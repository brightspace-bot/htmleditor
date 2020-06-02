import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { styleMap } from 'lit-html/directives/style-map.js';

class Dialog extends LitElement {

	static get properties() {
		return {
			fontFamily: { type: String, attribute: 'font-family' },
			opened: { type: Boolean, reflect: true },
			_selectedHtmlCode: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-htmleditor-symbols {
				padding: 4px 0;
			}
			.d2l-htmleditor-symbols > div {
				align-items: center;
				background-color: transparent;
				border-color: transparent;
				border: 1px solid transparent;
				border-radius: 0.3rem;
				box-sizing: border-box;
				cursor: pointer;
				display: inline-flex;
				justify-content: center;
				margin-bottom: 6px;
				margin-right: 6px;
				min-height: 2rem;
				outline: none;
				text-align: center;
				vertical-align: top;
				width: 2rem;
			}
			.d2l-htmleditor-symbols > div:hover {
				background-color: var(--d2l-color-gypsum);
			}
			.d2l-htmleditor-symbols > div:hover:focus {
				box-shadow: 0 0 0 2px var(--d2l-color-gypsum), 0 0 0 4px var(--d2l-color-celestine);
			}
			.d2l-htmleditor-symbols > div:focus {
				box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
			}
			.d2l-htmleditor-symbols > div[aria-selected="true"] {
				background-color: var(--d2l-color-celestine-plus-2);
				border-color: var(--d2l-color-celestine);
			}
			.d2l-htmleditor-symbols > div[aria-selected="true"]:focus {
				border-color: transparent;
				box-shadow: 0 0 0 2px var(--d2l-color-celestine-plus-2), 0 0 0 4px var(--d2l-color-celestine);
			}
		`;
	}

	constructor() {
		super();
		this.opened = false;
	}

	render() {
		const styles = {
			'font-family': this.fontFamily
		};
		return html`<d2l-dialog title-text="Symbol" ?opened="${this.opened}" @d2l-dialog-close="${this._handleClose}">
			<div class="d2l-htmleditor-symbols" style="${styleMap(styles)}">
				${symbols.map((s) => html`
					<div role="button" tabindex="0" data-html-code="${s.htmlCode}" aria-selected="${s.htmlCode === this._selectedHtmlCode ? 'true' : 'false'}" @click="${this._handleClick}">${s.value}</div>
				`)}
			</div>
			<d2l-button slot="footer" primary data-dialog-action="insert" ?disabled="${!this._selectedHtmlCode}">Insert</d2l-button>
			<d2l-button slot="footer" data-dialog-action="">Cancel</d2l-button>
		</d2l-dialog>`;
	}

	_handleClick(e) {
		this._selectedHtmlCode = e.target.getAttribute('data-html-code');
	}

	_handleClose(e) {
		this.opened = false;
		this.dispatchEvent(new CustomEvent(
			'd2l-htmleditor-symbol-dialog-close', {
				bubbles: true,
				detail: { action: e.detail.action, htmlCode: this._selectedHtmlCode }
			}
		));
	}

}

const symbols = [
	{ text: 'no-break space', numCode: '&#160;', htmlCode: '&nbsp;', value: ' ' },
	{ text: 'ampersand', numCode: '&#38;', htmlCode: '&amp;', value: '&' },
	{ text: 'quotation mark', numCode: '&#34;', htmlCode: '&quot;', value: '"' },
	{ text: 'cent sign', numCode: '&#162;', htmlCode: '&cent;', value: '¢' },
	{ text: 'euro sign', numCode: '&#8364;', htmlCode: '&euro;', value: '€' },
	{ text: 'pound sign', numCode: '&#163;', htmlCode: '&pound;', value: '£' },
	{ text: 'yen sign', numCode: '&#165;', htmlCode: '&yen;', value: '¥' },
	{ text: 'copyright', numCode: '&#169;', htmlCode: '&copy;', value: '©' },
	{ text: 'registered sign', numCode: '&#174;', htmlCode: '&reg;', value: '®' },
	{ text: 'trade mark sign', numCode: '&#8482;', htmlCode: '&trade;', value: '™' },
	{ text: 'per mille sign', numCode: '&#8240;', htmlCode: '&permil;', value: '‰' },
	{ text: 'micro sign', numCode: '&#181;', htmlCode: '&micro;', value: 'µ' },
	{ text: 'middle dot', numCode: '&#183;', htmlCode: '&middot;', value: '·' },
	{ text: 'bullet', numCode: '&#8226;', htmlCode: '&bull;', value: '•' },
	{ text: 'three dot leader', numCode: '&#8230;', htmlCode: '&hellip;', value: '…' },
	{ text: 'minutes / feet', numCode: '&#8242;', htmlCode: '&prime;', value: '′' },
	{ text: 'seconds / inches', numCode: '&#8243;', htmlCode: '&Prime;', value: '″' },
	{ text: 'section sign', numCode: '&#167;', htmlCode: '&sect;', value: '§' },
	{ text: 'paragraph sign', numCode: '&#182;', htmlCode: '&para;', value: '¶' },
	{ text: 'sharp s / ess-zed', numCode: '&#223;', htmlCode: '&szlig;', value: 'ß' },
	{ text: 'single left-pointing angle quotation mark', numCode: '&#8249;', htmlCode: '&lsaquo;', value: '‹' },
	{ text: 'single right-pointing angle quotation mark', numCode: '&#8250;', htmlCode: '&rsaquo;', value: '›' },
	{ text: 'left pointing guillemet', numCode: '&#171;', htmlCode: '&laquo;', value: '«' },
	{ text: 'right pointing guillemet', numCode: '&#187;', htmlCode: '&raquo;', value: '»' },
	{ text: 'left single quotation mark', numCode: '&#8216;', htmlCode: '&lsquo;', value: '‘' },
	{ text: 'right single quotation mark', numCode: '&#8217;', htmlCode: '&rsquo;', value: '’' },
	{ text: 'left double quotation mark', numCode: '&#8220;', htmlCode: '&ldquo;', value: '“' },
	{ text: 'right double quotation mark', numCode: '&#8221;', htmlCode: '&rdquo;', value: '”' },
	{ text: 'single low-9 quotation mark', numCode: '&#8218;', htmlCode: '&sbquo;', value: '‚' },
	{ text: 'double low-9 quotation mark', numCode: '&#8222;', htmlCode: '&bdquo;', value: '„' },
	{ text: 'less-than sign', numCode: '&#60;', htmlCode: '&lt;', value: '<' },
	{ text: 'greater-than sign', numCode: '&#62;', htmlCode: '&gt;', value: '>' },
	{ text: 'less-than or equal to', numCode: '&#8804;', htmlCode: '&le;', value: '≤' },
	{ text: 'greater-than or equal to', numCode: '&#8805;', htmlCode: '&ge;', value: '≥' },
	{ text: 'en dash', numCode: '&#8211;', htmlCode: '&ndash;', value: '–' },
	{ text: 'em dash', numCode: '&#8212;', htmlCode: '&mdash;', value: '—' },
	{ text: 'macron', numCode: '&#175;', htmlCode: '&macr;', value: '¯' },
	{ text: 'overline', numCode: '&#8254;', htmlCode: '&oline;', value: '‾' },
	{ text: 'currency sign', numCode: '&#164;', htmlCode: '&curren;', value: '¤' },
	{ text: 'broken bar', numCode: '&#166;', htmlCode: '&brvbar;', value: '¦' },
	{ text: 'diaeresis', numCode: '&#168;', htmlCode: '&uml;', value: '¨' },
	{ text: 'inverted exclamation mark', numCode: '&#161;', htmlCode: '&iexcl;', value: '¡' },
	{ text: 'inverted question mark', numCode: '&#191;', htmlCode: '&iquest;', value: '¿' },
	{ text: 'circumflex accent', numCode: '&#710;', htmlCode: '&circ;', value: 'ˆ' },
	{ text: 'small tilde', numCode: '&#732;', htmlCode: '&tilde;', value: '˜' },
	{ text: 'degree sign', numCode: '&#176;', htmlCode: '&deg;', value: '°' },
	{ text: 'minus sign', numCode: '&#8722;', htmlCode: '&minus;', value: '−' },
	{ text: 'plus-minus sign', numCode: '&#177;', htmlCode: '&plusmn;', value: '±' },
	{ text: 'division sign', numCode: '&#247;', htmlCode: '&divide;', value: '÷' },
	{ text: 'fraction slash', numCode: '&#8260;', htmlCode: '&frasl;', value: '⁄' },
	{ text: 'multiplication sign', numCode: '&#215;', htmlCode: '&times;', value: '×' },
	{ text: 'superscript one', numCode: '&#185;', htmlCode: '&sup1;', value: '¹' },
	{ text: 'superscript two', numCode: '&#178;', htmlCode: '&sup2;', value: '²' },
	{ text: 'superscript three', numCode: '&#179;', htmlCode: '&sup3;', value: '³' },
	{ text: 'fraction one quarter', numCode: '&#188;', htmlCode: '&frac14;', value: '¼' },
	{ text: 'fraction one half', numCode: '&#189;', htmlCode: '&frac12;', value: '½' },
	{ text: 'fraction three quarters', numCode: '&#190;', htmlCode: '&frac34;', value: '¾' },
	{ text: 'function / florin', numCode: '&#402;', htmlCode: '&fnof;', value: 'ƒ' },
	{ text: 'integral', numCode: '&#8747;', htmlCode: '&int;', value: '∫' },
	{ text: 'n-ary summation', numCode: '&#8721;', htmlCode: '&sum;', value: '∑' },
	{ text: 'infinity', numCode: '&#8734;', htmlCode: '&infin;', value: '∞' },
	{ text: 'square root', numCode: '&#8730;', htmlCode: '&radic;', value: '√' },
	{ text: 'almost equal to', numCode: '&#8776;', htmlCode: '&asymp;', value: '≈' },
	{ text: 'not equal to', numCode: '&#8800;', htmlCode: '&ne;', value: '≠' },
	{ text: 'indentical to', numCode: '&#8801;', htmlCode: '&equiv;', value: '≡' },
	{ text: 'n-ary product', numCode: '&#8719;', htmlCode: '&prod;', value: '∏' },
	{ text: 'not sign', numCode: '&#172;', htmlCode: '&not;', value: '¬' },
	{ text: 'intersection', numCode: '&#8745;', htmlCode: '&cap;', value: '∩' },
	{ text: 'partial differential', numCode: '&#8706;', htmlCode: '&part;', value: '∂' },
	{ text: 'acute accent', numCode: '&#180;', htmlCode: '&acute;', value: '´' },
	{ text: 'cedilla', numCode: '&#184;', htmlCode: '&cedil;', value: '¸' },
	{ text: 'feminine ordinal indicator', numCode: '&#170;', htmlCode: '&ordf;', value: 'ª' },
	{ text: 'masculine ordinal indicator', numCode: '&#186;', htmlCode: '&ordm;', value: 'º' },
	{ text: 'dagger', numCode: '&#8224;', htmlCode: '&dagger;', value: '†' },
	{ text: 'double dagger', numCode: '&#8225;', htmlCode: '&Dagger;', value: '‡' },
	{ text: 'A - grave', numCode: '&#192;', htmlCode: '&Agrave;', value: 'À' },
	{ text: 'A - acute', numCode: '&#193;', htmlCode: '&Aacute;', value: 'Á' },
	{ text: 'A - circumflex', numCode: '&#194;', htmlCode: '&Acirc;', value: 'Â' },
	{ text: 'A - tilde', numCode: '&#195;', htmlCode: '&Atilde;', value: 'Ã' },
	{ text: 'A - diaeresis', numCode: '&#196;', htmlCode: '&Auml;', value: 'Ä' },
	{ text: 'A - ring above', numCode: '&#197;', htmlCode: '&Aring;', value: 'Å' },
	{ text: 'ligature AE', numCode: '&#198;', htmlCode: '&AElig;', value: 'Æ' },
	{ text: 'C - cedilla', numCode: '&#199;', htmlCode: '&Ccedil;', value: 'Ç' },
	{ text: 'E - grave', numCode: '&#200;', htmlCode: '&Egrave;', value: 'È' },
	{ text: 'E - acute', numCode: '&#201;', htmlCode: '&Eacute;', value: 'É' },
	{ text: 'E - circumflex', numCode: '&#202;', htmlCode: '&Ecirc;', value: 'Ê' },
	{ text: 'E - diaeresis', numCode: '&#203;', htmlCode: '&Euml;', value: 'Ë' },
	{ text: 'I - grave', numCode: '&#204;', htmlCode: '&Igrave;', value: 'Ì' },
	{ text: 'I - acute', numCode: '&#205;', htmlCode: '&Iacute;', value: 'Í' },
	{ text: 'I - circumflex', numCode: '&#206;', htmlCode: '&Icirc;', value: 'Î' },
	{ text: 'I - diaeresis', numCode: '&#207;', htmlCode: '&Iuml;', value: 'Ï' },
	{ text: 'ETH', numCode: '&#208;', htmlCode: '&ETH;', value: 'Ð' },
	{ text: 'N - tilde', numCode: '&#209;', htmlCode: '&Ntilde;', value: 'Ñ' },
	{ text: 'O - grave', numCode: '&#210;', htmlCode: '&Ograve;', value: 'Ò' },
	{ text: 'O - acute', numCode: '&#211;', htmlCode: '&Oacute;', value: 'Ó' },
	{ text: 'O - circumflex', numCode: '&#212;', htmlCode: '&Ocirc;', value: 'Ô' },
	{ text: 'O - tilde', numCode: '&#213;', htmlCode: '&Otilde;', value: 'Õ' },
	{ text: 'O - diaeresis', numCode: '&#214;', htmlCode: '&Ouml;', value: 'Ö' },
	{ text: 'O - slash', numCode: '&#216;', htmlCode: '&Oslash;', value: 'Ø' },
	{ text: 'ligature OE', numCode: '&#338;', htmlCode: '&OElig;', value: 'Œ' },
	{ text: 'S - caron', numCode: '&#352;', htmlCode: '&Scaron;', value: 'Š' },
	{ text: 'U - grave', numCode: '&#217;', htmlCode: '&Ugrave;', value: 'Ù' },
	{ text: 'U - acute', numCode: '&#218;', htmlCode: '&Uacute;', value: 'Ú' },
	{ text: 'U - circumflex', numCode: '&#219;', htmlCode: '&Ucirc;', value: 'Û' },
	{ text: 'U - diaeresis', numCode: '&#220;', htmlCode: '&Uuml;', value: 'Ü' },
	{ text: 'Y - acute', numCode: '&#221;', htmlCode: '&Yacute;', value: 'Ý' },
	{ text: 'Y - diaeresis', numCode: '&#376;', htmlCode: '&Yuml;', value: 'Ÿ' },
	{ text: 'THORN', numCode: '&#222;', htmlCode: '&THORN;', value: 'Þ' },
	{ text: 'a - grave', numCode: '&#224;', htmlCode: '&agrave;', value: 'à' },
	{ text: 'a - acute', numCode: '&#225;', htmlCode: '&aacute;', value: 'á' },
	{ text: 'a - circumflex', numCode: '&#226;', htmlCode: '&acirc;', value: 'â' },
	{ text: 'a - tilde', numCode: '&#227;', htmlCode: '&atilde;', value: 'ã' },
	{ text: 'a - diaeresis', numCode: '&#228;', htmlCode: '&auml;', value: 'ä' },
	{ text: 'a - ring above', numCode: '&#229;', htmlCode: '&aring;', value: 'å' },
	{ text: 'ligature ae', numCode: '&#230;', htmlCode: '&aelig;', value: 'æ' },
	{ text: 'c - cedilla', numCode: '&#231;', htmlCode: '&ccedil;', value: 'ç' },
	{ text: 'e - grave', numCode: '&#232;', htmlCode: '&egrave;', value: 'è' },
	{ text: 'e - acute', numCode: '&#233;', htmlCode: '&eacute;', value: 'é' },
	{ text: 'e - circumflex', numCode: '&#234;', htmlCode: '&ecirc;', value: 'ê' },
	{ text: 'e - diaeresis', numCode: '&#235;', htmlCode: '&euml;', value: 'ë' },
	{ text: 'i - grave', numCode: '&#236;', htmlCode: '&igrave;', value: 'ì' },
	{ text: 'i - acute', numCode: '&#237;', htmlCode: '&iacute;', value: 'í' },
	{ text: 'i - circumflex', numCode: '&#238;', htmlCode: '&icirc;', value: 'î' },
	{ text: 'i - diaeresis', numCode: '&#239;', htmlCode: '&iuml;', value: 'ï' },
	{ text: 'eth', numCode: '&#240;', htmlCode: '&eth;', value: 'ð' },
	{ text: 'n - tilde', numCode: '&#241;', htmlCode: '&ntilde;', value: 'ñ' },
	{ text: 'o - grave', numCode: '&#242;', htmlCode: '&ograve;', value: 'ò' },
	{ text: 'o - acute', numCode: '&#243;', htmlCode: '&oacute;', value: 'ó' },
	{ text: 'o - circumflex', numCode: '&#244;', htmlCode: '&ocirc;', value: 'ô' },
	{ text: 'o - tilde', numCode: '&#245;', htmlCode: '&otilde;', value: 'õ' },
	{ text: 'o - diaeresis', numCode: '&#246;', htmlCode: '&ouml;', value: 'ö' },
	{ text: 'o slash', numCode: '&#248;', htmlCode: '&oslash;', value: 'ø' },
	{ text: 'ligature oe', numCode: '&#339;', htmlCode: '&oelig;', value: 'œ' },
	{ text: 's - caron', numCode: '&#353;', htmlCode: '&scaron;', value: 'š' },
	{ text: 'u - grave', numCode: '&#249;', htmlCode: '&ugrave;', value: 'ù' },
	{ text: 'u - acute', numCode: '&#250;', htmlCode: '&uacute;', value: 'ú' },
	{ text: 'u - circumflex', numCode: '&#251;', htmlCode: '&ucirc;', value: 'û' },
	{ text: 'u - diaeresis', numCode: '&#252;', htmlCode: '&uuml;', value: 'ü' },
	{ text: 'y - acute', numCode: '&#253;', htmlCode: '&yacute;', value: 'ý' },
	{ text: 'thorn', numCode: '&#254;', htmlCode: '&thorn;', value: 'þ' },
	{ text: 'y - diaeresis', numCode: '&#255;', htmlCode: '&yuml;', value: 'ÿ' },
	{ text: 'Alpha', numCode: '&#913;', htmlCode: '&Alpha;', value: 'Α' },
	{ text: 'Beta', numCode: '&#914;', htmlCode: '&Beta;', value: 'Β' },
	{ text: 'Gamma', numCode: '&#915;', htmlCode: '&Gamma;', value: 'Γ' },
	{ text: 'Delta', numCode: '&#916;', htmlCode: '&Delta;', value: 'Δ' },
	{ text: 'Epsilon', numCode: '&#917;', htmlCode: '&Epsilon;', value: 'Ε' },
	{ text: 'Zeta', numCode: '&#918;', htmlCode: '&Zeta;', value: 'Ζ' },
	{ text: 'Eta', numCode: '&#919;', htmlCode: '&Eta;', value: 'Η' },
	{ text: 'Theta', numCode: '&#920;', htmlCode: '&Theta;', value: 'Θ' },
	{ text: 'Iota', numCode: '&#921;', htmlCode: '&Iota;', value: 'Ι' },
	{ text: 'Kappa', numCode: '&#922;', htmlCode: '&Kappa;', value: 'Κ' },
	{ text: 'Lambda', numCode: '&#923;', htmlCode: '&Lambda;', value: 'Λ' },
	{ text: 'Mu', numCode: '&#924;', htmlCode: '&Mu;', value: 'Μ' },
	{ text: 'Nu', numCode: '&#925;', htmlCode: '&Nu;', value: 'Ν' },
	{ text: 'Xi', numCode: '&#926;', htmlCode: '&Xi;', value: 'Ξ' },
	{ text: 'Omicron', numCode: '&#927;', htmlCode: '&Omicron;', value: 'Ο' },
	{ text: 'Pi', numCode: '&#928;', htmlCode: '&Pi;', value: 'Π' },
	{ text: 'Rho', numCode: '&#929;', htmlCode: '&Rho;', value: 'Ρ' },
	{ text: 'Sigma', numCode: '&#931;', htmlCode: '&Sigma;', value: 'Σ' },
	{ text: 'Tau', numCode: '&#932;', htmlCode: '&Tau;', value: 'Τ' },
	{ text: 'Upsilon', numCode: '&#933;', htmlCode: '&Upsilon;', value: 'Υ' },
	{ text: 'Phi', numCode: '&#934;', htmlCode: '&Phi;', value: 'Φ' },
	{ text: 'Chi', numCode: '&#935;', htmlCode: '&Chi;', value: 'Χ' },
	{ text: 'Psi', numCode: '&#936;', htmlCode: '&Psi;', value: 'Ψ' },
	{ text: 'Omega', numCode: '&#937;', htmlCode: '&Omega;', value: 'Ω' },
	{ text: 'alpha', numCode: '&#945;', htmlCode: '&alpha;', value: 'α' },
	{ text: 'beta', numCode: '&#946;', htmlCode: '&beta;', value: 'β' },
	{ text: 'gamma', numCode: '&#947;', htmlCode: '&gamma;', value: 'γ' },
	{ text: 'delta', numCode: '&#948;', htmlCode: '&delta;', value: 'δ' },
	{ text: 'epsilon', numCode: '&#949;', htmlCode: '&epsilon;', value: 'ε' },
	{ text: 'zeta', numCode: '&#950;', htmlCode: '&zeta;', value: 'ζ' },
	{ text: 'eta', numCode: '&#951;', htmlCode: '&eta;', value: 'η' },
	{ text: 'theta', numCode: '&#952;', htmlCode: '&theta;', value: 'θ' },
	{ text: 'iota', numCode: '&#953;', htmlCode: '&iota;', value: 'ι' },
	{ text: 'kappa', numCode: '&#954;', htmlCode: '&kappa;', value: 'κ' },
	{ text: 'lambda', numCode: '&#955;', htmlCode: '&lambda;', value: 'λ' },
	{ text: 'mu', numCode: '&#956;', htmlCode: '&mu;', value: 'μ' },
	{ text: 'nu', numCode: '&#957;', htmlCode: '&nu;', value: 'ν' },
	{ text: 'xi', numCode: '&#958;', htmlCode: '&xi;', value: 'ξ' },
	{ text: 'omicron', numCode: '&#959;', htmlCode: '&omicron;', value: 'ο' },
	{ text: 'pi', numCode: '&#960;', htmlCode: '&pi;', value: 'π' },
	{ text: 'rho', numCode: '&#961;', htmlCode: '&rho;', value: 'ρ' },
	{ text: 'final sigma', numCode: '&#962;', htmlCode: '&sigmaf;', value: 'ς' },
	{ text: 'sigma', numCode: '&#963;', htmlCode: '&sigma;', value: 'σ' },
	{ text: 'tau', numCode: '&#964;', htmlCode: '&tau;', value: 'τ' },
	{ text: 'upsilon', numCode: '&#965;', htmlCode: '&upsilon;', value: 'υ' },
	{ text: 'phi', numCode: '&#966;', htmlCode: '&phi;', value: 'φ' },
	{ text: 'chi', numCode: '&#967;', htmlCode: '&chi;', value: 'χ' },
	{ text: 'psi', numCode: '&#968;', htmlCode: '&psi;', value: 'ψ' },
	{ text: 'omega', numCode: '&#969;', htmlCode: '&omega;', value: 'ω' },
	{ text: 'leftwards arrow', numCode: '&#8592;', htmlCode: '&larr;', value: '←' },
	{ text: 'upwards arrow', numCode: '&#8593;', htmlCode: '&uarr;', value: '↑' },
	{ text: 'rightwards arrow', numCode: '&#8594;', htmlCode: '&rarr;', value: '→' },
	{ text: 'downwards arrow', numCode: '&#8595;', htmlCode: '&darr;', value: '↓' },
	{ text: 'left right arrow', numCode: '&#8596;', htmlCode: '&harr;', value: '↔' },
	{ text: 'lozenge', numCode: '&#9674;', htmlCode: '&loz;', value: '◊' },
	{ text: 'black spade suit', numCode: '&#9824;', htmlCode: '&spades;', value: '♠' },
	{ text: 'black club suit', numCode: '&#9827;', htmlCode: '&clubs;', value: '♣' },
	{ text: 'black heart suit', numCode: '&#9829;', htmlCode: '&hearts;', value: '♥' },
	{ text: 'black diamond suit', numCode: '&#9830;', htmlCode: '&diams;', value: '♦' }
];

customElements.define('d2l-htmleditor-symbol-dialog', Dialog);
