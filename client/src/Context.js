import React, { Component } from "react";
import Data from "./Data";
import Cookies from "js-cookie";
export const Context = React.createContext();

export class Provider extends Component {
  constructor() {
    super();
    this.data = new Data();
    this.cookie = Cookies.get("authenticatedUser");
    this.state = {
      authenticatedUser: this.cookie ? JSON.parse(this.cookie) : null,
      courses: [],
      course: {},
    };
  }
  state = {
    authenticatedUser: null,
    courses: [],
    course: {},
  };

  render() {
    const { authenticatedUser, courses, course } = this.state;
    const value = {
      authenticatedUser,
      courses,
      course,
      data: this.data,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut,
        allCourses: this.allCourses,
        getCourseDetail: this.getCourseDetail,
      },
    };
    return (
      <Context.Provider value={value}>{this.props.children}</Context.Provider>
    );
  }

  signIn = async (emailAddress, password) => {
    const user = await this.data.getUser(emailAddress, password);
    console.log(user);
    if (user !== null) {
      this.setState(() => {
        return {
          authenticatedUser: user,
        };
      });
      Cookies.set("authenticatedUser", JSON.stringify(user), { expires: 1 });
    }
    return user;
  };

  signOut = () => {
    this.setState(() => {
      return {
        authenticatedUser: null,
      };
    });
    Cookies.remove("authenticatedUser");
  };

  allCourses = async () => {
    const courses = await this.data.getCourses();
    this.setState(() => {
      return {
        courses: courses,
      };
    });
  };

  getCourseDetail = async (id) => {
    const course = await this.data.getCourses(id);
    this.setState(() => {
      return {
        course: course,
      };
    });
  };
}

export const Consumer = Context.Consumer;

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {(context) => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  };
}
