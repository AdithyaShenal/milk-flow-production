import { Link, Outlet } from "react-router-dom";

const FleetPage = () => {
  return (
    <>
      <div className="flex flex-col gap-2">
        {/* Sub menu */}
        <div>
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <Link to=".">Drivers</Link>
              </li>
              <li>
                <Link to="trucks">Trucks</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Outlet */}
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default FleetPage;
