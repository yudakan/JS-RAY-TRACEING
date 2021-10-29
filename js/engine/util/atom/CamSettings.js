class CamSettings {

    // Attributes
    canvasWidth;
    canvasHeight;
    rasterWidth;
    rasterHeight;
    bgColor;

    constructor(canvasWidth=2, canvasHeight=1, rasterWidth=200, rasterHeight=100, bgColor=Color.GRAY) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.rasterWidth = rasterWidth;
        this.rasterHeight = rasterHeight;
        this.bgColor = bgColor;
    }

    clone() {
        return new CamSettings(
            this.canvasWidth,
            this.canvasHeight,
            this.rasterWidth,
            this.rasterHeight,
            this.bgColor.clone()
        );
    }
}