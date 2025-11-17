# Öğrenci Ders Notları — Statik Örnek Site

Bu proje öğretmenlerin girdiği ders notlarını öğrencilerin görüntüleyebileceği sade, statik bir HTML/CSS şablonudur. Notlar `data/notes.json` dosyasında tutulur ve tarayıcıda küçük bir JavaScript ile yüklenir.

Nasıl çalıştırılır
- Bu klasörde `index.html` dosyasını çift tıklayarak veya tarayıcıda açarak siteyi görüntüleyebilirsiniz.
- Yerel dosya sistemi bazı tarayıcılarda `fetch` ile JSON yüklemeye kısıtlama getirebilir (ör. eski güvenlik ayarları). Böyle bir sorun yaşarsanız basit bir HTTP sunucusu çalıştırın:

  PowerShell (aynı klasörde):

  ```powershell
  python -m http.server 8000; Start-Process http://localhost:8000
  ```

  veya

  ```powershell
  powershell -NoProfile -Command "Start-Process 'mshta.exe' 'about:internet'"
  ```

- Tarayıcıda `http://localhost:8000` adresini açın.

Dosya yapısı
- `index.html` — ana sayfa
- `styles.css` — basit, sade stiller
- `script.js` — notları yükleyen ve gösteren küçük JS
- `data/notes.json` — örnek öğretmen notları verisi

Geliştirme önerileri
- Yeni not eklemek için `data/notes.json` içine yeni bir nesne ekleyin.
- İsterseniz sunucu tarafı olmadan notlara direkt HTML dosyaları olarak da yer verebilirsiniz.

Lisans
- Bu küçük örnek özgürce kullanılabilir ve değiştirilebilir.
