var oldHash = window.location.hash.split('#')[1]

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
