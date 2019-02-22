# Uptime Emitter desktop

Uptime Emitter is [ping-monitor](https://github.com/qawemlilo/ping-monitor)'s desktop client.

### Technologies

  - [Electron](https://electronjs.org/)
  - [Vue.js](https://vuejs.org) / [Vuetify](https://vuetifyjs.com/en/)
  - [express](https://expressjs.com/)
  - [nedb](https://github.com/louischatriot/nedb)
  - [ping-monitor](https://github.com/qawemlilo/ping-monitor)
  - [axios](https://github.com/axios/axios)


### Architecture

  - The UI is built using Vue.js & Vuetify.
  - All monitors are created and controlled through an express server.
  - ping-monitor manages the lifecycle of each monitor.
  - The client uses the http protocol to send commands to server and fetch updates.  
  - Server updates the database at regular intervals to store monitoring data.


### How to use
```javascript
git clone https://github.com/qawemlilo/uptime-emitter.git
cd uptime-emitter && npm install

// run in development mode
npm run dev

// build
 npm run build

 // run in production mode
 npm start
```


### Credits

This app was inspired by [Axel Uriel Martínez Castillo](https://github.com/ackzell)'s [YouTube series](https://www.youtube.com/watch?v=dWGekDUJG1g&list=PLmJs3lfUmCdT9MyG60Oo6HM7xAn79vwZ0) on building a desktop app for monitoring micro-services.


### License

(MIT License)

Copyright (c) 2019 Qawelesizwe Mlilo <qawemlilo@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
