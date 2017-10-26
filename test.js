PNG = require('pngjs').PNG;
var fs = require('fs')

var Urf = require('imageurf')
var urf = new Urf()

var picture = [255, 255, 255, 0, 0, 0, 255, 255, 255 ] //RGB or greyscale pixel-array

var config = {
	width: 3, 				// width of picture
	height: 3, 				//height of picture
	greyScale: true, 		//Convert to greyscale, optional
	margin: {
		top: 5,
		bottom: 5,
		left: 5,
		right: 5
	}
}

urf.Encode(picture, config, function(buffer){

	urf.Decode(buffer, function(png){ //giving back an new PNG (see pngjs)
		png.pack()
		.pipe(fs.createWriteStream('newfile.png'))
		.on('finish', function() {
			console.log("Written to disk")
		});
	})
})