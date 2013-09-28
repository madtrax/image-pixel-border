 function ImgPixelBorder(callback) {
	
	var self 	= this;
	var arrC 	= [];
	var color	= null;
	var cb		= callback;
	var padding	= 5;

	self.getImageColor = function(img, padding) {
		padding = padding;
		loadImage(img);
	};
	
	var loadImage = function(img) {
		var canvas 	= $('<canvas />');
		var ctx2d	= canvas.get(0).getContext('2d');
		
		if (img.get(0).complete) {
			drawImage(img.get(0), canvas, ctx2d);			
		} else {
			$(img).on('load', function() {
				drawImage(this, canvas, ctx2d);
			});
		}
	};
	
	var drawImage = function(img, canvas, ctx2d) {
		var imgw = $(img).width();
		var imgh = $(img).height();
		
		canvas.attr('width', imgw).attr('height', imgh);
		ctx2d.drawImage(img, 0, 0, imgw, imgh);
		
		extractColor(ctx2d, imgw, imgh);
	};
	
	var extractColor = function(ctx2d, w, h) {
		
		readCanvasBorder(ctx2d, [0, 0, w, padding]); // Top
		readCanvasBorder(ctx2d, [0, h - padding, w, padding]); // Bottom
		
		readCanvasBorder(ctx2d, [w - padding, 0, padding, h]); // Right
		readCanvasBorder(ctx2d, [0, 0, padding, h]); // Left
		
		if (cb != undefined) {
			var cArr = color.split(',');
			var hexC = "#" + compToHex(cArr[0]) + compToHex(cArr[1]) + compToHex(cArr[2]);
			
			cb.call(this, hexC);
		}
	};
	
	var readCanvasBorder = function(ctx2d, pos) {
		var ctxd = ctx2d.getImageData(pos[0], pos[1], pos[2], pos[3]);
		var data = ctxd.data;
		
		var mxCol = "";
		var mxIdx = 0;
		var stepc = 1;
		
		for (var i = 0, n = data.length; i < n; i += 4) {
			var c = (data[i]) + "," + (data[i+1]) + "," + (data[i+2]);
			
			if (arrC[c] != null) {
				arrC[c] += (arrC[c] + stepc);
				if (arrC[c] > mxIdx) {
					mxIdx = arrC[c];
					color = c;
				}
					
			} else {
				arrC[c] = stepc;
			}
			
		}	
	};
	
	var compToHex = function(c) {
	    var hex = parseInt(c).toString(16);
	    return (hex.length == 1 ? "0" + hex : hex);
	};
}

$.fn.getPixelColor = function(callback, pading) { 
	var ipb = new ImgPixelBorder(function(color) {
		callback.call(document, color);
	}).getImageColor(this, padding);
};

