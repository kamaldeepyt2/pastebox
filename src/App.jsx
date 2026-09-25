import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import ViewPaste from './components/ViewPaste.jsx'
import Paste from './components/Paste.jsx'

const Layout = ({ children }) => (
  <div className="app-shell">
    <Navbar />
    <main className="app-main">{children}</main>
  </div>
);

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout><Home /></Layout>
    },

    {
      path: "/pastes",
      element: <Layout><Paste /></Layout>
    },

    {
      path: "/pastes/:id",
      element: <Layout><ViewPaste /></Layout>
    },
  ]
);

function App() {

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
