class Color {

    // Attributes
    static WHITE = new Color(0xFFFFFF);
    static SILVER = new Color(0xC0C0C0);
    static GRAY	= new Color(0x808080);
    static BLACK = new Color(0x000000);
    static RED = new Color(0xFF0000);
    static MAROON = new Color(0x800000);
    static YELLOW = new Color(0xFFFF00);
    static OLIVE = new Color(0x808000);
    static LIME	= new Color(0x00FF00);
    static GREEN = new Color(0x008000);
    static AQUA	= new Color(0x00FFFF);
    static TEAL	= new Color(0x008080);
    static BLUE	= new Color(0x0000FF);
    static NAVY	= new Color(0x000080);
    static FUCHSIA = new Color(0xFF00FF);
    static PURPLE = new Color(0x800080);
    me;

    constructor(idColor) {

        // Filter
        if (!idColor && idColor != 0) throw new Error('No color here ._.');
        if (typeof idColor !== 'number')
            throw new Error('No idColor here .-.');

        this.me = idColor & 0xFFFFFF;
    }

    getR() {
        return (this.me & 0xFF0000) >> 16;
    }
    getG() {
        return (this.me & 0xFF00) >> 8;
    }
    getB() {
        return this.me & 0xFF;
    }

    // TODO: this is wrong!
    // setR(val) {
    //     return new Color((val & 0xFF) << 16) | (this.me & 0xFFFF);
    // }
    // setG(val) {
    //     return new Color((val & 0xFF) << 8) | (this.me & 0xFF00FF);
    // }
    // setB(val) {
    //     return new Color(val & 0xFF) | (this.me & 0xFFFF00);
    // }

    // TODO: methods -> color brightness/intensity
    brightness(val) {
        if (val > 1 || val < 0)
            throw new Error('Value must be between 0 & 1 o_O');
        
        let R = this.getR() * val;
        let G = this.getG() * val;
        let B = this.getB() * val;
    
        R = R<255 ? R : 255;  
        G = G<255 ? G : 255;  
        B = B<255 ? B : 255;  

        return new Color(R << 16 | G << 8 | B);
    }

    clone() {
        return new Color(this.me);
    }
}