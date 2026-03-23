import { Link, useNavigate } from "@tanstack/react-router";
import { LocalStorage } from "@/storage/LocalStorage";

export function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    LocalStorage.remove("#core-nexus/data-key");
    LocalStorage.remove("#core-nexus/user-email");
    navigate({ to: "/login" });
  };

  return (
    <nav>
      <Link to="/">Core Nexus</Link>
      <ul>
        <li>
          <Link to="/sparks">Sparks</Link>
        </li>
        <li>
          <Link to="/implants">Implants</Link>
        </li>
        <li>
          <Link to="/architects">Architectes</Link>
        </li>
        <li>
          <Link to="/sigils">Sigils</Link>
        </li>
        <li>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
