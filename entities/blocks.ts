import { SharedData } from '../helpers/shared_data.helper'
import { ClientRequest } from '../helpers/request.helper'

const sharedData = SharedData.getInstance()

export async function list(queryBlock: any): Promise<object> {
  try {
    if(!queryBlock) new Error('You must provide a queryBlock')

    const _request = new ClientRequest('ATRYS')
    const _req = await _request.post('blocks/query', queryBlock)
    return _req
  } catch (error) {
    return error
  }
}

export default { list }