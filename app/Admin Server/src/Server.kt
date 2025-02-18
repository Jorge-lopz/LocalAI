import java.io.DataInputStream
import java.io.DataOutputStream
import java.io.File
import java.io.IOException
import java.security.KeyStore
import javax.net.ssl.*

class Server {

    private var pythonProcess: Process? = null

    init {
        val port = 8001
        val serverSocket = createSecureServerSocket(port)

        println("🔒 Secure SSL Server is running on port $port...")

        while (true) {
            try {
                val clientSocket = serverSocket.accept() as SSLSocket
                println("✅ Client connected: ${clientSocket.inetAddress}")

                val inputStream = DataInputStream(clientSocket.getInputStream())
                val outputStream = DataOutputStream(clientSocket.getOutputStream())

                // Receive message
                val clientMessage = inputStream.readUTF()
                println("📩 Received from client: $clientMessage")

                when (clientMessage) {
                    "START" -> startPythonScript(outputStream)
                    "STOP" -> stopPythonScript(outputStream)
                    else -> {
                        outputStream.writeUTF("Unknown command.")
                        outputStream.flush()
                    }
                }

                // Close resources
                inputStream.close()
                outputStream.close()
                clientSocket.close()
                println("🔻 Client disconnected.")
            } catch (e: Exception) {
                println("❌ Error: ${e.message}")
            }
        }
    }

    private fun createSecureServerSocket(port: Int): SSLServerSocket {
        // Load the server's keystore (contains the private key & certificate)
        val keyStore = KeyStore.getInstance("PKCS12")
        val keyStoreFile = "keystore.p12" // Change to your keystore file
        val keyStorePassword = "1234567".toCharArray() // Set your keystore password

        keyStore.load(ClassLoader.getSystemResourceAsStream(keyStoreFile), keyStorePassword)

        // Initialize KeyManagerFactory with the keystore
        val keyManagerFactory = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm())
        keyManagerFactory.init(keyStore, keyStorePassword)

        // Create SSL context
        val sslContext = SSLContext.getInstance("TLS")
        sslContext.init(keyManagerFactory.keyManagers, null, null)

        // Create SSLServerSocketFactory
        val serverSocketFactory = sslContext.serverSocketFactory as SSLServerSocketFactory

        // Create SSL server socket
        val serverSocket = serverSocketFactory.createServerSocket(port) as SSLServerSocket
        serverSocket.needClientAuth = false // Change to true if client authentication is needed
        return serverSocket
    }

    private fun startPythonScript(outputStream: DataOutputStream) {
        try {
            // Start the Python script using ProcessBuilder
            val pythonCommand = arrayOf("python", "C:\\Jorge\\DAM\\2\\PSP\\LocalAI\\api\\start.py")
            pythonProcess = ProcessBuilder(*pythonCommand).start()
            outputStream.writeUTF("Python script started.")
            outputStream.flush()
            println("📜 Python script started.")
        } catch (e: IOException) {
            outputStream.writeUTF("Error starting Python script: ${e.message}")
            outputStream.flush()
            println("❌ Error starting Python script: ${e.message}")
        }
    }

    private fun stopPythonScript(outputStream: DataOutputStream) {
        try {
            // Stop the Python script if it's running
            pythonProcess?.destroy()
            pythonProcess = null
            outputStream.writeUTF("Python script stopped.")
            outputStream.flush()
            println("🛑 Python script stopped.")
        } catch (e: Exception) {
            outputStream.writeUTF("Error stopping Python script: ${e.message}")
            outputStream.flush()
            println("❌ Error stopping Python script: ${e.message}")
        }
    }
}

fun main() {
    Server()
}
