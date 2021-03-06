import { promises as fs } from 'fs';
import path from 'path';
import { getNodeModulesRoot, getPrjRoot } from 'root/services/path-resolver';

interface JsonDao {
  id: string,
  name: string,
  package: string,
}

interface Module {
  indexTemplate: (name: string) => string,
  baseModelTemplate: () => string,
  postEnvCreated: (projectPath: string, envName: string) => void,
}

export default class Dao {
  id: string
  name: string
  package: string
  module: Module

  static get daosJsonPath(): string {
    return path.join(getPrjRoot(), 'daos.json');
  }

  static async getList(withModule: boolean = false): Promise<Dao[]> {
    const file = await fs.readFile(Dao.daosJsonPath);
    const jsonDaos: JsonDao[] = JSON.parse(file.toString());
    return jsonDaos.map(jsonDao => {
      const dao = new Dao();
      dao.id = jsonDao.id;
      dao.name = jsonDao.name;
      dao.package = jsonDao.package;
      if (withModule) {
        dao.module = require(path.join(getNodeModulesRoot(), dao.package));
      }
      return dao;
    });
  }

  async getById(daoId: string): Promise<boolean> {
    const daos = await Dao.getList();
    const dao = daos.find(d => d.id === daoId);
    if (dao) {
      Object.assign(this, { ...dao });
      this.module = require(path.join(getNodeModulesRoot(), this.package));
      return true;
    } else {
      return false;
    }
  }
}
