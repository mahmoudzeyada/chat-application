"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UsersDb {
    constructor() {
        this.users = [];
    }
    get allUsers() {
        return this.users;
    }
    addUser({ id, username, room }) {
        // cleaning data
        if (!username || !room) {
            return {
                error: "username and room required"
            };
        }
        username = username.trim().toLowerCase();
        room = room.trim().toLowerCase();
        // checking for existing users
        const existingUser = this.users.find((element) => {
            return element.username === username && element.room === room;
        });
        // validating users in room
        if (existingUser) {
            return {
                error: `this username:${username} is exists in this room ${room}`
            };
        }
        // adding a user to users
        const user = { id, username, room };
        this.users.push(user);
        // returning the last saved user
        return user;
    }
    removeUserByID(id) {
        // checking for the id for user
        const index = this.users.findIndex((element) => element.id === id);
        // validating the user
        if (index !== -1) {
            return this.users.splice(index, 1)[0];
        }
        // error when not to find user
        return {
            error: "there is no user with that id"
        };
    }
    getUserById(id) {
        // checking for the id for user
        const index = this.users.findIndex((element) => element.id === id);
        // validating the user
        if (index !== -1) {
            return this.users[index];
        }
        // error when not to find user
        return {
            error: "there is no user with that id"
        };
    }
    getUserByUserName(username) {
        // checking for the id for user
        const user = this.users.find((element) => {
            if (username === element.username) {
                return element;
            }
        });
        // validating user
        if (user) {
            return user;
        }
        // error when not to find user
        return {
            error: "there is no user with that username"
        };
    }
    getUsersInRoom(room) {
        // checking for room name
        const users = this.users.filter((element) => element.room === room);
        // validating users array
        if (users.length !== 0) {
            return users;
        }
        // error when not to find user
        return {
            error: "there is no users with this room or room not exists"
        };
    }
}
exports.userDb = new UsersDb();
//# sourceMappingURL=usersDb.js.map