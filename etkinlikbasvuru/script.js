document.getElementById("etkinlikFormu").addEventListener("submit", function(e) {
  e.preventDefault(); // Sayfanın yeniden yüklenmesini engeller

  // Başvuru tamamlandı mesajını göster
  const mesajKutusu = document.getElementById("basariMesaji");
  mesajKutusu.innerText = "Başvuru başarıyla gönderildi!";
  mesajKutusu.style.display = "block";

  // Formu sıfırlamak istersen aktif et:
  // this.reset();
});