const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Theater = require('../models/theater');

mongoose.connect('mongodb://localhost:27017/improv-dir', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Theater.deleteMany({});
    for(let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const theater = new Theater({
            author: '5fcf05ef24c2e82d08d0685b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/du3zg85jg/image/upload/v1607766271/ImprovDir/xjtlhfri3airsn9jumno.jpg',
                  filename: 'ImprovDir/xjtlhfri3airsn9jumno'
                },
                {
                  url: 'https://res.cloudinary.com/du3zg85jg/image/upload/v1607766271/ImprovDir/db3aof5p4cndz33a1ypw.jpg',
                  filename: 'ImprovDir/db3aof5p4cndz33a1ypw'
                },
                {
                  url: 'https://res.cloudinary.com/du3zg85jg/image/upload/v1607766271/ImprovDir/sma7iqwzdp8vwqgdmiqy.jpg',
                  filename: 'ImprovDir/sma7iqwzdp8vwqgdmiqy'
                },
                {
                  url: 'https://res.cloudinary.com/du3zg85jg/image/upload/v1607766271/ImprovDir/oruyzldt5wkxhua38fvi.jpg',
                  filename: 'ImprovDir/oruyzldt5wkxhua38fvi'
                },
                {
                  url: 'https://res.cloudinary.com/du3zg85jg/image/upload/v1607766271/ImprovDir/y3xgvl1dyagmsh7j0bch.jpg',
                  filename: 'ImprovDir/y3xgvl1dyagmsh7j0bch'
                },
                {
                  url: 'https://res.cloudinary.com/du3zg85jg/image/upload/v1607766271/ImprovDir/mlneyzxgfqlp6xxjw4s9.jpg',
                  filename: 'ImprovDir/mlneyzxgfqlp6xxjw4s9'
                },
                {
                  url: 'https://res.cloudinary.com/du3zg85jg/image/upload/v1607766271/ImprovDir/poa6j7ifxoj8ecb5xnj9.jpg',
                  filename: 'ImprovDir/poa6j7ifxoj8ecb5xnj9'
                }
              ],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam venenatis magna sit amet luctus imperdiet. Fusce faucibus nunc dapibus tortor gravida, a interdum diam auctor. Proin eu facilisis neque.',
            price,
            geometry: {
              type: "Point",
              coordinates: [
                cities[random1000].longitude, 
                cities[random1000].latitude
              ]
            }
        });
        await theater.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});