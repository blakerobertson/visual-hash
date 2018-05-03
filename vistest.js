const hash = require('./index');
const parse = require('csv-parse');
const fs = require('fs');

const IMAGE_SIZE = 128;

fs.readFile(process.argv[2], 'utf8', (err, contents) => {
    parse(contents, {auto_parse:true, from:2}, (err, data) => {        
        hash.visHash(data, IMAGE_SIZE)
            .then(({ base64Image, output_data }) => {
                fs.writeFileSync(process.argv[2]+".html", 
                    `<html><head><style>img {border:1px solid lightgray}</style></head><body><img height=${IMAGE_SIZE} width=${IMAGE_SIZE} src="${base64Image}"><div>max_number:${output_data.overall_max_number}</div><div>max_string:${output_data.overall_max_string}</div><div>${JSON.stringify(output_data)}</div></body></html>`, "utf8");
            });
    });
});



