import { createDynamicSlice } from '@common/utils/createDynamicSlice';
import { API_ROUTES } from '@constants';
const { GET_PREPARE_TIME,
    SUBMIT_PREPARE_ANSWER,
    SUBMIT_PREPARE_ASSESSMENT,
    GET_ASSESSMENT_QUESTIONS_BY_PREPARE } = API_ROUTES.PREPARE_ASSESSMENT;

const prepareSliceConfig = {
    name: 'prepare',
    initialState: {
        timeData: null,
        questionsData: [],
    },
    asyncThunks: [
        {
            name: 'getPrepareTime',
            method: 'get',
            url: GET_PREPARE_TIME,
            storeKey: 'timeData',
        },
        {
            name: 'getAssessmentQuestionsByPrepare',
            method: 'get',
            url: GET_ASSESSMENT_QUESTIONS_BY_PREPARE,
            storeKey: 'questionsData',
        },
        {
            name: 'submitAnswer',
            method: 'post',
            url: SUBMIT_PREPARE_ANSWER,
        },
        {
            name: 'submitAssessment',
            method: 'post',
            url: SUBMIT_PREPARE_ASSESSMENT,
        },
    ],
    reducers: {
        clearTimeData: (state) => {
            state.timeData = null;
        }
    },
};

const { reducer, thunks, actions } = createDynamicSlice(prepareSliceConfig);

export const { getPrepareTime, submitAnswer, submitAssessment, getAssessmentQuestionsByPrepare } = thunks;
export const { clearTimeData, clearError, clearSuccess } = actions;
export default reducer;
