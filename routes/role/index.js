const express = require("express");
const roleController = require("../../controllers/role/role.controller");
// const authenticate = require('../../middlewares/admin/authenticate.middleware');
const roleSchema = require("../../schemas/role/role.schema");
const { validate } = require("../../middlewares/validator.middleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: >
 *     APIs for managing roles.
 *     All endpoints are protected and require a valid `x-api-key` in the request headers for access.
 */
/**
 * @swagger
 * /role/create:
 *   post:
 *     summary: Create a new role
 *     tags:
 *       - Role
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: super admin
 *               accessModules:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: List of modules this role can access
 *                   example: [ "dashboard", "orders" ]
 *     responses:
 *       200:
 *         description: Role created successfully
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
 *                     name:
 *                       type: string
 *                       example: super admin
 *                     accessModules:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [ "dashboard", "orders" ]
 *                     active:
 *                       type: boolean
 *                       example: true
 *                 msg:
 *                   type: string
 *                   example: Role has been successfully created
 *       400:
 *         description: Error response
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 400
 *               msg: error message.
 */

/**
 * @route POST /role/create:
 * @description create a new role
 * @access Private
 */
router.post(
	"/create",
	validate(roleSchema.createRoleSchema),
	roleController.addNewRole
);

/**
 * @swagger
 * /role/all:
 *   get:
 *     summary: get all role
 *     tags:
 *       - Role
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6802abd9bc17463579ca4125
 *                       name:
 *                         type: string
 *                         example: super admin
 *                       accessModules:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: [ "dashboard", "orders" ]
 *                       active:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-18T19:45:29.901Z
 *                 msg:
 *                   type: string
 *                   example: sucess
 *       400:
 *         description: Error response
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 400
 *               msg: error message.
 */

/**
 * @route GET  /role/all
 * @description get all roles
 * @access Private
 */
router.get("/all", roleController.getRoles);

/**
 * @swagger
 * /role/update/{id}:
 *   put:
 *     summary: Update role
 *     tags:
 *       - Role
 *     security:
 *       - ApiKeyAuth: []
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               accessModules:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: List of modules this role can access
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

/**
 * @route PUT  /role/update/{id}:
 * @description update an admin role
 * @access Private
 */
router.put(
	"/update/:id",
	validate(roleSchema.updateRoleSchema),
	roleController.updateRole
);

/**
 * @swagger
 * /role/add-access-module/{id}:
 *   patch:
 *     summary: add new access module
 *     tags:
 *       - Role
 *     security:
 *       - ApiKeyAuth: []
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
 *               - accessModule
 *             properties:
 *               accessModule:
 *                 type: string
 *                 example: payment
 *     responses:
 *       200:
 *         description: Modules successfully added to the role
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
 *                     accessModules:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [ "dashboard", "orders", "payment" ]
 *                 msg:
 *                   type: string
 *                   example: Module has been successfully added to the role access module.
 *       400:
 *         description: Error response
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 400
 *               msg: error message.
 */

/**
 * @route PATCH  /role/add-access-module/{id}:
 * @description add-access-module into role access nodules
 * @access Private
 */
router.patch(
	"/add-access-module/:id",
	validate(roleSchema.addNewRoleAccessModuleSchema),
	roleController.addNewRoleAccessModule
);

/**
 * @swagger
 * /role/remove-access-module/{id}:
 *   patch:
 *     summary: remove access module
 *     tags:
 *       - Role
 *     security:
 *       - ApiKeyAuth: []
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
 *               - accessModule
 *             properties:
 *               accessModule:
 *                 type: string
 *                 example: payment
 *     responses:
 *       200:
 *         description: Modules successfully added to the role
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
 *                     accessModules:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [ "dashboard", "orders"]
 *                 msg:
 *                   type: string
 *                   example: Module has been successfully added to the role access module.
 *       400:
 *         description: Error response
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 400
 *               msg: error message.
 */

/**
 * @route PATCH  /role/remove-access-module/{id}:
 * @description remove-access-module into role access nodules
 * @access Private
 */
router.patch(
	"/remove-access-module/:id",
	validate(roleSchema.removeRoleAccessModuleSchema),
	roleController.removeRoleAccessModule
);

/**
 * @swagger
 * /role/remove/{id}:
 *   delete:
 *     summary: remove role
 *     tags:
 *       - Role
 *     security:
 *       - ApiKeyAuth: []
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
	validate(roleSchema.removeRoleSchema),
	roleController.deleteRole
);

module.exports = router;
