function loadTexture(gl, url) {
    return new Promise((resolve, reject) => {
        gl.activeTexture(gl.TEXTURE0);

        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Put a single pixel in the texture so we can
        // use it immediately. When the image has finished downloading
        // we'll update the texture with the contents of the image.
        const level = 0;
        // the format the GPU will use internally
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        // format and type of the data you're supplying to WebGL
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;

        function isPowerOf2(value) {
            return (value & (value - 1)) == 0;
        }

        const pixel = new Uint8Array([255, 255, 255, 255]);  // black
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            width, height, border, srcFormat, srcType,
            pixel);

        const image = new Image();
        image.src = url;
        image.onload = function () {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);


            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

            gl.generateMipmap(gl.TEXTURE_2D);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);


            resolve(texture)

        };

    })
}

// TODO: check the datatypes https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
function createDataTexture(gl) {
    gl.activeTexture(gl.TEXTURE1);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    // the format the GPU will use internally
    const internalFormat = gl.RGBA;
    // format and type of the data you're supplying to WebGL
    const format = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const border = 0;

    const width = gl.canvas.width;
    const height = gl.canvas.height;

    // Check if that is necesarry gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    // For wrong size of data
    //gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    // We don't need to supply any data. We just need WebGL to allocate the texture. By passing null, we will have all zeros
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border,
        format, srcType, null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    return texture;

}

module.exports = {
    loadTexture,
    createDataTexture,
};