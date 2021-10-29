class Vector {

    // Attributes
    static ZERO3 = new Vector([0, 0, 0]);
    dim; me;

    constructor(arr) {

        // Filter
        if (!arr) throw new Error("Array needed :/");
        if (!Array.isArray(arr))
            throw new Error("This is not an Array >.<");
        
        // Attributes
        this.dim = arr.length;
        this.me = Utilities.cloneArray(arr);
    }

    concat(element) {
        let arr = this.me.concat(Array.isArray(element) ? element : element.me);
        return new Vector(arr);
    }

    slice(start, end) { // Start included, end excluded
        let arr = this.me.slice(start, end);
        return new Vector(arr);
    }

    add(element) {
        if (typeof element === 'number') {
            let v = this.clone();
            for (let i=0; i < this.dim; i++)
                v.me[i] += element;

            return v;
        }
        else {
            if (this.dim != element.dim)
                throw new Error("Not same dimension u.u");

            let v = this.clone();
            for (let i=0; i < this.dim; i++)
                v.me[i] += element.me[i];

            return v;
        }
    }

    sub(element) {
        if (typeof element === 'number') {
            let v = this.clone();
            for (let i=0; i < this.dim; i++)
                v.me[i] -= element;

            return v;
        }
        else {
            if (this.dim != element.dim)
                throw new Error("Not same dimension u.u");

            let v = this.clone();
            for (let i=0; i < this.dim; i++)
                v.me[i] -= element.me[i];

            return v;
        }
    }

    scale(num) {
        if (typeof num !== 'number')
            throw new Error("Not a number ;-;");

        let v = this.clone();
        for (let i=0; i < this.dim; i++)
            v.me[i] *= num;

        return v;
    }

    cross(v) {
        if (this.dim != v.dim)
            throw new Error("Not same dimension u.u");
        if (this.dim != 3)
            throw new Error("Cross product just lives in three-dimensional space (R^3), not "+dim+"d space o.o");

        let x = this.me[1]*v.me[2] - this.me[2]*v.me[1];
        let y = this.me[2]*v.me[0] - this.me[0]*v.me[2];
        let z = this.me[0]*v.me[1] - this.me[1]*v.me[0];
        return new Vector([x, y, z]);
    }

    dot(v) {
        if (this.dim != v.dim)
            throw new Error("Not same dimension u.u");

        let sum = 0;
        for (let i=0; i < this.dim; i++)
            sum += this.me[i] * v.me[i];

        return sum;
    }

    multiply(mx) {
        if (mx.order != this.dim)
            throw new Error("Not same order u.u");

        let arr = Utilities.createArray(this.dim, 0);
        for (let j=0; j < this.dim; j++)
            for (let i=0; i < this.dim; i++)
                arr[j] += this.me[i] * mx.me[i][j];

        return new Vector(arr);
    }

    length() {
        let sum = 0;
        for (let i=0; i < this.dim; i++)
            sum += this.me[i] * this.me[i];

        return Math.sqrt(sum);
    }

    normalize() {
        let len = this.length();
        let normalized = this.clone();
        for (let i=0; i < this.dim; i++)
            normalized.me[i] /= len;

        return normalized;
    }

    equals(v, decimals=1000) {
        if (this.dim != v.dim)
            throw new Error("Not same dimension u.u");

        for (let i=0; i < this.dim; i++)
            if (Math.round(this.me[i] * decimals) != Math.round(v.me[i] * decimals))
                return false;

        return true;
    }

    clone() {
        return new Vector(this.me);
    }
    
}