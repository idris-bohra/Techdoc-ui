import publicStoreActionsTypes from "./publicStoreActionsTypes";

export function storeCurrentPublicId(currentPublicId: string) {
    return {
        type: publicStoreActionsTypes.CURRENT_PUBLIC_ID,
        payload: {
            currentPublicId
        }
    }
}