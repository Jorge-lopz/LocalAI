package com.example.adminpanel

import android.content.Context
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.example.adminpanel.databinding.ActivityMainBinding
import java.io.DataInputStream
import java.io.DataOutputStream
import java.io.InputStream
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.security.KeyStore
import java.security.cert.Certificate
import java.security.cert.CertificateFactory
import javax.net.ssl.SSLContext
import javax.net.ssl.SSLSocket
import javax.net.ssl.SSLSocketFactory
import javax.net.ssl.TrustManagerFactory

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }

    override fun onResume() {
        super.onResume()
        binding.startServer.setOnClickListener {
            sendMessage("START") { response -> Log.v("response", response) }
        }
        binding.stopServer.setOnClickListener {
            sendMessage("STOP") { response -> Log.v("response", response) }
        }
    }

    private fun sendMessage(message: String, onResponseReceived: (String) -> Unit) {
        CoroutineScope(Dispatchers.IO).launch {
            val client: SSLSocket?
            val inputStream: DataInputStream?
            val outputStream: DataOutputStream?
            var isSocketClosed = false

            try {
                val host = "192.168.2.243"
                val puerto = 8001

                val sslSocketFactory = createSSLSocketFactory(this@MainActivity)
                client = sslSocketFactory.createSocket(host, puerto) as SSLSocket
                client.soTimeout = 10000

                try {
                    client.startHandshake()
                    Log.d("SSLClient", "Handshake SSL successful")
                } catch (e: Exception) {
                    Log.e("SSLClient", "SSL/TLS Handshake error: ${e.message}", e)
                    withContext(Dispatchers.Main) { onResponseReceived("SSL/TLS Handshake error: ${e.message}") }
                }

                outputStream = DataOutputStream(client.getOutputStream())
                inputStream = DataInputStream(client.getInputStream())

                outputStream.writeUTF(message)
                outputStream.flush()
                Log.d("SSLClient", "Client message sent")

                try {
                    val serverResponse = inputStream.readUTF()
                    Log.d("SSLClient", "Server response: $serverResponse")

                    withContext(Dispatchers.Main) { onResponseReceived(serverResponse) }

                } catch (e: Exception) {
                    Log.e("SSLClient", "Error reading response: ${e.message}", e)
                    withContext(Dispatchers.Main) { onResponseReceived("Error reading response: ${e.message}") }
                }

            } catch (e: Exception) {
                Log.e("SSLClient", "Connection error: ${e.message}", e)
                withContext(Dispatchers.Main) { onResponseReceived("Connection error: ${e.message}") }
            }
        }
    }

    private fun createSSLSocketFactory(context: Context): SSLSocketFactory {
        try {
            // 1. Cargar el archivo PKCS12 desde res/raw
            val keystoreFile = context.resources.openRawResource(R.raw.keystore)
            val keyStore = KeyStore.getInstance("PKCS12")

            // 2. Cargar el keystore con la contraseña correcta
            val password = "1234567".toCharArray() // Reemplázala si es diferente
            keyStore.load(keystoreFile, password)

            // 3. Inicializar TrustManager con el keystore cargado
            val trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm())
            trustManagerFactory.init(keyStore)

            // 4. Crear SSLContext con el TrustManager
            val sslContext = SSLContext.getInstance("TLS")
            sslContext.init(null, trustManagerFactory.trustManagers, null)

            return sslContext.socketFactory
        } catch (e: Exception) {
            throw RuntimeException("❌ Error al cargar el certificado en Android: ${e.message}", e)
        }
    }
}