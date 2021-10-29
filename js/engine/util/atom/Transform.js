class Transform {

    // TODO: Scale method ?

    // Attributes
    matrix;

    constructor(mx) {

        // Filter
        if (!mx) {
            mx = new SquareMatrix([
            // R = <o, i, j, k>        World Orthonormal Basis
            // R' = <o', i', j', k'>   Object Orthonormal Basis
            //   x  y  z
                [1, 0, 0, 0], // i'
                [0, 1, 0, 0], // j'
                [0, 0, 1, 0], // k'
                [0, 0, 0, 1]  // o'
            ]);
        }
        if (mx.order != 4)
            throw new Error("Format Exception -.-");
        
        // Attributes
        this.matrix = mx.clone();
    }

    getPosition() {
        return new Vector(this.matrix.me[3].slice(0, 3));
    }

    translate(p) {
        if (p.dim != 3)
            throw new Error("Format Exception -.-");

        this.matrix.me[3][0] += p.me[0];
        this.matrix.me[3][1] += p.me[1];
        this.matrix.me[3][2] += p.me[2];
    }

    translateFromOrigin(p) {
        if (p.dim != 3)
            throw new Error("Format Exception -.-");

        this.matrix.me[3][0] = p.me[0];
        this.matrix.me[3][1] = p.me[1];
        this.matrix.me[3][2] = p.me[2];
    }

    rotateX(alpha) {
        let rx = new SquareMatrix([
            [1, 0, 0],
            [0, Math.cos(alpha), Math.sin(alpha)],
            [0, -Math.sin(alpha), Math.cos(alpha)]
        ]);

        let rotated = rx.multiply(SquareMatrix.minor(this.matrix, 3, 3));
        for (let j=0; j < 3; j++)
            for (let i=0; i < 3; i++)
                this.matrix.me[j][i] = rotated.me[j][i];
    }

    rotateY(alpha) {
        let ry = new SquareMatrix([
            [Math.cos(alpha), 0, Math.sin(alpha)],
            [0, 1, 0],
            [-Math.sin(alpha), 0, Math.cos(alpha)]
        ]);

        let rotated = ry.multiply(SquareMatrix.minor(this.matrix, 3, 3));
        for (let j=0; j < 3; j++)
            for (let i=0; i < 3; i++)
                this.matrix.me[j][i] = rotated.me[j][i];
    }

    rotateZ(alpha) {
        let rz = new SquareMatrix([
            [Math.cos(alpha), Math.sin(alpha), 0],
            [-Math.sin(alpha), Math.cos(alpha), 0],
            [0, 0, 1]
        ]);

        let rotated = rz.multiply(SquareMatrix.minor(this.matrix, 3, 3));
        for (let j=0; j < 3; j++)
            for (let i=0; i < 3; i++)
                this.matrix.me[j][i] = rotated.me[j][i];
    }

    rotate(angles) {
        if (angles.length != 3)
            throw new Error("Format Exception -.-");

        if (angles[0] != 0) this.rotateX(angles[0]);
        if (angles[1] != 0) this.rotateY(angles[1]);
        if (angles[2] != 0) this.rotateZ(angles[2]);
    }

    outsideToMyWorld(e) {
        if (e instanceof Vector) {
            if (e.dim != 3)
                throw new Error("3 components neded o.o");

            return e.concat([1]).multiply(this.matrix.inverse()).slice(0,3);
        }
        else if (e instanceof SquareMatrix) {
            if (e.order != 4)
                throw new Error("4x4 matrix neded o.o");

            return e.multiply(this.matrix.inverse());
        }

        throw new Error('Vector or SquareMatrix needed -_-');
    }

    myWorldToOutside(e) {
        if (e instanceof Vector) {
            if (e.dim != 3)
                throw new Error("3 components neded o.o");

            return e.concat([1]).multiply(this.matrix).slice(0,3);
        }
        else if (e instanceof SquareMatrix) {
            if (e.order != 4)
                throw new Error("4x4 matrix neded o.o");

            return e.multiply(this.matrix);
        }

        throw new Error('Vector or SquareMatrix needed -_-');
    }

    clone() {
        return new Transform(this.matrix);
    }
}