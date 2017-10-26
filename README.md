imageurf
========

Encode or Decode urf data to build a AirPrint server or send pictures to AirPrint compatible printers.

Installation
===============
```
$ npm install imageurf  --save
```

Example
==========
```js
PNG = require('pngjs').PNG;

var Urf = require('./urf.js')
var urf = new Urf()

var picture = [255 255 255 0 0 0 255 255 255 ] //RGB or greyscale pixel-array

var config = {
	width: 3, 				// width of picture
	height: 3, 				//height of picture
	greyScale: true, 		//Convert to greyscale, optional
	margin: {
		top: 100,
		left: 100
	}
}

urf.Encode(data, config, function(buffer){

	urf.Decode(buffer, function(png){ //giving back an new PNG (see pngjs)
		png.pack()
		.pipe(fs.createWriteStream('newfile.png'))
		.on('finish', function() {
			console.log("Written to disk")
		});
	})
})
```

Changelog
============


### 0.1.0 - 26/10/2017
  - Initial, Encode function needs some optimization

Thanks
=======
Alan Quatermain for reverse engineering the urf image format 
https://github.com/AlanQuatermain/unirast

License
=========

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.