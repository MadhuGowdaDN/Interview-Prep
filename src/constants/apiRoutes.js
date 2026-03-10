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
        LOGOUT: getFormattedRoute('auth/logout'),
        REFRESH: getFormattedRoute('auth/refresh'),
    },

    // Assessments
    ASSESSMENT: {
        CURD_ASSESSMENT: getFormattedRoute('assessments'),
        GET_ASSESSMENT_DETAILS: getFormattedRoute('assessments/:id'),
        GENERATE_ASSESSMENT_AI: getFormattedRoute('assessment-ai/generate'),
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
    },
};
