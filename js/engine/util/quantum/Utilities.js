class Utilities {

    static cloneArray(arr) {
        return arr.slice(0);
    }

    static createArray(n=3, fill=0) {
        let arr = new Array(n);
        for (let i=0; i < n; i++) arr[i] = fill;
        return arr;
    }

    static clone2Array(arr) {
        let arrNew = new Array(arr.length);

        for (let j=0; j < arr.length; j++) {
            arrNew[j] = new Array(arr[j].length);
            for (let i=0; i < arr[j].length; i++)
                arrNew[j][i] = arr[j][i];
        }

        return arrNew;
    }

    static create2Array(n=4, m=4, fill=0) {
        let arr = new Array(n);

        for (let j=0; j < n; j++) {
            arr[j] = new Array(m);
            for (let i=0; i < m; i++)
                arr[j][i] = fill;
        }

        return arr;
    }
    
}