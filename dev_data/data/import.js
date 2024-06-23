const fs = require('fs');
const mongoose = require('mongoose');
const dotenv= require('dotenv')
const Tour  = require('./../../models/tourModel')

dotenv.config({path: './.env'})
let URL = process.env.URL;

mongoose.connect(URL).then(() => {
    console.log("Database Connected");
    // return Tour.find({ name: null });
    }).catch(err => {
    console.log(`err = ${err}`);
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.simple.json`, "utf-8"))

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log("Imorted Successfully");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log("Deleted Successfully");
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}