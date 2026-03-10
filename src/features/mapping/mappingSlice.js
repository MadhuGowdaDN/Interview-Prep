import { createDynamicSlice } from '@common/utils/createDynamicSlice';
import { API_ROUTES } from '@constants';
const { CURD_MAPPING,
    START_MAPPING_PREPARE,
    VIEW_MAPPING_DETAILS,
} = API_ROUTES.ASSESSMENT_MAPPING;

const mappingSliceConfig = {
    name: 'mapping',
    initialState: {
        list: [],
        totalCount: 0,
    },
    asyncThunks: [
        {
            name: 'getMappings',
            method: 'get',
            url: CURD_MAPPING,
            customExtraReducer: true,
        },
        {
            name: 'getMappingDetails',
            method: 'get',
            url: VIEW_MAPPING_DETAILS,
            stateKey: "details",
        },
        {
            name: 'createMapping',
            method: 'post',
            url: CURD_MAPPING,
        },
        {
            name: 'startPrepareMapping',
            method: 'patch',
            url: START_MAPPING_PREPARE,
        },
    ],
    reducers: {},
    extraReducers: (builder, thunks) => {
        builder.addCase(thunks.getMappings.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload?.data) {
                state.data = action.payload.data;
                state.totalCount = action.payload.total || action.payload.data.length;
            }
        });
    }
};

const { reducer, thunks, actions } = createDynamicSlice(mappingSliceConfig);

export const { getMappings, createMapping, startPrepareMapping } = thunks;
export const { clearError, clearSuccess } = actions;
export default reducer;
