import { NavLink } from "react-router-dom";

import {
  House,
  Waypoints,
  Users,
  Truck,
  Milk,
  Route,
  History,
  FileSliders,
  // SlidersHorizontal,
} from "lucide-react";

const Sidebar = () => {
  return (
    <>
      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow">
            {/* List item */}
            <li>
              <NavLink
                to="."
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              >
                {/* Home icon */}
                <House className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Home</span>
              </NavLink>
            </li>

            {/* List item */}
            <li>
              <NavLink
                to="/farmer"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              >
                {/* Settings icon */}
                <Users className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Farmers</span>
              </NavLink>
            </li>

            {/* List item */}
            <li>
              <NavLink
                to="/fleet"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              >
                {/* Settings icon */}
                <Truck className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Fleet</span>
              </NavLink>
            </li>

            {/* List item */}
            <li>
              <NavLink
                to="/production"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              >
                {/* Settings icon */}
                <Milk className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Production</span>
              </NavLink>
            </li>

            {/* List item */}
            <li>
              <NavLink
                to="/routing"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              >
                {/* Settings icon */}
                <Waypoints className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Route Optimize</span>
              </NavLink>
            </li>

            {/* List item */}
            {/* <li>
              <NavLink
                to="/optimizeSettings"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              >

                <SlidersHorizontal className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">
                  Optimize Settings
                </span>
              </NavLink>
            </li> */}

            {/* List item */}
            <li>
              <NavLink
                to="/route_control"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              >
                {/* Settings icon */}
                <Route className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Route Control</span>
              </NavLink>
            </li>

            {/* List item */}
            <li>
              <NavLink
                to="/route_history"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              >
                {/* Settings icon */}
                <History className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Route History</span>
              </NavLink>
            </li>

            {/* List item */}
            <li>
              <NavLink
                to="/config"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              >
                {/* Settings icon */}
                <FileSliders className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Configurations</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
