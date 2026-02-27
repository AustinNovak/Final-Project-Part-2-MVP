import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/log">Log Trip</Link>
      <Link to="/trips">My Trips</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}

export default Navigation;