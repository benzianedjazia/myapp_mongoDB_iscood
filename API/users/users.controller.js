const NotFoundError = require("../../errors/not-found");
const usersService = require("./users.service");
const jwt = require("jsonwebtoken");
const config = require('../../config');
const UnauthorizedError = require("../../errors/unauthorized");



class UsersController {
    async getAll(req, res, next) {
        try {
            const users = await usersService.getAll();
            res.json(users);

        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {

        try {
            const id = req.params.id
            const user = await usersService.get(id);
            if (!user) {
                throw new NotFoundError();
            }

        } catch (err) {
            next(err)

        }
    }
    async create(req, res, next) {
        try {
            const user = await usersService.create(req.body);
            user.password = undefined
            req.io.emit("user:create", user);
            res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }
    async update(req, res, next) {
        try {
            const id = req.params.id;
            const data = req.body;
            const userModified = await usersService.update(id, data);
            userModified.password = undefined;
            res.json(userModified);
        } catch (err) {
            next(err);
        }
    }
    async delete(req, res, next) {
        try {
            const id = req.params.id;
            await usersService.delete(id);
            // Emite um evento para todos os usuários conectados

            req.io.emit("user:delete", { id });
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userId = await usersService.checkPasswordUser(email, password);
            if (!userId) {
                throw new UnauthorizedError();
            }
            const token = jwt.sign({ userId }, config.secretJwtToken, {
                expiresIn: "3d",
            });
            res.json({
                token,
            });
        } catch (err) {
            next(err);
        }
    }
   /*  async me(req, res, next) {
        try {
            const { id }  = req.user;
            const user = await usersService.get(id);
            if (!user) {
                throw new NotFoundError();
            }
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    } */
    async me(req, res, next) {
        try {
          const userId = req.user.id; // Assuming userId is stored in req.user
          const user = await usersService.get(userId);
          if (!user) {
            throw new NotFoundError();
          }
          res.status(200).json(user);
        } catch (err) {
          next(err);
        }
      }


}

module.exports = new UsersController();