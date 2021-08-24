import { SharedData } from '../helpers/shared_data.helper'
import { ClientRequest } from '../helpers/request.helper'

export async function login(): Promise<any>{
  return new Promise(async (resolve, reject) => {
    try {
      setTimeout(async () => {
        const sharedData = SharedData.getInstance()
  
        let _req

        if(sharedData.mode === 'SDK_ALONE'){
          const _request = new ClientRequest('SDK')
          _req = await _request.post('/access/integrations', {})
        }else{
          const credentials = {
            username: sharedData.patientUsername,
            password: sharedData.patientPassword
          }

          if(!sharedData.patientUsername) throw new Error('Yoy must provide a username for login')
          if(!sharedData.patientPassword) throw new Error('Yoy must provide a password for login')

          const _request = new ClientRequest('ATRYS')
          _req = await _request.post('/access/login-web', {...credentials})

          sharedData.patientId = _req.data.id
        }

        sharedData.tokens.atrysBackend = _req.data.access_token
        resolve(_req)

      }, 1500)
  
    } catch (error) {
      reject(error)
    }
  })
}

export default { login }