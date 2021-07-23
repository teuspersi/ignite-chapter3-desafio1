import { getRepository, Repository } from "typeorm";

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User | undefined> {
    const usersWithGames = await this.repository.findOne({
      join: {
        alias: "user",
        leftJoinAndSelect: {
          games: "user.games",
        },
      },
      where: {
        id: user_id,
      },
    });

    return usersWithGames;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository.query(
      `SELECT first_name FROM users ORDER BY first_name ASC`
    ); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const full_name = first_name + " " + last_name;
    return await this.repository.query(
      `SELECT first_name, last_name, email FROM users WHERE first_name ilike '${first_name}' and last_name ilike '${last_name}'`
    ); // Complete usando raw query
  }
}
