const errorCodes = {
    'EMAIL_ALREADY_EXISTS': { status: 409, message: 'A candidate with this email already exists.' },
    'DUPLICATE_PHONE_NUMBER': { status: 409, message: 'Phone nubmber is alredy registered' },
    'DUPLICATE_RESULT': { status: 409, message: 'You have already attended the test' },
    'EMAIL_SENDING_FAILED': { status: 500, message: 'We were unable to send an OTP email. Please try again later.' },
    'DATABASE_ERROR': { status: 500, message: 'Database error occurred.' },
    'NOT_FOUND': { status: 404, message: 'Candidate not found.' },
    'QUESTION_NOT_FOUND': { status: 404, message: 'Question not found.' },
    'INTERNAL_SERVER_ERROR': { status: 500, message: 'An unexpected error occurred. Please try again later.' },
    'USER_NOT_AUTHORIZED': { status: 403, message: 'User is not authorized to perform this action.' },
    'OTP_EXPIRED': { status: 408, message: 'The OTP has expired. Please request a new one.' },
    'INVALID_OTP': { status: 400, message: 'The OTP you entered is invalid. Please try again.' },
    'EMAIL_NOT_VERIFIED': { status: 400, message: 'Email exists, but OTP verification is pending.' },
    'INVALID_CREDENTIALS': { status: 401, message: 'Invalid Credentials.' },
    'SUBJECT_ALREADY_EXIST': { status: 409, message: 'Subject Already exists.' },
    'TOPIC_NAME_EXIST': { status: 409, message: 'Topic Already exists.' },
    'SUBJECT_NOT_FOUND': { status: 404, message: 'Subject Not Found.' },
    'TOPIC_NOT_FOUND': { status: 404, message: 'Topic Not Found.' },
    'NO_TOPICS_ASSIGNED': { status: 404, message: 'No Topics are assigend for this Subject' },
    'INVALID_INPUT': { status: 401, message: 'Invalid input' },
    'NO_TOPICS_FOUND': { status: 404, message: 'No active topics found' },
    'NO_QUESTIONS_FOUND': { status: 404, message: 'No Questions assigned for this test link.' },
    'BAD_REQUEST': { status: 404, message: 'One or More fields are missing.' },
    'FORBIDDEN': {status : 404, message : 'Access Forbidden'},
};

const handleError = (res, error) => {
    const errorDetails = errorCodes[error.code] || errorCodes['INTERNAL_SERVER_ERROR']; // Default to internal server error
    return res.status(errorDetails.status).json({
        message: errorDetails.message,
        code: error.code,
    });
};

module.exports = handleError;