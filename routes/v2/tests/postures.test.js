const request = require('supertest')
const postureRoutes = require('../posture-routes');

describe('Sanity test', () => {
    test('1 should equal 1', () => {
      expect(1).toBe(1)
    })
  })


describe('Get one posture details - endpoint', () => {
  
  // test('should return a posture object', async () => {
  //   const res = await request(postureRoutes)
  //     .get('/v2/postures/:id')
  //   expect(res.statusCode).toEqual(200)
  //   expect(res.body).toEqual({
  //     message: "Hello World"
  //   })
  // })


  // test('responds to /v2/postures/:id', async () => {
  //   const res = await request(postureRoutes).get('/v2/postures/63f68bbd15f1f156c982eb73'); 
  //   // expect(res.header['content-type']).toBe('text/html; charset=utf-8');
  //   expect(res.statusCode).toBe(200);
  //   // expect(res.posture.name).toEqual('Urdhva Hastasana');
  // });

  // test('responds to /hello/Annie', async () => {
  //   const res = await request(app).get('/hello/Annie'); 
  //   expect(res.header['content-type']).toBe('text/html; charset=utf-8');
  //   expect(res.statusCode).toBe(200);
  //   expect(res.text).toEqual('hello Annie!');
  // });

})