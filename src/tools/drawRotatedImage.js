const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

/**
 * A helper-method to display an image at set coordinates and angle
 * @param {*} image the image to draw
 * @param {*} x the x position
 * @param {*} y the y position
 * @param {*} angle the angle of drawing in radians
 */
export function drawRotatedImage(image, x, y, angle) {
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.drawImage(image, -(image.width / 2), -(image.height / 2));
    context.restore();
}