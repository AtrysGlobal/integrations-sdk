import { SharedData } from '../helpers/shared_data.helper'
import { ClientRequest } from '../helpers/request.helper'

const sharedData = SharedData.getInstance()

export async function list(): Promise<object> {
  try {
    const _request = new ClientRequest('ATRYS')
    const _req = await _request.get('medical-specialties')
    return _req
  } catch (error) {
    return error
  }
}

export default { list }