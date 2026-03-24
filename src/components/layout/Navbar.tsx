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
    <div className="nav">
      <div>
        <img src={`${import.meta.env.BASE_URL}images/economist-tall.gif`} alt="required ad placement" />
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
      </div>
      <img src={`${import.meta.env.BASE_URL}images/scottrade-tall.gif`} alt="necessary ad" />
    </div>
  );
}
