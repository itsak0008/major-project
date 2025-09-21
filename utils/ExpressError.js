class ExpressError extends Error {
    constructor(statuscode, message) {
        super();
        this.statuscode;
        this.message;
    }
}

module.exports = ExpressError;