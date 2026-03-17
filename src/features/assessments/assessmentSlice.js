import { createDynamicSlice } from '@common/utils/createDynamicSlice';
import { API_ROUTES } from '@constants';
const { CURD_ASSESSMENT,
    GET_ASSESSMENT_DETAILS,
    GENERATE_ASSESSMENT_AI,
    UPDATE_ASSESSMENT, DELETE_ASSESSMENT, ADD_QUESTION, UPDATE_QUESTION, DELETE_QUESTION
} = API_ROUTES.ASSESSMENT;

const assessmentSliceConfig = {
    name: 'assessments',
    initialState: {
        list: [],
        details: null,
        totalCount: 0,
    },
    asyncThunks: [
        {
            name: 'getAssessments',
            method: 'get',
            url: CURD_ASSESSMENT,
            customExtraReducer: true,
        },
        {
            name: 'getAssessmentById',
            method: 'get',
            url: GET_ASSESSMENT_DETAILS,
            storeKey: 'details',
        },
        {
            name: 'createAssessment',
            method: 'post',
            url: CURD_ASSESSMENT,
        },
        {
            name: 'generateAssessmentAi',
            method: 'post',
            url: GENERATE_ASSESSMENT_AI,
        },
        {
            name: 'updateAssessment',
            method: 'put',
            url: UPDATE_ASSESSMENT,
        },
        {
            name: 'deleteAssessment',
            method: 'delete',
            url: DELETE_ASSESSMENT,
        },
        {
            name: 'addQuestion',
            method: 'post',
            url: ADD_QUESTION,
        },
        {
            name: 'updateQuestion',
            method: 'put',
            url: UPDATE_QUESTION,
        },
        {
            name: 'deleteQuestion',
            method: 'delete',
            url: DELETE_QUESTION,
        },
    ],
    reducers: {
        clearCurrentAssessment: (state) => {
            state.details = null;
        },
    },
    extraReducers: (builder, thunks) => {
        builder.addCase(thunks.getAssessments.fulfilled, (state, action) => {
            state.loading = false;
            // Assume API returns { items: [], total: 0 } or just an array
            if (action.payload?.items) {
                state.list = action.payload.items;
                state.totalCount = action.payload.total || action.payload.items.length;
            } else if (Array.isArray(action.payload)) {
                state.list = action.payload;
                state.totalCount = action.payload.length;
            }
        });
    }
};

const { reducer, thunks, actions } = createDynamicSlice(assessmentSliceConfig);

export const { getAssessments, getAssessmentById, createAssessment, generateAssessmentAi, updateAssessment, deleteAssessment, addQuestion, updateQuestion, deleteQuestion } = thunks;
export const { clearCurrentAssessment, clearError, clearSuccess } = actions;
export default reducer;
