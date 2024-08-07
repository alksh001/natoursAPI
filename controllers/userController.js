const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filteredObj = (obj, ...allowdFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowdFields.includes(el)) newObj[el] = obj[el]
  });
  return newObj;
}

exports.getAllUsers =catchAsync( async(req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
    });
});


exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {

  // Create eror if user posts passowrd
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not open to modify password!', 400));
  }

  // Filtered the elements that are not allowed to be updated
  const filteredBody = filteredObj(req.body, "name", 'email');
  
  // Update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser 
    }
  })
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
