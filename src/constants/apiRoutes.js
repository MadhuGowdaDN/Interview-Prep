const API_VERSION = 'api/v1';
const API_BASE_URL = 'http://localhost:3006';

const getFormattedRoute = (route) => {
    return `${API_BASE_URL}/${API_VERSION}/${route}`
}
export const API_ROUTES = {
    // Auth
    AUTH: {
        LOGIN: getFormattedRoute('auth/login'),
        REGISTER: getFormattedRoute('auth/register'),
        IS_USER_ACTIVE: getFormattedRoute('auth/status'),
        LOGOUT: getFormattedRoute('auth/logout'),
        REFRESH: getFormattedRoute('auth/refresh'),
    },

    // Assessments
    ASSESSMENT: {
        CURD_ASSESSMENT: getFormattedRoute('assessments'),
        GET_ASSESSMENT_DETAILS: getFormattedRoute('assessments/:id'),
        GENERATE_ASSESSMENT_AI: getFormattedRoute('assessment-ai/generate'),
        UPDATE_ASSESSMENT: getFormattedRoute('assessments/:id'),
        DELETE_ASSESSMENT: getFormattedRoute('assessments/:id'),
        ADD_QUESTION: getFormattedRoute('assessments/:id/questions'),
        UPDATE_QUESTION: getFormattedRoute('assessments/:id/questions/:questionId'),
        DELETE_QUESTION: getFormattedRoute('assessments/:id/questions/:questionId'),
    },

    ASSESSMENT_MAPPING: {// Mapping
        CURD_MAPPING: getFormattedRoute('assessment-mapping'),
        START_MAPPING_PREPARE: getFormattedRoute('assessment-mapping/start-prepare'),
        VIEW_MAPPING_DETAILS: getFormattedRoute('assessment-mapping/details'),
    },

    // Prepare
    PREPARE_ASSESSMENT: {
        GET_PREPARE_TIME: getFormattedRoute('prepare-assessments/fetch-time'),
        SUBMIT_PREPARE_ANSWER: getFormattedRoute('prepare-assessments/answer'),
        SUBMIT_PREPARE_ASSESSMENT: getFormattedRoute('prepare-assessments/submit'),
        GET_ASSESSMENT_QUESTIONS_BY_PREPARE: getFormattedRoute('prepare-assessments/questions/:mappingId'),
    },
};
