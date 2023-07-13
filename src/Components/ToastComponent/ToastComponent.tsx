import { RefObject } from "react";
import { Toast } from "primereact/toast";

const ToastComponent = ({ toast }: { toast: RefObject<Toast> }) => {
  return <Toast ref={toast} />;
};

export default ToastComponent;
