const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

let createSendToken = (user, statusCode, res) => {
    let token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
        
    });

    createSendToken(newUser, 201, res);

    // const token = signToken(newUser._id);

    // res.status(201).json({
    //     status: 'success',
    //     token,
    //     data: {
    //         user: newUser
    //     }
    // });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    
    const user = await User.findOne({ email }).select('+password');
    
    // const correct = await user.correctPassword(password, user.password);

    if (!user || !await user.correctPassowrd(password, user.password)) {
        return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, res);

    // const token = signToken(user._id);
    // res.status(200).json({
    //     status: 'success',
    //     token,
    // });
    
});


exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // console.log(token);
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401))
    }

    // Verifying Token

    const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            resolve(decoded);
        });
    });

    // Check If user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError("The user belongs to this token does no longer exist", 401));
    }

    // Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }
   
    req.user = currentUser
    // console.log('user', req.user);
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // console.log('role',...roles, 'user', req.user);
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You dont have permission to do this action', 403));
        }
        next();
    }
};

exports.forgetPassowrd = catchAsync(async (req, res, next) => {
    // Get user based on their email
    let user = await User.findOne({ email: req.body.email });
    // console.log({user});

    if (!user) {
        return next(new AppError('There is no user with this email', 401));
    }
    // Generate the random token
    const resetToken = user.createPasswordResetToken();
    // console.log({resetToken});
    await user.save({ validateBeforeSave: false });

    // send it to users email
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;


    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}`
try{
    await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
    });

    res.status(200).json({
        status: 'success',
        message: "Token send"
    })
} catch (err) {
    // console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email. Try again later',500))
}
 });

exports.resetPassowrd = catchAsync(async (req, res, next) => { 
    // 1 Get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2 if token not expires , and a user, reset the token
    if (!user) {
        return next(new AppError("Token is invalid or expires", 401));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    
    // 3 Update changedPasswordAt property for the user
    // 4 Log the user in, send JWT

    createSendToken(user, 200, res);

    // const token = signToken(user._id);

    // return res.status(200).json({
    //     status: 'success',
    //     token
    // });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1 Get user from collection
    const user = await User.findById(req.user.id).select('+password');
    // console.log({user});

    // 2 Check if current password is correct
    const isCorrectPassword = await user.correctPassowrd(req.body.currentPassword, user.password);
    // console.log("Hello", isCorrectPassword);
    if (!isCorrectPassword) {
        console.log("Hello");
        return next(new AppError('Your current password is wrong', 401))
    }

    // 3 if so , update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // Login and send jwt
    createSendToken(user, 200, res);

    // const token = signToken(user._id);
    // console.log({token});

    // res.status(200).json({
    //     status: 'success',
    //     token
    // });
});