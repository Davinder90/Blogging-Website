import { Children, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserAuthForm from './Components/UserAuthForm/UserAuthForm.jsx';
import { Provider } from "react-redux";
import { store } from './Store/blogStore.js';
import Editor from './Pages/Editor-Page/Editor.jsx';
import HomePage from './Pages/Home-Page/HomePage.jsx';
import SearchPage from './Pages/Search-Page/SearchPage.jsx';
import PageNotFound from './Components/PageNotFound404/PNF404.jsx';
import Navbar from './Components/Navbar/Navbar.jsx';
import UserProfilePage from './Pages/User-Profile-Page/UserProfilePage.jsx';
import BlogPage from './Pages/Blog-Page/BlogPage.jsx';
import SideNav from './Components/SideNav/SideNav.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement : <PageNotFound/>,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/search/:query",
        element: <SearchPage />
      },
      {
        path: "/sign-in",
        element: <UserAuthForm type="sign-in" />
      },
      {
        path: "/sign-up",
        element: <UserAuthForm type="sign-up" />
      },
      {
        path : "/user/:id",
        element: <UserProfilePage />
      },
      {
        path : "/blog/:blog_id",
        element : <BlogPage />
      },
      {
        path : "/settings",
        element : <SideNav />,
        children : [
          {
            path : "/settings/edit-profile",
            element : <h1>edit profile</h1>
          },
          {
            path : "/settings/change-password",
            element : <h1>change password</h1>
          }
        ]
      }
    ],
  },
  {
    path: "/editor",
    element: <Editor />
  },
  {
    path : "/editor/:blog_id",
    element : <Editor />
  }
]);

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  // {/* </StrictMode>, */}
)
