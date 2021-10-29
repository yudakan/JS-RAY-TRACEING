class Mesh extends Stageable {

    // Attributes
    name; objects = [];

    constructor(name='', transform, parentLinked) {
        super(transform, parentLinked);
        if (typeof name !== 'string')
            throw new Error('Not a string ¬3¬');

        this.name = name ? name : 'mesh'+this.id;
    }

    // TODO: scale & rotate methods

    setColor(color) {
        if (!(color instanceof Color))
            throw new Error('Color needed! >.<');

        for (let i=0; i < this.objects.length; i++)
            this.objects[i].setColor(color);
    }

    add(objects) {
        if (!Array.isArray(objects))
            throw new Error('This is not an array! >.<');
        
        for (let i=0; i < objects.length; i++)
            if (!(objects[i] instanceof Triangle))
                throw new Error('Not Triangle element found! ^^"');
            else if (objects[i].parentLinked != null)
                throw new Error('This triangle is already linked to '+objects[i].parentLinked+' >v<');
            else {
                for (let j=0; j < this.objects.length; j++)
                    if (this.objects[j].id == objects[i].id)
                        throw new Error(objects[i]+' is already in this mesh ovo');
                        
                objects[i].linkToOutsideWorld(this);
                this.objects.push(objects[i]);
            }
    }

    remove(id) {
        for (let i=0; i < this.objects.length; i++)
            if (id == this.objects[i].id) {
                this.objects[i].breakLink();
                this.objects.splice(i, 1);
                return true
            }
        
        return false;
    }

    clone() { // TODO: likeAnInstance?
        let objects = new Array(this.objects.length);
        for (let i=0; i < objects.length; i++) {
            objects[i] = this.objects[i].clone();
            objects[i].breakLink();
        }

        let newMesh = new Mesh(this.name+'#', this.tr, this.parentLinked);
        newMesh.add(objects);
        return newMesh;
    }
}