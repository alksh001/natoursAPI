class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // 4xx = fail, 5xx = error
        this.isOperational = true;

        // console.log("opr",this.isOperational);

        Error.captureStackTrace(this, this.constructor);

    }
}

module.exports = AppError;