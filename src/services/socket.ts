import { io } from 'socket.io-client'

const baseURL = 'http://localhost:4000'

const socket = io(baseURL)

socket.on('connect', () => {
    console.log(socket.id)
})

export default socket
