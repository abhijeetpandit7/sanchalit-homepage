import { NavLink } from "react-router";
import { brandLogo } from "../../utils";

export const Navbar = () => {
  return (
    <nav className="px-4 py-2">
      <div className="flex items-center">
        <NavLink to="/" className="w-12 h-12 mr-8">
          {brandLogo}
        </NavLink>
        <NavLink
          to="/account"
          className={(navData) =>
            navData.isActive ? "text-lg nav-link-active" : "text-lg"
          }
        >
          Account
        </NavLink>
      </div>
    </nav>
  );
};
