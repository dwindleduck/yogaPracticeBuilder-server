const request = require('supertest')
const studentRoutes = require('../student-routes')

describe('Sanity test', () => {
    test('1 should equal 1', () => {
      expect(1).toBe(1)
    })
  })

  describe('User Routes', () => {
    test('The login route with the user', async () => {
      const res = await request(studentRoutes).post(`/v2/sign-in`, {
        email: 'demo@demo.demo',
        password: 'demodemodemo'
      })
      expect(res.status).toBe(200)
      // expect(res.body.credentials).toBeTruthy()
    });

    // test('The login route with the wrong user', async () => {
    //   try {
    //     await axios.post(`${url}/login`, {
    //       username: 'john@email.com',
    //       password: 'john123'
    //     })
            
    //   } catch (error) {
    //     expect(error.response.status).toBe(404)
    //     expect(error.message).toEqual(
    //       'Request failed with status code 404'
    //     )
    //   }
    // })
  })



