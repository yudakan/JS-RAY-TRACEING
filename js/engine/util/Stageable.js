class Stageable {

    // Attributes
    static idMax = 0;
    id; tr; parentLinked;
    ghost = false;

    constructor(transform=new Transform(), parentLinked=null) {
        if (!(transform instanceof Transform))
            throw new Error('Transform reference needed ò_ó');

        this.id = Stageable.idMax++;
        this.tr = transform.clone();
        this.parentLinked = parentLinked; // CAUTION! We're assuming programmer knows what he is doing...
    }

    linkToOutsideWorld(parentLinked) {
        if (!(parentLinked instanceof Stageable) && !(parentLinked instanceof Scene))
            throw new Error('Stageable reference needed ò3ó');
        
        this.parentLinked = parentLinked;
    }

    breakLink() {
        this.parentLinked = null;
    }

    setGhost(bol) {
        if (typeof bol !== 'boolean')
            throw new Error('Not a boolean value 7.7');
        this.ghost = bol;
    }

    lookAt(point, back=false) { // TODO: what reference tr?
        if (!(point instanceof Vector))
            throw new Error('Vector needed -.-"');
        if (point.dim != 3)
            throw new Error("3 components neded o.o");

        /* Object points to j' */
        /* i' always parallel to plane xi+yj=0 */
        /* the following notation will not have ' but still refers to it */
        // vector from o to point
        let p = new Vector([
            this.tr.matrix.me[3][0],
            this.tr.matrix.me[3][1],
            this.tr.matrix.me[3][2]
        ]);
        let j = back ? p.sub(point).normalize() : point.sub(p).normalize();

        // a -> plane with normal vector = j
        // b -> plane a but z = 0
        // b -> plane with normal vector = n
        let n = new Vector([j.me[0], j.me[1], 0]);
        let i = j.me[2] > 0 ? n.cross(j).normalize() : j.cross(n).normalize();
        let k = i.cross(j);

        // apply changes
        this.tr.matrix.me[0] = i.me.concat(0);
        this.tr.matrix.me[1] = j.me.concat(0);
        this.tr.matrix.me[2] = k.me.concat(0);
    }
}