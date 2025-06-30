//toggle class active
const navbarNav = document.querySelector(".navbar-nav");

document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

const hamburger = document.querySelector("#hamburger-menu");
document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

// ...existing code...
document.getElementById("btn-konfirmasi").onclick = function () {
  let pesan = "";
  document
    .querySelectorAll(".menu-card, .menu-food")
    .forEach(function (card, i) {
      const nama = card.querySelector(".menu-card-title").innerText;
      const harga = card.querySelector(".menu-card-price").innerText;
      const qty = card.querySelector(".order-qty").value;
      if (qty && parseInt(qty) > 0) {
        pesan += `<p><b>${nama}</b> - Jumlah: ${qty} - Harga: ${harga}</p>`;
      }
    });
  if (pesan === "") pesan = "<p>Tidak ada pesanan.</p>";
  document.getElementById("orderDetail").innerHTML = pesan;
  document.getElementById("orderModal").style.display = "flex";
};

document.getElementById("closeModal").onclick = function () {
  document.getElementById("orderModal").style.display = "none";
};
document.getElementById("confirmOrder").onclick = function () {
  document.getElementById("orderModal").style.display = "none";
};
// ...existing code...
// ...existing code...

// Array untuk menampung pesanan sementara
let pesananSementara = [];

// Saat tombol "Pesan" di menu diklik, simpan ke pesanan sementara
document.querySelectorAll(".btn-pesan").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const card = btn.closest(".menu-card, .menu-food");
    const nama = card.querySelector(".menu-card-title").innerText;
    const harga = card.querySelector(".menu-card-price").innerText;
    const qty = card.querySelector(".order-qty").value;

    // Cek jika sudah ada menu yang sama, update jumlahnya
    const existing = pesananSementara.find(
      (item) => item.nama === nama && item.harga === harga
    );
    if (existing) {
      existing.qty = parseInt(existing.qty) + parseInt(qty);
    } else {
      pesananSementara.push({ nama, harga, qty });
    }

    // Reset jumlah ke 0 setelah klik pesan
    card.querySelector(".order-qty").value = 0;
    alert("Pesanan ditambahkan!");
  });
});

// Tampilkan modal konfirmasi saat "Kirim Pesanan" diklik
document.getElementById("btn-konfirmasi").onclick = function () {
  let pesan = "";
  let total = 0;
  pesananSementara.forEach(function (item) {
    let hargaSatuan = 0;
    if (item.harga.toLowerCase().includes("k")) {
      hargaSatuan = parseInt(item.harga.replace(/[^0-9]/g, "")) * 1000;
    } else {
      hargaSatuan = parseInt(item.harga.replace(/[^0-9]/g, ""));
    }
    let subtotal = hargaSatuan * parseInt(item.qty);
    total += subtotal;
    pesan += `<p><b>${item.nama}</b> - Jumlah: ${item.qty} - Harga: ${
      item.harga
    } x ${item.qty} = IDR ${subtotal.toLocaleString()}</p>`;
  });
  if (pesan === "") pesan = "<p>Tidak ada pesanan.</p>";
  else pesan += `<hr><p><b>Total: IDR ${total.toLocaleString()}</b></p>`;
  document.getElementById("orderDetail").innerHTML = pesan;
  document.getElementById("orderModal").style.display = "flex";
};

// Tutup modal
document.getElementById("closeModal").onclick = function () {
  document.getElementById("orderModal").style.display = "none";
};

// Kirim pesanan ke backend saat tombol OK di modal diklik
document.getElementById("confirmOrder").onclick = async function () {
  const nomorKursi = document.getElementById("nomorKursi").value.trim();

  if (pesananSementara.length === 0) {
    alert("Silakan pilih pesanan terlebih dahulu!");
    return;
  }
  if (!nomorKursi) {
    alert("Silakan isi nomor kursi!");
    return;
  }

  // Hitung total harga
  let totalHarga = 0;
  pesananSementara.forEach(function (item) {
    let hargaSatuan = 0;
    if (item.harga.toLowerCase().includes("k")) {
      hargaSatuan = parseInt(item.harga.replace(/[^0-9]/g, "")) * 1000;
    } else {
      hargaSatuan = parseInt(item.harga.replace(/[^0-9]/g, ""));
    }
    totalHarga += hargaSatuan * parseInt(item.qty);
  });

  console.log("Kirim ke backend:", {
    pesanan: pesananSementara,
    nomorKursi: nomorKursi,
    totalHarga: totalHarga,
  });

  try {
    const res = await fetch("http://localhost:3000/api/pesanan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pesanan: pesananSementara,
        nomorKursi: nomorKursi,
        totalHarga: totalHarga,
      }),
    });
    const data = await res.json();
    if (data.message) {
      alert("Pesanan berhasil dikirim ke kasir!");
      pesananSementara = [];
      document
        .querySelectorAll(".order-qty")
        .forEach((input) => (input.value = 0));
      document.getElementById("orderModal").style.display = "none";
      document.getElementById("nomorKursi").value = "";
    } else {
      alert("Gagal mengirim pesanan!");
    }
  } catch (err) {
    alert("Tidak dapat terhubung ke kasir!");
  }
};
