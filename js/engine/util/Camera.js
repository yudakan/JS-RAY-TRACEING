class Camera extends Stageable {

    // Attributes
    name; settings; raster;
    triangles; lights; trianglesInMyWorld; lightsInMyWorld;

    constructor(settings=new CamSettings(), name='', transform, parentLinked) {
        super(transform, parentLinked);

        if (typeof name !== 'string')
            throw new Error('Not a string ¬3¬');
        if (!(settings instanceof CamSettings))
            throw new Error('What is this? -o-"');

        this.settings = settings;
        this.name = name ? name : 'cam'+this.id;
    }

    createRaster() { //private
        this.raster = Utilities.create2Array(this.settings.rasterHeight, this.settings.rasterWidth, 0);
    }

    collect(collectable) { //private
        for (let i=0; i < collectable.objects.length; i++) {
            const obj = collectable.objects[i];

            if (!obj.ghost)
                if (obj instanceof Triangle) this.triangles.push(obj);
                else if (obj instanceof Light) this.lights.push(obj);
                else if (obj instanceof Mesh) this.collect(obj);
                else if (obj instanceof Null) this.collect(obj);
        }
    }

    mountContent() { //private
        let scene = this.parentLinked;
        while (!(scene instanceof Scene)) {
            if (scene == null)
                throw new Error("I'm not in scene :'c");
            scene = scene.parentLinked;
        }
        
        // Look for all no-ghost triangles & lights on the scene
        this.triangles = [];
        this.lights = [];
        this.collect(scene);
    }

    contentToMyWorld() { //private
        this.trianglesInMyWorld = [];
        for (let i=0; i < this.triangles.length; i++) {

            // Go down to max outside, global world
            let trMatrix = this.triangles[i].tr.matrix;
            let step =  this.triangles[i].parentLinked;
            while (!(step instanceof Scene)) {
                trMatrix = step.tr.myWorldToOutside(trMatrix);
                step = step.parentLinked;
            }

            let a = this.triangles[i].points[0].concat([1]).multiply(trMatrix);
            let b = this.triangles[i].points[1].concat([1]).multiply(trMatrix);
            let c = this.triangles[i].points[2].concat([1]).multiply(trMatrix);

            // Go up to cam world (reversed)
            trMatrix = this.tr.matrix;
            step = this.parentLinked;
            while (!(step instanceof Scene)) {
                trMatrix = step.tr.outsideToMyWorld(trMatrix);
                step = step.parentLinked;
            }

            a = a.multiply(trMatrix.inverse()).slice(0,3);
            b = b.multiply(trMatrix.inverse()).slice(0,3);
            c = c.multiply(trMatrix.inverse()).slice(0,3);

            // Push triangle to array
            const myTriangle = this.triangles[i].clone();
            myTriangle.points = [a, b, c];
            myTriangle.tr = new Transform();
            myTriangle.parentLinked = this;
            this.trianglesInMyWorld.push( myTriangle );
        }

        this.lightsInMyWorld = [];
        for (let i=0; i < this.lights.length; i++) {

            // Go down to max outside, global world
            let trMatrix1 = this.lights[i].tr.matrix;
            let step =  this.lights[i].parentLinked;
            while (!(step instanceof Scene)) {
                trMatrix1 = step.tr.myWorldToOutside(trMatrix1);
                step = step.parentLinked;
            }

            // Go up to cam world (reversed)
            let trMatrix2 = this.tr.matrix;
            step = this.parentLinked;
            while (!(step instanceof Scene)) {
                trMatrix2 = step.tr.outsideToMyWorld(trMatrix2);
                step = step.parentLinked;
            }

            // Push triangle to array
            const myLight = this.lights[i].clone();
            myLight.tr.matrix = trMatrix1.multiply(trMatrix2.inverse());
            myLight.parentLinked = this;
            this.lightsInMyWorld.push( myLight );
        }
    }

    async getFrame(perPixelFun, mode_ini=true) {
        if (this.ghost)
            throw new Error("I'm a fucking ghost! >3<");

        if (mode_ini) {
            this.createRaster();
            this.mountContent();
        }
        this.contentToMyWorld();

        const xunit = this.settings.canvasWidth / this.settings.rasterWidth;
        const zunit = this.settings.canvasHeight / this.settings.rasterHeight;
        const xoffset = this.settings.canvasWidth / 2;
        const zoffset = this.settings.canvasHeight / 2;

        const p = new Vector([0, 0, 0]); // cam position
        let d = new Vector([0, 0, 0]); // Ray direction
        const ray = new Ray(p, d, this); // Ray Template

        // Loop all raster
        for (let j=0; j < this.raster.length; j++)
            for (let i=0; i < this.raster[j].length; i++) {

                // direction per pixel
                d = new Vector([ xunit*i - xoffset, 1, zunit*j - zoffset ]);
                ray.d = d;

                // Ray creation per pixel
                const color = ray.getColor('direct').me;

                // set raster pixel
                this.raster[this.raster.length-1-j][i] = color;

                // Per pixel custom function
                if (perPixelFun)
                    await perPixelFun(i, this.raster.length-1-j, color, (this.raster[0].length*j+i+1)/(this.raster.length*this.raster[0].length));
            }

        return this.raster;
    }
}