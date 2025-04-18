const express = require("express");
const userController = require("../../controllers/user/user.controller");
// const authenticate = require('../../middlewares/admin/authenticate.middleware');
const userSchema = require("../../schemas/user/user.schema");
const { validate } = require("../../middlewares/validator.middleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Api for manage user. All routes under require `authentication` and are accessible after successful login.
 */

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: get all users
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data: [{
 *       		  "_id": "680139893f6a04350bbe098a",
 *       		  "username": "nks",
 *       		  "firstName": "nks",
 *       		  "lastName": "ptl",
 *       		  "email": "nks@example.com",
 *       		  "role": {
 *       		  	"_id": "6800fc654d3117f081bfb34d",
 *       		  	"name": "string"
 *       		  },
 *       		  "active": true,
 *       		  "createdAt": "2025-04-17T17:25:29.407Z"
 * 				 }]
 *               msg: message
 *       400:
 *         description: Error response
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 400
 *               msg: error message.
 */

/**
 * @route GET  /user/all
 * @description get all users
 * @access Private
 */
router.get("/all", userController.getUsers);

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: create a new user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
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
 *         description: Validation or duplicate email/username error
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 400
 *               msg: error message.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 500
 *               msg: Internal server error
 */
/**
 * @route POST /user/create:
 * @description Create a new user
 * @access Private
 */
router.post(
	"/create",
	validate(userSchema.createUserSchema),
	userController.addNewUser
);

/**
 * @swagger
 * /user/update/{id}:
 *   put:
 *     summary: Update user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - username
 *               - email
 *               - role
 *               - active
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
 *               active:
 *                 type: Boolean
 *                 example: true
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nks@example.com
 *               role:
 *                 type: string
 *                 description: Role ID (ObjectId)
 *                 example: 661f1a12cd2d86ab2a23e85d
 *     responses:
 *       200:
 *         description: User has been successfully updated
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               msg: User has been successfully updated
 *               data:
 *                 user:
 *                   id: 661f1b23a2cd3a001efcb792
 *                   username: nks
 *                   email: nks@example.com
 *                   role: 661f1a12cd2d86ab2a23e85d
 *       400:
 *         description: Validation or duplicate email/username error
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 400
 *               msg: error message.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 500
 *               msg: Internal server error
 */

/**
 * @route PUT  /user/update/{id}:
 * @description update an user
 * @access Private
 */
router.put(
	"/update/:id",
	validate(userSchema.updateUserSchema),
	userController.updateUser
);

/**
 * @swagger
 * /user/remove/{id}:
 *   delete:
 *     summary: remove user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data: {}
 *               msg: message
 *       400:
 *         description: Error response
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 400
 *               msg: error message.
 */
router.delete(
	"/remove/:id",
	validate(userSchema.removeUserSchema),
	userController.deleteUser
);

/**
 * @swagger
 * /user/search:
 *   get:
 *     summary: Search users
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search keyword for username, email, firstname, lastname, role
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data: [{
 *                 "_id": "680139893f6a04350bbe098a",
 *                 "username": "nks",
 *                 "firstName": "nks",
 *                 "lastName": "ptl",
 *                 "email": "nks@example.com",
 *                 "role": {
 *                   "_id": "6800fc654d3117f081bfb34d",
 *                   "name": "string"
 *                 },
 *                 "active": true,
 *                 "createdAt": "2025-04-17T17:25:29.407Z"
 *               }]
 *               msg: message
 *       400:
 *         description: Error response
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 400
 *               msg: error message.
 */

/**
 * @route GET  /user/search
 * @description search all users
 * @access Private
 */
router.get(
	"/search",
	validate(userSchema.searchUserSchema),
	userController.searchUser
);
/**
 * @swagger
 * /user/check/{id}:
 *   get:
 *     summary: Verify user access to a specific module
 *     description: Checks if the user has access to the specified module based on their assigned roles.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: accessModule
 *         schema:
 *           type: string
 *         required: true
 *         description: identifier of the module to check access for.
 *     responses:
 *       200:
 *         description: Access check result
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 hasAccess: true
 *               msg: User has access to the specified module.
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 400
 *               msg: accessModule query parameter is required.
 */

/**
 * @route GET  /user/check/:id
 * @description Verify user access to a specific module
 * @access Private
 */
router.get(
	"/check/:id",
	validate(userSchema.checkAccessModuleUserSchema),
	userController.checkUserModuleAccess
);

/**
 * @swagger
 * /user/bulk-update-same-payload:
 *   patch:
 *     summary: Bulk update multiple users with the same payload.
 *     description: Updates multiple users' fields (`firstName`, `lastName`, `role`, `active`).
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: List of user IDs to be updated.
 *                 example: ["5f4d87b3c8e4b1b1e4a7f8e4", "5f4d87b3c8e4b1b1e4a7f8e5"]
 *               userDetails:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: "nks"
 *                   lastName:
 *                     type: string
 *                     example: "ptl"
 *                   role:
 *                     type: string
 *                     example: "5f4d87b3c8e4b1b1e4a7f8f6"
 *                   active:
 *                     type: boolean
 *                     example: true
 *     responses:
 *       200:
 *         description: All users updated successfully
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
 *                     matchedCount:
 *                       type: integer
 *                       example: 1
 *                     modifiedCount:
 *                       type: integer
 *                       example: 1
 *                 msg:
 *                   type: string
 *                   example: All users updated successfully.
 *       400:
 *         description: Error response
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 400
 *               msg: error message.
 */
/**
 * @route PATCH /user/bulk-update-same-payload:
 * @description  Bulk update multiple users with the same payload.
 * @access Private
 */
router.patch(
	"/bulk-update-same-payload",
	validate(userSchema.bulkUpdateUsersWithSamePayloadSchema),
	userController.bulkUpdateUsersWithSamePayload
);
/**
 * @swagger
 * /user/bulk-update-diffrent-payload:
 *   patch:
 *     summary: Bulk update multiple users with the different payload.
 *     description: Updates multiple users' fields (`firstName`, `lastName`, `role`, `active`).
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       description: The user ID to be updated.
 *                       example: "5f4d87b3c8e4b1b1e4a7f8e4"
 *                     userDetails:
 *                       type: object
 *                       properties:
 *                         firstName:
 *                           type: string
 *                           example: "nks"
 *                         lastName:
 *                           type: string
 *                           example: "ptl"
 *                         role:
 *                           type: string
 *                           example: "5f4d87b3c8e4b1b1e4a7f8f6"
 *                         active:
 *                           type: boolean
 *                           example: true
 *     responses:
 *       200:
 *         description: Successful batch update response
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
 *                   description: Contains the batch update results
 *                   properties:
 *                     updated:
 *                       type: integer
 *                       description: Number of documents successfully updated
 *                       example: 1
 *                     totalMatched:
 *                       type: integer
 *                       description: Total number of documents matched for update
 *                       example: 1
 *                     successIds:
 *                       type: array
 *                       description: List of IDs that were successfully updated
 *                       items:
 *                         type: string
 *                       example: ["680224ae15cd895d19578161"]
 *                     failed:
 *                       type: array
 *                       description: List of IDs that failed to update
 *                       items:
 *                         type: string
 *                       example: []
 *                 msg:
 *                   type: string
 *                   description: Message describing the result of the batch update
 *                   example: batch updated result.
 *       400:
 *         description: Error response
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 400
 *               msg: "Error message"
 */
/**
 * @route PATCH /user/bulk-update-diffrent-payload:
 * @description  Bulk update multiple users with the diffrent payload.
 * @access Private
 */
router.patch(
	"/bulk-update-diffrent-payload",
	validate(userSchema.bulkUpdateUsersWithDifferentPayloadSchema),
	userController.bulkUpdateUsersWithDifferentPayload
);

module.exports = router;
