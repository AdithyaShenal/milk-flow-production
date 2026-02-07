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
  UserStar,
  // SlidersHorizontal,
} from "lucide-react";
import useAuthStore from "../stores/useAuthStore";

const Sidebar = () => {
  const { user } = useAuthStore();

  return (
    <>
      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className=" text-white flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64 bg-neutral-800">
          {/* Sidebar content here */}
          <ul className="menu w-full grow">
            {/* List item */}
            <li>
              <NavLink
                end
                to="."
                className={({ isActive }) =>
                  `
                  is-drawer-close:tooltip 
                  is-drawer-close:tooltip-right 
                  hover:bg-neutral-600
                  hover:text-white
                  flex items-center gap-2 px-3 py-2 rounded-lg transition
                  my-1
                  ${isActive ? "bg-neutral-600 text-white shadow-sm" : ""}
    `
                }
              >
                <House className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Home</span>
              </NavLink>
            </li>

            {/* List item */}
            <li>
              <NavLink
                to="farmer"
                className={({ isActive }) =>
                  `
                  is-drawer-close:tooltip 
                  is-drawer-close:tooltip-right 
                  hover:bg-neutral-600
                  hover:text-white
                  flex items-center gap-2 px-3 py-2 rounded-lg transition
                  my-1
                  ${isActive ? "bg-neutral-600 text-white shadow-sm" : ""}
    `
                }
              >
                {/* Settings icon */}
                <Users className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Farmers</span>
              </NavLink>
            </li>

            {/* List item */}
            <li>
              <NavLink
                to="fleet"
                className={({ isActive }) =>
                  `
                  is-drawer-close:tooltip 
                  is-drawer-close:tooltip-right 
                  hover:bg-neutral-600
                  hover:text-white
                  flex items-center gap-2 px-3 py-2 rounded-lg transition
                  my-1
                  ${isActive ? "bg-neutral-600 text-white shadow-sm" : ""}
    `
                }
              >
                {/* Settings icon */}
                <Truck className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Fleet</span>
              </NavLink>
            </li>

            {/* List item */}
            <li>
              <NavLink
                to="production"
                className={({ isActive }) =>
                  `
                  is-drawer-close:tooltip 
                  is-drawer-close:tooltip-right 
                  hover:bg-neutral-600
                  hover:text-white
                  flex items-center gap-2 px-3 py-2 rounded-lg transition
                  my-1
                  ${isActive ? "bg-neutral-600 text-white shadow-sm" : ""}
    `
                }
              >
                {/* Settings icon */}
                <Milk className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Production</span>
              </NavLink>
            </li>

            {/* List item */}
            <li>
              <NavLink
                to="routing"
                className={({ isActive }) =>
                  `
                  is-drawer-close:tooltip 
                  is-drawer-close:tooltip-right 
                  hover:bg-neutral-600
                  hover:text-white
                  flex items-center gap-2 px-3 py-2 rounded-lg transition
                  my-1
                  ${isActive ? "bg-neutral-600 text-white shadow-sm" : ""}
    `
                }
              >
                {/* Settings icon */}
                <Waypoints className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Route Optimize</span>
              </NavLink>
            </li>

            {/* List item */}
            <li>
              <NavLink
                to="route_control"
                className={({ isActive }) =>
                  `
                  is-drawer-close:tooltip 
                  is-drawer-close:tooltip-right 
                  hover:bg-neutral-600
                  hover:text-white
                  flex items-center gap-2 px-3 py-2 rounded-lg transition
                  my-1
                  ${isActive ? "bg-neutral-600 text-white shadow-sm" : ""}
    `
                }
              >
                {/* Settings icon */}
                <Route className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Route Control</span>
              </NavLink>
            </li>

            {/* List item */}
            <li>
              <NavLink
                to="route_history"
                className={({ isActive }) =>
                  `
                  is-drawer-close:tooltip 
                  is-drawer-close:tooltip-right 
                  hover:bg-neutral-600
                  hover:text-white
                  flex items-center gap-2 px-3 py-2 rounded-lg transition
                  my-1
                  ${isActive ? "bg-neutral-600 text-white shadow-sm" : ""}
    `
                }
              >
                {/* Settings icon */}
                <History className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Route History</span>
              </NavLink>
            </li>

            {/* List item */}
            <li>
              <NavLink
                to="config"
                className={({ isActive }) =>
                  `
                  is-drawer-close:tooltip 
                  is-drawer-close:tooltip-right 
                  hover:bg-neutral-600
                  hover:text-white
                  flex items-center gap-2 px-3 py-2 rounded-lg transition
                  my-1
                  ${isActive ? "bg-neutral-600 text-white shadow-sm" : ""}
    `
                }
              >
                {/* Settings icon */}
                <FileSliders className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Configurations</span>
              </NavLink>
            </li>

            {/* List item */}
            {user.role === "super-admin" && (
              <li>
                <NavLink
                  to="admin_control"
                  className={({ isActive }) =>
                    `
                  is-drawer-close:tooltip 
                  is-drawer-close:tooltip-right 
                  hover:bg-neutral-600
                  hover:text-white
                  flex items-center gap-2 px-3 py-2 rounded-lg transition
                  my-1
                  ${isActive ? "bg-neutral-600 text-white shadow-sm" : ""}
    `
                  }
                >
                  {/* Settings icon */}
                  <UserStar className="my-1.5 inline-block size-4" />
                  <span className="is-drawer-close:hidden">Configurations</span>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
