import { Env } from 'root/models';

require('module-alias/register');
import res from 'root/services/response-handler';
import { Request } from './interfaces';

export default async (req: Request) => {
  try {
    const {
      queryStringParameters,
    } = req;

    const envs = await Env.getList();
    return res(envs, 200, {
      headers: {
        'Access-Control-Expose-Headers': 'content-range',
        'content-range': `${envs.length}`,
      },
    });
  } catch (e) {
    console.error(e);
    return res({}, 500);
  }
};
