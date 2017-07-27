class Component {

  constructor (name) {
    this.tag = name
    this.id = '#' + name.split('-').splice(0,name.split('-').length-1).join('-')
    this.events = []
  }

  newElm (that = this) {
    let proto = Object.create(HTMLElement.prototype)
    const importDoc = document.currentScript.ownerDocument
    const template = importDoc.querySelector(that.id)
    proto.createdCallback = function () {
      that.root = this.attachShadow({ mode: 'open' })
      let clone = document.importNode(template.content, true)
      that.serveDir(this)
      that.htmlJS = new htmlJS
      for (const e of that.events) {
        let newEvent = clone.getElementById(e.id)
        newEvent.addEventListener(e.type, ()=>{
          const cdata = this.hasAttribute('serve') ? this.getAttribute('served') : null
          if (cdata) that.data = JSON.parse(cdata)
          that.root = this.shadowRoot
          e.method()
          if (e.update) that.update()
        })
      }
      that.root.appendChild(clone)
    }
    proto.attributeChangedCallback = function (attrName, oldVal, newVal) {
      that.root = this.shadowRoot
      // if (!this.htmlJS) this.htmlJS = new htmlJS

      if (attrName === 'served') {
        that.data = JSON.parse(this.getAttribute('served'))
        if (that.onAttributeSetOrChange) {
          that.onAttributeSetOrChange(attrName)
          // that.htmlJS.update(that.data, that.root)
          // ;(( h = new htmlJS )=>{ h.update(that.data, that.root) })()
        }
        that.htmlJS.update(that.data, that.root)


      } else if (attrName === 'directory' && that.onAttributeSetOrChange) {
        that.directory = this.getAttribute('directory')
        that.data = JSON.parse(this.getAttribute('served'))
        that.onAttributeSetOrChange(attrName)
        // ;(( h = new htmlJS )=>{ h.update(that.data, that.root) })()
        // that.htmlJS.update(that.data, that.root)
      }
      // ;(( h = new htmlJS )=>{ h.update(that.data, that.root) })()
      // console.log('---', that.data)
      // that.htmlJS.update(JSON.parse(this.getAttribute('served')), that.root)

    }
    if (!polyFillIncluded) {
      document.registerElement(that.tag, {prototype: proto})
    } else {
      window.addEventListener('WebComponentsReady', (e)=>{
        document.registerElement(that.tag, {prototype: proto})
      })
    }
  }

  addEvent (type, id, method, update) {
    this.events.push( {'type': type, 'method': method, 'id': id, 'update': update} )
  }

  getDir (obj, dir, mDir = dir.split(' '), oObj = { 'data': obj }, mObj = []) {
    if (mDir.length > 1) {
      for (const i in mDir) {
        for (const p of mDir[i].split(/[.\[\]]/).filter(Boolean)) oObj = oObj[p]
        mObj.push(oObj)
        oObj = { 'data': obj }
      }
      oObj = mObj
    } else {
      if (dir) for (const p of dir.split(/[.\[\]]/).filter(Boolean)) oObj = oObj[p]
    }
    return oObj
  }

  update () {
    for (const component of componentsStoredGlobally) {
      if (component.hasAttribute('serve')) {
        const serve = component.getAttribute('serve')
        component.setAttribute('served', JSON.stringify(this.getDir(data, serve)))
      }
    }
  }

  serveDir (that) {
    if (that.hasAttribute('serve')) {
      let served = document.createAttribute('served')
      served.value = JSON.stringify(this.getDir(data, that.getAttribute('serve')))
      that.setAttributeNode(served)
    }
    let pageStatus = document.createAttribute('directory')
    pageStatus.value = window.location.hash.split('#')[1]
    that.setAttributeNode(pageStatus)
    componentsStoredGlobally.push(that)

  }

  I (id) { return this.root.getElementById(id) }

}

/* () () () () () () () () ()  Global Variables () () () () () () () () () () */

var componentsStoredGlobally = []
var polyFillIncluded = false
var oldHash = window.location.hash.split('#')[1]

/* () () () () () () () () ()   Page  Handling  () () () () () () () () () () */

document.onreadystatechange = ()=>{
  if (document.readyState === 'complete') {
    pageSet(window.location.hash.split('#')[1], true)
  }
}

pageSet = (dir, initial, hash = '')=>{
  event.preventDefault()
  let active = document.querySelectorAll('[activePage]')
  for (page of active) pageDisplay(page.getAttribute('pageName'))
  if (dir) {
    for (page of dir.split('/')) {
      pageDisplay(page)
      hash += '/' + page
    }
    oldHash = hash.slice(1)
    window.location.href = '#' + hash.slice(1)
    if (!initial) updateComponents(hash)
  }
}

pageDisplay = (page)=>{
  pageGroup = document.querySelector("[pageName='"+page+"']")
  pages = document.getElementsByTagName(pageGroup.tagName)
  for (var i = 0; i < pages.length; i++) { // iOS does not like (i of arr) here... for some reason
     if (page === pages[i].getAttribute('pageName')) {
      pages[i].setAttribute('style', 'display: intial;')
    } else {
      pages[i].setAttribute('style', 'display: none;')
    }
  }
}

updateComponents = (hash)=>{
  for (const component of componentsStoredGlobally) {
    component.setAttribute('directory', hash)
  }
}

window.onhashchange = function() {
  const hash = window.location.hash.split('#')[1]
  if (oldHash !== hash) pageSet(hash)
}

goBack = ()=>{ window.history.back() }

/* () () () () () () () () ()   polyfill  Handling  () () () () () () () () () () */

(()=>{
  if ('registerElement' in document
      && 'import' in document.createElement('link')
      && 'content' in document.createElement('template')) {
    console.log('No Polyfill needed for this browser')
  } else {
    console.log('*** Webcomponents Polyfill needed for this browser ***')
    polyFillIncluded = true
    var e = document.createElement('script');
    e.src = 'bower_components/webcomponentsjs/webcomponents-lite.js';
    document.getElementsByTagName('head')[0].appendChild(e);
    var e2 = document.createElement('script');
    e2.src = 'bower_components/document-register-element/build/document-register-element.js';
    document.getElementsByTagName('head')[0].appendChild(e2);
  }
})()
