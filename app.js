var canvas = document.getElementById("board");
var context = canvas.getContext("2d");
var source = document.getElementById("img");

var width = 400, height = 400;
canvas.width = width;
canvas.height = height;

context.fillStyle = "black";

context.drawImage(source, 0, 0, width, height);

var data = context.getImageData(0, 0, width, height).data;

var select = function(i) {
    var r = data[i];
    var g = data[i+1];
    var b = data[i+2];
    var a = data[i+3];

  	return (r + g + b) / 3 < 230;
};

var imagePoints = [];
var process = function() {
  for(var i = 0; i < data.length; i+=4) {
    if(select(i))
      	imagePoints.push(1);
  	else
  		imagePoints.push(0);
  }
};

process();

var rect = function(y, x, color) {
	this.x = x;
	this.y = y;
	this.finish = false;
	this.width = 1;
	this.height = 1;
	this.color = color;

	this.maxHeight = 5;
	this.maxWidth = 5;

	this.update = function() {
		if(this.finish) return;

		if(this.width >= this.maxWidth || this.height >= this.maxHeight) {
			this.finish = true;
			return;
		}

		var flag_left_right = true;
		for(var i = this.y - this.height; i < this.y + this.height + 1; i++) {
			if(i < 0 || i > height) {
				flag_left_right = false;
				break;
			}

			var left_point = i * width + (this.x - this.width - 1 );
			var right_point = i * width + (this.x + this.width + 1 );

			if(!imagePoints[left_point] || !imagePoints[right_point]) {
				flag_left_right = false;
				break;
			}
		}

		if(flag_left_right) {
			for(var i = this.y - this.height; i < this.y + this.height + 1; i++) {
				var left_point = i * width + (this.x - this.width - 1 );
				var right_point = i * width + (this.x + this.width + 1 );

				imagePoints[left_point] = 0;
				imagePoints[right_point] = 0;
			}

			this.width++;
		}

		var flag_top_bottom = true;
		for(var i = this.x - this.width; i < this.x + this.width + 1; i++) {
			if(i < 0 || i > width) {
				flag_top_bottom = false;
				break;
			}

			var top_point = (this.y - this.height - 1) * width + i;
			var bottom_point = (this.y + this.height + 1) * width + i;

			if(!imagePoints[top_point] || !imagePoints[bottom_point]) {
				flag_top_bottom = false;
				break;
			}
		}

		if(flag_top_bottom) {
			for(var i = this.x - this.width; i < this.x + this.width + 1; i++) {
				var top_point = (this.y - this.height - 1) * width + i;
				var bottom_point = (this.y + this.height + 1) * width + i;

				imagePoints[top_point] = 0;
				imagePoints[bottom_point] = 0;
			}

			this.height++;
		}

		if(!flag_top_bottom && !flag_left_right)
			this.finish = true;
	};

	this.draw = function() {
		var avg = {r: 0, g: 0, b: 0};

		var c = 0;
		for(var j = this.y - this.height; j <= this.y + this.height; j++) {
			for(var i = this.x - this.width; i  <= this.x + this.width; i++) {
				var p = j * width + i;

				avg.r += data[p*4];
				avg.g += data[p*4 + 1];
				avg.b += data[p*4 + 2];

				c++;
			}
		}

		var color = "rgb(" + Math.floor(avg.r / c) + "," + Math.floor(avg.g / c) + "," + Math.floor(avg.b / c) + ")";
		
		context.fillStyle = color;
		context.fillRect(this.x - this.width, this.y - this.height, this.width*2, this.height*2);
	};
};

var points = [];

var draw = function() {
	requestAnimationFrame(draw);
	context.clearRect(0, 0, width, height);
	/*context.globalAlpha = 0.2;
	context.drawImage(source, 0, 0, width, height);
	context.globalAlpha = 1;*/

	for(var i = 0; i < 10; i++) {
		var randomPoint = Math.floor(Math.random() * (imagePoints.length-1));
		if(imagePoints[randomPoint]) {
			var color = "rgb(" + data[randomPoint*4] + "," + data[randomPoint*4+1] + "," + data[randomPoint*4+2] + ")";
			points.push(new rect(Math.floor(randomPoint / width), randomPoint % width, color ));
		}
	}

	for(var i = 0; i < points.length; i++) {
		if(Math.random() > 0.5)
			points[i].update();
		points[i].draw();
	}

	/*setTimeout(draw, 1000/10);*/
}

draw();



