import { getRepository, Repository, getConnection } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = this.repository
      .createQueryBuilder("game")
      .where("game.title ilike :param", { param: `%${param}%` })
      .getMany();

    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const count = this.repository.query(`SELECT COUNT(title) FROM games;`);
    return count;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users = await getConnection()
      .getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.games", "game")
      .where("game.id = :id", { id: id })
      .getMany();

    return users;
  }
}
