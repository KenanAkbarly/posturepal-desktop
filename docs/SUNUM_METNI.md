# PosturePal — Sunum Metni (yeniden yazıldı)

> **Nasıl kullanılır:**
> - 🔵 ile başlayan satırlar **senin ne yapacağın** (ekranı paylaş, tıkla, app'i aç).
>   Bunları okumuyorsun — sadece yapıyorsun.
> - Düz metin **konuşmandır**. Akıcı, kısa cümleler. Doğal nefes payı var.
> - Toplam ~17 dakika konuşma + ekran demo iç içe.
>
> **Sunumdan önce hazırlık:**
> 1. PosturePal uygulamasını masaüstüne yerleştir, ikonuna kolay erişilsin.
> 2. Tarayıcıda iki sekme aç: **(1)** posturepal-web-ochre.vercel.app, **(2)** boş bir not defteri (yedek için).
> 3. Demo'yu bir kere kendi başına test et — her şey çalışsın.
> 4. Su iç. Derin nefes al. Hazırsın.

---

## BÖLÜM 1 — Selam ve giriş (1 dakika)

🔵 **EKRAN:** Henüz paylaşma. Sadece sesin var.

Merhaba hocam. Ben Kanan.

Bugün size bitirme projemi göstereceğim. Adı **PosturePal**.

Kısaca ne yapıyor: bilgisayarınızın kamerasını kullanarak, siz ekrana bakarken nasıl oturduğunuzu sürekli takip ediyor. Eğri otururken size haber veriyor.

En önemli özelliği şu: tüm hesaplama sizin kendi bilgisayarınızda olur. Hiçbir şey internete gitmez. Yani gizlilik problemi yok.

Birazdan canlı göstereceğim, hem siteyi hem uygulamayı paylaşacağım. Şimdilik beş dakika anlatayım, sonra ekrana geçiyoruz.

---

## BÖLÜM 2 — Problem nedir (2 dakika)

🔵 **EKRAN:** Hâlâ paylaşma.

Şuna bakın. Çoğumuz günde sekiz saat bilgisayar başında oturuyoruz. Yazılımcılar, ofis çalışanları, öğrenciler — hepimiz.

Sonuç? Boyun ağrısı. Bel ağrısı. Baş ağrısı.

Sebep belli aslında: eğri oturuyoruz. Ama fark etmiyoruz. İşte asıl mesele bu.

Düşünün — kendi vücudunuza dışarıdan bakmıyorsunuz. Ne kadar eğildiğinizi bilmiyorsunuz. Bir saat sonra boyun acımaya başladığında anlıyorsunuz. Ama o zaman zaten geç.

Bu yüzden insanların ihtiyacı şu: **anlık geri bildirim**. Eğri otururken birinin "kendine gel, düzel" demesi lazım.

Ben de tam bu noktaya odaklandım. Ama tek bu kadar değil. Burada birkaç ekstra zorluk var. Birazdan onlara geleceğim.

Şunu da ekleyeyim: Dünya Sağlık Örgütü kas-iskelet rahatsızlıklarını dünyadaki engellilik nedenlerinin başına koymuş. Forward Head Posture dedikleri "başın öne çıkması" — bu, ekran kullananların yüzde altmışında var. Yani küçük bir problem değil.

---

## BÖLÜM 3 — Niye yeni bir çözüm lazımdı (1.5 dakika)

🔵 **EKRAN:** Hâlâ paylaşma.

"Tamam Kanan, anladık problemi. Ama bu probleme zaten çözümler var, sen niye yeni bir şey yapıyorsun?"

Haklı soru. Bakalım mevcut çözümler ne kadar yetiyor.

**Bir,** donanım sensörler var. Sırta yapışan cihazlar, mesela Upright Go. Çalışıyor ama yüz dolar civarı, takıp çıkarması zor, şarjı bitiyor, zamanla çekmecede unutuluyor.

**İki,** bulut tabanlı telefon uygulamaları var. Kameranın görüntüsünü buluta gönderiyorlar. Ama burada bir mahremiyet sorunu var: kamera görüntünüz bir şirketin sunucusunda. Onlar ne yapıyor, kimle paylaşıyor — siz bilmiyorsunuz.

**Üç,** "10 dakikada bir uyar" tarzı zamanlayıcı uygulamalar var. Bunlar ölçüm yapmıyor. Sadece zaman geçtiğini söylüyor. Düz mü oturuyorsunuz eğri mi — fark etmiyor.

**Dört,** tabii bir de fizyoterapist var. En doğru çözüm ama pahalı, ulaşılması zor, günlük yanınızda olmuyor.

Yani her çözüm bir tarafta eksik. Ben şunu hedefledim: ölçüm yapan, gerçek zamanlı, ama hiçbir veriyi internete göndermeyen, herkesin standart laptop'uyla çalışan bir sistem. Donanım yok, bulut yok.

---

## BÖLÜM 4 — Şimdi sizi siteyle tanıştırayım (1.5 dakika)

🔵 **EKRAN:** Ekranı paylaş. Tarayıcı sekmesini aç:
**posturepal-web-ochre.vercel.app**

İşte bu tanıtım sitesi. Vercel'de barındırılıyor.

Üstte gördüğünüz büyük yazı — "Your posture, watched only by you". Yani "duruşunuz, sadece sizin görüşünüzde."

🔵 **EKRAN:** Sayfayı yavaşça aşağı kaydır.

Burada özellikler var. Altı tane. Gizlilik birinci sırada — bu vurgu özellikle önemli.

🔵 **EKRAN:** "Privacy" bölümüne kaydır.

İşte burası en sevdiğim kısım. Bakın — büyük yazıyla diyor ki: "Kameranız bilgisayarınızdan asla çıkmaz." Altta dört sütun: ağ çağrısı sıfır, telemetri yok, hesap gerektirmiyor, kaynak kodu açık.

Bunlar reklam sloganı değil. Birazdan ispatlayacağım — kod açık kaynak, GitHub'da, herkes bakabilir.

🔵 **EKRAN:** "Download" bölümüne in. İki kart görünüyor — macOS ve Windows.

İndirme kısmı. Site sizin işletim sisteminizi tanıyor. Ben şu an Mac'te olduğum için yukardaki büyük buton "macOS için indir" diyor. Windows kullanıcısı geldiğinde otomatik olarak Windows için indir oluyor.

Türkçe-İngilizce çevirisi tam — sağ üstte dil değiştiriciyle anlık geçiş yapabilirsiniz.

Tamam, siteyi gördünüz. Şimdi asıl uygulamayı açacağım.

---

## BÖLÜM 5 — Uygulamayı açıyorum (3 dakika)

🔵 **EKRAN:** Tarayıcıyı küçült. **PosturePal** uygulamasını aç (Launchpad veya Spotlight'tan).

🔵 **EKRAN:** İlk açılışta macOS kamera izni soracak. **"OK"** bas.

Bakın — macOS bana kamera izni soruyor. Burada bir teknik detay var aslında: macOS'in son sürümlerinde, uygulamanın **hardened runtime entitlement**'ı dediğimiz bir izin bayrağı olmazsa, bu pencere bile çıkmıyor. Sessizce reddediyor.

Ben bunu test sırasında keşfettim. Sürüm 0.0.2'de bu hatayı düzelttim. Yani uygulamanın doğru çalışması için sadece kod değil, paketleme ayarları da önemliymiş.

🔵 **EKRAN:** İzin verdikten sonra uygulamanın ana ekranı açılır. Webcam görüntüsü canlı, ama henüz kalibrasyon yok.

İlk açılışta kalibrasyon ekranı çıkıyor. Niye? Çünkü her insanın doğal oturuşu farklı. Sistemin sizi tanıması lazım.

🔵 **EKRAN:** Sandalyede dik otur. **"Start calibration"** butonuna bas.

🔵 **EKRAN:** 3-2-1 geri sayım, sonra 5 saniyelik kayıt. Bu sırada dik dur.

Şimdi sistem benim normal oturuşumu ölçüyor. Beş saniye boyunca üç tane şey topluyor:
- Başımın çıkma açısı
- Omuzlarımın simetrisi
- Belimin düzlüğü

Beş saniye sonu — bakın, sistem diyor ki "kalibrasyonunuz sağlıklı aralıkta." Yeşil onay var. Bu da önemli bir nokta, biraz sonra niye önemli olduğunu anlatacağım.

🔵 **EKRAN:** **"Looks good"** butonuna bas. İzleme moduna geçiş.

Şimdi ana izleme ekranındayız. Sol üstte canlı kamera görüntüsü, üstüne çizilmiş iskelet var — bunlar yapay zekanın bulduğu vücut noktaları. Saniyede otuz defa güncelleniyor.

Aşağıda durum göstergesi: **iyi**, yeşil renkte. Yanında üç tane ölçüm: CVA açım, omuz asimetrim, hizalama açım. Hepsi yeşil — her şey yolunda.

---

## BÖLÜM 6 — Şimdi eğri oturarak ne olduğunu göstereyim (1.5 dakika)

🔵 **EKRAN:** Uygulamayı paylaşmaya devam et. Bilerek başını öne ver, kambur otur.

Şimdi bilerek kötü oturuyorum. Başımı öne eğiyorum.

Bekleyin… birkaç saniye sürer çünkü sistem ani değişikliklere kanmasın diye **bir buçuk saniyelik onay süresi** koydum.

🔵 **EKRAN:** ~2-3 saniye sonra durum kırmızıya döner.

İşte — sarıya geçti, sonra kırmızıya. Durum: **kötü oturuş**.

🔵 **EKRAN:** Aynı anda macOS'tan sistem bildirimi gelir (sağ üst köşede).

Aynı zamanda bildirim geldi. Bakın ne yazıyor:

**"CVA açın 41 derece — sağlıklı sınır 45 derece olmalı. Başını biraz dik tut."**

Sadece "kötü oturuyorsun" demiyor. **Gerçek veri** var: tam ne açıda, sınır ne olmalı, ne yapacağım.

🔵 **EKRAN:** Şimdi dik otur. Durum yeşile döner.

Düzeltiyorum — bakın yeşile döndü.

Bu sırada sistem arka planda otuz saniyede bir veritabanına kayıt yazıyor. Birazdan dashboard'da göstereceğim — gün boyu nasıl oturduğumu görüyorum.

---

## BÖLÜM 7 — En önemli yenilik: iki katmanlı sistem (3 dakika)

🔵 **EKRAN:** Uygulama hâlâ açık. Yukarıda kalibrasyon güzelken biri demişti — şimdi bunun yokluğunu test edeceğim.

Şimdi en önemli kısma geldim. Bu projenin akademik anlamda yeni olan tarafı bu.

Az önce ne yaptık? Düzgün oturup kalibre olduk. Sistem benim normal oturuşumu ezberledi. Sonra ben eğri otururken uyarı geldi. Hepsi mantıklı.

Ama düşünelim. Diyelim ki ben **çok yorgunum**. Sabah uyandım, mahmurum, eğri oturarak kalibrasyon yaptım. Sistem ne yapacak? Benim eğri oturuşumu "normal" olarak ezberleyecek. Bundan sonra ben eğri otursam bile sistem "her şey iyi" diyecek. Çünkü ona göre bu benim normalim.

Bu bir **sağlık uygulaması için ciddi bir tehlike**. Çünkü kullanıcı zaten zarar görüyor ama uygulama hiçbir şey söylemiyor.

Ben bunu nasıl çözdüm? **İkinci bir katman ekledim**.

İlk katman size özel — sizin baseline'ınızla karşılaştırıyor. İkinci katman ise **klinik araştırmalardan gelen genel sınırlar**. Burada üç farklı bilimsel makaleden değerler aldım:

- Kim ve arkadaşları, 2024'te bir makale yayınladılar — başın açısı kırk beş derecenin altına düşmemeli demişler.
- Cortes ve arkadaşları, 2024'te omuz asimetrisi için yüzde sekizden büyük olmamalı demişler.
- Moreira ve arkadaşları, 2022'de bel hizası açısı için yüz elli beş dereceden küçük olmamalı demişler.

Bu sınırlar **size özel değil, herkese aynı**. Tıbbi standart.

Her ölçümde iki katman birlikte çalışıyor. Sonra ne yapıyorum? **En kötüsünü alıyorum.** Eğer kişisel katman "iyi" der ama tıbbi katman "kötü" derse — sonuç kötüdür.

Niye böyle? Çünkü güvenlik öncelikli sistemlerde — uçaklar, tıbbi cihazlar, otonom araçlar — hep bu mantık vardır. Bir katman atlarsa diğeri yakalar. Buna **defense-in-depth** deniyor.

Şimdi bunu canlı göstereyim. İlk olarak kötü baseline alacağım, sonra bakalım ne olacak.

🔵 **EKRAN:** Uygulamada **"Recalibrate"** butonuna bas.

🔵 **EKRAN:** Şimdi bilerek **çok kötü otur** — başını çok öne çıkar, omuzlarını kambur yap. Beş saniye böyle dur. Kalibrasyon böyle bitsin.

İşte. Bilerek çok eğri oturarak kalibre oldum.

🔵 **EKRAN:** Beş saniye bitince güvenlik uyarısı çıkar.

Bakın ne diyor: **"Kalibrasyonunuz sağlıklı aralık dışında. Sırtınızı dik tutarak, omuzlarınız rahat, başınız omuz hizasında olacak şekilde tekrar deneyin."**

Sistem benim hatalı kalibrasyonumu tespit etti. İki seçenek veriyor: **tekrar dene** veya **yine de devam et** (bu ikincisi gizli, gelişmiş kullanıcılar için, bir onay diyaloğuyla korunuyor).

Bu özellik benim açımdan çok değerli çünkü **gerçek kullanım sırasında keşfettim**. Otomatik testlerim yüz on üç tane — hepsi geçiyor. Ama hiçbir test "kullanıcı kötü baseline alır" senaryosunu test etmiyordu. Sadece manuel kullanım gösterdi.

Bana öğretti ki: otomatik testler ne kadar iyi olsa da gerçek dünyayı tam yakalayamaz. Gerçek kullanıcı testi şart.

🔵 **EKRAN:** **"Try again"** bas. Sonra dik otur. Düzgün kalibre ol.

Tamam, düzelttim.

---

## BÖLÜM 8 — Gizlilik nasıl güvende (1 dakika)

🔵 **EKRAN:** Uygulamayı kapatma, paylaşmaya devam et.

Söz vermiştim, gizlilikten bahsedeceğim. Hızlıca geçeyim çünkü en önemli şey çok basit:

**Verileri zaten almıyorum.** Aradaki fark şu:

Sıradan bir uygulama bulut kullanıyorsa "verileriniz şifreli, güvenli" der. Yani veri var ama korumalı. Sunucu hacklenirse, şirket veri satarsa — risk var.

Benim sistemimde **sunucu yok**. Kamera görüntüsü kapasiteye geliyor, işleniyor, hemen siliniyor. Ölçümler sizin bilgisayarınızdaki yerel veritabanına yazılıyor. Hiçbir internet bağlantısı kurulmuyor.

Bunu kanıtlamak çok kolay. Kod açık, GitHub'da. Herkes açıp "fetch", "axios", "internet" gibi kelimeleri arayabilir. Çıkmıyor.

Mahremiyet bir reklam değil — sistemin **mimari özelliği**. Yapı öyle ki gizlilik ihlali fiziksel olarak imkansız.

Bu özellikle Türkiye için önemli, Kişisel Verilerin Korunması Kanunu yüzünden. Benim sistemim bu kanunun kapsamına bile girmiyor — çünkü zaten kişisel veri toplanmıyor.

---

## BÖLÜM 9 — Dashboard ve dil değiştirme (1.5 dakika)

🔵 **EKRAN:** Uygulama üst menüsünde **"Dashboard"** sekmesine geç.

Şimdi dashboard'a bakalım.

🔵 **EKRAN:** Bugünün grafiği, hafta grafiği görünür.

Üstte bugünkü özet — kaç dakika iyi oturdum, kaç dakika uyarı, kaç dakika kötü. Altta saatlik grafik — günün hangi saatlerinde nasıl oturduğum.

Daha aşağıda haftalık grafik var. Hangi günler daha iyi oturmuşum görüyorum.

Tüm bu veri **sizin bilgisayarınızda**, SQLite veritabanında. Herhangi bir yere gitmedi.

🔵 **EKRAN:** **"Settings"** sekmesine geç. Dil seçimini bul.

Şimdi dile bakayım. Buradan Türkçe seçiyorum.

🔵 **EKRAN:** Türkçe seç. UI anında Türkçeye döner.

Bakın — bütün arayüz Türkçeye geçti. Yüz on'dan fazla çeviri anahtarı var. Bu tercih veritabanına kaydedildi — uygulamayı kapatıp açtığımda Türkçe açılacak.

---

## BÖLÜM 10 — Arka planda nasıl çalışır (1 dakika)

🔵 **EKRAN:** Uygulamanın pencere kapatma butonuna bas — uygulama menü çubuğunda kalır.

Şimdi bir şey daha göstereyim. Pencereyi kapatıyorum.

🔵 **EKRAN:** Pencere kapalı. Üst menü çubuğunda küçük simge var.

Bakın — uygulama tamamen kapanmadı. Menü çubuğunda küçük simgesi var. Yani arka planda çalışmaya devam ediyor.

Bu önemli çünkü çalışırken başka uygulama kullanıyor olabilirsiniz. Word açık, Excel açık, kod yazıyorsunuz. PosturePal görünmüyor ama yine de sizi izliyor.

🔵 **EKRAN:** Bilerek eğri otur, başını öne çıkar. Birkaç saniye bekle.

Şimdi bilerek eğri oturuyorum. Pencere kapalı. Bekleyin…

🔵 **EKRAN:** macOS bildirimi gelir.

Geldi. Pencereyi kapatmama rağmen sistem bana ulaşıyor.

Bu, küçük bir teknik detay gibi görünüyor ama aslında zor bir kısımdı. Modern tarayıcılar arka plandaki sayfaları yavaşlatıyor — pil tasarrufu için. Bu varsayılan ayarı kapatmam gerekti, yoksa pose detection arka planda saniyede bir kareye düşüyordu.

---

## BÖLÜM 11 — Eksikler ve gelecek planı (1.5 dakika)

🔵 **EKRAN:** Paylaşımı durdurabilirsin (isteğe bağlı).

Bitirmeden dürüst olmam gereken birkaç şey var.

**Şu anda eksik olanlar:**

Bir — sadece önden bakan kamera çalışıyor. Yandan açı yok. Bel kavisi gibi yandan görülen problemler tam ölçülemiyor.

İki — aynı anda sadece bir kişiyi takip ediyor.

Üç — düşük ışıkta dikkat azalıyor.

Dört — **bu klinik onaylı bir tıbbi cihaz değil**. Akademik prototip. README'de açıkça yazdım.

Beş — kullandığım tıbbi sınırlar Batılı popülasyon araştırmalarından. Türk popülasyonu için ayrı kalibrasyon gerek olabilir.

**Gelecekte yapmak istediklerim:**

Birincisi, kendi yapay zeka modelimi sıfırdan eğitmek. Şu an Google'ın modelini kullanıyorum, ama duruşa özel optimize bir model daha doğru olabilir.

İkincisi, ikinci bir kamera ya da telefon kamerası ile yan görüş eklemek. En önemli eksik bu.

Üçüncüsü, gerçek hastalar üzerinde klinik bir doğrulama çalışması yapmak. Bu sekiz on iki haftalık bir araştırma, etik kurul onayı gerekir.

Dördüncüsü, Apple Watch entegrasyonu — kalp atış değişkenliğiyle duruş arasındaki ilişki.

Bunların hepsi yapılabilir ama ayrı araştırma projesi. V2 yol haritasında.

---

## BÖLÜM 12 — Kapanış (45 saniye)

🔵 **EKRAN:** İsteğe bağlı — paylaşım kapalı, sadece ses.

Toparlayacak olursak.

PosturePal, kullanıcının webcam'inden duruşunu gerçek zamanlı izleyen, hiçbir veriyi internete göndermeyen, kişisel ve tıbbi normları birleştirip kullanıcı hatasından bile koruyan bir masaüstü uygulaması.

Bu projeyle bir uygulama yazmaktan fazlasını öğrendim. Otomatik testler ne kadar iyi olsa da gerçek kullanım her zaman sürpriz yapar. Basit görünen problemler — mesela kamera izninin nasıl alınacağı — pratikte hiç basit değildir. Ve mahremiyet sonradan eklenen bir özellik olamaz; sistemin temelinden öyle tasarlanmalı.

Teşekkür ederim dinlediğiniz için. Şimdi sorularınızı almak isterim.

---

## EK — Hocanın sorabileceği 5 sıkça çıkan soruya hızlı cevap

🔵 **EKRAN:** Soru gelirse bu kısımdan oku. Acele etme — düşünmek için "iyi soru" denir.

**Soru:** *"Bu sadece MediaPipe + biraz arayüz değil mi? Sen ne yaptın?"*

Cevap: MediaPipe sadece koordinat veriyor — vücudumdaki noktaları buluyor. Asıl iş ondan sonra: açıları hesaplama, iki katmanlı sınıflandırma, kalibrasyon güvenliği, hassasiyet ayarı. Bunlar benim yazdığım kısımlar. Yüz on üç birim test örtüyor. MediaPipe sadece bir araç.

---

**Soru:** *"Niye bulut yapmadın? Performans daha iyi olmaz mıydı?"*

Cevap: Bulut gecikme ekler — ağ üzerinden gidiş geliş iki yüz milisaniye sürer. Yerel olarak otuz milisaniyede yapıyorum. Üstelik mahremiyet kazanıyorum ve internet olmadan da çalışıyor. Üç kazanım birden.

---

**Soru:** *"Bu sayıları nereden aldın? Tıbbi sınırlar yani."*

Cevap: Üç bilimsel makale: Kim 2024 forward head için, Cortes 2024 omuz asimetrisi için, Moreira 2022 hizalama için. Kodumda referans olarak yazılı. Türk popülasyonuna uyarlamak istersek Türkiye'de yapılan bir çalışmaya göre kalibre edebiliriz, ama bu V2.

---

**Soru:** *"Bunu satabilir misin? Ticari ürün olabilir mi?"*

Cevap: Teknik olarak evet. Ama satmak için Apple ve Microsoft sertifikası, müşteri desteği altyapısı, sigorta gerekir. Bunlar ayrı bir iş. Şu anda akademik açık kaynak olarak tutuyorum.

---

**Soru:** *"Klinik kullanıma uygun mu?"*

Cevap: Hayır. Akademik prototip. Klinik kullanım için Sağlık Bakanlığı onayı, hasta üzerinde doğrulama çalışması, sigorta gerekir. Şu an günlük ofis kullanıcısı için önleyici bir araç olarak konumlandırıyorum.

---

## EK — Eğer canlı demo'da bir şey çalışmazsa

🔵 **EKRAN:** Sakin ol. Panik yapma.

Eğer kamera açılmazsa:
> "Bu yerel makinada bazen kamera takılı kalıyor. Önemli değil, çünkü çekirdek mantığı şu anda anlatabilirim — şu ekranı göstereyim."
> (Sonra kodu aç, `posture/hybrid-classifier.ts`'i göster, ne yaptığını anlat.)

Eğer bildirim çıkmazsa:
> "Notification'lar bazen macOS Focus mode'da gecikiyor. Konsept aynı — sistem durumu tespit ediyor, sadece görsel gecikti."

Eğer site açılmazsa:
> "Vercel'in CDN'i ara sıra önbellekte takılıyor. GitHub'dan direkt kod gösterebilirim."

**En önemlisi:** hangi şey çalışmazsa o şeyin konseptini anlatmaya geçersin. Demo bir destek, anlatım ana iş.

---

**Bitti. Başarılar, Kanan.** 🎯
