class Component {

  constructor (componentData) {
    [ this.tag, this.id ] = componentData
    this.events = []
    this.owner = document.currentScript.ownerDocument
  }

  newElm (that = this) {
    let proto = Object.create(HTMLElement.prototype)
    const importDoc = that.owner
    // const importDoc = document.currentScript.ownerDocument
    const template = importDoc.querySelector(that.id)
    proto.createdCallback = function () {
      const root = this.attachShadow({ mode: 'open' })
      let clone = document.importNode(template.content, true)
      that.serveDir(this)
      for (const e of that.events) {
        let newEvent = clone.getElementById(e.id)
        newEvent.addEventListener(e.type, ()=>{
          [ that.root, that.data ] = [ root, JSON.parse(this.getAttribute('served')) ]
          e.method()
          if (e.update) that.update()
        })
      }
      console.log('Created: ',clone)
      root.appendChild(clone)
    }
    proto.attributeChangedCallback = function () {
      that.root = this.shadowRoot
      that.data = JSON.parse(this.getAttribute('served'))
      if (typeof that.onLoad !== 'undefined') that.onLoad()
      console.log('--- Changed: ', that.root)
    }
    if (!polyFillIncluded) {
      document.registerElement(that.tag, {prototype: proto})
    } else {
      window.addEventListener('WebComponentsReady', function(e) {
        document.registerElement(that.tag, {prototype: proto})
      })
    }
    // return [ this.root, this.data ]
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
}

var componentsStoredGlobally = []
var polyFillIncluded = false

;(()=>{
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
