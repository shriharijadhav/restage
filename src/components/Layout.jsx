import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-4 py-3 flex gap-4">
        <Link to="/">Feed</Link>
        <Link to="/drafts">Drafts</Link>
        <Link to="/create">Create</Link>
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
