class Scene {

    // Attributes
    name; objects = [];

    constructor(name='scene') {
        if (typeof name !== 'string')
            throw new Error('Not a string ¬3¬');

        this.name = name;
    }

    add(objects) {
        if (!Array.isArray(objects))
            throw new Error('This is not an array! >_<');
        
        for (let i=0; i < objects.length; i++)
            if (!(objects[i] instanceof Stageable))
                throw new Error('Not Stageable element found! è.é');
            else if (objects[i].parentLinked != null)
                throw new Error('This object is already linked to '+objects[i].parentLinked+' >v<');
            else {
                for (let j=0; j < this.objects.length; j++)
                    if (this.objects[j].id == objects[i].id)
                        throw new Error(objects[i]+' is already in scene ovo');

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

    static load(json) {
        // TODO!
    }

    save() {
        // TODO!
    }

    // TODO: mx.inverse = mx.translate when ortogonal ?
}