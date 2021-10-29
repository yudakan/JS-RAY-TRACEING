class Ray {

    // Attributes
    // TODO: MAX_RECURSIVITY
    static MAX_DEPTH = 1000;
    p; d; linkedCam;

    constructor(point, direction, linkedCam) {

        // Filter
        if (!(point instanceof Vector) || !(direction instanceof Vector))
            throw new Error('Vectors needed >:c');
        if (!(linkedCam instanceof Camera))
            throw new Error('Cam reference needed ò3ó');

        this.p = point.clone();
        this.d = direction.clone();
        this.linkedCam = linkedCam;
    }

    intersect(triangle) {
        if (!(triangle instanceof Triangle))
            throw new Error("What the fuck? @_@");

        // Vertices of the triangle
        const a = triangle.points[0];
        const b = triangle.points[1];
        const c = triangle.points[2];

        // Ray and plane ab+ac intersection
        // r: p + t*d
        // π: a + x*ab + y*ac
        const ab = b.sub(a);
        const ac = c.sub(a);
        const system_intersection_ABAC_ray = [
            [ab.me[0], ac.me[0], -this.d.me[0], -a.me[0]+this.p.me[0]],
            [ab.me[1], ac.me[1], -this.d.me[1], -a.me[1]+this.p.me[1]],
            [ab.me[2], ac.me[2], -this.d.me[2], -a.me[2]+this.p.me[2]],
        ];
        const sol1 = Gauss.resolve(system_intersection_ABAC_ray);
        
        if (!sol1) return false;
        
        const x1 = sol1[0];
        const y1 = sol1[1];
        let t = sol1[2];

        if (x1 < 0 || y1 < 0 || x1 > 1 || y1 > 1) return false; // in plane but not in triangle

        // Ray and plane ba+bc intersection
        // r: p + t*d
        // π: b + x*ba + y*bc
        const ba = a.sub(b);
        const bc = c.sub(b);
        const system_intersection_BABC_ray = [
            [ba.me[0], bc.me[0], -this.d.me[0], -b.me[0]+this.p.me[0]],
            [ba.me[1], bc.me[1], -this.d.me[1], -b.me[1]+this.p.me[1]],
            [ba.me[2], bc.me[2], -this.d.me[2], -b.me[2]+this.p.me[2]],
        ];
        const sol2 = Gauss.resolve(system_intersection_BABC_ray);

        if (!sol2) return false; // throw new Error('FATAL ERROR: Triangle lives in two different planes? x_x');
                                 // it could be different because of decimal precision

        const x2 = sol2[0];
        const y2 = sol2[1];
        t = sol2[2]; // it should be the same value

        if (x2 < 0 || y2 < 0) return false; // in plane but not in triangle

        return this.p.add( this.d.scale(t) );
    }

    traceToLigth(point, exceptTriangle) { // TODO: more lights & improve
        if (!(point instanceof Vector))
            throw new Error("What the fuck? #_#");

        const toLigth = this.linkedCam.lightsInMyWorld[0].tr.getPosition().sub( point );
        const ray = new Ray(point, toLigth, this.linkedCam);

        // Loop all triangles
        for (let i=0; i < ray.linkedCam.trianglesInMyWorld.length; i++) {
            if (exceptTriangle.id == ray.linkedCam.trianglesInMyWorld[i].id)
                continue;
        
            const intersection = ray.intersect( ray.linkedCam.trianglesInMyWorld[i] );

            // is there an intersection?
            // is this one between point and light?
            if ( intersection && toLigth.dot(intersection.sub(point)) > 0 )
                return null; // so no direct light here :/
        }
        
        return toLigth;
    }

    // TODO: direct mode
    // TODO: we need no camera dependency
    getColor(mode='noLight') {
        let yDepth = Ray.MAX_DEPTH;
        let closerTriangle = false;
        let directLightVect = mode == 'direct';

        // Loop all triangles
        for (let i=0; i < this.linkedCam.trianglesInMyWorld.length; i++) {
                
            const intersection = this.intersect( this.linkedCam.trianglesInMyWorld[i] );

            // is there an intersection?
            // is this one closer than previous triangles?
            // not behind camera?
            if ( intersection && intersection.me[1] < yDepth && this.d.dot(intersection) > 0 ) {
                yDepth = intersection.me[1];
                closerTriangle = this.linkedCam.trianglesInMyWorld[i];
                if (directLightVect !== false) directLightVect = this.traceToLigth(intersection, closerTriangle);
            }
        }

        // Return color   
        if (closerTriangle) {
            if (directLightVect === false) return closerTriangle.getColor();
            else if (directLightVect === null) return closerTriangle.getColor().brightness( 0.25 );
            else {
                const distance = directLightVect.length();
                const intensity = 1 / Math.sqrt(distance < 1 ? 1 : distance);
                return closerTriangle.getColor().brightness( intensity );
            }
        }
        else return this.linkedCam.settings.bgColor;
    }
}