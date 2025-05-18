import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Feed from './pages/Feed';
import BlogDetail from './pages/BlogDetail';
import Preview from './pages/Preview';
import Drafts from './pages/Drafts';
import CreateBlog from './pages/CreateBlog';

import '@blocknote/core/style.css';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Feed />} />
        <Route path="blog/:id" element={<BlogDetail />} />
        <Route path="preview/:id" element={<Preview />} />
        <Route path="drafts" element={<Drafts />} />
        <Route path="create" element={<CreateBlog />} /> {/* New Route */}

      </Route>
    </Routes>
  );
}
