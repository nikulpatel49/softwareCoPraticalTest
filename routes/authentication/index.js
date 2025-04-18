const express = require("express");

const router = express.Router();
const authController = require("../../controllers/auth/auth.controller");
const authSchema = require("../../schemas/auth/auth.schema");
const { validate } = require("../../middlewares/validator.middleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User login and Register
 */
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: nks
 *               lastName:
 *                 type: string
 *                 example: ptl
 *               username:
 *                 type: string
 *                 example: nks
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nks@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongPassword123
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: strongPassword123
 *                 description: Must match the password
 *               role:
 *                 type: string
 *                 description: Role ID (ObjectId)
 *                 example: 661f1a12cd2d86ab2a23e85d
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               msg: User created successfully
 *               data:
 *                 user:
 *                   id: 661f1b23a2cd3a001efcb792
 *                   username: nks
 *                   email: nks@example.com
 *                   role: 661f1a12cd2d86ab2a23e85d
 *       400:
 *         description: Role is invalid or inactive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: role
 *                       message:
 *                         type: string
 *                         example: role is either invalid or currently inactive.
 *                 msg:
 *                   type: string
 *                   example: role is either invalid or currently inactive.
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 500
 *               msg: Internal server error
 */

/**
 * @route POST /auth/signup:
 * @description Register a new user
 * @access Private
 */
router.post(
	"/signup",
	validate(authSchema.validateSignUpSchema),
	authController.registerUser
);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user with email and password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nks@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongPassword123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 msg:
 *                   type: string
 *                   example: User successfully login.
 *       400:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 400
 *               msg: Invalid email or password
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 500
 *               msg: Internal server error
 */
/**
 * @route POST /auth/login:
 * @description Login user
 * @access Private
 */
router.post(
	"/login",
	validate(authSchema.validateLoginSchema),
	authController.login
);
module.exports = router;
