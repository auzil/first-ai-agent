import http from 'node:http'
import { Server } from 'socket.io'
import OpenAI from 'openai'


const client = new OpenAI({
    apiKey: 'your-api-key-here',
})
const MODEL = 'gpt-4o-mini'

const getCurrentTime = () => new Date().toISOString()
const userTimeZone = () => 'GMT+1'
const getOrderStatus = (orderId) => {
    const orderStatuses = { '12345': 'Shipped', '67890': 'Processing', '54321': 'Delivered' }
    return orderStatuses[orderId] || 'Order ID not found'
}

const toolExecutors = {
    getCurrentTime: async () => getCurrentTime(),
    userTimeZone: async () => userTimeZone(),
    getOrderStatus: async (args) => {
        const { orderId } = args || {}
        return getOrderStatus(orderId)
    },
}

const tools = [
    {
        type: 'function',
        function: {
            name: 'getCurrentTime',
            description: 'Get the current time in ISO format.',
            parameters: { type: 'object', properties: {} },
        },
    },
    {
        type: 'function',
        function: {
            name: 'userTimeZone',
            description: "Get the user's current time zone.",
            parameters: { type: 'object', properties: {} },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getOrderStatus',
            description: 'Get the status of an order by its ID.',
            parameters: {
                type: 'object',
                properties: {
                    orderId: { type: 'string', description: 'The unique identifier for the order.' },
                },
                required: ['orderId'],
            },
        },
    },
]

async function runWithTools(history) {
 // code here
}

const PORT = process.env.PORT || 3030
const server = http.createServer()

const io = new Server(server, {
    cors: { origin: '*' },
})


const socketHistories = new Map() // socket.id -> Message[]


io.on('connection', async (socket) => {
    console.log('client connected', socket.id)

    socketHistories.set(socket.id, [
        {
            role: 'system',
            content: `
You are a helpful, concise AI assistant.
      `.trim(),
        },
    ])

    socket.on('chat:message', async (userMsg) => {
        try {
            const { text } = userMsg || {}
            if (!text || typeof text !== 'string') return

            const history = socketHistories.get(socket.id) || []
            history.push({ role: 'user', content: text })

            const assistantText = await runWithTools(history)

            history.push({ role: 'assistant', content: assistantText })

            const reply = {
                id: `${socket.id}:${Date.now()}`,
                role: 'assistant',
                text: assistantText,
                ts: Date.now(),
            }

            socket.emit('chat:message', reply)
            socket.emit('debug:history', history)
        } catch (err) {
            console.error('chat:message error', err)
            socket.emit('chat:message', {
                id: `${socket.id}:err:${Date.now()}`,
                role: 'assistant',
                text: 'Oops, something went wrong on the server.',
                ts: Date.now(),
            })
        }
    })

    socket.on('disconnect', () => {
        socketHistories.delete(socket.id)
        console.log('client disconnected', socket.id)
    })
})

server.listen(PORT, () => {
    console.log('Socket.IO + OpenAI server running on :' + PORT)
})
