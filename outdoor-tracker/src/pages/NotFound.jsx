import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="notfound">
      <h2>404</h2>
      <p>This page doesn't exist in the wilderness.</p>
      <Link to="/">← Head back home</Link>
    </div>
  );
}

export default NotFound;
