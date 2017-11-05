const net = require('net')

const client = new net.Socket()
client.connect(3000, 'localhost', () => {
  console.log('connected')
  // client.write('{"id":0,"jsonrpc":"2.0","method":"miner_getstat1"}')
})

client.on('data', (data) => {
  // console.log(parseResponse(JSON.parse(data.toString('ascii'))))
  console.log(data)
  // client.destroy()
})

const parseArray = arrayString =>
  arrayString.split(';').map(token => parseInt(token))

const parseResponse = (data) => {
  const parsed = {
    id: data.id,
    error: data.error
  }
  const result = data.result
  parsed.version = result[0]
  parsed.runningTime = result[1]
  parsed.hashRates = parseArray(result[2])
  return parsed
}
