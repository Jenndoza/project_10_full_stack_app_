import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./styles/global.css";

import Courses from "./components/Courses";
import CourseDetail from "./components/CourseDetail";
import UserSignIn from "./components/UserSignIn";
import UserSignUp from "./components/UserSignUp";
import CreateCourse from "./components/CreateCourse";
import UpdateCourse from "./components/UpdateCourse";
import Header from "./components/Header";
import UserSignOut from "./components/UserSignOut";
import NotFound from "./components/NotFound";
import PrivateRoute from "./PrivateRoute";
import useContext from "./Context";

const UserSignUpWithContext = useContext(UserSignUp);
const UserSignInWithContext = useContext(UserSignIn);
const UserSignOutWithContext = useContext(UserSignOut);
const HeaderWithContext = useContext(Header);
const CoursesWithContext = useContext(Courses);
const CourseDetailWithContext = useContext(CourseDetail);
const UpdateCourseWithContext = useContext(UpdateCourse);
const CreateCourseWithContext = useContext(CreateCourse);

export default () => (
  <Router>
      <HeaderWithContext />
      <Switch>
        <Route exact path="/" component={CoursesWithContext} />
        <PrivateRoute
          path="/courses/create"
          component={CreateCourseWithContext}
        />
        <PrivateRoute
          path="/courses/:id/update"
          component={UpdateCourseWithContext}
        />
        <Route path="/courses/:id" component={CourseDetailWithContext} />
        <Route path="/signin" component={UserSignInWithContext} />
        <Route path="/signup" component={UserSignUpWithContext} />
        <Route path="/signout" component={UserSignOutWithContext} />
        <Route component={NotFound} />
      </Switch>
    
  </Router>
);