class Light extends Stageable {

    // Attributes
    // TODO: color is always white
    // TODO: brightness
    name; color;

    constructor(color=Color.WHITE, name='', transform, parentLinked) {
        super(transform, parentLinked);

        // Filter
        if (!(color instanceof Color))
            throw new Error('Color needed! >.<');
        if (typeof name !== 'string')
            throw new Error('Not a string ¬3¬');

        this.color = color;
        this.name = name ? name : 'light'+this.id;
    }

    getColor() {
        return this.color;
    }

    setColor(color) {
        if (!(color instanceof Color))
            throw new Error('Color needed! >.<');

        this.color = color;
    }

    clone() {
        return new Light(this.color, this.name+'#', this.tr, this.parentLinked);
    }
}