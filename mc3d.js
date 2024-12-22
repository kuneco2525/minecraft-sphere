const cvIds = ['blocks', 'coord', 'sphere', 'point', 'cursor'], canvas = [], ctx = [],
	c01 = 'Turquoise',// excluding boundaries
	c02 = 'Gold',// include block x-z center
	c03 = 'Salmon',// includeing boundaries
	c10 = 'rgba(0,0,0,0.1)',// grid
	c11 = 'rgba(0,0,0,0.3)',// chunk grid
	c20 = 'rgba(0,0,0,0.3)',// outer sphere
	c21 = 'black',// current sphere
	c30 = 'black',// position inside of sphere
	c31 = 'red',// position outside of sphere
	c40 = 'black',// cursor
	c41 = 'red',// cursor outside of sphere
	diameter = document.getElementById('diameter'),
	r7 = document.getElementById('end'),
	radius = document.getElementById('radius'),
	rG = document.getElementById('radiusOfGyration'),
	dist = document.getElementById('dist'),
	circumference = document.getElementById('circumference'),
	area = document.getElementById('area'),
	surface = document.getElementById('surface'),
	volume = document.getElementById('volume'),
	oX = document.getElementById('ox'), oY = document.getElementById('oy'), oZ = document.getElementById('oz'),
	rX = document.getElementById('rx'), rY = document.getElementById('ry'), rZ = document.getElementById('rz'),
	aX = document.getElementById('ax'), aY = document.getElementById('ay'), aZ = document.getElementById('az'),
	mX = document.getElementById('mx'), mZ = document.getElementById('mz'),
	range = document.getElementById('range'), scale = document.getElementById('scale');

let ww = window.innerWidth, wh = window.innerHeight,
	r = diameter.value / 2, rg = r,
	rp = r7.value * 1, m = Math.max(scale.value * 1, 1),
	ox = oX.value * 1, oy = oY.value * 1, oz = oZ.value * 1,
	rx = rX.value * 1, ry = rY.value * 1, rz = rZ.value * 1,
	d = Math.sqrt(Math.pow(rx, 2) + Math.pow(ry, 2) + Math.pow(rz, 2)),
	mx = mX.value * 1, mz = mZ.value * 1,
	xc = ww / 2 - m * mx, zc = wh / 2 - m * mz,
	x0 = xc - m * ox, z0 = zc - m * oz,
	xl = Math.ceil(ox - ww / 2 / m + mx), xr = Math.floor(ox + ww / 2 / m + mx),
	zt = Math.ceil(oz - wh / 2 / m + mz), zb = Math.floor(oz + wh / 2 / m + mz),
	px = 0, py = 0;

function drawBlocks() {
	ctx[0].clearRect(0, 0, ww, wh);
	switch(range.value * 1) {
		case 1:
			ctx[0].fillStyle = c01;
			for(let x = xl; x < xr; ++x) {
				const xi = x0 + m * x, qx = x < ox ? 0 : 1;
				for(let z = zt; z < zb; ++z) { if(Math.sqrt(Math.pow(x + qx - ox, 2) + Math.pow(z + (z < oz ? 0 : 1) - oz, 2)) <= rg) { ctx[0].fillRect(xi, z0 + m * z, m, m); } }
			}
			break;
		case 2:
			ctx[0].fillStyle = c02;
			for(let x = xl; x < xr; ++x) {
				const xi = x0 + m * x;
				for(let z = zt; z < zb; ++z) { if(Math.sqrt(Math.pow(x + 0.5 - ox, 2) + Math.pow(z + 0.5 - oz, 2)) <= rg) { ctx[0].fillRect(xi, z0 + m * z, m, m); } }
			}
			break;
		case 3:
			ctx[0].fillStyle = c03;
			for(let x = xl; x < xr; ++x) {
				const xi = x0 + m * x, qx = x < ox ? 1 : 0;
				for(let z = zt; z < zb; ++z) { if(Math.sqrt(Math.pow(x + qx - ox, 2) + Math.pow(z + (z < oz ? 1 : 0) - oz, 2)) < rg) { ctx[0].fillRect(xi, z0 + m * z, m, m); } }
			}
	}
}

function drawCoord() {
	ctx[1].clearRect(0, 0, ww, wh);
	for(let x = xl; x <= xr; ++x) {
		const xi = x0 + m * x, chunk = x % 16;
		ctx[1].strokeStyle = chunk ? c10 : c11;
		ctx[1].beginPath();
		ctx[1].moveTo(xi, 0);
		ctx[1].lineTo(xi, wh);
		ctx[1].stroke();
		if(!chunk) { ctx[1].fillText(x, xi - 9, wh / 2); }
	}
	for(let z = zt; z <= zb; ++z) {
		const zi = z0 + m * z, chunk = z % 16;
		ctx[1].strokeStyle = chunk ? c10 : c11;
		ctx[1].beginPath();
		ctx[1].moveTo(0, zi);
		ctx[1].lineTo(ww, zi);
		ctx[1].stroke();
		if(!chunk) { ctx[1].fillText(z, ww / 2 - 9, zi + 4); }
	}
}

function drawSphere() {
	ctx[2].clearRect(0, 0, ww, wh);
	ctx[2].strokeStyle = c20;
	ctx[2].beginPath();
	ctx[2].arc(xc, zc, m * r, 0, 2 * Math.PI, true);
	ctx[2].stroke();
	ctx[2].strokeStyle = c21;
	ctx[2].beginPath();
	ctx[2].arc(xc, zc, m * rg, 0, 2 * Math.PI, true);
	ctx[2].stroke();
}

function drawPoint() {
	ctx[3].clearRect(0, 0, ww, wh);
	ctx[3].fillStyle = d > r ? c31 : c30;
	ctx[3].beginPath();
	ctx[3].arc(xc + m * rx, zc + m * rz, 1, 0, 2 * Math.PI, true);
	ctx[3].fill();
}

function drawCursor() {
	const x = ox + (px - xc) / m, z = oz + (py - zc) / m, dp = Math.sqrt(Math.pow(x - ox, 2) + Math.pow(ry, 2) + Math.pow(z - oz, 2));
	ctx[4].clearRect(0, 0, ww, wh);
	ctx[4].fillStyle = dp > r ? c41 : c40;
	ctx[4].beginPath();
	ctx[4].arc(px, py, 1, 0, 2 * Math.PI, true);
	ctx[4].fill();
	ctx[4].fillText(x + ', ' + z, px, py);
}

function draw() {
	drawBlocks();
	drawCoord();
	drawSphere();
	drawPoint();
}

function calc() {
	r = diameter.value / 2;
	rg = Math.abs(ry) < r ? Math.cos(Math.asin(ry / r)) * r : 0;
	radius.textContent = r;
	rG.textContent = rg;
	circumference.textContent = 2 * Math.PI * r;
	area.textContent = Math.PI * Math.pow(r, 2);
	surface.textContent = 4 * Math.PI * Math.pow(r, 2);
	volume.textContent = 4/3 * Math.PI * Math.pow(r, 3);
	draw();
}

for(let i = 0; i < cvIds.length; ++i) {
	canvas[i] = document.getElementById(cvIds[i]);
	canvas[i].width = ww;
	canvas[i].height = wh;
	ctx[i] = canvas[i].getContext('2d');
}
dist.textContent = d;
aX.textContent = ox + rx;
aY.textContent = oy + ry;
aZ.textContent = oz + rz;
calc();
window.addEventListener('resize', () => {
	ww = window.innerWidth;
	wh = window.innerHeight;
	xc = ww / 2 - m * mx;
	zc = wh / 2 - m * mz;
	x0 = xc - m * ox;
	z0 = zc - m * oz;
	xl = Math.ceil(ox - ww / 2 / m + mx);
	xr = Math.floor(ox + ww / 2 / m + mx);
	zt = Math.ceil(oz - wh / 2 / m + mz);
	zb = Math.floor(oz + wh / 2 / m + mz);
	for(const cv of canvas) {
		cv.width = ww;
		cv.height = wh;
	}
	draw();
});
window.addEventListener('mousemove', e => {
	px = e.x;
	py = e.y;
	drawCursor();
});
diameter.addEventListener('input', calc);
r7.addEventListener('input', () => {
	const rv = r7.value * 1;
	diameter.value -= 1.4 * (rp - rv);
	rp = rv;
	calc();
});
oX.addEventListener('input', () => {
	ox = oX.value * 1;
	x0 = xc - m * ox;
	xl = Math.ceil(ox - ww / 2 / m + mx);
	xr = Math.floor(ox + ww / 2 / m + mx);
	aX.textContent = ox + rx;
	drawBlocks();
	drawCoord();
});
oY.addEventListener('input', () => {
	oy = oY.value * 1;
	aY.textContent = oy + ry;
});
oZ.addEventListener('input', () => {
	oz = oZ.value * 1;
	z0 = zc - m * oz;
	zt = Math.ceil(oz - wh / 2 / m + mz);
	zb = Math.floor(oz + wh / 2 / m + mz);
	aZ.textContent = oz + rz;
	drawBlocks();
	drawCoord();
});
rX.addEventListener('input', () => {
	rx = rX.value * 1;
	aX.textContent = ox + rx;
	d = Math.sqrt(Math.pow(rx, 2) + Math.pow(ry, 2) + Math.pow(rz, 2));
	dist.textContent = d;
	dist.className = d > r ? 'over' : '';
	drawBlocks();
	drawCoord();
	drawPoint();
});
rY.addEventListener('input', () => {
	ry = rY.value * 1;
	aY.textContent = oy + ry;
	d = Math.sqrt(Math.pow(rx, 2) + Math.pow(ry, 2) + Math.pow(rz, 2));
	dist.textContent = d;
	dist.className = d > r ? 'over' : '';
	rg = Math.abs(ry) < r ? Math.cos(Math.asin(ry / r)) * r : 0;
	rG.textContent = rg;
	drawBlocks();
	drawSphere();
});
rZ.addEventListener('input', () => {
	rz = rZ.value * 1;
	aZ.textContent = oz + rz;
	d = Math.sqrt(Math.pow(rx, 2) + Math.pow(ry, 2) + Math.pow(rz, 2));
	dist.textContent = d;
	dist.className = d > r ? 'over' : '';
	drawBlocks();
	drawCoord();
	drawPoint();
});
mX.addEventListener('input', () => {
	mx = mX.value * 1;
	xc = ww / 2 - m * mx;
	x0 = xc - m * ox;
	xl = Math.ceil(ox - ww / 2 / m + mx);
	xr = Math.floor(ox + ww / 2 / m + mx);
	draw();
});
mZ.addEventListener('input', () => {
	mz = mZ.value * 1;
	zc = wh / 2 - m * mz;
	z0 = zc - m * oz;
	zt = Math.ceil(oz - wh / 2 / m + mz);
	zb = Math.floor(oz + wh / 2 / m + mz);
	draw();
});
range.addEventListener('input', drawBlocks);
scale.addEventListener('input', () => {
	m = Math.max(scale.value * 1, 1);
	xc = ww / 2 - m * mx;
	zc = wh / 2 - m * mz;
	x0 = xc - m * ox;
	z0 = zc - m * oz;
	xl = Math.ceil(ox - ww / 2 / m + mx);
	xr = Math.floor(ox + ww / 2 / m + mx);
	zt = Math.ceil(oz - wh / 2 / m + mz);
	zb = Math.floor(oz + wh / 2 / m + mz);
	draw();
});
