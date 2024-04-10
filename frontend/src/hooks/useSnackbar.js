import { useReducer } from "react";

export function useSnackbar(defaultSnackbar) {

    const [snackbar, dispatch] = useReducer(snackbarReducer, defaultSnackbar);

    return [snackbar, dispatch];
};

function snackbarReducer(state, action) {
    switch (action.type) {
        case OPEN_SNACKBAR:
            return {
                ...state,
                open: true,
                content: action.payload.content,
                severity: action.payload.severity,
            };
        case CLOSE_SNACKBAR:
            return {
                ...state,
                open: false,
            };
        default:
            throw Error('Unknown action: ' + action.type);
    }
}

export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const defaultSnackbar = {
    content: "",
    severity: "",
    open: false,
    vertical: "bottom",
    horizontal: "right",
};