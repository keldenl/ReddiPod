import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between py-6 bg-black text-white px-4">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold">
          ReddiPod
        </Link>
      </div>
      {/* <div className="flex items-center">
        <img
          src="/profile-icon.png"
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      </div> */}
    </nav>
  );
}

export default Navbar;
