// import Config from '../conf'
// import WebSocket from 'ws'
// import Queue from '../lib/Queue'

// const sleep = (ms) => {
//   return new Promise(resolve => {
//     setTimeout(resolve, ms)
//   })
// }

// export default (app) => {
//   app.use(async (req, res, next) => {
//     const dataCache = new Queue()
//     const s = new WebSocket('ws://localhost:3001/')
//     s.addEventListener('message', function (m) {
//       const dataStr = m.toString()
//       const data = JSON.parse(dataStr)
//       dataCache.enqueue(data)
//       if (dataCache.getLength() >= Config.DATA_CACHE_MAX_LENGTH) {
//         for (let i = 0; i < (dataCache.getLength() - Config.DATA_CACHE_MAX_LENGTH); i++) {
//           dataCache.dequeue()
//         }
//       }
//     })
//     s.on('open', async () => {
//       let timestamp = Date.now()
//       while (true) {
//         s.send('')
//         const timeRemain = Config.INTERVAL + timestamp - Date.now()
//         await sleep(timeRemain)
//         timestamp = Date.now()
//       }
//     })
//   })
// }
