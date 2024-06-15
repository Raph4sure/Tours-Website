// Suggested code may be subject to a license. Learn more: ~LicenseLog:1304724356.
class AppError extends Error{
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperation = true;
    }
}