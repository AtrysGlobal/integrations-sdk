import { SharedData } from '../helpers/shared_data.helper'
import { ClientRequest } from '../helpers/request.helper'

const sharedData = SharedData.getInstance()

export async function list(specialtyId: string): Promise<object> {
  try {

    if(!specialtyId) new Error('You must provide a specialty id')

    const _request = new ClientRequest('ATRYS')
    const _req = await _request.get(`administrative/specialties/${specialtyId}`)
    return _req
  } catch (error) {
    return error
  }
}

export default { list }