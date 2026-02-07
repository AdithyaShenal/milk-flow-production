import { NavLink } from "react-router-dom";
import ThemeController from "./ThemeController";
import profileImage from "../assets/images/user_profile.png";
import useLogout from "../hooks/useLogout";
import { Info, LogOut, User } from "lucide-react";

const NavBar = () => {
  const { mutate: logout } = useLogout();

  return (
    <>
      {/* Navbar */}
      <nav className="navbar w-full border-b border-base-300">
        <label
          htmlFor="my-drawer-4"
          aria-label="open sidebar"
          className="btn btn-square btn-ghost"
        >
          {/* Sidebar toggle icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2"
            fill="none"
            stroke="currentColor"
            className="my-1.5 inline-block size-4"
          >
            <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
            <path d="M9 4v16"></path>
            <path d="M14 10l2 2l-2 2"></path>
          </svg>
        </label>
        <div className="px-4 font-bold">
          Supply & Logistic Management System
        </div>
        <div className="ml-auto flex justify-center items-center gap-10 mr-2">
          <ThemeController />

          <div className="dropdown dropdown-end cursor-pointer">
            <div tabIndex={0} role="button" className="m-1">
              <div>
                <div className="avatar avatar-online rounded-full ring-2 border border-base-300 hover:ring-black/50 transition-all duration-300">
                  <div className="rounded-full">
                    <img src={profileImage} className="size-11" />
                  </div>
                </div>
              </div>
            </div>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-md border  border-base-300">
              <li>
                <NavLink to="adminProfile">
                  <User className="size-4" />
                  Profile
                </NavLink>
              </li>
              <li>
                <button>
                  <Info className="size-4" />
                  Info
                </button>
              </li>
              <li>
                <button className="text-red-500" onClick={() => logout()}>
                  <LogOut className="size-4" />
                  Log out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
