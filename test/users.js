import supertest from 'supertest';
import {expect} from 'chai';
import dotenv from 'dotenv';
import { createRandomUser } from '../helpers/user_helper';

//Confiuration
dotenv.config();

//Request
const request = supertest('https://gorest.co.in/public-api/');
const token = process.env.USER_TOKEN;


//Mocha test case
describe('/usersroute', () =>{
    let userId = null;

    it('GET/ users', async () =>{
        const res = await request.get('users');
        expect(res.body.data).to.not.be.empty
        //console.log(res.body.data);

    });
    it('GET/ users | query parameters-get females', async () =>{
        const url = `users?access-token=${token}&gender=female&status=active`;
        const res = await request.get(url)
       // console.log(res.body.data)
       //Loop over each result
       res.body.data.forEach((user) => {
        //console.log(user.gender);
        expect(user.gender).to.eq('female');
        expect(user.status).to.eq('active');

       });

    });
    //console.log(createRandomUser());
    it('POST /users', async () => {
        const data = createRandomUser();
        const res = await request
            .post('users') 
            .set('Authorization',`Bearer ${token}`)
            .send(data);
        //console.log(res.body.data);
        expect(res.body.data).to.include(data);
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('email');
        userId = res.body.data.id;

    });
    it('POST/ users | Negative', async () => {
        const data = {};
        const res = await request
            .post('users')
            .set('Authorization',`Bearer ${token}`)
            .send(data);

        //console.log(res.body.data);
        expect(res.body.code).to.eq(422);

    });
    it('GET/users/:id | User we just created', async () =>{
        const res = await request.get (`users/${userId}?access-token=${token}`);
        expect(res.body.data.id).to.eq(userId);
       // console.log(res.body.data);
    });
    it ('PUT/users/.id', async() => {
        const data = {
            name:'Test user updated'
        };
        const res = await request.put(`users/${userId}`)
        .set('Authorization',`Bearer ${token}`)
        .send(data);

        expect (res.body.data.name).to.equal(data.name);
        expect (res.body.data).to.include(data);
       // console.log(res.body.data);
    });
    it ('DELETE/users/.id | User we just created', async() => {
        const res = await request.delete(`users/${userId}`)
             .set('Authorization',`Bearer ${token}`)
        //console.log(res.body.data);
        expect (res.body.data).to.be.null;

    });

    it('GET/users/:id | Negative ', async()=>{
        const res = await request.get(`users/${userId}`);
        //console.log(res)
        expect (res.body.data.message).to.eq('Resource not found');
    });
        it('GET/users/:id | Negative ', async()=>{
            const res = await request.delete(`users/${userId}`)
            //console.log(res)
            .set('Authorization',`Bearer ${token}`)
            //console.log(res.body.data);
          
          expect (res.body.data.message).to.eq('Resource not found');
        });

});