import { createDynamicSlice } from '@common/utils/createDynamicSlice';
import { API_ROUTES } from '@constants';
const { GET_PREPARE_TIME,
    SUBMIT_PREPARE_ANSWER,
    SUBMIT_PREPARE_ASSESSMENT, } = API_ROUTES.PREPARE_ASSESSMENT;

const prepareSliceConfig = {
    name: 'prepare',
    initialState: {
        timeData: null,
    },
    asyncThunks: [
        {
            name: 'getPrepareTime',
            method: 'get',
            url: GET_PREPARE_TIME,
            storeKey: 'timeData',
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

export const { getPrepareTime, submitAnswer, submitAssessment } = thunks;
export const { clearTimeData, clearError, clearSuccess } = actions;
export default reducer;
