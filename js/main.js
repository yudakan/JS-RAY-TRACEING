/*====================================================
 * Yka's magic ^o^
 *====================================================*/
// triangles for cube
const tri0 = new Triangle([new Vector([0,0,2]), new Vector([0,0,0]), new Vector([2,0,0])], Color.WHITE );
const tri1 = new Triangle([new Vector([0,0,2]), new Vector([2,0,2]), new Vector([2,0,0])], Color.WHITE );

// front
const face0 = new Mesh();
face0.add([tri0,tri1]);

// right
const face1 = face0.clone();
face1.tr.rotateZ(Math.PI/2);

// back
const face2 = face0.clone();
face2.tr.translateFromOrigin(new Vector([0,2,0]));

// left
const face3 = face1.clone();
face3.tr.translateFromOrigin(new Vector([2,0,0]));

// down
const face4 = face0.clone();
face4.tr.rotateX(-Math.PI/2);

// up
const face5 = face4.clone();
face5.tr.translateFromOrigin(new Vector([0,0,2]));

// Construct default cube
const cube = new Null();
cube.add([face0,face1,face2,face3,face4,face5]);

// Construct cube1
const cube1 = cube.clone();
cube1.objects.forEach(m => m.setColor(Color.AQUA));
cube1.tr.translateFromOrigin(new Vector([-1,3,-1.5]));

// Construct cube2
const cube2 = cube.clone();
cube2.objects.forEach(m => m.setColor(Color.FUCHSIA));
cube2.tr.translateFromOrigin(new Vector([-2,2,-2.5]));

// Construct cube3
const cube3 = cube.clone();
cube3.objects.forEach(m => m.setColor(Color.BLUE));
cube3.tr.translateFromOrigin(new Vector([-1,10,-1.75]));

// Construct cube4
const cube4 = cube.clone();
cube4.objects.forEach(m => m.setColor(Color.YELLOW));
cube4.tr.translateFromOrigin(new Vector([8.5,2.5,-2]));

// plane ground
const tri2 = new Triangle([new Vector([0,20,0]), new Vector([0,0,0]), new Vector([20,0,0])], Color.WHITE);
const tri3 = new Triangle([new Vector([0,20,0]), new Vector([20,20,0]), new Vector([20,0,0])], Color.WHITE);
const ground = new Mesh();
ground.add([tri2,tri3]);
ground.tr.translateFromOrigin(new Vector([-3.5,1.5,-2.5]));

// light
const light = new Light();
light.tr.translateFromOrigin(new Vector([-1.5,4,2]));

// camera
const cam = new Camera(new CamSettings(2, 1, undefined, undefined, new Color(0x383838)));
cam.tr.matrix.me = [
	[0.7071067811865476, -0.7071067811865475, 0, 0],
	[0.5879378012096799, 0.58793780120968, -0.555570233019603, 0],
	[0.3928474791935515, 0.39284747919355156, 0.8314696123025461, 0],
	[-3.0000000000000013, 0.7, 2.100000000000001, 1]
];
cam.tr.rotateZ(Math.PI/100);
cam.tr.translate(new Vector([-1, -1, 0.1]));

// scene
const scene = new Scene();
scene.add([cam, light, cube1, cube2, cube3, cube4, ground]);


/*====================================================
 * RENDER FUNCTION
 *====================================================*/
let rendering = false;
const renderFrame = async resolution => {

    // Set resolution
    cam.settings.rasterWidth = resolution;
    cam.settings.rasterHeight = Math.trunc(resolution/2);

	// Prevent new renders if already rendering
	if (rendering) throw new Error('Already rendering ò.ó !');
	rendering = true;

	// Get frame
    const prog_el = document.getElementById('prog');
    let last_prog_time = performance.now();
	let frame = await cam.getFrame(async (i,j,color,prog) => {
        const now = performance.now();
        if (now - last_prog_time > 250) {
            const p = prog*100;
            prog_el.style.background = `linear-gradient(to right, var(--strong-color) ${p}%, rgba(0,0,0,0) ${p}%)`;
            last_prog_time = now;
            // console.log(p);
            await new Promise(res => setTimeout(() => res(), 1));
        }
    })
    prog_el.style.background = `linear-gradient(to right, var(--strong-color) 100%, rgba(0,0,0,0) 100%)`;

    // let str = frame.reduce((acc, color) => `${acc}, ${color}`)
    // console.log(`[${str}]`);

	// Get canvas
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	canvas.width = cam.settings.rasterWidth;
	canvas.height = cam.settings.rasterHeight;
    const idata = ctx.createImageData(canvas.width, canvas.height);

    // Update image buffer
    for (let y=0; y < canvas.height; y++) {
        for (let x=0; x < canvas.width; x++) {
            let pos = (y*canvas.width+x) * 4;
            idata.data[pos] = frame[y][x] >> 16;
            idata.data[pos+1] = (frame[y][x] >> 8) & 0xFF;
            idata.data[pos+2] = frame[y][x] & 0xFF;
            idata.data[pos+3] = 255;
        }
    }

    // Update canvas with new data
    ctx.putImageData(idata, 0, 0);

    // console.log(canvas.toDataURL());

	// Allow new renders
	rendering = false;
};


/*====================================================
 * UPLOAD FILE FUNCTION
 *====================================================*/
const readUploadedFileAsText = inputFile => {
	const temporaryFileReader = new FileReader();

	return new Promise((resolve, reject) => {
		temporaryFileReader.onerror = () => {
			temporaryFileReader.abort();
			reject(new DOMException('Problem parsing input file.'));
		};

		temporaryFileReader.onload = () => {
			resolve(temporaryFileReader.result);
		};
		temporaryFileReader.readAsText(inputFile);
	});
};


/*====================================================
 * LOAD OBJ FUNCTION
 *====================================================*/
const loadObjFile = async event => {
	// Get input file
	const input = event.target;
	const [file] = input.files;
	if (!file.name.endsWith('.obj')) return alert('Invalid file extension');

	// Read file contents
	const text = await readUploadedFileAsText(file);
	const lines = text.split(/[\r\n]+/g);

	// Create mesh
	let mesh = new Mesh();

	// Create data storage
	const vectors = [];
	const triangles = [];

	// Process file
	lines.forEach(line => {
		if (line === '') return;

		// Process each line
		const data = line.split(' ');
		const type = data[0];
		const values = data.slice(1).map(i => parseFloat(i));

		if (type === 'v') {
			vectors.push(new Vector(values));
			return;
		}

		if (type === 'f') {
			triangles.push(new Triangle([vectors[values[0] - 1].clone(), vectors[values[1] - 1].clone(), vectors[values[2] - 1].clone()]));
			return;
		}
	});

	mesh.add(triangles);

	// Add mest to scene and render
	scene.add([mesh]);
	renderFrame();
};


/*====================================================
 * CONTROLS FUNCTION
 *====================================================*/
const controls = event => {
	const key = event.key.toLowerCase();

	if (key == 'w') cam.tr.translate(new Vector([0, 0.1, 0]));
	else if (key == 's') cam.tr.translate(new Vector([0, -0.1, 0]));
	else if (key == 'd') cam.tr.translate(new Vector([0.1, 0, 0]));
	else if (key == 'a') cam.tr.translate(new Vector([-0.1, 0, 0]));
	else if (key == 'shift') cam.tr.translate(new Vector([0, 0, 0.1]));
	else if (key == 'c') cam.tr.translate(new Vector([0, 0, -0.1]));
	else if (key == 'arrowup') cam.tr.rotateX(Math.PI / 32);
	else if (key == 'arrowdown') cam.tr.rotateX(-Math.PI / 32);
	else if (key == 'arrowright') cam.tr.rotateZ(Math.PI / 32);
	else if (key == 'arrowleft') cam.tr.rotateZ(-Math.PI / 32);
	else if (key == '1' || key == 'end') cam.tr.rotateY(Math.PI / 32);
	else if (key == '3' || key == 'pagedown') cam.tr.rotateY(-Math.PI / 32);
	else return;

	renderFrame();
};


/*====================================================
 * Listeners
 *====================================================*/
document.addEventListener('DOMContentLoaded', () => {
    // document.getElementById('obj-import-file').addEventListener('change', loadObjFile);
	// document.addEventListener('keydown', controls);

    const canvas = document.getElementById('canvas');
    const res = () => canvas.style.height = `${Math.trunc(canvas.getBoundingClientRect().width/2)}px`;
    window.addEventListener('resize', res);
    res();
    
    const resolutionSlider = document.getElementById('resolution');
    const resolutionLabel = document.getElementById('resolutionLabel');
    resolutionSlider.addEventListener('change', () => resolutionLabel.textContent = `Resolution: ${resolutionSlider.value}px`)
	document.getElementById('render-start').addEventListener('click', () => renderFrame(resolutionSlider.value));
});
