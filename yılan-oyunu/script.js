const canvas = document.getElementById("gameCanvas"); // Canvas elementini al
const ctx = canvas.getContext("2d"); // 2D çizim bağlamını al
const startBtn = document.getElementById("startBtn"); // Başlat butonu
const restartBtn = document.getElementById("restartBtn"); // Tekrar oyna butonu
const menu = document.getElementById("menu"); // Menü divi
const gameContainer = document.getElementById("gameContainer"); // Oyun alanı divi
const scoreEl = document.getElementById("score"); // Puan gösterge alanı
const highScoreEl = document.getElementById("highScore"); // En yüksek puan gösterge alanı

let snake = []; // Yılan parçalarını tutan dizi
let apple = {}; // Elma objesi
let dx = 0; // X eksenindeki hareket yönü (-1,0,1)
let dy = 0; // Y eksenindeki hareket yönü (-1,0,1)
let score = 0; // Güncel puan
let highScore = localStorage.getItem("highScore") || 0; // Kaydedilmiş en yüksek puan, yoksa 0
let interval; // Oyun döngüsünü kontrol eden interval ID
const gridSize = 20; // Her bir yılan parçasının büyüklüğü (px)
const tileCountX = canvas.width / gridSize; // X eksenindeki kare sayısı
const tileCountY = canvas.height / gridSize; // Y eksenindeki kare sayısı

function spawnApple() { // Yeni elma konumu oluşturur
  apple = {
    x: Math.floor(Math.random() * tileCountX), // Rastgele X koordinatı
    y: Math.floor(Math.random() * tileCountY), // Rastgele Y koordinatı
  };
}

function startGame() { // Oyunu başlatan fonksiyon
  menu.classList.add("hidden"); // Menü gizle
  restartBtn.classList.add("hidden"); // Tekrar oyna butonunu gizle
  gameContainer.classList.remove("hidden"); // Oyun alanını göster
  snake = [{ x: 10, y: 10 }]; // Yılanın başlangıç pozisyonu
  dx = 1; // Başlangıçta sağa doğru hareket
  dy = 0;
  score = 0; // Puan sıfırla
  spawnApple(); // Elmayı yerleştir
  updateScores(); // Skorları güncelle
  if (interval) clearInterval(interval); // Önceki interval varsa temizle
  interval = setInterval(drawGame, 100); // Oyun döngüsünü başlat (her 100ms)
}

function drawGame() { // Oyun ekranını çiz ve güncelle
  moveSnake(); // Yılanı hareket ettir

  if (isGameOver()) { // Eğer oyun bittiyse
    gameOver(); // Oyun bitiş fonksiyonunu çalıştır
    return; // Daha fazla işlem yapma
  }

  ctx.fillStyle = "#111"; // Arka plan rengi koyu siyah
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Arka planı temizle

  snake.forEach((part, i) => { // Yılanın her parçası için
    const isHead = i === 0; // İlk parça baş olarak kabul edilir
    const cx = part.x * gridSize + gridSize / 2; // Parçanın merkez X koordinatı
    const cy = part.y * gridSize + gridSize / 2; // Parçanın merkez Y koordinatı
    const r = gridSize / 2 - 2; // Yarıçap (kenarlara 2px boşluk)

    ctx.beginPath(); // Yeni şekil başlat
    const greenVal = 255 - i * 10; // Yılan gövdesi için yeşil renk tonunu ayarla (baş parlak)
    ctx.fillStyle = isHead ? "#0ff" : `rgb(0,${Math.max(greenVal, 80)},0)`; // Baş farklı renk (#0ff), gövde tonlama
    ctx.arc(cx, cy, r, 0, Math.PI * 2); // Daire çiz (parça)
    ctx.fill(); // Daireyi doldur

    if (isHead) { // Eğer parça baş ise
      ctx.fillStyle = "white"; // Göz beyazları için renk ayarla
      ctx.beginPath();
      ctx.arc(cx - 4, cy - 4, 2, 0, Math.PI * 2); // Sol göz beyazı
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 4, cy - 4, 2, 0, Math.PI * 2); // Sağ göz beyazı
      ctx.fill();

      ctx.fillStyle = "black"; // Göz bebekleri için siyah renk
      ctx.beginPath();
      ctx.arc(cx - 4, cy - 4, 1, 0, Math.PI * 2); // Sol göz bebeği
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 4, cy - 4, 1, 0, Math.PI * 2); // Sağ göz bebeği
      ctx.fill();
    }
  });

  ctx.fillStyle = "red"; // Elma rengi kırmızı
  ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 2, gridSize - 2); // Elmaları çiz

  updateScores(); // Skorları ekranda güncelle
}

function moveSnake() { // Yılanı hareket ettirir
  const head = { x: snake[0].x + dx, y: snake[0].y + dy }; // Yeni kafa pozisyonu
  snake.unshift(head); // Yılanın başına ekle

  if (head.x === apple.x && head.y === apple.y) { // Eğer elmayı yediyse
    score++; // Puan artır
    spawnApple(); // Yeni elma oluştur
  } else {
    snake.pop(); // Kuyruk parçasını kaldır (yemediği için)
  }
}

function isGameOver() { // Oyun bitiş koşullarını kontrol et
  const head = snake[0]; // Yılanın başı
  if (head.x < 0 || head.y < 0 || head.x >= tileCountX || head.y >= tileCountY) { // Duvara çarptı mı?
    return true;
  }
  for (let i = 1; i < snake.length; i++) { // Kendi üzerine geldi mi?
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false; // Oyun devam ediyor
}

function gameOver() { // Oyun bittiğinde çağrılır
  clearInterval(interval); // Oyun döngüsünü durdur

  ctx.fillStyle = "rgba(0,0,0,0.7)"; // Yarı şeffaf koyu katman
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Ekranı kapla

  ctx.fillStyle = "white"; // Yazı rengi beyaz
  ctx.font = "bold 60px Arial"; // Büyük ve kalın font
  ctx.textAlign = "center"; // Ortala
  ctx.fillText("💥 Oyun Bitti!", canvas.width / 2, canvas.height / 2 - 20); // Başlık yazısı

  ctx.font = "bold 30px Arial"; // Daha küçük font
  ctx.fillText(`Puanınız: ${score}`, canvas.width / 2, canvas.height / 2 + 30); // Puanı göster

  restartBtn.classList.remove("hidden"); // Tekrar oyna butonunu göster
}

function updateScores() { // Puan ve yüksek puanı günceller
  scoreEl.textContent = `Puan: ${score}`; // Güncel puan göster
  if (score > highScore) { // Yeni yüksek puan varsa
    highScore = score; // Yüksek puanı güncelle
    localStorage.setItem("highScore", highScore); // Local storage'a kaydet
  }
  highScoreEl.textContent = `En Yüksek Puan: ${highScore}`; // Yüksek puanı göster
}

document.addEventListener("keydown", (e) => { // Klavyeden yön tuşları dinleniyor
  if (e.key === "ArrowUp" && dy === 0) { // Yukarı tuşu, sadece aşağı değilse
    dx = 0;
    dy = -1;
  } else if (e.key === "ArrowDown" && dy === 0) { // Aşağı tuşu, sadece yukarı değilse
    dx = 0;
    dy = 1;
  } else if (e.key === "ArrowLeft" && dx === 0) { // Sol tuşu, sadece sağ değilse
    dx = -1;
    dy = 0;
  } else if (e.key === "ArrowRight" && dx === 0) { // Sağ tuşu, sadece sol değilse
    dx = 1;
    dy = 0;
  }
});

startBtn.addEventListener("click", startGame); // Başlat butonuna tıklanınca oyunu başlat
restartBtn.addEventListener("click", startGame); // Tekrar oyna butonuna tıklanınca oyunu başlat
