let w = 20, h = 100;
let y_ai1, y_ai2;

let r;
let x_ball;
let y_ball;

let speed = 25;
let x_vel;
let y_vel;

let streak = 0;
let high_streak = 0;

let slider;

let train_input, train_output;
let train_inputs_x = [];
let train_inputs_y = [];
let train_outputs = [];


function setup(){
	let canvas = createCanvas(600, 600);
	canvas.parent('canvascontainer');

	slider = select("#soe-slider");

	background(51);
	y = height/2;
	y_ai1 = height / 2;
	y_ai2 = height / 2;

	r = 16;
	x_ball = width/2;
	y_ball = height/2;

	x_vel = speed*random([1, -1]);
	y_vel = random(-5, 5) + random([1, -1]);

	ai1 = new NeuralNetwork(1, 1, 1);
	ai2 = new NeuralNetwork(2, 3, 1);

	train_input = new Matrix(2, 1);
	train_output = new Matrix(1, 1);

	document.getElementById('high-streak').innerHTML = high_streak;
	document.getElementById('current-streak').innerHTML = streak;
}

function draw(){
	let prediction2;

	
	for (let i = 0; i < slider.value(); i++){

		train_inputs_y.push(map(y_ball, 0, height, 0, 1));
		train_inputs_x.push(map(x_ball, 0, width, 0, 1));
		train_outputs.push(map(y_ball, 0, height, 0, 1));

		for (let i = 0; i < train_inputs_x.length; i++){
			train_input.array = [[train_inputs_y[i]], [train_inputs_x[i]]];
			train_output.array = [[train_outputs[i]]];
			for (let j = 0; j < 1; j++)
				ai2.train(train_input, train_output);
		}

		train_inputs_y = [];
		train_inputs_x = [];
		train_outputs = [];


		update();
		ballPhysics();

		let input1 = [map(y_ball, 0, height, 0, 1)]
		let input2 = [map(x_ball, 0, width, 0, 1)]
		let inputs = new Matrix(2, 1);
		inputs.array = [input1, input2];
		prediction2 = map(ai2.predict(inputs)[0][0], 0, 1, 0, height);
		y_ai2 = prediction2;


		x_ball += x_vel;
		y_ball += y_vel;

	}
	


	clear();
	background(51);
	ellipse(x_ball, y_ball, r, r);


	rect(0, y_ai1 - h/2, w, h);
	fill(256);

	rect(width - w, y_ai2 - h/2, w, h);
	fill(256);
}

function update(){
	// if (mouseY < 0 + h/2)
	// 	y_ai1 = 0 + h/2;
	// else if (mouseY + h/2 > height)
	// 	y_ai1 = height  -  h/2;
	// else
	// 	y_ai1 = mouseY;

	y_ai1 = y_ball;
}

function ballPhysics(){
	if (x_ball - r - w <= 0 && y_ball > y_ai1 - h/2 && y_ball < y_ai1 + h/2){
		x_vel *= -1;
		y_vel *= random([1, -1]);
	}

	if (x_ball + r - width + w >= 0 && y_ball > y_ai2 - h/2 && y_ball < y_ai2 + h/2){
		x_vel *= -1;
		streak ++;
		document.getElementById('current-streak').innerHTML = streak;
		if (streak > high_streak)
			document.getElementById('high-streak').innerHTML = streak;
	}

	if (y_ball - r <= 0 || y_ball + r - height >= 0)
		y_vel *= -1;

	if (x_ball - r <= 0 || x_ball + r - height >= 0)
		reset();
}

function reset(){
	x_ball = width/2;
	y_ball = height/2;
	x_vel = speed*random([1, -1])
	y_vel = 4*random([-1, 1]);

	if (streak > high_streak){
		high_streak = streak;
		document.getElementById('high-streak').innerHTML = high_streak;
	}

	streak = 0;

	document.getElementById('current-streak').innerHTML = streak;
}
