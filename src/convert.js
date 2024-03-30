const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the output format for the image you want (e.g., jpg, png, webp): ', (outputFormat) => {
  console.log(`Selected: ${outputFormat}`);
  
  rl.question('Drag A Image Onto This Prompt: ', (imagePath) => {
    imagePath = imagePath.trim();
    const outputDir = path.join(__dirname, '../output');

    if (!fs.existsSync(outputDir)){
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.stat(imagePath, (err, stats) => {
      if (err) {
        console.error('Error reading the file:', err);
        return rl.close();
      }
      if (stats.isFile()) {
        const outputFileName = path.join(outputDir, path.basename(imagePath, path.extname(imagePath)) + '.' + outputFormat);

        sharp(imagePath)
          .toFormat(outputFormat)
          .toBuffer()
          .then(data => {
            fs.writeFile(outputFileName, data, err => {
              if (err) {
                throw err;
              }
              console.log(`Image converted successfully: ${path.relative(process.cwd(), outputFileName)}`);
              rl.close();
            });
          })
          .catch(err => {
            console.error('Error converting image:', err.message);
            rl.close();
          });
      } else {
        console.error('Provided path is not a valid image file.');
        rl.close();
      }
    });
  });
});