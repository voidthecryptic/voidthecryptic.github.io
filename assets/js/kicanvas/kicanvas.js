var Ks=Object.defineProperty;var vn=Object.getOwnPropertyDescriptor;var c=(s,e)=>Ks(s,"name",{value:e,configurable:!0});var P=(s,e,t,r)=>{for(var i=r>1?void 0:r?vn(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=(r?o(e,t,i):o(i))||i);return r&&i&&Ks(e,t,i),i};function Re(s){window.setTimeout(()=>{s()},0)}c(Re,"later");var Ve=class{static{c(this,"DeferredPromise")}#e;#t;#r;#i;#s;constructor(){this.#e=new Promise((e,t)=>{this.#t=e,this.#r=t})}get rejected(){return this.#i===1}get resolved(){return this.#i===0}get settled(){return!!this.#i}get value(){return this.#s}then(e,t){return this.#e.then(e,t)}resolve(e){this.#i=0,this.#s=e,this.#t(e)}reject(e){this.#i=1,this.#s=e,this.#r(e)}},Pe=class extends Ve{static{c(this,"Barrier")}get isOpen(){return this.resolved&&this.value===!0}open(){this.resolve(!0)}};function pt(s){return s instanceof URL&&(s=s.pathname),s.split("/").slice(0,-1).join("/")}c(pt,"dirname");function we(s){return s instanceof URL&&(s=s.pathname),s.split("/").at(-1)}c(we,"basename");function s3(s){let e=s.split(".");return e.length<=1?"":e.at(-1)}c(s3,"extension");function We(...s){return s.flatMap(e=>e.split("/")).filter(e=>e!=="").join("/")}c(We,"normalize_join");function ve(s,e){if(s===e)return"";let t=We(s),r=t.length>0?t+"/":"";return e.startsWith(r)?e.slice(r.length):e}c(ve,"based_on");function Hs(s){let e,t;s instanceof File?(e=URL.createObjectURL(s),t=s.name):(e=s.href,t=we(e));let r=document.createElement("a");r.href=e,r.download=t,r.target="_blank",console.log(r),r.click(),s instanceof File&&URL.revokeObjectURL(e)}c(Hs,"initiate_download");var Qe=class s{static{c(this,"FileSystemBase")}constructor(e=new Map){this.entries=e}*list(){for(let[e,t]of this.entries)t.type==="file"&&(yield e)}async setup(){await this.walk("")}async get(e){if(!await this.has(e))throw new Error(`File ${e} not found`);return await this.load_file(e)}async has(e){let t=pt(e);if(!this.entries.has(t)&&!this.entries.has(e))return!1;await this.walk(t);let r=this.entries.get(e);return!!r&&r.type==="file"}async download(e){Hs(await this.get(e))}static is_kicad_file(e){return["kicad_pcb","kicad_pro","kicad_sch"].includes(s3(e))}async walk(e){if(this.entries.get(e)?.type==="visited-directory")return;let t=await this.enumerate(e);this.entries.set(e,{path:e,type:"visited-directory"});for(let r of t)r.type==="file"&&!s.is_kicad_file(r.path)||this.entries.set(r.path,r)}},n3=class{static{c(this,"MergedFileSystem")}constructor(e){this.fs_list=e.filter(t=>t!==null)}*list(){for(let e of this.fs_list)yield*e.list()}async setup(){for(let e of this.fs_list)await e.setup()}async has(e){for(let t of this.fs_list)if(await t.has(e))return!0;return!1}async get(e){for(let t of this.fs_list)if(await t.has(e))return await t.get(e);throw new Error(`File ${e} not found`)}async download(e){for(let t of this.fs_list)if(await t.has(e))return await t.download(e);throw new Error(`File ${e} not found`)}},o3=class s extends Qe{constructor(t){super(s.into_entries(t));this.file_list=t}static{c(this,"LocalFileSystemBase")}async load_file(t){let r=this.file_list.get(t);if(!r)throw new Error(`File ${t} not found!`);return r}async enumerate(t){return[]}static into_entries(t){let r=new Map;for(let i of t.keys())r.set(i,{path:i,type:"file"});return r}},ut=class extends Qe{constructor(t,r=null){super();this.urls=new Map;this.resolver=r??this.#e;for(let i of t)this.#t(i)}static{c(this,"FetchFileSystem")}#e(t){return new URL(t,window.location.toString())}#t(t){if(typeof t=="string"){let r=this.urls.get(t);if(r)return r;{let i=this.resolver(t),n=we(i);return this.urls.set(n,i),i}}return t}async load_file(t){let r=this.#t(t);if(!r)throw new Error(`File ${t} not found!`);let i=new Request(r,{method:"GET"}),n=await fetch(i);if(!n.ok)throw new Error(`Unable to load ${r}: ${n.status} ${n.statusText}`);let o=await n.blob();return new File([o],t)}async enumerate(t){return Array.from(this.urls.keys()).map(r=>({path:r,type:"file"}))}},a3=class s extends o3{static{c(this,"DragAndDropFileSystem")}static async fromDataTransfer(e){let t=[];for(let l=0;l<e.items.length;l++){let p=e.items[l]?.webkitGetAsEntry();p&&t.push(p)}let r=await s.walk(t),i=new Map;for(let l of r)if(l.isFile&&s.is_kicad_file(l.name)){let p=await s.load(l);i.set(We(l.fullPath),p)}let n=s.lcp(Array.from(i.keys())),o=new Map([...i].map(([l,p])=>[ve(n,l),p]));return new s(o)}static lcp(e){if(e.length===0)return"";let t=e.map(n=>n.split("/").filter(Boolean).slice(0,-1)),r=t[0],i=r.length;for(let n of t.slice(1)){let o=0;for(;o<i&&o<n.length&&r[o]===n[o];)o+=1;if(i=o,i===0)break}return r.slice(0,i).join("/")}static async load(e){return await new Promise((t,r)=>{e.file(t,r)})}static async walk(e){let t=[];for(;e.length>0;){let r=e.pop();if(r.isFile)t.push(r);else if(r.isDirectory){let i=r.createReader();await new Promise((n,o)=>{i.readEntries(l=>{for(let p of l)p.isFile?t.push(p):p.isDirectory&&e.push(p);n(!0)},o)})}}return t}},ht=class extends o3{static{c(this,"LocalFileSystem")}constructor(e){super(new Map(e.map(t=>[t.name,t])))}};var l3=class{static{c(this,"DropTarget")}constructor(e,t){e.addEventListener("dragenter",r=>{r.preventDefault()},!1),e.addEventListener("dragover",r=>{r.dataTransfer&&(r.preventDefault(),r.dataTransfer.dropEffect="move")},!1),e.addEventListener("drop",async r=>{r.stopPropagation(),r.preventDefault();let i=r.dataTransfer;if(!i)return;let n=await a3.fromDataTransfer(i);t(n)},!1)}};var c3=class s{static{c(this,"FilePicker")}static async pick(e){let t=await s.open_picker();t.length>0&&await e(new ht(t))}static open_picker(){return new Promise(e=>{let t=document.createElement("input");t.type="file",t.style.display="none",t.multiple=!0,t.accept=".kicad_pcb,.kicad_pro,.kicad_sch",t.onchange=r=>{let i=r.target.files;i&&i.length>0?e(Array.from(i)):e([])},t.oncancel=()=>{e([])},t.click()})}};var R3=class s extends Event{constructor(t,r){super(s.type,{bubbles:!0,cancelable:!0,composed:!0});this.context_name=t;this._callback=r}static{c(this,"ContextRequestEvent")}static{this.type="context-request"}callback(t){this.stopPropagation(),this._callback(t)}};async function Gs(s,e){return new Promise(t=>{s.dispatchEvent(new R3(e,r=>{t(r)}))})}c(Gs,"requestContext");function Es(s,e,t){s.addEventListener(R3.type,r=>{let i=r;i.context_name==e&&i.callback(t)})}c(Es,"provideContext");async function Qn(s,e){return(await Gs(s,e))()}c(Qn,"requestLazyContext");async function Yn(s,e,t){Es(s,e,t)}c(Yn,"provideLazyContext");function Js(s){return class extends s{static{c(this,"WithContext")}constructor(...t){super(...t)}async requestContext(t){return await Gs(this,t)}provideContext(t,r){Es(this,t,r)}async requestLazyContext(t){return await Qn(this,t)}provideLazyContext(t,r){Yn(this,t,r)}}}c(Js,"WithContext");function br(s){return s===null||typeof s!="object"&&typeof s!="function"}c(br,"is_primitive");function E(s){return typeof s=="string"}c(E,"is_string");function le(s){return typeof s=="number"&&!isNaN(s)}c(le,"is_number");function t2(s){return Array.isArray(s)||typeof s?.[Symbol.iterator]=="function"}c(t2,"is_iterable");function r2(s){return Array.isArray(s)}c(r2,"is_array");function ks(s){return typeof s=="object"&&s!==null&&!Array.isArray(s)&&!(s instanceof RegExp)&&!(s instanceof Date)}c(ks,"is_object");var Is=new Map,Ze=class{constructor(e){this.css_string=e}static{c(this,"CSS")}get stylesheet(){let e=Is.get(this.css_string);return e==null&&(e=new CSSStyleSheet,e.replaceSync(this.css_string),Is.set(this.css_string,e)),e}};function y(s,...e){let t="";for(let r=0;r<s.length-1;r++){t+=s[r];let i=e[r];if(i instanceof Ze)t+=i.css_string;else if(le(i))t+=String(i);else throw new Error("Only CSS or number variables allowed in css template literal")}return t+=s.at(-1),new Ze(t)}c(y,"css");function As(s,e){s.adoptedStyleSheets=s.adoptedStyleSheets.concat(e.map(t=>t instanceof CSSStyleSheet?t:t.stylesheet))}c(As,"adopt_styles");function p3(s){return r2(s)?s:[s]}c(p3,"as_array");function Cs(s){return r2(s)?s:t2(s)?Array.from(s):[s]}c(Cs,"iterable_as_array");var Kn=new Intl.Collator(void 0,{numeric:!0});function pe(s,e){return s.slice().sort((t,r)=>Kn.compare(e(t),e(r)))}c(pe,"sorted_by_numeric_strings");var dt=class{constructor(){this._disposables=new Set;this._is_disposed=!1}static{c(this,"Disposables")}add(e){if(this._is_disposed)throw new Error("Tried to add item to a DisposableStack that's already been disposed");return this._disposables.add(e),e}disposeAndRemove(e){e&&(e.dispose(),this._disposables.delete(e))}get isDisposed(){return this._is_disposed}dispose(){if(this._is_disposed){console.trace("dispose() called on an already disposed resource");return}for(let e of this._disposables.values())e.dispose();this._disposables.clear(),this._is_disposed=!0}};function Hn(s){return typeof HTMLElement=="object"&&s instanceof HTMLElement}c(Hn,"is_HTMLElement");function f(s,...e){let t=document.createElement("template");t.innerHTML=Gn(s,e);let r=t.content;return r=document.importNode(r,!0),En(r,e),r.childElementCount==1?r.firstElementChild:r}c(f,"html");var fr=class{constructor(e){this.text=e}static{c(this,"Literal")}},Mr=/\$\$:(\d+):\$\$/g;function Gn(s,e){let t=[];for(let i=0;i<s.length-1;i++)t.push(s[i]),e[i]instanceof fr?t.push(e[i].text):t.push(`$$:${i}:$$`);return t.push(s[s.length-1]),t.join("")}c(Gn,"prepare_template_html");function En(s,e){let t=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,null),r;for(;(r=t.nextNode())!==null;)if(r.nodeType==Node.TEXT_NODE)Jn(r.parentNode,r,e);else if(r.nodeType==Node.ELEMENT_NODE){let i=r;for(let n of i.getAttributeNames()){let o=i.getAttributeNode(n);kn(i,o,e)}}}c(En,"apply_values_to_tree");function Jn(s,e,t){if(!s)return;let r=e.data.split(Mr);if(!(!r||r.length==1)){if(Hn(s)&&["script","style"].includes(s.localName))throw new Error("Cannot bind values inside of <script> or <style> tags");for(let i=0;i<r.length;i++){let n=r[i];if(n)if(i%2==0)s.insertBefore(new Text(n),e);else for(let o of Ds(t[parseInt(n,10)]))o!=null&&s.insertBefore(o,e)}e.data=""}}c(Jn,"apply_content_value");function kn(s,e,t){let r=e.value.split(Mr);if(!(!r||r.length==1)){if(e.localName.startsWith("on"))throw new Error(`Cannot bind to event handler ${e.localName}.`);if(r.length==3&&r[0]==""&&r[2]==""){let i=t[parseInt(r[1],10)];i===!0?e.value="":i===!1||i===null||i===void 0?s.removeAttribute(e.name):e.value=gr(i,e.name);return}e.value=e.value.replaceAll(Mr,(i,n)=>{let o=t[parseInt(n,10)];return gr(o,e.localName)})}}c(kn,"apply_attribute_value");function*Ds(s){if(!(s==null||s==null)){if(br(s)){yield new Text(s.toString());return}if(s instanceof Node||s instanceof DocumentFragment){yield s;return}if(t2(s)){for(let e of s)yield*Ds(e);return}throw new Error(`Invalid value ${s}`)}}c(Ds,"convert_value_for_content");function gr(s,e){if(s==null||s==null)return"";if(br(s))return s.toString();if(t2(s))return Array.from(s).map(t=>gr(t,e)).join("");throw new Error(`Invalid value ${s}`)}c(gr,"convert_value_for_attr");var Ye=class extends HTMLElement{constructor(){super();this.updateComplete=new Ve;this.disposables=new dt;let t=this.constructor;t.exportparts.length&&this.setAttribute("exportparts",t.exportparts.join(","))}static{c(this,"CustomElement")}static{this.useShadowRoot=!0}static{this.exportparts=[]}addDisposable(t){return this.disposables.add(t)}get renderRoot(){return this.shadowRoot??this}connectedCallback(){this.#e()}disconnectedCallback(){this.disposables.dispose()}initialContentCallback(){}render(){return f``}renderedCallback(){}async update(){for(this.updateComplete=new Ve;this.renderRoot.firstChild;)this.renderRoot.firstChild.remove();return this.renderRoot.appendChild(await this.render()),this.renderedCallback(),window.requestAnimationFrame(()=>{this.updateComplete.resolve(!0)}),this.updateComplete}#e(){let t=this.constructor;return this.updateComplete=new Ve,this.constructor.useShadowRoot&&this.attachShadow({mode:"open"}),t.styles&&As(this.shadowRoot??document,p3(t.styles)),(async()=>{let r=this.render();this.renderRoot.appendChild(r),this.renderedCallback(),this.initialContentCallback(),window.requestAnimationFrame(()=>{this.updateComplete.resolve(!0)})})(),this.updateComplete}queryAssignedElements(t,r){let n=this.renderRoot.querySelector(`slot${t?`[name=${t}]`:":not([name])"}`)?.assignedElements()??[];return r?n.filter(o=>o.matches(r)):n}};function L(s){let e=s.converter?.to_attribute??Bs.to_attribute,t=s.converter?.from_attribute??Bs.from_attribute;return(r,i)=>{let n=i.replace("_","-"),o=!1;Object.defineProperty(r,i,{enumerable:!0,configurable:!0,get(){return t(this.getAttribute(n),s.type)},set(l){let p=this[i],u=e(l,s.type);u===null?this.removeAttribute(n):this.setAttribute(n,u),o||(o=!0,s.on_change?.(p,l),o=!1)}})}}c(L,"attribute");var Bs={to_attribute(s,e){if(s===null)return s;switch(e){case Boolean:return s?"":null;case String:return s;case Number:return`${s}`;default:throw new Error(`Cannot convert type "${e}" and value "${s} to attribute`)}},from_attribute(s,e){switch(e){case Boolean:return s!==null;case String:return s;case Number:return s===null?null:Number(s);default:throw new Error(`Cannot convert type "${e}" and value "${s} to attribute`)}}};function v(s,e){return(t,r)=>{let i=typeof r=="symbol"?Symbol():`__${r}`;Object.defineProperty(t,r,{enumerable:!0,configurable:!0,get(){let n=this;if(e&&n[i]!==void 0)return n[i];let o=this.renderRoot?.querySelector(s)??null;return e&&o&&(n[i]=o),o}})}}c(v,"query");function js(s){return(e,t)=>{Object.defineProperty(e,t,{enumerable:!0,configurable:!0,get(){return this.renderRoot?.querySelectorAll(s)??[]}})}}c(js,"query_all");function I(s,e,t,r){return s.addEventListener(e,t,r),{dispose:c(()=>{s.removeEventListener(e,t,r)},"dispose")}}c(I,"listen");function ue(s,e,t,r,i){return I(s,t,n=>{let o=n.target.closest(e);o&&r(n,o)},i)}c(ue,"delegate");var In=y`
    :host {
        box-sizing: border-box;
    }

    :host *,
    :host *::before,
    :host *::after {
        box-sizing: inherit;
    }

    [hidden] {
        display: none !important;
    }

    :host {
        scrollbar-width: thin;
        scrollbar-color: #ae81ff #282634;
    }

    ::-webkit-scrollbar {
        position: absolute;
        width: 6px;
        height: 6px;
        margin-left: -6px;
        background: var(--scrollbar-bg);
    }

    ::-webkit-scrollbar-thumb {
        position: absolute;
        background: var(--scrollbar-fg);
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--scrollbar-hover-fg);
    }

    ::-webkit-scrollbar-thumb:active {
        background: var(--scrollbar-active-fg);
    }

    .invert-scrollbar::-webkit-scrollbar {
        position: absolute;
        width: 6px;
        height: 6px;
        margin-left: -6px;
        background: var(--scrollbar-fg);
    }

    .invert-scrollbar::-webkit-scrollbar-thumb {
        position: absolute;
        background: var(--scrollbar-bg);
    }

    .invert-scrollbar::-webkit-scrollbar-thumb:hover {
        background: var(--scrollbar-hover-bg);
    }

    .invert-scrollbar::-webkit-scrollbar-thumb:active {
        background: var(--scrollbar-active-bg);
    }
`,N=class extends Js(Ye){static{c(this,"KCUIElement")}static{this.styles=[In]}};var i2=class s extends N{static{c(this,"KCUIIconElement")}static{this.sprites_url=""}static{this.styles=[y`
            :host {
                box-sizing: border-box;
                font-family: "Material Symbols Outlined";
                font-weight: normal;
                font-style: normal;
                font-size: inherit;
                line-height: 1;
                letter-spacing: normal;
                text-transform: none;
                white-space: nowrap;
                word-wrap: normal;
                direction: ltr;
                -webkit-font-feature-settings: "liga";
                -moz-font-feature-settings: "liga";
                font-feature-settings: "liga";
                -webkit-font-smoothing: antialiased;
                user-select: none;
            }

            svg {
                width: 1.2em;
                height: auto;
                fill: currentColor;
            }
        `]}render(){let e=this.textContent??"";if(e.startsWith("svg:")){let t=e.slice(4),r=`${s.sprites_url}#${t}`;return f`<svg viewBox="0 0 48 48" width="48">
                <use xlink:href="${r}" />
            </svg>`}else return f`<slot></slot>`}};window.customElements.define("kc-ui-icon",i2);var he=class extends N{static{c(this,"KCUIButtonElement")}static{this.styles=[...N.styles,y`
            :host {
                display: inline-flex;
                position: relative;
                width: auto;
                cursor: pointer;
                user-select: none;
                align-items: center;
                justify-content: center;
            }

            button {
                all: unset;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0.5em;
                border: 1px solid transparent;
                border-radius: 0.25em;
                font-weight: medium;
                font-size: 1em;
                background: var(--button-bg);
                color: var(--button-fg);
                transition:
                    color var(--transition-time-short) ease,
                    border var(--transition-time-short) ease,
                    background var(--transition-time-short) ease;
            }

            :host {
                fill: var(--button-fg);
            }

            button:hover {
                background: var(--button-hover-bg);
                color: var(--button-hover-fg);
            }

            button:disabled {
                background: var(--button-disabled-bg);
                color: var(--button-disabled-fg);
            }

            button:focus {
                outline: var(--button-focus-outline);
            }

            :host([selected]) button {
                background: var(--button-selected-bg);
                color: var(--button-selected-fg);
            }

            /* variants */

            button.outline {
                background: var(--button-outline-bg);
                color: var(--button-outline-fg);
            }

            button.outline:hover {
                background: var(--button-outline-hover-bg);
                color: var(--button-outline-hover-fg);
            }

            button.outline:disabled {
                background: var(--button-outline-disabled-bg);
                color: var(--button-outline-disabled-fg);
            }

            :host([selected]) button.outline {
                background: var(--button-outline-disabled-bg);
                color: var(--button--outline-disabled-fg);
            }

            button.toolbar {
                background: var(--button-toolbar-bg);
                color: var(--button-toolbar-fg);
            }

            button.toolbar:hover {
                background: var(--button-toolbar-hover-bg);
                color: var(--button-toolbar-hover-fg);
            }

            button.toolbar:disabled {
                background: var(--button-toolbar-disabled-bg);
                color: var(--button-toolbar-disabled-fg);
            }

            :host([selected]) button.toolbar {
                background: var(--button-toolbar-disabled-bg);
                color: var(--button--toolbar-disabled-fg);
            }

            button.toolbar-alt {
                background: var(--button-toolbar-alt-bg);
                color: var(--button-toolbar-alt-fg);
            }

            button.toolbar-alt:hover {
                background: var(--button-toolbar-alt-hover-bg);
                color: var(--button-toolbar-alt-hover-fg);
            }

            button.toolbar-alt:disabled {
                background: var(--button-toolbar-alt-disabled-bg);
                color: var(--button-toolbar-alt-disabled-fg);
            }

            :host([selected]) button.toolbar-alt {
                background: var(--button-toolbar-alt-disabled-bg);
                color: var(--button--toolbar-alt-disabled-fg);
            }

            button.menu {
                background: var(--button-menu-bg);
                color: var(--button-menu-fg);
                padding: 0;
            }

            button.menu:hover {
                background: var(--button-menu-hover-bg);
                color: var(--button-menu-hover-fg);
                outline: none;
            }

            button.menu:focus {
                outline: none;
            }

            button.menu:disabled {
                background: var(--button-menu-disabled-bg);
                color: var(--button-menu-disabled-fg);
            }

            :host([selected]) button.menu {
                background: var(--button-menu-disabled-bg);
                color: var(--button--menu-disabled-fg);
                outline: none;
            }
        `]}static get observedAttributes(){return["disabled","icon"]}attributeChangedCallback(e,t,r){if(this.button)switch(e){case"disabled":this.button.disabled=r!=null;break;case"icon":this.button_icon.innerText=r??"";break}}initialContentCallback(){this.variant&&this.button.classList.add(this.variant),this.button.disabled=this.disabled}render(){let e=this.icon?f`<kc-ui-icon part="icon">${this.icon}</kc-ui-icon>`:void 0;return f`<button part="base">
            ${e}
            <slot part="contents"></slot>
        </button>`}};P([v("button",!0)],he.prototype,"button",2),P([v("button_icon",!0)],he.prototype,"button_icon",2),P([L({type:String})],he.prototype,"name",2),P([L({type:String})],he.prototype,"icon",2),P([L({type:String})],he.prototype,"variant",2),P([L({type:Boolean})],he.prototype,"disabled",2),P([L({type:Boolean})],he.prototype,"selected",2);window.customElements.define("kc-ui-button",he);var mt=class extends N{static{c(this,"KCUIActivitySideBarElement")}static{this.styles=[...N.styles,y`
            :host {
                flex-shrink: 0;
                display: flex;
                flex-direction: row;
                height: 100%;
                overflow: hidden;
                min-width: calc(max(20%, 200px));
                max-width: calc(max(20%, 200px));
            }

            div {
                display: flex;
                overflow: hidden;
                flex-direction: column;
            }

            div.bar {
                flex-grow: 0;
                flex-shrink: 0;
                height: 100%;
                z-index: 1;
                display: flex;
                flex-direction: column;
                background: var(--activity-bar-bg);
                color: var(--activity-bar-fg);
                padding: 0.2em;
                user-select: none;
            }

            div.start {
                flex: 1;
            }

            div.activities {
                flex-grow: 1;
            }

            kc-ui-button {
                --button-bg: transparent;
                --button-fg: var(--activity-bar-fg);
                --button-hover-bg: var(--activity-bar-active-bg);
                --button-hover-fg: var(--activity-bar-active-fg);
                --button-selected-bg: var(--activity-bar-active-bg);
                --button-selected-fg: var(--activity-bar-active-fg);
                --button-focus-outline: none;
                margin-bottom: 0.25em;
            }

            kc-ui-button:last-child {
                margin-bottom: 0;
            }

            ::slotted(kc-ui-activity) {
                display: none;
                height: 100%;
            }

            ::slotted(kc-ui-activity[active]) {
                display: block;
            }
        `]}#e;get#t(){return this.querySelectorAll("kc-ui-activity")}get#r(){return Array.from(this.#t).map(e=>(e.getAttribute("name")??"").toLowerCase())}get#i(){return(this.#t[0]?.getAttribute("name")??"").toLowerCase()}render(){let e=[],t=[];for(let r of this.#t){let i=r.getAttribute("name"),n=r.getAttribute("icon");(r.getAttribute("button-location")=="bottom"?t:e).push(f`
                    <kc-ui-button
                        type="button"
                        tooltip-left="${i}"
                        name="${i?.toLowerCase()}"
                        title="${i}"
                        icon=${n}>
                    </kc-ui-button>
                `)}return f`<div class="bar">
                <div class="start">${e}</div>
                <div class="end">${t}</div>
            </div>
            <div class="activities">
                <slot name="activities"></slot>
            </div>`}initialContentCallback(){this.collapsed?this.change_activity(null):this.change_activity(this.#i),ue(this.renderRoot,"kc-ui-button","click",(t,r)=>{this.change_activity(r.name,!0)}),new MutationObserver(async t=>{await this.update(),this.#e&&!this.#r.includes(this.#e)&&this.change_activity(this.#i)}).observe(this,{childList:!0})}static get observedAttributes(){return["collapsed"]}attributeChangedCallback(e,t,r){switch(e){case"collapsed":r==null?this.show_activities():this.hide_activities();break;default:break}}get activity(){return this.#e}set activity(e){this.change_activity(e,!1)}hide_activities(){this.activities_container&&(this.style.width="unset",this.style.minWidth="unset",this.style.maxWidth="",this.activities_container.style.width="0px")}show_activities(){this.activities_container&&(this.#e||this.change_activity(this.#i),this.style.minWidth="",this.activities_container.style.width="")}change_activity(e,t=!1){e=e?.toLowerCase(),this.#e==e&&t?this.#e=null:this.#e=e,this.#e?this.collapsed=!1:this.collapsed=!0,this.update_state()}update_state(){for(let e of this.buttons)e.selected=e.name==this.#e;for(let e of this.#t)e.getAttribute("name")?.toLowerCase()==this.#e?e.setAttribute("active",""):e.removeAttribute("active")}};P([v(".activities",!0)],mt.prototype,"activities_container",2),P([js("kc-ui-button")],mt.prototype,"buttons",2),P([L({type:Boolean})],mt.prototype,"collapsed",2);window.customElements.define("kc-ui-activity-side-bar",mt);var Nr=class extends Ye{static{c(this,"KCUIAppElement")}static{this.useShadowRoot=!1}};window.customElements.define("kc-ui-app",Nr);var Vr=class extends N{static{c(this,"KCUIControlListElement")}static{this.styles=[...N.styles,y`
            :host {
                display: flex;
                flex-direction: column;
                flex-wrap: nowrap;
                background: var(--list-item-bg);
                color: var(--list-item-fg);
                padding-top: 0.2em;
            }
        `]}render(){return f`<slot></slot>`}};window.customElements.define("kc-ui-control-list",Vr);var Pr=class extends N{static{c(this,"KCUIControlListItemElement")}static{this.styles=[...N.styles,y`
            :host {
                margin-top: 0.2em;
                display: flex;
                flex-direction: column;
                flex-wrap: nowrap;
                user-select: none;
                background-color: transparent;
                transition:
                    color var(--transition-time-short) ease,
                    background-color var(--transition-time-short) ease;
            }

            ::slotted(label) {
                flex: 1 1 100%;
                display: block;
                margin: 0;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            ::slotted(input),
            ::slotted(select) {
                margin: 0;
                padding-left: 0;
                padding-right: 0;
            }
        `]}render(){return f`<slot></slot>`}};window.customElements.define("kc-ui-control-list-item",Pr);function _t(s,e,t){let r=t.value,i=!1;t.value=function(...n){if(!i){i=!0;try{r.apply(this,n)}finally{i=!1}}}}c(_t,"no_self_recursion");var u3=class extends N{static{c(this,"KCUIMenuElement")}static{this.styles=[...N.styles,y`
            :host {
                width 100%;
                display: flex;
                flex-direction: column;
                flex-wrap: nowrap;
                background: var(--list-item-bg);
                color: var(--list-item-fg);
            }

            :host(.outline) ::slotted(kc-ui-menu-item) {
                border-bottom: 1px solid var(--grid-outline);
            }

            :host(.dropdown) {
                --list-item-padding: 0.3em 0.6em;
                --list-item-bg: var(--dropdown-bg);
                --list-item-fg: var(--dropdown-fg);
                --list-item-hover-bg: var(--dropdown-hover-bg);
                --list-item-hover-fg: var(--dropdown-hover-fg);
                --list-item-active-bg: var(--dropdown-active-bg);
                --list-item-active-fg: var(--dropdown-active-fg);
                max-height: 50vh;
                overflow-y: auto;
            }
        `]}constructor(){super(),this.role="menu"}items(){return this.querySelectorAll("kc-ui-menu-item")}item_by_name(e){for(let t of this.items())if(t.name==e)return t;return null}deselect(){for(let e of this.items())e.selected=!1}get selected(){for(let e of this.items())if(e.selected)return e;return null}set selected(e){let t;E(e)?t=this.item_by_name(e):t=e,this.deselect(),!(!t||!(t instanceof Ke))&&(t.selected=!0,this.send_selected_event(t))}send_selected_event(e){this.dispatchEvent(new CustomEvent("kc-ui-menu:select",{detail:e,bubbles:!0,composed:!0}))}initialContentCallback(){super.initialContentCallback(),ue(this,"kc-ui-menu-item","click",(e,t)=>{e.target.tagName!="KC-UI-BUTTON"&&(e.stopPropagation(),this.selected=t)})}render(){return f`<slot></slot>`}};P([_t],u3.prototype,"send_selected_event",1);window.customElements.define("kc-ui-menu",u3);var Ke=class extends N{static{c(this,"KCUIMenuItemElement")}static{this.styles=[...N.styles,y`
            :host {
                display: flex;
                align-items: center;
                flex-wrap: nowrap;
                padding: var(--list-item-padding, 0.2em 0.3em);
                user-select: none;
                background: transparent;
                transition:
                    color var(--transition-time-short) ease,
                    background-color var(--transition-time-short) ease;
                cursor: pointer;
            }

            :host(:hover) {
                background: var(--list-item-hover-bg);
                color: var(--list-item-hover-fg);
            }

            :host([selected]) {
                background: var(--list-item-active-bg);
                color: var(--list-item-active-fg);
            }

            :host([disabled]) {
                background: var(--list-item-disabled-bg);
                color: var(--list-item-disabled-fg);
            }

            ::slotted(*) {
                flex: 1 1 100%;
                display: block;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            ::slotted(.narrow) {
                max-width: 100px;
            }

            ::slotted(.very-narrow) {
                max-width: 50px;
            }

            kc-ui-icon {
                margin-right: 0.5em;
                margin-left: -0.1em;
            }
        `]}constructor(){super(),this.role="menuitem"}render(){let e=this.icon?f`<kc-ui-icon>${this.icon}</kc-ui-icon>`:void 0;return f`${e}<slot></slot>`}};P([L({type:String})],Ke.prototype,"name",2),P([L({type:String})],Ke.prototype,"icon",2),P([L({type:Boolean})],Ke.prototype,"selected",2),P([L({type:Boolean})],Ke.prototype,"disabled",2);window.customElements.define("kc-ui-menu-item",Ke);var Wr=class extends N{static{c(this,"KCUIMenuLabelElement")}static{this.styles=[...N.styles,y`
            :host {
                width: 100%;
                display: flex;
                flex-wrap: nowrap;
                padding: 0.2em 0.3em;
                background: var(--panel-subtitle-bg);
                color: var(--panel-subtitle-fg);
            }
        `]}render(){return f`<slot></slot>`}};window.customElements.define("kc-ui-menu-label",Wr);var s2=class extends N{static{c(this,"KCUIDropdownElement")}static{this.styles=[...N.styles,y`
            :host {
                border-radius: 5px;
                border: 1px solid transparent;
                display: none;
                flex-direction: column;
                overflow: hidden;
                user-select: none;
                background: var(--dropdown-bg);
                color: var(--dropdown-fg);
                font-weight: 300;
            }

            :host([visible]) {
                display: flex;
            }
        `]}constructor(){super(),this.mouseout_padding??=50}show(){this.visible||(this.visible=!0,this.dispatchEvent(new CustomEvent("kc-ui-dropdown:show",{bubbles:!0,composed:!0})))}hide(){this.visible&&(this.visible=!1,this.dispatchEvent(new CustomEvent("kc-ui-dropdown:hide",{bubbles:!0,composed:!0})))}toggle(){this.visible?this.hide():this.show()}get menu(){return this.querySelector("kc-ui-menu")}initialContentCallback(){super.initialContentCallback(),this.hasAttribute("auto-hide")&&this.setup_leave_event(),this.menu.classList.add("invert-scrollbar")}setup_leave_event(){this.addEventListener("mouseleave",e=>{if(!this.visible)return;let t=this.mouseout_padding,r=this.getBoundingClientRect(),i=I(window,"mousemove",n=>{this.visible||i.dispose(),n.clientX>r.left-t&&n.clientX<r.right+t&&n.clientY>r.top-t&&n.clientY<r.bottom+t||(this.hide(),i.dispose())})})}render(){return f`<slot></slot>`}};P([L({type:Boolean})],s2.prototype,"visible",2),P([L({type:Number})],s2.prototype,"mouseout_padding",2);window.customElements.define("kc-ui-dropdown",s2);var Zr=class extends N{static{c(this,"KCUIFilteredListElement")}static{this.styles=[...N.styles,y`
            :host {
                display: contents;
            }
        `]}render(){return f`<slot></slot>`}#e;set filter_text(e){this.#e=e?.toLowerCase()??null,this.apply_filter()}get filter_text(){return this.#e}get item_selector(){return this.getAttribute("item-selector")??"[data-match-text]"}*items(){for(let e of this.queryAssignedElements())yield*e.querySelectorAll(this.item_selector)}apply_filter(){Re(()=>{for(let e of this.items())this.#e==null||e.dataset.matchText?.toLowerCase().includes(this.#e)?e.style.removeProperty("display"):e.style.display="none"})}};window.customElements.define("kc-ui-filtered-list",Zr);var Sr=class extends N{static{c(this,"KCUIFloatingToolbarElement")}static{this.styles=[...N.styles,y`
            :host {
                z-index: 10;
                user-select: none;
                pointer-events: none;
                position: absolute;
                left: 0;
                width: 100%;
                padding: 0.5em;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
            }

            :host([location="top"]) {
                top: 0;
            }

            :host([location="bottom"]) {
                bottom: 0;
            }

            ::slotted(*) {
                user-select: initial;
                pointer-events: initial;
            }

            slot[name="left"] {
                flex-grow: 999;
                display: flex;
            }

            slot[name="right"] {
                display: flex;
            }

            ::slotted(kc-ui-button) {
                margin-left: 0.25em;
            }
        `]}render(){return f`<slot name="left"></slot><slot name="right"></slot>`}};window.customElements.define("kc-ui-floating-toolbar",Sr);var Tr=class extends N{static{c(this,"KCUIFocusOverlay")}static{this.styles=[...N.styles,y`
            :host {
                z-index: 10;
                user-select: none;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: initial;
                background: transparent;
                contain: paint;
            }

            :host(.has-focus) {
                z-index: -10;
                pointer-events: none;
            }

            .bg {
                background: var(--focus-overlay-bg);
                opacity: 0;
                transition: opacity var(--transition-time-short);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }

            :host(:hover) .bg {
                opacity: var(--focus-overlay-opacity);
            }

            :host(.has-focus) .bg {
                opacity: 0;
            }

            .fg {
                position: absolute;
                font-size: 1.5rem;
                color: var(--focus-overlay-fg);
                text-shadow: rgba(0, 0, 0, 0.5) 0px 0px 15px;
                opacity: 0;
                pointer-events: none;
            }

            :host(:hover) .fg {
                opacity: 1;
            }

            :host(.has-focus) .fg {
                opacity: 0;
            }
        `]}#e;initialContentCallback(){this.addEventListener("click",()=>{this.classList.add("has-focus")}),this.addDisposable(I(document,"click",e=>{!e.composedPath().includes(this.parentElement)&&this.classList.remove("has-focus")})),this.#e=new IntersectionObserver(e=>{for(let t of e)t.isIntersecting||this.classList.remove("has-focus")}),this.#e.observe(this),this.addDisposable({dispose:c(()=>{this.#e.disconnect()},"dispose")})}render(){return f`
            <div class="bg"></div>
            <div class="fg">Click or tap to interact</div>
        `}};window.customElements.define("kc-ui-focus-overlay",Tr);var yr=class extends N{static{c(this,"KCUIPanelElement")}static{this.styles=[...N.styles,y`
            :host {
                width: 100%;
                height: 100%;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                background: var(--panel-bg);
                color: var(--panel-fg);
                --bg: var(--panel-bg);
            }

            :host(:last-child) {
                flex-grow: 1;
            }
        `]}render(){return f`<slot></slot>`}};window.customElements.define("kc-ui-panel",yr);var Lr=class extends N{static{c(this,"KCUIPanelTitleElement")}static{this.styles=[...N.styles,y`
            :host {
                flex: 0;
                width: 100%;
                text-align: left;
                padding: 0.2em 0.8em 0.2em 0.4em;
                display: flex;
                align-items: center;
                background: var(--panel-title-bg);
                color: var(--panel-title-fg);
                border-top: var(--panel-title-border);
                user-select: none;
            }

            div.title {
                flex: 1;
            }

            div.actions {
                flex: 0 1;
                display: flex;
                flex-direction: row;
                /* cheeky hack to work around scrollbar causing placement to be off. */
                padding-right: 6px;
            }
        `]}render(){return f`<div class="title">${this.title}</div>
            <div class="actions">
                <slot name="actions"></slot>
            </div>`}};window.customElements.define("kc-ui-panel-title",Lr);var Xr=class extends N{static{c(this,"KCUIPanelBodyElement")}static{this.styles=[...N.styles,y`
            :host {
                width: 100%;
                min-height: 0;
                overflow-y: auto;
                overflow-x: hidden;
                flex: 1 0;
                font-weight: 300;
                font-size: 1em;
            }

            :host([padded]) {
                padding: 0.1em 0.8em 0.1em 0.4em;
            }
        `]}render(){return f`<slot></slot>`}};window.customElements.define("kc-ui-panel-body",Xr);var Or=class extends N{static{c(this,"KCUIPanelLabelElement")}static{this.styles=[...N.styles,y`
            :host {
                width: 100%;
                display: flex;
                flex-wrap: nowrap;
                padding: 0.2em 0.3em;
                background: var(--panel-subtitle-bg);
                color: var(--panel-subtitle-fg);
            }
        `]}render(){return f`<slot></slot>`}};window.customElements.define("kc-ui-panel-label",Or);var Ur=class extends N{static{c(this,"KCUIPropertyList")}static{this.styles=[...N.styles,y`
            :host {
                display: grid;
                gap: 1px;
                grid-template-columns: fit-content(50%) 1fr;
                background: var(--grid-outline);
                border-bottom: 1px solid var(--grid-outline);
            }
        `]}render(){return f`<slot></slot>`}};window.customElements.define("kc-ui-property-list",Ur);var h3=class extends N{static{c(this,"KCUIPropertyListItemElement")}static{this.styles=[...N.styles,y`
            :host {
                display: contents;
            }

            span {
                padding: 0.2em;
                background: var(--bg);
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                user-select: all;
            }

            :host(.label) span:first-child {
                user-select: none;
                grid-column-end: span 2;
                background: var(--panel-subtitle-bg);
                color: var(--panel-subtitle-fg);
            }

            :host(.label) span:last-child {
                display: none;
            }

            ::slotted(*) {
                vertical-align: middle;
            }
        `]}render(){return f`<span title="${this.name}">${this.name}</span
            ><span><slot></slot></span>`}};P([L({type:String})],h3.prototype,"name",2);window.customElements.define("kc-ui-property-list-item",h3);var Se=class extends N{static{c(this,"KCUIRangeElement")}static{this.styles=[...N.styles,y`
            :host {
                display: block;
                width: 100%;
                user-select: none;
            }

            input[type="range"] {
                all: unset;
                box-sizing: border-box;
                display: block;
                width: 100%;
                max-width: 100%;
                padding-top: 0.25em;
                padding-bottom: 0.25em;
                -webkit-appearance: none;
                appearance: none;
                font: inherit;
                cursor: grab;
                background: transparent;
                transition:
                    color var(--transition-time-medium) ease,
                    box-shadow var(--transition-time-medium) ease,
                    outline var(--transition-time-medium) ease,
                    background var(--transition-time-medium) ease,
                    border var(--transition-time-medium) ease;
            }

            input[type="range"]:hover {
                z-index: 10;
                box-shadow: var(--input-range-hover-shadow);
            }

            input[type="range"]:focus {
                box-shadow: none;
                outline: none;
            }

            input[type="range"]:disabled:hover {
                cursor: unset;
            }

            input[type="range"]::-webkit-slider-runnable-track {
                box-sizing: border-box;
                height: 0.5em;
                border: 1px solid transparent;
                border-radius: 0.5em;
                background: var(--input-range-bg);
            }
            input[type="range"]::-moz-range-track {
                box-sizing: border-box;
                height: 0.5em;
                border: 1px solid transparent;
                border-radius: 0.5em;
                background: var(--input-range-bg);
            }

            input[type="range"]:hover::-webkit-slider-runnable-track,
            input[type="range"]:focus::-webkit-slider-runnable-track {
                border: 1px solid var(--input-range-hover-bg);
            }
            input[type="range"]:hover::-moz-range-track,
            input[type="range"]:focus::-moz-range-track {
                border: 1px solid var(--input-range-hover-bg);
            }

            input[type="range"]:disabled::-webkit-slider-runnable-track {
                background: var(--input-range-disabled-bg);
            }
            input[type="range"]:disabled::-moz-range-track {
                background: var(--input-range-disabled-bg);
            }

            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                height: 1em;
                width: 1em;
                border-radius: 0.5em;
                margin-top: -0.3em;
                background: var(--input-range-fg);
            }
            input[type="range"]::-moz-range-thumb {
                border: none;
                height: 1em;
                width: 1em;
                border-radius: 100%;
                margin-top: -0.3em;
                background: var(--input-range-fg);
            }

            input[type="range"]:focus::-webkit-slider-thumb {
                box-shadow: var(--input-range-handle-shadow);
            }
            input[type="range"]:focus::-moz-range-thumb {
                box-shadow: var(--input-range-handle-shadow);
            }
        `]}static get observedAttributes(){return["disabled","min","max","step","value"]}get value(){return this.input.value}set value(e){this.input.value=e}get valueAsNumber(){return this.input.valueAsNumber}attributeChangedCallback(e,t,r){if(this.input)switch(e){case"disabled":this.input.disabled=r!=null;break;case"min":this.input.min=r??"";break;case"max":this.input.max=r??"";break;case"step":this.input.step=r??"";break;case"value":this.value=r??"";break}}initialContentCallback(){this.input.disabled=this.disabled,this.input.addEventListener("input",e=>{e.stopPropagation(),this.dispatchEvent(new CustomEvent("kc-ui-range:input",{composed:!0,bubbles:!0}))})}render(){return f`<input
            type="range"
            min="${this.min}"
            max="${this.max}"
            step="${this.step}"
            value="${this.getAttribute("value")}">
        </input>`}};P([L({type:String})],Se.prototype,"name",2),P([L({type:String})],Se.prototype,"min",2),P([L({type:String})],Se.prototype,"max",2),P([L({type:String})],Se.prototype,"step",2),P([L({type:Boolean})],Se.prototype,"disabled",2),P([v("input",!0)],Se.prototype,"input",2);window.customElements.define("kc-ui-range",Se);var Fr=class extends N{static{c(this,"KCUIResizerElement")}static{this.styles=[...N.styles,y`
            :host {
                z-index: 999;
                user-select: none;
                display: block;
                width: 6px;
                margin-left: -6px;
                cursor: col-resize;
                background: transparent;
                opacity: 0;
                transition: opacity var(--transition-time-medium, 500) ease;
            }

            :host(:hover) {
                background: var(--resizer-bg, rebeccapurple);
                opacity: 1;
                transition: opacity var(--transition-time-short) ease;
            }

            :host(:hover.active),
            :host(.active) {
                background: var(--resizer-active-bg, rebeccapurple);
            }
        `]}initialContentCallback(){let e=this.previousElementSibling,t=this.nextElementSibling;this.addEventListener("mousedown",r=>{let i=r.clientX,n=t.getBoundingClientRect().width;document.body.style.cursor="col-resize",e.style.pointerEvents="none",e.style.userSelect="none",t.style.pointerEvents="none",t.style.userSelect="none",t.style.width=`${n}px`,t.style.maxWidth="unset",this.classList.add("active"),t.hasAttribute("collapsed")&&(console.log("removing collapsed"),t.removeAttribute("collapsed"));let o=c(u=>{let m=i-u.clientX,_=(n+m)*100/this.parentElement.getBoundingClientRect().width;t.style.width=`${_}%`},"mouse_move"),l=this.addDisposable(I(window,"mousemove",o)),p=c(u=>{document.body.style.cursor="",e.style.pointerEvents="",e.style.userSelect="",t.style.pointerEvents="",t.style.userSelect="",this.classList.remove("active"),l.dispose()},"mouse_up");window.addEventListener("mouseup",p,{once:!0})})}};window.customElements.define("kc-ui-resizer",Fr);var $s=y`
    :host(.grow) {
        flex-basis: unset;
        flex-grow: 999;
    }

    :host(.shrink) {
        flex-grow: 0;
        flex-shrink: 1;
        width: unset;
    }

    :host:(.fixed) {
        flex-grow: 0;
        flex-shrink: 0;
    }
`,xr=class extends N{static{c(this,"KCUIView")}static{this.styles=[...N.styles,$s,y`
            :host {
                flex-grow: 1;
                display: flex;
                overflow: hidden;
                flex-direction: column;
                position: relative;
            }
        `]}render(){return f`<slot></slot>`}};window.customElements.define("kc-ui-view",xr);var wr=class extends N{static{c(this,"KCUISplitView")}static{this.styles=[...N.styles,$s,y`
            :host {
                display: flex;
                height: 100%;
                overflow: hidden;
            }

            :host([horizontal]) {
                flex-direction: column;
                max-height: 100%;
            }

            :host([vertical]) {
                flex-direction: row;
                max-width: 100%;
            }
        `]}render(){return f`<slot></slot>`}};window.customElements.define("kc-ui-split-view",wr);var n2=class extends N{static{c(this,"KCUITextFilterInputElement")}static{this.styles=[...N.styles,y`
            :host {
                display: flex;
                align-items: center;
                align-content: center;
                position: relative;
                border-bottom: 1px solid var(--grid-outline);
            }

            kc-ui-icon.before {
                pointer-events: none;
                position: absolute;
                left: 0;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding-left: 0.25em;
            }

            input {
                all: unset;
                display: block;
                width: 100%;
                max-width: 100%;
                border-radius: 0;
                padding: 0.4em;
                padding-left: 1.5em;
                text-align: left;
                font: inherit;
                background: var(--input-bg);
                color: var(--input-fg);
            }

            input:placeholder-shown + button {
                display: none;
            }

            button {
                all: unset;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                color: var(--input-fg);
                padding: 0.25em;
            }

            button:hover {
                cursor: pointer;
                color: var(--input-accent);
            }
        `]}get value(){return this.input.value}set value(e){this.input.value=e,this.input.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}initialContentCallback(){super.initialContentCallback(),this.button.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),this.value=""})}render(){return f`<kc-ui-icon class="flex before">search</kc-ui-icon>
            <input style="" type="text" placeholder="search" name="search" />
            <button type="button">
                <kc-ui-icon>close</kc-ui-icon>
            </button>`}};P([v("input",!0)],n2.prototype,"input",2),P([v("button",!0)],n2.prototype,"button",2);window.customElements.define("kc-ui-text-filter-input",n2);var o2=class extends N{static{c(this,"KCUIToggleMenuElement")}static{this.styles=[...N.styles,y`
            * {
                box-sizing: border-box;
            }

            button {
                all: unset;
                box-sizing: border-box;
                user-select: none;
                width: 100%;
                max-width: 100%;
                margin: unset;
                font: inherit;
                padding: 0.3em 0.6em 0.3em 0.6em;
                display: flex;
                align-items: flex-end;
                justify-content: left;
                border: 1px solid transparent;
                border-radius: 0.25em;
                font-weight: 300;
                font-size: 1em;
                background: var(--dropdown-bg);
                color: var(--dropdown-fg);
                transition:
                    color var(--transition-time-medium, 500) ease,
                    background var(--transition-time-medium, 500) ease;
            }

            button:hover {
                background: var(--dropdown-hover-bg);
                color: var(--dropdown-hover-fg);
                box-shadow: none;
                outline: none;
            }

            button kc-ui-icon {
                font-size: 1em;
                margin-top: 0.1em;
                margin-bottom: 0.1em;
            }

            button span {
                display: none;
                margin-left: 0.5em;
            }

            :host([visible]) button {
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }

            :host([visible]) button span {
                display: revert;
            }

            ::slotted(kc-ui-dropdown) {
                border-top-left-radius: 0;
                border-top-right-radius: 0;
            }
        `]}get dropdown(){return this.queryAssignedElements("dropdown","kc-ui-dropdown")[0]}get button(){return this.renderRoot.querySelector("button")}initialContentCallback(){this.button.addEventListener("click",e=>{this.dropdown.toggle()}),this.addEventListener("kc-ui-dropdown:show",()=>{this.visible=!0}),this.addEventListener("kc-ui-dropdown:hide",()=>{this.visible=!1})}render(){return f`<button name="toggle" type="button" title="${this.title}">
                <kc-ui-icon>${this.icon??"question-mark"}</kc-ui-icon>
                <span>${this.title}</span>
            </button>
            <slot name="dropdown"></slot>`}};P([L({type:String})],o2.prototype,"icon",2),P([L({type:Boolean})],o2.prototype,"visible",2);window.customElements.define("kc-ui-toggle-menu",o2);var zs=`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs/><symbol id="pcb_file" viewBox="0 0 48 48">
    <path d="M11,44C10.2,44 9.5,43.7 8.9,43.1C8.3,42.5 8,41.8 8,41L8,7C8,6.2 8.3,5.5 8.9,4.9C9.5,4.3 10.2,4 11,4L29.05,4L40,14.95L40,41C40,41.8 39.7,42.5 39.1,43.1C38.5,43.7 37.8,44 37,44L11,44ZM27.55,16.3L27.55,7L11,7L11,41L37,41L37,16.3L27.55,16.3ZM11,7L11,16.3L11,7L11,41L11,7Z"/>
    <path d="M20.231,37.681C20.231,37.681 20.231,36.001 20.231,36.001L18.007,36.001C17.437,36.001 16.936,35.792 16.509,35.365C16.081,34.937 15.872,34.437 15.872,33.867L15.872,31.643L13.693,31.643L13.693,29.008C13.693,29.008 15.872,29.008 15.872,29.008L15.872,26.63L13.693,26.63L13.693,23.995C13.693,23.995 15.872,23.995 15.872,23.995L15.872,21.771C15.872,21.201 16.081,20.701 16.509,20.273C16.936,19.846 17.437,19.636 18.007,19.636C18.007,19.636 20.231,19.636 20.231,19.636L20.231,17.566L22.865,17.566C22.865,17.566 22.865,19.636 22.865,19.636C22.865,19.636 25.244,19.636 25.244,19.636L25.244,17.566L27.878,17.566C27.878,17.566 27.878,19.636 27.878,19.636L30.102,19.636C30.672,19.636 31.173,19.846 31.6,20.273C32.028,20.701 32.237,21.201 32.237,21.771C32.237,21.771 32.237,23.995 32.237,23.995L34.307,23.995L34.307,26.63C34.307,26.63 32.237,26.63 32.237,26.63C32.237,26.63 32.237,29.008 32.237,29.008L34.307,29.008L34.307,31.643C34.307,31.643 32.237,31.643 32.237,31.643L32.237,33.867C32.237,34.437 32.028,34.937 31.6,35.365C31.173,35.792 30.672,36.001 30.102,36.001L27.878,36.001L27.878,38.181L25.244,38.181C25.244,38.181 25.244,36.001 25.244,36.001L22.865,36.001L22.865,38.181L20.231,38.181L20.231,37.681ZM29.602,33.367L29.602,22.271L18.507,22.271L18.507,33.367L29.602,33.367ZM20.694,24.595L27.279,24.595L27.279,31.179L20.694,31.179L20.694,24.595ZM23.329,28.545C23.329,28.545 24.644,28.545 24.644,28.545C24.644,28.545 24.644,27.229 24.644,27.229C24.644,27.229 23.329,27.229 23.329,27.229L23.329,28.545Z"/>
</symbol><symbol id="schematic_file" viewBox="0 0 48 48">
    <path d="M11,44C10.2,44 9.5,43.7 8.9,43.1C8.3,42.5 8,41.8 8,41L8,7C8,6.2 8.3,5.5 8.9,4.9C9.5,4.3 10.2,4 11,4L29.05,4L40,14.95L40,41C40,41.8 39.7,42.5 39.1,43.1C38.5,43.7 37.8,44 37,44L11,44ZM27.55,16.3L27.55,7L11,7L11,41L37,41L37,16.3L27.55,16.3ZM11,7L11,16.3L11,7L11,41L11,7Z"/>
    <path d="M18.256,26.367L15.377,26.367L15.377,23.367L18.256,23.367L18.256,23.184C18.256,22.155 18.784,21.198 19.654,20.648C20.524,20.098 21.615,20.033 22.544,20.475L24.69,21.494L24.69,19.353L27.69,19.353L27.69,22.92L32.411,25.164C33.457,25.661 34.123,26.715 34.123,27.873C34.123,29.031 33.457,30.086 32.411,30.583L27.69,32.827L27.69,36.394L24.69,36.394L24.69,34.252L22.544,35.272C21.615,35.714 20.524,35.648 19.654,35.099C18.784,34.549 18.256,33.592 18.256,32.563L18.256,32.38L15.377,32.38L15.377,29.38L18.256,29.38L18.256,26.367ZM21.256,32.563L31.123,27.873L21.256,23.184L21.256,32.563Z"/>
</symbol><symbol id="zoom_footprint" viewBox="0 0 48 48">
    <g>
        <path d="M33,38.5C34.567,38.5 35.875,37.975 36.925,36.925C37.975,35.875 38.5,34.567 38.5,33C38.5,31.433 37.975,30.125 36.925,29.075C35.875,28.025 34.567,27.5 33,27.5C31.433,27.5 30.125,28.025 29.075,29.075C28.025,30.125 27.5,31.433 27.5,33C27.5,34.567 28.025,35.875 29.075,36.925C30.125,37.975 31.433,38.5 33,38.5ZM43.2,45.3L37.842,39.95C37.147,40.417 36.392,40.792 35.575,41.075C34.758,41.358 33.9,41.5 33,41.5C30.639,41.5 28.632,40.673 26.979,39.019C25.326,37.365 24.5,35.357 24.5,32.994C24.5,30.631 25.327,28.625 26.981,26.975C28.635,25.325 30.643,24.5 33.006,24.5C35.369,24.5 37.375,25.326 39.025,26.979C40.675,28.632 41.5,30.639 41.5,33C41.5,33.9 41.358,34.758 41.075,35.575C40.792,36.392 40.417,37.147 39.95,37.842L45.3,43.2L43.2,45.3Z"/>
        <path d="M22.597,38L21,38L21,42L18,42L18,38L13,38C12.2,38 11.5,37.7 10.9,37.1C10.3,36.5 10,35.8 10,35L10,30L6,30L6,27L10,27L10,20.8L6,20.8L6,17.8L10,17.8L10,12.8C10,12 10.3,11.3 10.9,10.7C11.5,10.1 12.2,9.8 13,9.8L18,9.8L18,6L21,6L21,9.8L27.2,9.8L27.2,6L30.2,6L30.2,9.8L35.2,9.8C36,9.8 36.7,10.1 37.3,10.7C37.9,11.3 38.2,12 38.2,12.8L38.2,17.8L42,17.8L42,20.8L38.2,20.8L38.2,22.691C37.262,22.214 36.262,21.88 35.2,21.69L35.2,12.8L13,12.8L13,35L21.657,35C21.83,36.06 22.143,37.06 22.597,38ZM22.119,29.15L18.85,29.15L18.85,18.9L29.1,18.9L29.1,22.139C28.029,22.515 27.029,23.058 26.1,23.767L26.1,21.9L21.85,21.9L21.85,26.15L23.727,26.15C23.025,27.079 22.489,28.079 22.119,29.15Z"/>
    </g>
</symbol><symbol id="zoom_page" viewBox="0 0 48 48">
    <g>
        <path d="M9,41L24.75,41C25.417,41.7 26.158,42.3 26.975,42.8C27.792,43.3 28.683,43.7 29.65,44L9,44C8.2,44 7.5,43.7 6.9,43.1C6.3,42.5 6,41.8 6,41L6.02,9.006C6.02,8.206 6.32,7.506 6.92,6.906C7.52,6.306 8.22,6.006 9.02,6.006L27.07,6.006L38,14.95L38,22.65C37.533,22.417 37.05,22.217 36.55,22.05C36.05,21.883 35.533,21.75 35,21.65L35,16.3L25.55,16.3L25.57,9.006L9.02,9.006L9,16.3L9,41Z"/>
        <path d="M43.2,45.3L37.842,39.95C37.147,40.417 36.392,40.792 35.575,41.075C34.758,41.358 33.9,41.5 33,41.5C30.639,41.5 28.632,40.673 26.979,39.019C25.326,37.365 24.5,35.357 24.5,32.994C24.5,30.631 25.327,28.625 26.981,26.975C28.635,25.325 30.643,24.5 33.006,24.5C35.369,24.5 37.375,25.326 39.025,26.979C40.675,28.632 41.5,30.639 41.5,33C41.5,33.9 41.358,34.758 41.075,35.575C40.792,36.392 40.417,37.147 39.95,37.842L45.3,43.2L43.2,45.3ZM33,38.5C34.567,38.5 35.875,37.975 36.925,36.925C37.975,35.875 38.5,34.567 38.5,33C38.5,31.433 37.975,30.125 36.925,29.075C35.875,28.025 34.567,27.5 33,27.5C31.433,27.5 30.125,28.025 29.075,29.075C28.025,30.125 27.5,31.433 27.5,33C27.5,34.567 28.025,35.875 29.075,36.925C30.125,37.975 31.433,38.5 33,38.5Z"/>
    </g>
</symbol></svg>`;var qs=URL.createObjectURL(new Blob([zs],{type:"image/svg+xml"}));function a2(s){return s[Symbol.iterator]().next().value}c(a2,"first");function*en(s,e){let t=0;for(let r of s)yield e(r,t),t++}c(en,"map");function l2(s){let e=0;for(let t of s)e++;return e}c(l2,"length");var te=class{constructor(e,t=1){this.name=e;this.level=t}static{c(this,"Logger")}#e(e,...t){e(`%c${this.name}:%c`,"color: ButtonText","color: inherit",...t)}debug(...e){this.level>=2&&this.#e(console.debug,...e)}info(...e){this.level>=1&&this.#e(console.info.bind(window.console),...e)}warn(...e){this.level>=0&&this.#e(console.warn,...e)}error(...e){this.level>=0&&this.#e(console.error,...e)}},Cn=new te("kicanvas");function c2(...s){Cn.warn(...s)}c(c2,"warn");var U=class s{static{c(this,"Matrix3")}constructor(e){if(e.length!=9)throw new Error(`Matrix3 requires 9 elements, got ${e}`);this.elements=new Float32Array(e)}static from_DOMMatrix(e){return new s([e.m11,e.m12,e.m14,e.m21,e.m22,e.m24,e.m41,e.m42,e.m44])}to_DOMMatrix(){let e=this.elements;return new DOMMatrix([e[0],e[3],e[1],e[4],e[6],e[7]])}to_4x4_DOMMatrix(){let e=this.elements;return new DOMMatrix([e[0],e[1],0,e[2],e[3],e[4],0,e[5],0,0,1,0,e[6],e[7],0,1])}static identity(){return new s([1,0,0,0,1,0,0,0,1])}static orthographic(e,t){return new s([2/e,0,0,0,-2/t,0,-1,1,1])}copy(){return new s(this.elements)}set(e){if(e.length!=9)throw new Error(`Matrix3 requires 9 elements, got ${e}`);this.elements.set(e)}transform(e){let t=this.elements[0],r=this.elements[1],i=this.elements[3],n=this.elements[4],o=this.elements[6],l=this.elements[7],p=e.x,u=e.y,m=p*t+u*i+o,_=p*r+u*n+l;return new d(m,_)}*transform_all(e){for(let t of e)yield this.transform(t)}static transform_all(e,t){return e?Array.from(e.transform_all(t)):t}multiply_self(e){let t=this.elements[0],r=this.elements[1],i=this.elements[2],n=this.elements[3],o=this.elements[4],l=this.elements[5],p=this.elements[6],u=this.elements[7],m=this.elements[8],_=e.elements[0],b=e.elements[1],M=e.elements[2],g=e.elements[3],Z=e.elements[4],T=e.elements[5],w=e.elements[6],C=e.elements[7],X=e.elements[8];return this.elements[0]=_*t+b*n+M*p,this.elements[1]=_*r+b*o+M*u,this.elements[2]=_*i+b*l+M*m,this.elements[3]=g*t+Z*n+T*p,this.elements[4]=g*r+Z*o+T*u,this.elements[5]=g*i+Z*l+T*m,this.elements[6]=w*t+C*n+X*p,this.elements[7]=w*r+C*o+X*u,this.elements[8]=w*i+C*l+X*m,this}multiply(e){return this.copy().multiply_self(e)}inverse(){let e=this.elements[0],t=this.elements[1],r=this.elements[2],i=this.elements[3],n=this.elements[4],o=this.elements[5],l=this.elements[6],p=this.elements[7],u=this.elements[8],m=u*n-o*p,_=-u*i+o*l,b=p*i-n*l,g=1/(e*m+t*_+r*b);return new s([m*g,(-u*t+r*p)*g,(o*t-r*n)*g,_*g,(u*e-r*l)*g,(-o*e+r*i)*g,b*g,(-p*e+t*l)*g,(n*e-t*i)*g])}static translation(e,t){return new s([1,0,0,0,1,0,e,t,1])}translate_self(e,t){return this.multiply_self(s.translation(e,t))}translate(e,t){return this.copy().translate_self(e,t)}static scaling(e,t){return new s([e,0,0,0,t,0,0,0,1])}scale_self(e,t){return this.multiply_self(s.scaling(e,t))}scale(e,t){return this.copy().scale_self(e,t)}static rotation(e){let t=new W(e).radians,r=Math.cos(t),i=Math.sin(t);return new s([r,-i,0,i,r,0,0,0,1])}rotate_self(e){return this.multiply_self(s.rotation(e))}rotate(e){return this.copy().rotate_self(e)}get absolute_translation(){return this.transform(new d(0,0))}get absolute_rotation(){let e=this.transform(new d(0,0));return this.transform(new d(1,0)).sub(e).angle.normalize()}};var d=class s{static{c(this,"Vec2")}constructor(e=0,t){this.set(e,t)}copy(){return new s(...this)}set(e,t){let r=null;if(le(e)&&le(t)?r=e:e instanceof s?(r=e.x,t=e.y):e instanceof Array?(r=e[0],t=e[1]):e instanceof Object&&Object.hasOwn(e,"x")?(r=e.x,t=e.y):e==0&&t==null&&(r=0,t=0),r==null||t==null)throw new Error(`Invalid parameters x: ${e}, y: ${t}.`);this.x=r,this.y=t}*[Symbol.iterator](){yield this.x,yield this.y}get magnitude(){return Math.sqrt(this.x**2+this.y**2)}get squared_magnitude(){return this.x**2+this.y**2}get normal(){return new s(-this.y,this.x)}get angle(){return new W(Math.atan2(this.y,this.x))}get kicad_angle(){return this.x==0&&this.y==0?new W(0):this.y==0?this.x>=0?new W(0):W.from_degrees(-180):this.x==0?this.y>=0?W.from_degrees(90):W.from_degrees(-90):this.x==this.y?this.x>=0?W.from_degrees(45):W.from_degrees(-135):this.x==-this.y?this.x>=0?W.from_degrees(-45):W.from_degrees(135):this.angle}normalize(){if(this.x==0&&this.y==0)return new s(0,0);let e=this.magnitude,t=this.x/=e,r=this.y/=e;return new s(t,r)}equals(e){return this.x==e?.x&&this.y==e?.y}add(e){return new s(this.x+e.x,this.y+e.y)}sub(e){return new s(this.x-e.x,this.y-e.y)}scale(e){return new s(this.x*e.x,this.y*e.y)}rotate(e){return U.rotation(e).transform(this)}multiply(e){return le(e)?new s(this.x*e,this.y*e):new s(this.x*e.x,this.y*e.y)}resize(e){return this.normalize().multiply(e)}cross(e){return this.x*e.y-this.y*e.x}static segment_intersect(e,t,r,i){let n=t.sub(e),o=i.sub(r),l=r.sub(e),p=o.cross(n),u=o.cross(l),m=n.cross(l);return p==0||p>0&&(m<0||m>p||u<0||u>p)||p<0&&(m<p||u<p||u>0||m>0)?null:new s(r.x+m/p*o.x,r.y+m/p*o.y)}};var W=class s{static{c(this,"Angle")}#e;#t;static rad_to_deg(e){return e/Math.PI*180}static deg_to_rad(e){return e/180*Math.PI}static round(e){return Math.round((e+Number.EPSILON)*100)/100}constructor(e){if(e instanceof s)return e;this.radians=e}copy(){return new s(this.radians)}get radians(){return this.#e}set radians(e){this.#e=e,this.#t=s.round(s.rad_to_deg(e))}get degrees(){return this.#t}set degrees(e){this.#t=e,this.#e=s.deg_to_rad(e)}static from_degrees(e){return new s(s.deg_to_rad(e))}add(e){let t=this.radians+new s(e).radians;return new s(t)}sub(e){let t=this.radians-new s(e).radians;return new s(t)}normalize(){let e=s.round(this.degrees);for(;e<0;)e+=360;for(;e>=360;)e-=360;return s.from_degrees(e)}normalize180(){let e=s.round(this.degrees);for(;e<=-180;)e+=360;for(;e>180;)e-=360;return s.from_degrees(e)}normalize720(){let e=s.round(this.degrees);for(;e<-360;)e+=360;for(;e>=360;)e-=360;return s.from_degrees(e)}negative(){return new s(-this.radians)}get is_vertical(){return this.degrees==90||this.degrees==270}get is_horizontal(){return this.degrees==0||this.degrees==180}rotate_point(e,t=new d(0,0)){let r=e.x-t.x,i=e.y-t.y,n=this.normalize();if(n.degrees!=0)if(n.degrees==90)[r,i]=[i,-r];else if(n.degrees==180)[r,i]=[-r,-i];else if(n.degrees==270)[r,i]=[-i,r];else{let o=Math.sin(n.radians),l=Math.cos(n.radians),[p,u]=[r,i];r=u*o+p*l,i=u*l-p*o}return r+=t.x,i+=t.y,new d(r,i)}};var O=class s{constructor(e=0,t=0,r=0,i=0,n){this.x=e;this.y=t;this.w=r;this.h=i;this.context=n;this.w<0&&(this.w*=-1,this.x-=this.w),this.h<0&&(this.h*=-1,this.y-=this.h)}static{c(this,"BBox")}copy(){return new s(this.x,this.y,this.w,this.h,this.context)}static from_corners(e,t,r,i,n){return r<e&&([e,r]=[r,e]),i<t&&([t,i]=[i,t]),new s(e,t,r-e,i-t,n)}static from_points(e,t){if(e.length==0)return new s(0,0,0,0);let r=e[0],i=r.copy(),n=r.copy();for(let o of e)i.x=Math.min(i.x,o.x),i.y=Math.min(i.y,o.y),n.x=Math.max(n.x,o.x),n.y=Math.max(n.y,o.y);return s.from_corners(i.x,i.y,n.x,n.y,t)}static combine(e,t){let r=Number.POSITIVE_INFINITY,i=Number.POSITIVE_INFINITY,n=Number.NEGATIVE_INFINITY,o=Number.NEGATIVE_INFINITY;for(let l of e)l.valid&&(r=Math.min(r,l.x),i=Math.min(i,l.y),n=Math.max(n,l.x2),o=Math.max(o,l.y2));return r==Number.POSITIVE_INFINITY||i==Number.POSITIVE_INFINITY||n==Number.NEGATIVE_INFINITY||o==Number.NEGATIVE_INFINITY?new s(0,0,0,0,t):s.from_corners(r,i,n,o,t)}get valid(){return(this.w!==0||this.h!==0)&&this.w!==void 0&&this.h!==void 0}get start(){return new d(this.x,this.y)}set start(e){this.x=e.x,this.y=e.y}get end(){return new d(this.x+this.w,this.y+this.h)}set end(e){this.x2=e.x,this.y2=e.y}get top_left(){return this.start}get top_right(){return new d(this.x+this.w,this.y)}get bottom_left(){return new d(this.x,this.y+this.h)}get bottom_right(){return this.end}get x2(){return this.x+this.w}set x2(e){this.w=e-this.x,this.w<0&&(this.w*=-1,this.x-=this.w)}get y2(){return this.y+this.h}set y2(e){this.h=e-this.y,this.h<0&&(this.h*=-1,this.y-=this.h)}get center(){return new d(this.x+this.w/2,this.y+this.h/2)}transform(e){let t=e.transform(this.start),r=e.transform(this.end);return s.from_corners(t.x,t.y,r.x,r.y,this.context)}grow(e,t){return t??=e,new s(this.x-e,this.y-t,this.w+e*2,this.h+t*2,this.context)}scale(e){return s.from_points([this.start.multiply(e),this.end.multiply(e)],this.context)}mirror_vertical(){return new s(this.x,-this.y,this.w,-this.h)}contains(e){return this.contains_point(e.start)&&this.contains_point(e.end)}contains_point(e){return e.x>=this.x&&e.x<=this.x2&&e.y>=this.y&&e.y<=this.y2}constrain_point(e){let t=Math.min(Math.max(e.x,this.x),this.x2),r=Math.min(Math.max(e.y,this.y),this.y2);return new d(t,r)}intersect_segment(e,t){if(this.contains_point(e))return null;let r=[this.top_left,this.bottom_left],i=[this.top_right,this.bottom_right],n=[this.top_left,this.top_right],o=[this.bottom_left,this.bottom_right],l=e,p=t;for(let u of[r,i,n,o]){let m=d.segment_intersect(e,t,...u);m&&m.sub(l).squared_magnitude<p.sub(l).squared_magnitude&&p.set(m)}return l.equals(p)?null:p}};var q=class s{constructor(e,t,r,i,n,o="clockwise"){this.center=e;this.radius=t;this.start_angle=r;this.end_angle=i;this.width=n;this.direction=o}static{c(this,"Arc")}static from_three_points(e,t,r,i=1){let o=Dn(new d(e.x*1e6,e.y*1e6),new d(t.x*1e6,t.y*1e6),new d(r.x*1e6,r.y*1e6));o.x/=1e6,o.y/=1e6;let l=o.sub(t).magnitude,p=e.sub(o).angle,u=t.sub(o).angle,m=r.sub(o).angle,_,b=u.sub(p).normalize(),M=m.sub(p).normalize();b.degrees<M.degrees?_=M:_=W.from_degrees(360).sub(M);let g,Z,T=t.sub(e),w=r.sub(t);T.cross(w)<0?(g=m.normalize(),Z="counter-clockwise"):(g=p.normalize(),Z="clockwise");let C=g.add(_);return new s(o,l,g,C,i,Z)}static from_center_start_end(e,t,r,i){let n=t.sub(e).magnitude,o=t.sub(e),l=r.sub(e),p=o.kicad_angle,u=l.kicad_angle;return u.degrees==p.degrees&&(u.degrees=p.degrees+360),p.degrees>u.degrees&&(u.degrees<0?u=u.normalize():p=p.normalize().sub(W.from_degrees(-360))),new s(e,n,p,u,i)}get start_radial(){return this.start_angle.rotate_point(new d(this.radius,0))}get start_point(){return this.center.add(this.start_radial)}get end_radial(){return this.end_angle.rotate_point(new d(this.radius,0))}get end_point(){return this.center.add(this.end_radial)}get mid_angle(){return new W((this.start_angle.radians+this.end_angle.radians)/2)}get mid_radial(){return this.mid_angle.rotate_point(new d(this.radius,0))}get mid_point(){return this.center.add(this.mid_radial)}get arc_angle(){return this.end_angle.sub(this.start_angle)}to_polyline(){let e=[],t=this.start_angle.radians,r=this.end_angle.radians;t>r&&([r,t]=[t,r]);for(let o=t;o<r;o+=Math.PI/32)e.push(new d(this.center.x+Math.cos(o)*this.radius,this.center.y+Math.sin(o)*this.radius));let i;this.direction==="counter-clockwise"?(e.reverse(),i=t):i=r;let n=new d(this.center.x+Math.cos(i)*this.radius,this.center.y+Math.sin(i)*this.radius);return n.equals(e[e.length-1])||e.push(n),e}to_polygon(){let e=this.to_polyline();return e.push(this.center),e}get bbox(){let e=[this.start_point,this.mid_point,this.end_point];return this.start_angle.degrees<0&&this.end_angle.degrees>=0&&e.push(this.center.add(new d(this.radius,0))),this.start_angle.degrees<90&&this.end_angle.degrees>=90&&e.push(this.center.add(new d(0,this.radius))),this.start_angle.degrees<180&&this.end_angle.degrees>=180&&e.push(this.center.add(new d(-this.radius,0))),this.start_angle.degrees<270&&this.end_angle.degrees>=270&&e.push(this.center.add(new d(0,this.radius))),this.start_angle.degrees<360&&this.end_angle.degrees>=360&&e.push(this.center.add(new d(0,this.radius))),O.from_points(e)}};function Dn(s,e,t){let r=Math.SQRT1_2,i=new d(0,0),n=e.y-s.y,o=e.x-s.x,l=t.y-e.y,p=t.x-e.x;if(o==0&&l==0||n==0&&p==0)return i.x=(s.x+t.x)/2,i.y=(s.y+t.y)/2,i;o==0&&(o=Number.EPSILON),p==0&&(p=-Number.EPSILON);let u=n/o,m=l/p,_=u*new d(.5/n,.5/o).magnitude,b=m*new d(.5/l,.5/p).magnitude;if(u==m){if(s==t)return i.x=(s.x+e.x)/2,i.y=(s.y+e.y)/2,i;u+=Number.EPSILON,m-=Number.EPSILON}u==0&&(u=Number.EPSILON);let M=u*m*(s.y-t.y),g=M*Math.sqrt(_/u*_/u+b/m*b/m+r/(s.y-t.y)*(r/(s.y-t.y))),Z=m*(s.x+e.x),T=Z*Math.sqrt(b/m*b/m+r/(s.x+e.x)*r/(s.x+e.x)),w=u*(e.x+t.x),C=w*Math.sqrt(_/u*_/u+r/(e.x+t.x)*r/(e.x+t.x)),X=2*(m-u),F=2*Math.sqrt(b*b+_*_),Rt=M+Z-w,xe=Math.sqrt(g*g+T*T+C*C),$=(M+Z-w)/X,se=$*Math.sqrt(xe/Rt*xe/Rt+F/X*F/X),_r=(s.x+e.x)/2-$,Os=Math.sqrt(1/8+se*se),Us=_r/u,Fs=Us*Math.sqrt(Os/_r*Os/_r+_/u*_/u),e2=Us+(s.y+e.y)/2,xs=Math.sqrt(Fs*Fs+1/8),ws=Math.floor(($+50)/100)*100,vs=Math.floor((e2+50)/100)*100,Qs=Math.floor(($+5)/10)*10,Ys=Math.floor((e2+5)/10)*10;return Math.abs(ws-$)<se&&Math.abs(vs-e2)<xs?(i.x=ws,i.y=vs):Math.abs(Qs-$)<se&&Math.abs(Ys-e2)<xs?(i.x=Qs,i.y=Ys):(i.x=$,i.y=e2),i}c(Dn,"arc_center_from_three_points");var d3=class{constructor(e=new d(0,0),t=new d(0,0),r=1,i=new W(0),n=!1){this.viewport_size=e;this.center=t;this.zoom=r;this.rotation=i;this.flipped=n}static{c(this,"Camera2")}translate(e,t){let r=this.center.add(new d(this.flipped?-e.x:e.x,e.y));t&&r.set(t.constrain_point(r)),this.center.set(r)}rotate(e){this.rotation=this.rotation.add(e)}get matrix(){let e=this.viewport_size.x/2,t=this.viewport_size.y/2,r=this.center.x-this.center.x*this.zoom,i=this.center.y-this.center.y*this.zoom,n=this.flipped?-(this.center.x+e)+r:-(this.center.x-e)+r,o=-(this.center.y-t)+i,l=this.flipped?-1:1;return U.identity().scale_self(l,1).translate_self(n,o).rotate_self(this.rotation).scale_self(this.zoom,this.zoom)}get bbox(){let e=this.matrix.inverse(),t=e.transform(new d(0,0)),r=e.transform(new d(this.viewport_size.x,this.viewport_size.y));return new O(t.x,t.y,r.x-t.x,r.y-t.y)}set bbox(e){let t=this.viewport_size.x/e.w,r=this.viewport_size.y/e.h,i=e.x+e.w/2,n=e.y+e.h/2;this.zoom=Math.min(t,r),this.center.set(i,n)}get top(){return this.bbox.y}get bottom(){return this.bbox.y2}get left(){return this.bbox.x}get right(){return this.bbox.x2}apply_to_canvas(e){this.viewport_size.set(e.canvas.clientWidth,e.canvas.clientHeight);let t=U.from_DOMMatrix(e.getTransform());t.multiply_self(this.matrix),e.setTransform(t.to_DOMMatrix())}screen_to_world(e){return this.matrix.inverse().transform(e)}world_to_screen(e){return this.matrix.transform(e)}};var h=class s{constructor(e,t,r,i=1){this.r=e;this.g=t;this.b=r;this.a=i}static{c(this,"Color")}copy(){return new s(this.r,this.g,this.b,this.a)}static get transparent_black(){return new s(0,0,0,0)}static get black(){return new s(0,0,0,1)}static get white(){return new s(1,1,1,1)}static from_css(e){let t,r,i,n;if(e[0]=="#")e=e.slice(1),e.length==3&&(e=`${e[0]}${e[0]}${e[1]}${e[1]}${e[2]}${e[2]}`),e.length==6&&(e=`${e}FF`),[t,r,i,n]=[parseInt(e.slice(0,2),16)/255,parseInt(e.slice(2,4),16)/255,parseInt(e.slice(4,6),16)/255,parseInt(e.slice(6,8),16)/255];else if(e.startsWith("rgb")){e.startsWith("rgba")||(e=`rgba(${e.slice(4,-1)}, 1)`),e=e.trim().slice(5,-1);let o=e.split(",");if(o.length!=4)throw new Error(`Invalid color ${e}`);[t,r,i,n]=[parseFloat(o[0])/255,parseFloat(o[1])/255,parseFloat(o[2])/255,parseFloat(o[3])]}else throw new Error(`Unable to parse CSS color string ${e}`);return new s(t,r,i,n)}to_css(){return`rgba(${this.r_255}, ${this.g_255}, ${this.b_255}, ${this.a})`}to_array(){return[this.r,this.g,this.b,this.a]}get r_255(){return Math.round(this.r*255)}set r_255(e){this.r=e/255}get g_255(){return Math.round(this.g*255)}set g_255(e){this.g=e/255}get b_255(){return Math.round(this.b*255)}set b_255(e){this.b=e/255}get is_transparent_black(){return this.r==0&&this.g==0&&this.b==0&&this.a==0}with_alpha(e){let t=this.copy();return t.a=e,t}desaturate(){if(this.r==this.g&&this.r==this.b)return this;let[e,t,r]=Bn(this.r,this.g,this.b);return new s(...jn(e,0,r))}mix(e,t){return new s(e.r*(1-t)+this.r*t,e.g*(1-t)+this.g*t,e.b*(1-t)+this.b*t,this.a)}};function Bn(s,e,t){let r=Math.max(s,e,t),i=Math.min(s,e,t),n=(i+r)/2,o=r-i,[l,p]=[NaN,0];if(o!==0){switch(p=n===0||n===1?0:(r-n)/Math.min(n,1-n),r){case s:l=(e-t)/o+(e<t?6:0);break;case e:l=(t-s)/o+2;break;case t:l=(s-e)/o+4}l=l*60}return[l,p*100,n*100]}c(Bn,"rgb_to_hsl");function jn(s,e,t){s=s%360,s<0&&(s+=360),e/=100,t/=100;function r(i){let n=(i+s/30)%12,o=e*Math.min(t,1-t);return t-o*Math.max(-1,Math.min(n-3,9-n,1))}return c(r,"f"),[r(0),r(8),r(4)]}c(jn,"hsl_to_rgb");var k=class{constructor(e,t=null){this.type=e;this.value=t}static{c(this,"Token")}static{this.OPEN=Symbol("opn")}static{this.CLOSE=Symbol("clo")}static{this.ATOM=Symbol("atm")}static{this.NUMBER=Symbol("num")}static{this.STRING=Symbol("str")}};function _3(s){return s>="0"&&s<="9"}c(_3,"is_digit");function rn(s){return s>="A"&&s<="Z"||s>="a"&&s<="z"}c(rn,"is_alpha");function m3(s){return s==="
