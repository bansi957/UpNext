import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import Mentors from "./pages/Mentors";
import useGetMentors from "./hooks/useGetMentors";
import AskAQuestion from "./pages/AskAQuestion";
import MentorProfilePage from "./pages/MentorProfilePage";
import ProfilePageMentor from "./pages/ProfilePageMentor";
import MyQueries from "./pages/MyQueries";
import useMyQueriesById from "./hooks/useMyQueriesById";
import ViewQuestion from "./pages/ViewQuestion";
import EditQuestion from "./pages/EditQuestion";
import MyRequests from "./pages/MyRequests";
import MentorActiveChats from "./pages/MentorActiveChats";

export const serverUrl = "http://localhost:3000";

function App() {
  useGetCurrentUser();
  useGetMentors();
  useMyQueriesById();
  const { userData } = useSelector((state) => state.user);

  return (
    <Routes>
      <Route
        path="/signup"
        element={userData ? <Navigate to={"/"} /> : <SignUp />}
      />
      <Route
        path="/login"
        element={userData ? <Navigate to={"/"} /> : <SignIn />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to={"/signup"} />}
      />
      <Route
        path="/profile"
        element={userData ? <ProfilePage /> : <Navigate to={"/signup"} />}
      />
      <Route
        path="/profile"
        element={
          userData?.role === "student" ? <ProfilePage /> : <Navigate to="/" />
        }
      />

      {/* Mentor Self Profile */}
      <Route
        path="/mentor/profile"
        element={
          userData?.role === "student" ? (
            <MentorProfilePage />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/profilementor"
        element={
          userData?.role === "mentor" ? (
            <ProfilePageMentor />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/question/:id"
        element={
          userData?.role === "student" ? <ViewQuestion /> : <Navigate to="/" />
        }
      />
      <Route
        path="/question/:id/edit"
        element={
          userData?.role === "student" ? <EditQuestion /> : <Navigate to="/" />
        }
      />
      <Route
        path="/user/mentors"
        element={
          userData?.role == "student" ? <Mentors /> : <Navigate to={"/"} />
        }
      />
      <Route
        path="/user/ask-question"
        element={
          userData?.role == "student" ? <AskAQuestion /> : <Navigate to={"/"} />
        }
      />
      <Route
        path="/user/queries"
        element={
          userData?.role == "student" ? <MyQueries /> : <Navigate to={"/"} />
        }
      />
      <Route
        path="/mentor/requests"
        element={
          userData?.role == "mentor" ? <MyRequests /> : <Navigate to={"/"} />
        }
      />
 <Route
        path="/mentor/chats"
        element={
          userData?.role == "mentor" ? <MentorActiveChats /> : <Navigate to={"/"} />
        }
      />
       
       
    </Routes>
    

  );
}

export default App;
