import { Toast } from "primereact/toast";
import { RefObject } from "react";

const checkToast = (toast: RefObject<Toast>) => {
    return toast.current != null ? true : false;
}
export const showSuccess = (toast: RefObject<Toast>, detail: string) => {
    if (checkToast(toast))
        toast.current!.show({ severity: 'success', summary: 'Success', detail: detail, life: 3000 });
}

export const showInfo = (toast: RefObject<Toast>, detail: string) => {
    if (checkToast(toast))
        toast.current!.show({ severity: 'info', summary: 'Info', detail: detail, life: 3000 });
}

export const showWarn = (toast: RefObject<Toast>, detail: string) => {
    if (checkToast(toast))
        toast.current!.show({ severity: 'warn', summary: 'Warning', detail: detail, life: 3000 });
}

export const showError = (toast: RefObject<Toast>, detail: string) => {
    if (checkToast(toast))
        toast.current!.show({ severity: 'error', summary: 'Error', detail: detail, life: 3000 });
}