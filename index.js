const Hilbert2d = require('hilbert').Hilbert2d;
const Jimp = require('jimp');
const colors = require('./colors');

class VisualHash {
    constructor() {

    }

    visHash(dataset, image_size=null) {
        // figure out the size of our input and output
        const data_size = dataset.length * dataset[0].length;
        const output_size = this.getOutputSize(data_size);
        const Hilbert = new Hilbert2d(output_size);
        if (!image_size) image_size = output_size;

        // initialize output data for our image
        let output_data = [];
        output_data.overall_max_number = 0;
        output_data.overall_max_string = 0;
        for (let i=0; i < output_size; i++) {
            output_data.push([]);
            for (let j=0; j < output_size; j++) {
                output_data[i][j] = {
                    empty_count: 0,
                    total_count: 0,
                    max_number: 0,
                    max_string: 0
                };
            }
        }

        // build our output data from our input data
        const TOTAL_LOCATIONS = (output_size*output_size);
        for (let i=0; i < dataset.length; i++) {
            for (let j=0; j < dataset[i].length; j++) {
                let output_distance = ((i*dataset[i].length+j)/data_size) * TOTAL_LOCATIONS;
                let output_location = Hilbert.d2xy(output_distance);
                let output_val = output_data[output_location.x][output_location.y];
                let val = dataset[i][j];
                
                switch (typeof val) {
                    case "string":
                        if (val.length > output_val.max_string) output_val.max_string = val.length; 
                        if (val.length > output_data.overall_max_string) output_data.overall_max_string = val.length;
                        if (val.length === 0) output_val.empty_count++;
                        break;
                    case "number":
                        let absval = Math.abs(val);
                        if (absval > output_val.max_number) output_val.max_number = absval;
                        if (absval > output_data.overall_max_number) output_data.overall_max_number = absval; 
                        break;
                    default: 
                        if (val === null || val === undefined) output_val.empty_count++;
                        break;
                }
                output_val.total_count++;
            }
        }

        // generate our image based on our output data
        let image = new Jimp(output_size, output_size, 0xFFFFFFFF, (err, image) => {
            for (let i=0; i < output_data.length; i++) {
                for (let j=0; j < output_data[i].length; j++) {
                    let data = output_data[i][j];        
                    let color = this.pickColor(data, output_data);
                    if (color < 0x777777FF) console.log("dark data:",data);
                    image.setPixelColor(color, i, j);
                }
            }
        }).resize(image_size, image_size, Jimp.RESIZE_NEAREST_NEIGHBOR);



        // render and return our image
        return new Promise((resolve, reject) => {
            image.getBase64(Jimp.MIME_BMP, (error, base64Image) => {
                if (error) reject(error);
                else {resolve({ base64Image, output_data });}
            });
        });
    }

    getOutputSize(data_size) {
        let size = 2;
        let next_size = size << 1;
        while (next_size*next_size < data_size) {
            size = next_size;
            next_size = next_size << 1;
        }
        return size >> 1;
    }

    pickColor(data_point, all_data) {
        let percent_populated = (1 - data_point.empty_count/data_point.total_count);
        let number_intensity = data_point.max_number/(all_data.overall_max_number+1);
        let string_intensity = data_point.max_string/(all_data.overall_max_string+1);

        if (number_intensity < .7 && string_intensity < .7) {
            return Jimp.rgbaToInt(255,255,255,255*percent_populated);
            //return colors.grayscale(percent_populated);
        } else if (number_intensity > string_intensity) {
            return Jimp.rgbaToInt(233,131,0,255*percent_populated);
            //return colors.one(number_intensity);
        } else {
            return Jimp.rgbaToInt(42,110,187,255*percent_populated);
            //return colors.two(string_intensity);
        }
    }
}

module.exports = new VisualHash();