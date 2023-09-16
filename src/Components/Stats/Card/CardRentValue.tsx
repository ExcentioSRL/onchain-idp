export const CardRentValue = () => {
  return (
    <div className="col-12 md:col-6 lg:col-3">
      <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round min-height-card">
        <div className="flex justify-content-between mb-3">
          <div>
            <span className="block text-500 font-medium mb-3">Noleggi</span>
            <div className="text-900 font-medium" style={{ fontSize: "1rem" }}>
              100
            </div>
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
  );
};
