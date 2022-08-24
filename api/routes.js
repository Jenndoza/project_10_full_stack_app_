"use strict";

// load modules
const express = require("express");
const morgan = require("morgan");
const { authenticateUser } = require("./middleware/auth-user");

const router = express.Router();
//const {model} = require("./models")
const { User, Course } = require("./models");

router.use(express.json());

//Handler function for all routes
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}

//User Get Route that returns a list of users
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    //const user = await req.currentUser;
    res.status(200).json(req.currentUser);
  })
);

//User Post Route that creates a new user
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).location("/").end();
    } catch (error) {
      console.log("ERROR: ", error.name);
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

//Courses GET route that will return all courses inluding User associated w that course
router.get(
  "/courses",
  asyncHandler(async (req, res, next) => {
    const courses = await Course.findAll({
      include: {
        model: User,
				as: "user"
      },
    });
		if(courses) {
			res.json(courses).status(200);
		} else {
			res.status(404).json({message: "The course you are looking for doesn't exist."})
		}
  })
);

//Courses GET route that will return corresponding course w User associated w that course
router.get(
  "/courses/:id",
  asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id, {
			attributes: [
				"id", "title", "description", "estimatedTime", "materialsNeeded", "userId"
			],
      include: [
				{
        	model: User,
					as: "user",
					attributes: [
						"id", "firstName", "lastName", "emailAddress"
					]
      	},
			]
    });

		if(course) {
			res.json(course).status(200);
		} else {
			res.status(404).json({message: "The course you are looking for doesn't exist."})
		}
  })
);

//Courses POST route that will create a new course
router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    try {
      const courseId = await Course.create(req.body);
      res.status(201).location(`/courses/${courseId.id}`).end();
    } catch (error) {
      console.log("ERROR: ", error.name);

      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

//Courses PUT route that updates corresponding course
router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      const user = req.currentUser;
      if (user.id === course.userId) {
        try {
          await course.update(req.body);
          res.status(204).end();
        } catch (error) {
          console.log("ERROR: ", error.name);
          if (
            error.name === "SequelizeValidationError" ||
            error.name === "SequelizeUniqueConstraintError"
          ) {
            const errors = error.errors.map((err) => err.message);
            res.status(400).json({ errors });
          } else {
            next(error);
          }
        }
      } else {
				res.status(403).json({message:  "You are not allowed to update this course."});
			}
    } else {
			res.status(404).json({message: "The course you are looking for doesn't exist."});
		}
  })
);

//Courses DELETE route that will delete the corresponding course
router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
		const course = await Course.findByPk(req.params.id);
		if(course) {
			const user = req.currentUser;
			if(course.userId === user.id) {
				try {
					await course.destroy();
					res.status(204).end();
				} catch (err) {
					res.status(500).json({ message: err.message });
				}
			} else {
				res.status(403).json({message: "You are not allowed to delete this course"});
			}
		} else {
			res.status(404).json({message: "The course you are looking for doesn't exist."});
		}
  })
);

module.exports = router;
