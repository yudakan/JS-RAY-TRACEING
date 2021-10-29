class SquareMatrix {

    // Attributes
    order; me;

    constructor(arr) {

        // Filter
        if (!arr) throw new Error("2 Dim Array needed :/");
        if (!Array.isArray(arr) || !Array.isArray(arr[0]))
            throw new Error("This is not a 2 Dim Array >.<");
        for (let i=0; i < arr.length; i++)
            if (arr.length != arr[i].length)
                throw new Error("Not quadratic >.<");
        
        // Attributes
        this.order = arr.length;
        this.me = Utilities.clone2Array(arr);
    }


    add(element) {
        if (typeof element === 'number') {
            let mx = this.clone();
            for (let j=0; j < this.order; j++)
                for (let i=0; i < this.order; i++)
                    mx.me[j][i] += element;

            return mx;
        }
        else {
            if (element.order != this.order)
                throw new Error("Not same order u.u");

            let mx = this.clone();
            for (let j=0; j < this.order; j++)
                for (let i=0; i < this.order; i++)
                    mx.me[j][i] += element.me[j][i];

            return mx;
        }
    }

    sub(element) {
        if (typeof element === 'number') {
            let mx = this.clone();
            for (let j=0; j < this.order; j++)
                for (let i=0; i < this.order; i++)
                    mx.me[j][i] -= element;

            return mx;
        }
        else {
            if (element.order != this.order)
                throw new Error("Not same order u.u");

            let mx = this.clone();
            for (let j=0; j < this.order; j++)
                for (let i=0; i < this.order; i++)
                    mx.me[j][i] -= element.me[j][i];

            return mx;
        }
    }

    scale(num) {
        if (typeof num !== 'number')
            throw new Error("Not a number ;-;");

        let mx = this.clone();
        for (let j=0; j < this.order; j++)
            for (let i=0; i < this.order; i++)
                mx.me[j][i] *= num;

        return mx;
    }

    multiply(element) {
        if (element instanceof SquareMatrix) {
            if (element.order != this.order)
                throw new Error("Not same order u.u");

            let arr = Utilities.create2Array(this.order, this.order, 0);
            for (let j=0; j < this.order; j++)
                for (let i=0; i < this.order; i++)

                    for (let k=0; k < this.order; k++)
                        arr[j][i] += this.me[j][k] * element.me[k][i];

            return new SquareMatrix(arr);
        }
        else { // Vector
            if (element.dim != this.order)
                throw new Error("Not same order u.u");

            let arr = Utilities.createArray(this.order, 0);
            for (let j=0; j < this.order; j++)
                for (let i=0; i < this.order; i++)
                    arr[j] += this.me[j][i] * element.me[i];

            return new Vector(arr);
        }
    }

    transpose() {
        let arr = Utilities.create2Array(this.order, this.order, 0);
        for (let j=0; j < this.order; j++)
            for (let i=0; i < this.order; i++)
                arr[j][i] = this.me[i][j];

        return new SquareMatrix(arr);
    }

    static minor(mx, j, i) {
        if (i >= mx.order || j >= mx.order || i < 0  || j < 0)
            throw new Error("Out of rang >:c");

        let minor = Utilities.create2Array(mx.order-1, mx.order-1, 0);

        for (let jj=0; jj < mx.order; jj++)
            for (let ii=0; jj != j && ii < mx.order; ii++)
                if (ii != i)
                    minor[jj < j ? jj : jj - 1][ii < i ? ii : ii - 1] = mx.me[jj][ii];

        return new SquareMatrix(minor);
    }

    static adj(mx, j, i) {
        if (i >= mx.order || j >= mx.order || i < 0  || j < 0)
            throw new Error("Out of rang >:c");

        return Math.pow(-1, j+i) * SquareMatrix.det(SquareMatrix.minor(mx, j, i));
    }

    static det(mx) {
        if (mx.order == 1)
            return mx.me[0][0];
        if (mx.order == 2)
            return mx.me[0][0] * mx.me[1][1] - mx.me[0][1] * mx.me[1][0];

        let det = 0;
        for (let i=0; i < mx.order; i++)
            det += mx.me[0][i] * SquareMatrix.adj(mx, 0, i);

        return det;
    }

    cof() {
        let cofactors = Utilities.create2Array(this.order, this.order, 0);
        for (let j=0; j < this.order; j++)
            for (let i=0; i < this.order; i++)
                cofactors[j][i] = SquareMatrix.adj(this, j, i);

        return new SquareMatrix(cofactors);
    }

    adjMx() {
        return this.cof().transpose();
    }

    inverse() {
        let det = SquareMatrix.det(this);
        if (det == 0)
            throw new Error("Not inversible TToTT");

        return this.adjMx().scale(1.0 / det);
    }

    clone() {
        return new SquareMatrix(this.me);
    }
}