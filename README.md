# loneJS
Dynamic Single Page Application (SPA) Without a Framework Resource &amp; Guide

**STEPS TO PREVIEW IN BROWSER**
- cd (to directory this file is located in)
- Ensure you have this installed: https://www.npmjs.com/package/http-server
- In Terminal: `http-server -c-1`
- Open browser and go to http://localhost:8080/ if this file is index.html
- IF the main `.html` file isn't named index.html, just add the endpoint of the file (ex: http://localhost:8080/template.html)
- ALSO, you can `http-server -c-1 -p 8010` (will change port to 8010 if there's a conflict for some reason)
- ALSO, you may need to `sudo kill -9 PID` (If port has conflict (`top`: to find out PID)
- HELPFUL LINK: https://www.html5rocks.com/en/tutorials/webcomponents/imports/
- HELPFUL LINK2: https://www.html5rocks.com/en/tutorials/webcomponents/customelements/
- HELPFUL LINK3: https://www.webcomponents.org/polyfills


**RESERVED Variable Names**



html.js - RESERVED VAR NAMES && Naming conventions

*** DOM attributes
- for=""
- var=""
- if=""
- is-clone=""
- serve=""
- served=""
- directory=""
- initial-innerhtml=""
- if-initial=""

*** JavaScript Variable Names
- _DATA
- _OLD_HASH
- _COMPONENTS_STORED_GLOBALLY
- _POLYFILL_INCLUDED

*** JavaScript Functions
- _PAGE_SET
- _PAGE_Display
- _UPDATE_COMPONENTS
- _GO_BACK

*** JavaScriptS Classes
- HtmlJS
- Component

*** Naming Conventions ***
- html tags for components: <mycomponent-tag>
 - ALL lowercase. ALWAYS end with -tag
- pages: <SPECIALp>
 - ALL capitals. ALWAYS end with p

## component.js methods

```javascript
(( c = new Component('example-component-tag') )=>{
  /*
  local component scripting here ...
  */
  c._NEW_ELM()
})()
```
- creates instance of components.js

```javascript
c._ON_SET = (attr)=>{ * javascript }
```

- auto fires page/html.js/componetns.js after starts or changes

```javascript
c._ADD_EVENT(' *event type* ', ' *html id* ', ()=>{
  // script...
}, *bool for updating html.js )
```
Shortcut Functions

```javascript
c.I( *html element id* )
```
calls: I (id) { return this.root.getElementById(id) }

```javascript
c.KV( *click event * )
```
calls: KV (e) { return [ e.path[0].getAttribute('key'), e.path[0].getAttribute('val') ] }
  - returns key and val attributes
