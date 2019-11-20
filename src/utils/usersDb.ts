import { IUserData } from "../interfaces/userData.interface";
import { IError } from "../interfaces/errors.interface";

class UsersDb {
  private users: IUserData[] = [];

  get allUsers(): IUserData[] {
    return this.users;
  }

  public addUser({ id, username, room }: IUserData): IError | IUserData {
    // cleaning data
    if (!username || !room) {
      return {
        error: "username and room required"
      };
    }

    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // checking for existing users
    const existingUser = this.users.find((element): boolean => {
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

  public removeUserByID(id: string): IUserData | IError {
    // checking for the id for user
    const index = this.users.findIndex((element): boolean => element.id === id);
    // validating the user
    if (index !== -1) {
      return this.users.splice(index, 1)[0];
    }
    // error when not to find user
    return {
      error: "there is no user with that id"
    };
  }

  public getUserById(id: string): IUserData | IError {
    // checking for the id for user
    const index = this.users.findIndex((element): boolean => element.id === id);

    // validating the user
    if (index !== -1) {
      return this.users[index];
    }
    // error when not to find user
    return {
      error: "there is no user with that id"
    };
  }

  public getUserByUserName(username: string): IUserData | IError {
    // checking for the id for user
    const user = this.users.find(
      (element): IUserData => {
        if (username === element.username) {
          return element;
        }
      }
    );

    // validating user
    if (user) {
      return user;
    }
    // error when not to find user
    return {
      error: "there is no user with that username"
    };
  }

  public getUsersInRoom(room: string): IUserData[] | IError {
    // checking for room name
    const users = this.users.filter(
      (element): boolean => element.room === room
    );

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

export const userDb = new UsersDb();
