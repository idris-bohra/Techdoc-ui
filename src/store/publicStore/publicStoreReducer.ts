import publicStoreActionsTypes from "./publicStoreActionsTypes"

type stateType = {
    currentPublicId: string
}

type payloadType = {
    currentPublicId: string
}

type actionType = {
    type: string
    payload: payloadType
}

const initialState: stateType = {
    currentPublicId: ''
}

export default function publicStoreReducer(state: stateType = initialState, action: actionType) {
    switch (action.type) {
        case publicStoreActionsTypes.CURRENT_PUBLIC_ID:
            return { ...state, currentPublicId: action.payload.currentPublicId }
        default:
            return state
    }
}