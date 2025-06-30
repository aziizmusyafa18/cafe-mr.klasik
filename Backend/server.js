// Impor library yang dibutuhkan
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors"); // Impor CORS

const app = express();
const server = http.createServer(app);

// Konfigurasi Socket.IO dengan CORS
const io = new Server(server, {
  cors: {
    origin: "*", // Izinkan koneksi dari sumber manapun
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors()); // Gunakan middleware CORS
app.use(express.json()); // Middleware untuk membaca body JSON
app.use(express.static("public")); // Sajikan file statis dari folder 'public' (untuk kasir.html)

// --- Endpoint API ---
// Alamat diubah menjadi /api/pesanan agar cocok dengan frontend Anda
app.post("/api/pesanan", (req, res) => {
  // req.body sekarang berisi: { pesanan: [...], nomorKursi: '...', totalHarga: ... }
  const dataPesananLengkap = req.body;

  // Tampilkan di terminal server untuk memastikan data masuk
  console.log("Pesanan Lengkap Diterima:", dataPesananLengkap);

  // Pancarkan (emit) seluruh data pesanan ini ke semua kasir yang terhubung
  io.emit("pesananBaru", dataPesananLengkap);

  // Kirim respons sukses kembali ke halaman pelanggan
  res.status(201).json({ message: "Pesanan berhasil dikirim!" });
});

// --- Penanganan Koneksi Socket.IO ---
io.on("connection", (socket) => {
  console.log("Sebuah layar kasir telah terhubung:", socket.id);
  socket.on("disconnect", () => {
    console.log("Layar kasir terputus:", socket.id);
  });
});

// --- Menjalankan Server ---
server.listen(PORT, () => {
  console.log(`Server Kafe Mr. Klasik berjalan di http://localhost:${PORT}`);
});
