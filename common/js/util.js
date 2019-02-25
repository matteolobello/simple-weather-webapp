function makeHttpRequest(url) {
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function makeHttpRequestAsync(url, onResult) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        switch (xmlhttp.readyState) {
          case 0 : // UNINITIALIZED
          case 1 : // LOADING
          case 2 : // LOADED
          case 3 : // INTERACTIVE
          break;
          case 4 : // COMPLETED
          onResult(xmlhttp.responseText);
          break;
          default: alert("error");
       }
    };
    xmlhttp.open("GET", url ,true);
    xmlhttp.send(null);
}

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

function addZeroIfNeeded(a) {
	a += "";

	if (a.length == 1) {
		return "0" + a;
	}

	return a;
}

function kelvinToCelsius(k) {
    return new Number(parseFloat(k) - 273.15).toFixed(0)
}

/**
 * Fade in/out an element
 * Note: I am not using requestAnimationFrame as it does not play well in mobile browsers
 *
 * @param {Object}   [options={}]                An object with options.
 * @param {Element}  [options.el]                The Element object.
 * @param {String}   [options.type='in']         The fade type: 'in' or 'out'.
 * @param {Integer}  [options.duration=400]      The duration of the animation in miliseconds.
 * @param {String}   [options.display='block']   The display property of the element when fade in starts.
 * @param {Boolean}  [options.empty=false]       Set to true if you need to empty the element after fade out.
 */
function fade(options) {
  options = Object.assign({
    type:'in',
    duration: 400,
    display: 'flex'
  }, options)

  var isIn = options.type === 'in',
    opacity = isIn ? 0 : 1,
    interval = 50,
    gap = interval / options.duration

  if(isIn) {
    options.el.style.display = options.display
    options.el.style.opacity = opacity
  }

  var fading = window.setInterval(function() {
    opacity = isIn ? opacity + gap : opacity - gap
    options.el.style.opacity = opacity

    if(opacity <= 0) options.el.style.display = 'none'
    if(opacity <= 0 || opacity >= 1) {
      if(fading) window.clearInterval(fading)
      if(options.empty) options.el.textContent = ''
    }
  }, interval)
}