PNG = require('pngjs').PNG;

class Urf {
	constructor(){
		this.margin = {
			top 	:	0,
    		bottom 	: 	0,
    		left 	: 	0,
    		right 	: 	0
		}
		
    	this.width		= 0
    	this.height		= 0
    	this.greyscale	= true
    	this.dpi		= 300
	}

	Encode(imgData, config, callback){

        for(var prob in config.margin){
        	if(this.margin.hasOwnProperty(prob)){
        		this.margin[prob] = config.margin[prob]
        	} 
        }

        var width = config.width
        var height = config.height

        var bytesPerPixel = imgData.length / (config.width*config.height)

        var blob = [];
        blob.push(new Buffer("554e495241535400", "hex")); // UNIRAST
        blob.push(new Buffer("00000001", "hex"));   // Some Header
              // 

        var greyscale = false
        if(config.greyScale || bytesPerPixel <= 2){
            greyscale = true
            blob.push(new Buffer("08", "hex"));
            blob.push(new Buffer("00", "hex"));               
        } else {
            blob.push(new Buffer("18", "hex"));
            blob.push(new Buffer("01", "hex")); 
        }


        blob.push(new Buffer("00", "hex"));               //DUPLEX_MODE
        blob.push(new Buffer("04", "hex"));               //QUALITY
        blob.push(new Buffer("0000000100000000", "hex")); //UNKNOWN
        
        
            
        var widthBlob = new Buffer(4);
        widthBlob.writeUIntBE((width+this.margin.left+this.margin.right), 0, 4); 
        blob.push(widthBlob);                            
  
        var heightBlob = new Buffer(4);
        heightBlob.writeUIntBE((height+this.margin.top+this.margin.bottom), 0, 4);
        blob.push(heightBlob); 

        var dpi = new Buffer(4)                                
        if(config.dpi){
            dpi.writeUIntBE(config.dpi,0,4)
        } else {
            dpi.writeUIntBE(300,0,4)
        }
        blob.push(dpi)

        blob.push(new Buffer("0000000000000000", "hex"));   //Seems neccessary

        writeEmptyLines(this.margin.top)
        
        for (var y = 0; y < height; y++) {


            blob.push(new Buffer("00", "hex"));             //line repeat code
            
            writeEmptyPixel(this.margin.left)

            for (var x = 0; x < width; x++) {

                var index = Math.floor((width * y + x) * bytesPerPixel);


                blob.push(new Buffer("00", "hex"));         //PackBits code

                //Grauwert = 0,299 × Rotanteil + 0,587 × Grünanteil + 0,114 × Blauanteil
                if(greyscale){
                    var pixel = new Buffer(1)
                    

                    var greyValue = imgData[index]

                    if(bytesPerPixel > 2) {
                        greyValue = 0.299*greyValue+0.587*imgData[index+1]+0.114*imgData[index+2]
                    }
                    if(bytesPerPixel == 2 || bytesPerPixel == 4){
                        greyValue = greyValue*imgData[index+3]/255 + 255-imgData[index+3]
                    }                    
                    pixel.writeUIntBE(greyValue, 0, 1);
                    blob.push(pixel)

                } else{
                    for(var i = 0; i<3; i++){
                        
                        var pixel = new Buffer(1)
                        var colorValue = imgData[index+i]

                        if(bytesPerPixel==4){
                            colorValue = colorValue*(imgData[index+3])/255 + ((255-imgData[index+3]))
                        }
                        

                        pixel.writeUIntBE(colorValue, 0, 1);
                        
                        blob.push(pixel); 
                    } 
                }
                
                   
                
            }
            writeEmptyPixel(this.margin.right)
        }
        writeEmptyLines(this.margin.bottom)
        

        function writeEmptyLines(count){
            while(count){
                if(count >256){
                    blob.push(new Buffer("ff80", "hex"));
                    count-= 256
                } else {
                    var last = new Buffer(1)
                    last.writeUIntBE(count-1, 0, 1)
                    blob.push(last); 
                    blob.push(new Buffer("80", "hex"));
                    count = 0
                }
            }
        }

        function writeEmptyPixel(count) {
            while (count){
                if(count >128){
                    blob.push(new Buffer("7f", "hex"));
                    count-= 128
                } else {
                    var last = new Buffer(1)
                    last.writeUIntBE(count-1, 0, 1)
                    blob.push(last); 
                    count = 0
                }
                blob.push(new Buffer("ff", "hex"));
                if(!greyscale){
                    blob.push(new Buffer("ffff", "hex"));
                }
            }
        }
        callback(Buffer.concat(blob))
	}



	Decode(buf, callback){

	    function copySinglePixel(pixel, x,y){
	        var idx = (config.width * y + x) << 2;
	        if(pixel.length == 1){
	            newfile.data[idx] = pixel[0];
	            newfile.data[idx + 1] = pixel[0];;
	            newfile.data[idx + 2] = pixel[0];;
	            newfile.data[idx + 3] = 0xff;
	        } else{
	            newfile.data[idx] = pixel[0];
	            newfile.data[idx + 1] = pixel[1];
	            newfile.data[idx + 2] = pixel[2];
	            newfile.data[idx + 3] = 0xff;
	        }
	    }
	    
	    function fillRestOfLineempty(){
	        var idx = (config.width * y + x) << 2;
	        for(var i = x; i < config.width; i++){
	            copySinglePixel([0xff],i,y)
	        }
	        x = config.width
	    }
	    
	    function copySinglePixelRepeatedly(){
	        var pixel = []
	        for(var col = 0; col <config.colorValues;col++){
	            pixel.push(buf.readUInt8(k++))
	        }
	        for(var l = 0; l<= code;l++){
	            copySinglePixel(pixel, x,y)
	            x++
	        }
	    }
	    
	    function copyMultiplePixels(){
	        for(var pix = 0; pix <= code*(-1); pix++){
	            var pixel = []
	            for(var col = 0; col <config.colorValues;col++){
	                pixel.push(buf.readUInt8(k++))
	            }
	            copySinglePixel(pixel, x,y)
	            x++
	        }
	    }
	    function checkEndOfLine(){
	        if(x >= config.width) { 
	            x=0
	            y++
	            return true
	        } else {
	            return false
	        }
	    }
	    
	    let config = {
	        bitPerPixel:    buf.readUInt8(12),
	        colorValues:    buf.readUInt8(13)==0 ? 1:3,
	        width:          buf.readUInt32BE(24),
	        height:         buf.readUInt32BE(28),
	        duplex:         buf.readUInt8(14),
	        quality:        buf.readUInt8(15),
	        dpi:            buf.readUInt32BE(32)
	    }
	    
	    var newfile = new PNG({'width':config.width,'height':config.height});
	    
	    var x = 0
	    var y = 0
	    var k = 44 // firstDataByte
	    
	    while(k<buf.length-1){
	        
	        var lineRepeatNumber = buf.readUInt8(k++)
	        var LineToRepeat = k
	        var endOfLine = false

	        for(var lr = 0; lr <= lineRepeatNumber; lr++){
	            
	            k = LineToRepeat
	            endOfLine = false
	            
	            while(!endOfLine){
	                
	                var code = Number(buf.readInt8(k++))
	                
	                if(code == -128){
	                    fillRestOfLineempty()
	                } else if(code >= 0){
	                    copySinglePixelRepeatedly()
	                } else if(code < 0){
	                    copyMultiplePixels()
	                }
	                endOfLine = checkEndOfLine()
	            }
	            
	        }
	    }

		callback(newfile)	    
	}




}


module.exports = Urf