var masterUri = 'https://api.myjson.com/bins/6lj7d';

getMyJson = function(uri, callback, i){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			json = JSON.stringify(xhr.responseText);
			callback(JSON.parse(xhr.responseText), uri, i);
		}
	}
	xhr.open('GET', uri, true);
	xhr.send(null);
}

apiCallback = function(data, uri){
	_DATA = data
	_DATA.runs = []
	for (var i = 0; i < _DATA.paths.length; i++) {
		getMyJson(_DATA.paths[i], apiPathCallback, i)
	}
}

apiPathCallback = function(data, uri, i){
	_DATA.runs.push(data)
	if (i === _DATA.paths.length -1) {
		updateComponents();
	}
	//console.log('uri: ',uri)
	//console.log('data: ',data)
}

getDir = (Obj, jVar, shell = {})=>{
  if (jVar.split(/[\.\[\]\"]/)) {
    shell[jVar.split(/[\.\[\]\"]/)[0]] = Obj
    for (const p of jVar.split(/[\.\[\]\"]/).filter(Boolean)) {
      shell = Obj[p]
    }
  }
  return Obj = shell ? shell : Obj
}

getMyJson(masterUri, apiCallback)

updateComponents = function(){
	for (const component of _COMPONENTS_STORED_GLOBALLY) {
		if (component.hasAttribute('serve')) {
			const serve = component.getAttribute('serve')
			component.setAttribute('served', JSON.stringify(getDir(_DATA, serve)))
		}
	}
}
