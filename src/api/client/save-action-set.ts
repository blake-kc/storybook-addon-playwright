import { SaveActionSetRequest } from '..//typings';
import { getEndpoint } from './utils';

export const saveActionSet = async (data: SaveActionSetRequest) => {
  const restEndpoint = getEndpoint('SAVE_ACTION_SET');

  const res = await fetch(restEndpoint, {
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
  });

  const resp = await res.json();

  if (resp.error) throw new Error(resp.error);
};
