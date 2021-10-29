class Null extends Stageable {

    // Attributes
    name; objects = [];

    constructor(name='', transform, parentLinked) {
        super(transform, parentLinked);
        if (typeof name !== 'string')
            throw new Error('Not a string ¬3¬');

        this.name = name ? name : 'null'+this.id;
    }

    add(objects, preserveWorld=true) { // TODO: preserveWorld
        if (!Array.isArray(objects))
            throw new Error("This is not an Array >.<");

        for (let i=0; i < objects.length; i++)
            if (!(objects[i] instanceof Stageable))
                throw new Error("Not a Stageable object found TToTT");
            else if (objects[i].parentLinked != null)
                throw new Error('This object is already linked to '+objects[i].parentLinked+' >v<');
            else {
                for (let j=0; j < this.objects.length; j++)
                    if (this.objects[j].id == objects[i].id)
                        throw new Error(objects[i]+' is already in this null ovo');
                        
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

        let newNUll = new Null(this.name+'#', this.tr, this.parentLinked);
        newNUll.add(objects);
        return newNUll;
    }
}
