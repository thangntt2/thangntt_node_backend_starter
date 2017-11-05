export default async (client, req) => {
  console.log('websocket connection')
  // first cleanup dataCache
  const lastData = req.dataCache.getLast()
  req.dataCache.dequeueAll()
  req.dataCache.enqueue(lastData)
  // then every call data, push all dataCache data
  client.on('message', async() => {
    console.log('On request')
    const data = req.dataCache.dequeueAll()
    client.send(JSON.stringify(data.length > 0 ? data : []))
  })
}
