import { Button } from "primereact/button";
import { Dispatch, SetStateAction } from "react";

interface FirstRowProps {
  value: string | undefined;
  setBuyTokenDialog: Dispatch<SetStateAction<boolean>>;
  setSellTokenDialog: Dispatch<SetStateAction<boolean>>;
}

export const FirstRow = ({
  value,
  setBuyTokenDialog,
  setSellTokenDialog,
}: FirstRowProps) => {
  return (
    <div className="flex w-full justify-content-around">
      <div className="grid p-3 w-10">
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round min-height-card">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">Conto</span>
                <div className="text-900 font-medium text-xl">
                  {value ? value : 0} EXC
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-green-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className="pi pi-wallet text-green-500 text-xl"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round min-height-card">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">Noleggi</span>
                <div className="text-900 font-medium text-xl">100</div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className="pi pi-key text-blue-500 text-xl"></i>
              </div>
            </div>
            <span className="text-500 font-medium">di cui attivi: 1</span>
          </div>
        </div>
      </div>
      <div className="flex flex-column gap-3 justify-content-center">
        <Button
          label="Compra token"
          severity="success"
          rounded
          onClick={() => setBuyTokenDialog(true)}
        />
        <Button
          label="Vendi token"
          severity="danger"
          rounded
          onClick={() => setSellTokenDialog(true)}
        />
      </div>
    </div>
  );
};
