class CustomError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = this.constructor.name;
    }
}

module.exports = CustomError;