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

var componentsStoredGlobally = []
var polyFillIncluded = false
var hash = window.location.hash.split('#')[1]
var allPages = { hash: window.location.hash.split('#')[1] }

/* () () () () () () () () ()   Page  Handling  () () () () () () () () () () */

document.onreadystatechange = ()=>{
  if (document.readyState === 'complete') {
    let elms = document.querySelectorAll('[pageName]')
    // try and combine some of these loops here. you've got FOUR!
    for (elm of elms) allPages[elm.getAttribute('pageName')] = []
    for (elm of elms) {
      if (elm.querySelector('[pageName]')) {
        for (c of elm.querySelectorAll('[pageName]')) {
          allPages[elm.getAttribute('pageName')].push(c.getAttribute('pageName'))
          allPages[c.getAttribute('pageName')].push(elm.getAttribute('pageName'))
        }
      }
    }
    console.log(allPages)
    for (elm of elms) {
      const name = elm.getAttribute('pageName')
      if (elm.hasAttribute('activePage')) pageSet(elm.tagName, name, true)
    } // ! need to be seperate loops for #overides to properly clean up.
    for (elm of elms) {
      const name = elm.getAttribute('pageName')
      if (name === hash) pageSet(elm.tagName, name, true)
    }
  }
}

pageSet = (group, switchTo, browserEvent)=>{
  if (!browserEvent) {
    hash = switchTo
    window.location.href = window.location.hash.split('#')[0] + '#' + hash
  }

  let pages = document.getElementsByTagName(group)
  for (var i = 0; i < pages.length; i++) { // iOS does not like (i of arr) here... for some reason
     if (switchTo === pages[i].getAttribute('pageName')) {
      pages[i].setAttribute('style', 'display: intial;')
    } else {
      pages[i].setAttribute('style', 'display: none;')
    }
  }
}

window.onhashchange = function() {
  hash = window.location.hash.split('#')[1]
  let page = document.querySelector('[pageName="'+hash+'"')
  console.log(page)
  // you should really just rewrite this whole thing using the page-group object...
  pageSet(page.tagName, hash, true)

  // if (hash) {
  //   pageSet(page.tagName, hash, true)
  // } else {
  //   let elms = document.querySelectorAll('[pageName]')
  //   for (elm of elms) {
  //     const name = elm.getAttribute('pageName')
  //     if (elm.hasAttribute('activePage')) pageSet(elm.tagName, name, true)
  //   } // ! need to be seperate loops for #overides to properly clean up.
  //   for (elm of elms) {
  //     const name = elm.getAttribute('pageName')
  //     if (name === hash) pageSet(elm.tagName, name, true)
  //   }
  // }
}

// initialPageSet = (sets)=>{
//   for (set of sets) {
//     console.log(set, hash)
//     pageSet(set[0], set[1])
//     // should be merged with pageSet
//   }
// }

/* () () () () () () () () ()   polyfill  Handling  () () () () () () () () () () */

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
