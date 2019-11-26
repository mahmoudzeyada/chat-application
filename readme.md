# ChatApplication

My project with node-Js Express and Socket.io

## OverView

It's a n app allowing users to communicates with others in specific rooms

## Live Version

[demo](https://chat-app-mahmoudzeyada.herokuapp.com/)

![Alt text](./login.png?raw=true "LOGIN")
![Alt text](./chat.png?raw=true "Chat")

## how to run the App

first you need to setup node-js

then you are ready to clone and run
first clone then run this command in the root directory:

    npm install

after finish installing  
make sure you in root directory where you could find **src** then run this command:

    npm run start

## features

1. each user have can choose name and room to join

2. each user can chat with every users in the same room

3. i followed best practice when writing backend services with typescript.

4. there is alive notification when the user enter the room or leave or curse.

5. there is a list that shows all active users in the room.

6. i used here the internal array data structure as db due to its speed and make the
   deployment much better than using redis but it is not scalable like redis when producing more process
   in that app .

## what I'm using

     node-js  Express Socket.io TypeScript  MVC

## TODO LIST

    making more features in the application such as :
      * listing all current rooms when logging
      * making private rooms with password
    add Testing
    using docker
    Refactor and use best practices
    build Front-end with reactJs
