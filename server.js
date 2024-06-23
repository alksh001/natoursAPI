const mongoose = require('mongoose');
const dotenv= require('dotenv')
const app = require('./app');
const Tour  = require('./models/tourModel')

dotenv.config({path: './.env'})
let URL = process.env.URL;
console.log(URL);

mongoose.connect(URL).then(async() => {
    console.log("Database Connected");
   
        // Find documents with null names (just in case)
        // const docsWithNullName = await Tour.find({ names: null });
        // console.log('Documents with null name:', docsWithNullName);
        
        // Optionally delete these documents if there are any
        // if (docsWithNullName.length > 0) {
        //     // await Tour.deleteMany({ names: null });
        // }

        // Drop the existing index if it exists
        await Tour.collection.dropIndex('names_1').catch(err => {
            if (err.codeName !== 'IndexNotFound') {
                throw err;
            }
        });

        // // Ensure the unique index is created
        // await Tour.createIndexes();

        // console.log('Unique index created');
})
    .catch(err => {
    console.log(`err = ${err}`);
});

app.listen(3000, () => {
    console.log("App is running");
});