const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// this makes the should syntax available throughout
// this module
const should = chai.should();

const {Blog} = require('../models');
const {app, runServer,closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values
function seedBlogData() {
    console.info('Seeding blog data');
    const seedData = [];

    for (let i = 1; i <= 10; i++) {
        seedData.push(generateBlogData());
    }
    // this will return a promise
    return Blog.insertMany(seedData);
}

// used to generate data to put in db
function generateFirstName() {
    const firstName = [
        'Bob', 'Traci', 'Patrick', 'Dan', 'Logan', 'Neville'
    ];
    return firstName[Math.floor(Math.random() * firstName.length)];
}

// used to generate data to put in db
function generateLastName() {
    const lastName = [
        'Jones', 'Rosenblum', 'Herget', 'Weber', 'Rose', 'B'
    ];
    return lastName[Math.floor(Math.random() * lastName.length)];
}

// used to generate data to put in db
function generateTitle() {
    const title = [
        'Parallax1', 'Parallax2', 'Parallax3', 'Parallax4', 'Parallax5', 'Parallax6'
    ];
    return title[Math.floor(Math.random() * title.length)];
}

// generate an object represnting a restaurant.
// can be used to generate seed data for db
// or request.body data

function generateBlogData() {
    return {
        author: {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
        },
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        created: faker.date.past()
    }
}

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure  ata from one test does not stick
// around for next one
function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Blogs API resource', function() {

    // we need each of these hook functions to return a promise
    // otherwise we'd need to call a `done` callback. `runServer`,
    // `seedBlogData` and `tearDownDb` each return a promise,
    // so we return the value returned by these function calls.
    before(function() {
        console.log('Before');
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        console.log('Seeding Data');
        return seedBlogData();
    });

    afterEach(function() {
        console.log('Tearing Down');
        return tearDownDb();
    });

    after(function() {
        console.log('Closing Server');
        return closeServer();
    })

    describe('GET endpoint', function() {

        it('should return all existing blogs', function() {
            let res;
            return chai.request(app)
                .get('/blog-posts')
        });        
    });
});