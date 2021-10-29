class Gauss {

    static resolve(system) {

        // Filter
        if (!system) throw new Error("2 Dim Array needed :/");
        if (!Array.isArray(system) || !Array.isArray(system[0]))
            throw new Error("This is not a 2 Dim Array >.<");
        for (let i=0; i < system.length; i++)
            if (system.length != system[i].length-1)
                throw new Error("System format exception >~<");

        for (let d=0; d < system.length; d++) {

            let dmax = d;

            // get the biggest main
            for (let j=d+1; j < system.length; j++)
                if (Math.abs(system[dmax][d]) < Math.abs(system[j][d]))
                    dmax = j;

            // swap rows
            if (dmax != d) {
                let temp = system[d];
                system[d] = system[dmax];
                system[dmax] = temp;
            }

            let main = system[d][d];

            // solution?
            if (main == 0)
                return false;

            // main must be 1
            if (main != 1)
                for (let i=d; i < system[0].length; i++)
                    system[d][i] /= main;

            // all zeros in this column
            for (let j=0; j < system.length; j++) {
                if (j == d) continue;
                let reason = system[j][d];
                for (let i=d; i < system[0].length; i++)
                    system[j][i] -= reason * system[d][i];
            }
        }

        let sols = new Array(system.length);
        for (let i=0; i < system.length; i++)
            sols[i] = system[i][system.length];

        return sols;
    }

}