const request = require("supertest");
const { app } = require("../server");

const jwt = require("jsonwebtoken");
const config = require("../config");
const { default: mongoose } = require("mongoose");
const mockingoose = require("mockingoose");
const User = require("../API/users/users.model");
const usersService = require("../API/users/users.service");

describe("tester API users", () => {

    let token;
    const USER_ID = 'fake';
    const MOCK_DATA = {
        _id: USER_ID,
        name: "djazia",
        email: "aaa@erf.net",
        password: 'aaaaaaaa',

    };
    const MOCK_DATA_CREATED = {
        name: "djazia",
        email: "aaa@erf.net",
        password: 'aaaaaaaa'
    };

    beforeEach(() => {
        token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
        //  mongoose.Query.prototype.find = jest.fn().mockResolvedValue(MOCK_DATA);
        mockingoose(User).toReturn(MOCK_DATA, 'find');

    });


    test("[Users] Get All", async () => {
        const res = await request(app)
            .get("/api/users")
            .set("x-access-token", token);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    /*   test("Mock", async () => {
          const muFunction = jest.fn().mockResolvedValue('test');
  
          const val = await muFunction();
          expect(val).toBe("test");
          expect(muFunction).toHaveBeenCalled();
      });
   */


    test("[Users] Create User", async () => {
        const res = await request(app)
            .post("/api/users")
            .send(MOCK_DATA_CREATED)
            .set("x-access-token", token);
        expect(res.status).toBe(201);
        expect(res.body.length).toBe(MOCK_DATA_CREATED.name);
    });



test('est que userService.getAll',async()=>{
   const spy=jest.spyOn(usersService,'getAll')
   (await request(app).get('/api/users'))
   .set("x-access-token", token);
   expect(spy).toHaveBeenCalled();
   expect(spy).toHaveBeenCalledTime(1);
   expect(spy).toHaveReturneWith("test");
});


afterEach(()=>{
    jest.restoreAllMocks();
})










});


































/* describe('tester API users', () => {
    /* before(()=>{

    })
    beforeEach(() => {

    });
    aftereache(()=>{}); 
    test('1+1= 2 ?', () => {
        // tobe pour verifier une valeur 
       // expect(1 + 1).toBe(2);
       expect(null).not.toBeNull();
    });
    beforeEach(async() => {

    });

}) */