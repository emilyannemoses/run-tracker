class Component {

  constructor (componentData) {
    [ this.tag, this.id ] = componentData
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
      let pageStatus = document.createAttribute("pageDirectory")
      pageStatus.value = window.location.hash.split('#')[1]
      this.setAttributeNode(pageStatus)
      for (const e of that.events) {
        let newEvent = clone.getElementById(e.id)
        newEvent.addEventListener(e.type, ()=>{
          const data = this.hasAttribute('serve') ? this.getAttribute('served') : null
          if (data) that.data = JSON.parse(data)
          that.root = this.shadowRoot
          e.method()
          if (e.update) that.update()
        })
      }
      that.root.appendChild(clone)
    }
    proto.attributeChangedCallback = function () {
      that.root = this.shadowRoot
      that.data = JSON.parse(this.getAttribute('served'))
      if (typeof that.onLoad !== 'undefined') that.onLoad()
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

  getDir (Obj, dir) {
    Obj = { 'data': Obj }
    for (const p of dir.split(/[.\[\]]/).filter(Boolean)) Obj = Obj[p]
    return Obj
  }

  update () {
    for (const component of componentsStoredGlobally) {
      const serve = component.getAttribute('serve')
      component.setAttribute('served', JSON.stringify(this.getDir(data, serve)))
    }
  }

  serveDir (that) {
    if (that.hasAttribute('serve')) {
      let served = document.createAttribute('served')
      served.value = JSON.stringify(this.getDir(data, that.getAttribute('serve')))
      that.setAttributeNode(served)
      componentsStoredGlobally.push(that)
    }
  }

  I (id) { return this.root.getElementById(id) }

}

/* () () () () () () () () ()  Global Variables () () () () () () () () () () */

var componentsStoredGlobally = []
var polyFillIncluded = false

/* () () () () () () () () ()   Page  Handling  () () () () () () () () () () */

document.onreadystatechange = ()=>{
  if (document.readyState === 'complete') pageSet(window.location.hash.split('#')[1])
}

pageSet = (dir, hold, hash = '')=>{
  let active = document.querySelectorAll('[activePage]')
  for (page of active) pageDisplay(page.getAttribute('pageName'))
  if (dir) {
    for (page of dir.split('/')) {
      pageDisplay(page)
      hash += '/' + page
    }
    // I don't see hold anywhere...?
    if (!hold) window.location.href = '#' + hash.slice(1)
    updateComponents(hash)
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
  console.log('updateComponents fired.', hash)
}

window.onhashchange = function() { pageSet(window.location.hash.split('#')[1]) }

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
