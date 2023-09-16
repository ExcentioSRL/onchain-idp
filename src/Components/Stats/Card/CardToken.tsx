import { ProgressSpinner } from "primereact/progressspinner";

export const CardToken = ({
  loading,
  value,
}: {
  loading: boolean;
  value: string | undefined;
}) => {
  return (
    <div className="col-12 md:col-6 lg:col-3">
      <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round min-height-card">
        <div className="flex justify-content-between mb-3">
          <div>
            <span className="block text-500 font-medium mb-3">Conto</span>
            <div className="text-900 font-medium " style={{ fontSize: "1rem" }}>
              {loading ? (
                <ProgressSpinner
                  style={{ height: "40px", width: "40px" }}
                  strokeWidth="5"
                />
              ) : (
                <> {value ? value : 0} EXC</>
              )}
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
  );
};
