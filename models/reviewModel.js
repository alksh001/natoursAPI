const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    review: {
        type: String,
        required: [true, "Reviews can not be empty"],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belons to a tour']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belons to a user']
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

reviewSchema.pre(/^find/, function (next)
{
    this.populate({
        path: 'user',
        select: '-_id name photo'
    });
    
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // }).populate({
    //     path: 'user',
    //     select: '-_id name photo'
    // });
    
    next();
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

