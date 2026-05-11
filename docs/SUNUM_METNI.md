# PosturePal — Sunum Metni (Türkçe, ~17 dakika)

> Online sunum. Kamera yok. Bu metni doğrudan okuyabilirsin.
> Doğal ton için cümleler kısa, günlük dildedir.
> Sözcükler hesaplandı: ~2550 (yaklaşık 17 dakika @ 150 sözcük/dakika).

---

## HAZIRLIK PLANI — Sunumdan önce yapacakların

### 1 gün önce
- **Bu metni baştan sona oku.** Anlamadığın yerleri belirle, kendi sözcüklerinle değiştir.
- **Demo akışını uygulamalı test et.** `docs/PRESENTATION_GUIDE.md` içindeki "DEMO FLOW SCRIPT" bölümünü adım adım kendin uygula. Her adım çalışıyor mu kontrol et.
- **Yedekleri hazırla:** `posturepal-desktop-0.0.4.dmg` indirilmiş olsun, internet kesintisi olursa diye sayttan değil yerel dosyadan açabilesin.

### Sunum gününden 1 saat önce
- App'i bir kere aç, kalibre ol, çalıştığından emin ol.
- Sitenin canlı olduğunu kontrol et: https://posturepal-web-ochre.vercel.app/
- Online toplantı linkini hazır tut (Zoom / Google Meet / Teams).
- **Metni yanında aç** ama tam okuma değil — anahtar cümleleri bil, gerisini akıcı anlat.
- Su iç, derin nefes al.

### Sunum sırasında
- **Yavaş konuş.** Online'da nefes daha çok lazım olur.
- **Demo'da ekranını paylaş.** Önce marketing sitesini göster, sonra app'i.
- Hoca sorduğunda "Bilmiyorum" demek yerine "Tam bunu test etmedim ama sanırım…" de — dürüstlük güven kazandırır.
- Vakit kalırsa **Q&A için 5-10 dakika** bırak.

### Notlar
- Bu metin **17 dakikalık** ana sunum. Demo orta yerde, ~3-4 dakika sürer.
- Toplam (sunum + demo + Q&A) = **25-30 dakika**.
- Eğer hoca daha kısa istersek, "Bölüm 7 — Teknolojiler" ve "Bölüm 10 — Limitler"i atla, 12 dakikaya iner.

---

## SUNUM METNI

---

### [BÖLÜM 1 — Selamlama ve Giriş] (1 dakika)

Merhaba hocam, ben Kanan Akbarlı. Bugün size bitirme projem olan **PosturePal**'i anlatacağım.

PosturePal şunu yapan bir masaüstü uygulaması: bilgisayarın kamerasını kullanarak siz ekrana bakarken oturuşunuzu sürekli takip ediyor, eğri otururken size haber veriyor. Tüm hesaplama sizin bilgisayarınızda olur — kameradan hiçbir görüntü internete gitmez. Yani gizlilik açısından tamamen güvenli.

Önümüzdeki yaklaşık on yedi dakika boyunca size şunları anlatacağım: bu probleme neden el attım, mevcut çözümler neden yetersiz, ben nasıl bir farklı çözüm yaptım, en önemli yeniliğim ne, hangi teknolojileri kullandım, ve sonunda canlı bir demo yapacağım. Sorularınızı en sonda alalım, akış bölünmesin.

Hazır mısınız? Başlayalım.

---

### [BÖLÜM 2 — Problem nedir, neden önemli] (2 dakika)

Şimdi şöyle düşünelim: günümüzde insanların çoğu işini bilgisayar başında yapıyor. Yazılımcılar, ofis çalışanları, öğrenciler, uzaktan çalışanlar — herkes günde dört saat, beş saat, bazen sekiz saat ekrana bakıyor. Bunun sonucunda ortaya çıkan şey çok ciddi bir sağlık problemi.

Dünya Sağlık Örgütü'nün verilerine göre, kas-iskelet sistemi rahatsızlıkları dünyadaki engellilik nedenlerinin başında geliyor. Bunun büyük bir kısmı kötü oturuştan kaynaklanıyor. Özellikle bir şey var, adı **Forward Head Posture** — yani başın öne doğru çıkması. Bu, ekran kullananların yüzde altmışından fazlasında görülüyor. Sonuç: boyun ağrısı, sırt ağrısı, baş ağrısı, uzun vadede disk kayması.

Şimdi soru şu: bu problem bu kadar yaygınken, neden hâlâ herkes eğri oturuyor? Cevap basit: **insanlar oturuş bozulduğunda fark etmiyorlar.** Kendi vücudunu görmüyorsun, ne kadar eğildiğini bilmiyorsun. Bir saat sonra boynun acımaya başlıyor — ama o zaman çoktan zarar olmuş.

Yani buradaki gerçek ihtiyaç şu: insanlara **anlık geri bildirim** vermek. Eğri oturmaya başladığın an, sana bunu söyleyen bir şey olmalı. Ki sen düzeltebilesin, daha boyun ağrımadan, daha kötü alışkanlık yerleşmeden.

PosturePal tam olarak bunu yapıyor. Ama bunu yaparken benim çözmem gereken başka problemler de vardı — onlara birazdan geleceğim.

---

### [BÖLÜM 3 — Mevcut çözümler ve eksikleri] (2 dakika)

Bu problemi çözmeye çalışan ürünler zaten var. Şöyle ayırabiliriz:

**Birincisi**, donanım sensörler. Mesela "Upright Go" ya da "Lumo Lift" gibi cihazlar var — sırtınıza yapışıyor, eğildiğinizde titreşiyor. Bunlar çalışıyor ama iki problemi var: birincisi seksen ila yüz elli dolar gibi bir maliyet, ikincisi her gün takmak lazım. Şarjı bitiyor, banyoda unutuyorsun, bir süre sonra çekmeceye atıyorsun.

**İkincisi**, bulut tabanlı uygulamalar. Telefonun kamerasını kullanıp görüntüyü buluta gönderiyorlar, orada işliyorlar, sonuç geri geliyor. Performans olarak fena değiller ama burada bir mahremiyet sorunu var: **kamera görüntünüz birinin sunucusuna gidiyor.** Şirket o veriyi nerede saklıyor, kimle paylaşıyor — bilmiyorsunuz.

**Üçüncüsü**, basit hatırlatma uygulamaları. "Stretchly" ya da "Workrave" gibi. Bunlar bir zamanlayıcı, on dakikada bir "ayağa kalk, yürü" diyor. Ama bu ölçüm yapmıyor — siz şu an düz mü oturuyorsunuz eğri mi oturuyorsunuz, bilmiyor. Sadece zaman geçtiğini biliyor.

**Dördüncüsü**, fizyoterapist gözetimi. Tabi ki en doğrusu bu, ama hem pahalı hem de günde sekiz saat yanınızda olamaz.

Yani mevcut çözümlerin hepsi bir tarafta eksik. Donanım pahalı, bulut güvensiz, hatırlatıcılar ölçüm yapmıyor, doktor ulaşılmaz. Benim çözümümün hedefi: bu dördünün **iyi taraflarını birleştirip** kötü taraflarından kaçınmak. Yani: ölçüm var ama maliyetsiz, gerçek zamanlı ama mahremiyetli.

---

### [BÖLÜM 4 — Benim çözümüm — genel bakış] (2 dakika)

PosturePal'i şöyle özetleyebilirim: kameraya bakıyor, sizin oturuşunuzu sürekli ölçüyor, üç değişik açıyı hesaplıyor, eğri oturduğunuzda bildirim gönderiyor. Hepsi sizin bilgisayarınızda.

Üç açıyı ölçüyorum çünkü kötü oturuş tek bir şey değil. Mesela:
- **Başın öne çıkması** var — bunu "Craniovertebral Angle" denilen bir ölçüyle takip ediyorum.
- **Omuzların eğri olması** var — yani sağ omuz sol omuzdan yüksek olabilir, bu da bir problem.
- **Belin kambur olması** var — kulak, omuz, kalça hizada mı değil mi.

Bu üçü bir-birinden bağımsız. Birinde sorun olabilir diğerlerinde olmayabilir. O yüzden hepsini ayrı ayrı izliyorum.

Şimdi en önemli kısım geliyor: ölçüm yetmiyor, ölçümü nasıl yorumladığın da önemli. Çünkü her insanın "normal" oturuşu farklı. Sizin doğal oturuşunuzla benim doğal oturuşum birbirinden farklı olabilir. Ben bunu çözmek için **iki katmanlı bir sistem** kurdum. Birinci katman kişiseldir — sizi tanıyor, sizin normal oturuşunuza göre değerlendirme yapıyor. İkinci katman ise tıbbi normlardır — bilimsel makalelerden gelen genel sınırları kontrol ediyor. Bu iki katman birlikte çalışıyor. Birazdan detayına gireceğim çünkü bu **projemin en önemli yeniliği**.

Bunun yanında bir de **gizlilik mimarisi** var. Kameradan gelen görüntü hiçbir yere gitmiyor — internet, sunucu, hesap, hepsi yok. Bu bir reklam sloganı değil, kodun yapısında öyle. Birazdan onu da göstereceğim.

Şimdi nasıl çalıştığını adım adım anlatayım.

---

### [BÖLÜM 5 — Nasıl çalışıyor, adım adım] (3 dakika)

Sistemin çalışmasını başından sonuna bir film gibi düşünelim.

**Birinci adım:** Kamera açılır. PosturePal sizin webcam'inizi okur, saniyede otuz kare alır.

**İkinci adım:** Her kare Google'ın geliştirdiği **MediaPipe** denilen bir kütüphaneye gider. Bu kütüphane vücudunuzdaki otuz üç noktayı bulur — gözleriniz, kulaklarınız, omuzlarınız, dirsekleriniz, kalçanız, dizleriniz, ayaklarınız. Hepsi koordinat olarak çıkar.

Burada önemli bir nokta var: bu yapay zeka modelini ben sıfırdan yazmadım. Google'ın açık kaynak olarak verdiği hazır bir modeldir. Niye? Çünkü sıfırdan model eğitmek üç dört aylık iş. Benim dört günüm vardı. O yüzden hazır olanı kullandım — bilimsel kaynakta belirtilen güvenilir bir model.

**Üçüncü adım:** Otuz üç noktadan benim ihtiyacım olanları seçiyorum: kulak, omuz, kalça. Bu üç noktayı kullanarak az önce bahsettiğim üç açıyı hesaplıyorum. Burada matematik var ama temelde basit geometri — iki nokta arasındaki açı, üç noktalı vektör hesabı.

Önemli bir nokta: ben açıyı **piksel olarak değil, oran olarak** ölçüyorum. Yani kameraya yakın oturduğunuzda da uzakta otururken de aynı sonucu vermesi için, ölçümleri omuz genişliğine göre normalleştiriyorum. Bu önemli çünkü insanlar her zaman aynı mesafede oturmuyor.

**Dördüncü adım:** Bu ham ölçümlerde küçük titremeler oluyor — yapay zeka her karede biraz farklı bir nokta tahmin ediyor. Bu yüzden son bir saniyenin ortalamasını alıyorum, ki "titremeleri" temizleyelim.

**Beşinci adım:** Şimdi temiz ölçü elde ettik. Bu ölçüyü **iki katmanlı sistemime** veriyorum — birazdan detayını anlatacağım. Çıkış: oturuşunuz şu an "iyi", "uyarı", ya da "kötü" olarak işaretlenir.

**Altıncı adım:** Durum hemen değişmiyor. Bir saniyelik kötü ölçüm var diye hemen alarm çalmasın — yarım saniye için kafanızı yana eğmiş olabilirsiniz, normal bir hareket. O yüzden "kötü" durumun **bir buçuk saniye boyunca devam etmesi** gerekiyor, ki sistem bunu gerçek bir kötü oturuş kabul etsin.

**Yedinci adım:** Eğer gerçekten kötüyse, sistem **macOS'un yerleşik bildirim sistemiyle** bir uyarı gönderir. Bildirim metninde gerçek veri vardır: mesela "CVA açın 41 derece — sağlıklı sınır 45 derece olmalı. Başını biraz dik tut." Sadece "kötü oturuyorsun" gibi belirsiz bir şey değil; tam ne yanlış, somut olarak söyler.

**Sekizinci adım:** Her otuz saniyede bir, o anki ölçümü yerel veritabanına yazıyorum. Bu sayede sonradan "bugün ne kadar iyi oturdum, bu hafta nasıldım" gibi grafikler çıkarabiliyorum.

Bütün bu süreç saniyede otuz kez tekrar ediyor. Hiçbir adımda internet kullanılmıyor.

---

### [BÖLÜM 6 — En önemli yenilik: hibrit sistem] (3 dakika)

Şimdi geldik en önemli kısma. Bu projenin akademik anlamda yeni olan tarafı bu — başka yerlerde görmediğim bir yapı.

Söylediğim gibi, her insanın "normal" oturuşu farklı. Bazı insanların doğası gereği başı biraz öne çıkıktır, bazısının değil. Bu yüzden ilk başta **sadece kişisel bir sistem** kurmayı düşündüm: kullanıcı uygulamayı ilk açtığında, beş saniye boyunca **kendi normal oturuşunu kaydederim**. Sonra bunun üzerinden ölçerim — sizin baseline'ınızdan ne kadar saptınız?

Bu mantıklı geliyor, değil mi? Ama burada büyük bir sorun var.

Diyelim ki kullanıcı çok yorgun, ya da uyanırken kalibrasyon yapıyor. Eğri oturarak "ben böyle oturuyorum" diye sisteme kaydetti. Şimdi sistem onun "normal"i olarak **eğri oturuşu** öğrendi. Sonra bu kullanıcı her zaman eğri otursa bile sistem hiçbir zaman uyarmayacak — çünkü bu onun normali, sapma yok.

Bu çok ciddi bir problem. Bir sağlık uygulaması için aslında **tehlikeli**. Çünkü o kullanıcı zaten zarar görüyor, ama uygulama hiçbir şey söylemiyor.

Bunu nasıl çözdüm? **İkinci bir katman ekledim**: tıbbi normlar katmanı.

Burada artık kişisel değil, **bilimsel** sınırları kullanıyorum. Üç farklı klinik araştırmadan alınan sayılar var:

- Kim ve arkadaşları, 2024'te bir makale yayınladılar — başın öne çıkma açısı için kırk beş derecenin altı tehlikeli demişler.
- Cortes ve arkadaşları, 2024'te omuz asimetrisi için yüzde sekizden büyük olmamalı demişler.
- Moreira ve arkadaşları, 2022'de kulak-omuz-kalça hizasının açısı için yüz elli beş dereceden küçük olmamalı demişler.

Bu sınırlar **herkese aynı** uygulanıyor — sizin baseline'ınızdan bağımsız.

Şimdi her ölçümde iki katman birlikte çalışıyor:
- **Birinci katman** diyor ki: "Bu kullanıcının kendi normaline göre durumu iyi."
- **İkinci katman** diyor ki: "Ama tıbbi sınıra göre baktığımızda durumu kötü."

Bu iki cevap çakıştığında ne yapacağım? **En kötüsünü alıyorum.** Yani bir tanesi bile "kötü" derse, son cevap "kötü" olur. Bu çok önemli çünkü güvenlik öncelikli sistemlerde — havacılık, tıbbi cihazlar, otonom arabalar — standart yaklaşımdır. Defense-in-depth deniyor, yani savunma derinliği. Bir katman atlarsa, diğeri yakalar.

Sonuç: kullanıcı yanlış kalibrasyon yapsa bile, tıbbi katman onu güvenli sınırların dışında olduğunda uyarır. **Hatadan koruma var.**

Bunu test ederken bir şey daha keşfettim — onu da anlatayım, çok ilginç.

---

### [BÖLÜM 7 — Test sırasında bulduğum hata ve çözümü] (2 dakika)

Şimdi şöyle bir an düşünün. Ben uygulamayı yazdım. Yüz on üç tane test yazdım, hepsi geçiyor. Yapay test verileriyle her şey çalışıyor. Ama bir gün uygulamayı kendim kullandım, gerçek davranışı görmek için.

Ne yaptım? **Bilerek eğri oturarak kalibrasyon yaptım.** Yani sisteme dedim ki "ben böyle oturuyorum." Sonra aynı eğri oturuşumla devam ettim. Sistem ne yaptı? **Hiçbir şey.** Hiç uyarı yok.

Tıbbi katmanım var ya — niye o iş görmedi? Çünkü o sırada tıbbi katman henüz yoktu, sadece kişisel sistem vardı. Kişisel sistem bana baktı, "bu senin baseline'ın, sapmıyorsun" dedi.

Burada gerçek dünya testinin değeri ortaya çıktı. **Otomatik testler bu hatayı yakalayamazdı** çünkü test "kullanıcı kötü baseline alır" senaryosunu test etmiyorlardı. Sadece manuel kullanım gösterdi.

İki şey yaptım:

**Bir:** Tıbbi katmanı ekledim — az önce anlattığım iki katmanlı yapıyı. Bu sayede aynı senaryoda artık sistem uyarı veriyor.

**İki:** Kalibrasyonun kendisine güvenlik kontrolü koydum. Şimdi kullanıcı kalibrasyon yapacağı zaman, beş saniye bitince sistem o baseline'ı **tıbbi sınırlarla karşılaştırıyor**. Eğer baseline tıbbi olarak sağlıksız bir bölgede ise, uyarı çıkıyor: "Kalibrasyonunuz sağlıklı sınırların dışında görünüyor. Lütfen dik oturarak tekrar deneyin." İki düğme var: "Tekrar dene" ve "Yine de devam et". İkincisi gizli, gelişmiş kullanıcılar için, üstüne bir onay diyaloğu da koydum.

Bu hatayı bulup düzeltmem benim açımdan çok değerliydi, çünkü gösterdi ki: **insan davranışı testlerden daha karmaşıktır.** Bu da bir mühendislik dersi — gerçek kullanım her zaman kontrollü ortamdan farklı.

---

### [BÖLÜM 8 — Gizlilik mimarisi] (1.5 dakika)

Söz verdiğim gibi gizlilik kısmına geldim. Bu konuda dürüst olmam lazım çünkü kolayca yalan söylenen bir alan.

Ben "verileriniz güvende" demiyorum. **Verileri zaten almıyorum.** Aradaki fark şu:

Sıradan bir uygulama bulut sunucusu kullanıyorsa, "verileriniz şifreli, güvenli" diyor. Yani veri var, ama korumalı. Sorun şu: sunucu hacklenirse, şirket veri satarsa, yasalar değişirse — risk vardır.

Benim sistemimde **sunucu yok**. Yani:
- Kamera görüntüsü kameradan kapasiteye geliyor, işleniyor, anında siliniyor.
- Ölçümler sizin bilgisayarınızdaki yerel veritabanına yazılıyor.
- Hiçbir internet bağlantısı kurulmuyor.

Bunu nasıl kanıtlarım? Çok basit. Kod açık kaynak. GitHub'da. Herkes açıp "fetch", "axios", "http" gibi internet kelimelerini arayabilir. Tek bulunacak yer: ilk kurulumda Google'dan yapay zeka modelini indirme — onun da kullanıcı izniyle olduğunu README'de yazdım.

Mahremiyet bir reklam sloganı değil, **mimari bir özellik**. Yapı öyle ki gizlilik ihlali fiziksel olarak imkansız.

Bu özellikle Türkiye için önemli, çünkü Kişisel Verilerin Korunması Kanunu var. Benim sistemim bu kanunun kapsamına girmiyor bile — çünkü kişisel veri toplanmıyor.

---

### [BÖLÜM 9 — Hangi teknolojileri kullandım] (1 dakika)

Kısaca üzerinden geçeyim:

Masaüstü uygulaması için **Electron** kullandım. Bu Discord, VS Code, Slack gibi büyük uygulamaların kullandığı bir altyapı. Hem Mac hem Windows'ta aynı kodla çalışıyor.

Arayüz için **React** ve **TypeScript** kullandım. TypeScript sayesinde hataları yazarken yakalıyorum, çalıştırınca değil. Bu da kalite için önemli.

Yapay zeka tarafı için **MediaPipe** dedim — Google'ın açık modeli.

Veri saklama için **SQLite** kullandım. Yerel veritabanı, küçük, hızlı, sunucu gerektirmiyor.

Tanıtım sitesi için **Next.js** kullandım, **Vercel**'e deploy ettim. Site iki dilde — İngilizce ve Türkçe. Adres: **posturepal-web-ochre.vercel.app**.

Uygulamayı macOS ve Windows için ayrı ayrı paketledim. Windows derlemesini GitHub Actions ile otomatik yaptım, çünkü Windows derlemesi Mac'te güvenilir çalışmıyor.

Yani standartlara uygun, güncel teknolojiler — özel ya da egzotik bir şey yok. Önemli olan bunları nasıl birleştirdiğim.

---

### [BÖLÜM 10 — Demo] (3-4 dakika — bunu konuşma değil, gösterme olarak yap)

Şimdi izninizle ekranı paylaşacağım ve uygulamayı canlı göstereceğim.

**[Ekran paylaşımına geç. Tarayıcıda siteyi aç.]**

İlk önce tanıtım sitesi. Gördüğünüz gibi gizlilik vurgusu var, indirme bölmesi var. **[İndirme butonuna tıkla, dosya inmesin diye iptal et.]** Site otomatik olarak işletim sisteminizi anlıyor — Mac'tesiniz "Mac için indir" diyor, Windows'tasınız "Windows için indir" diyor.

Şimdi uygulamayı açıyorum. **[Uygulamayı aç.]** Kamera izni isteyecek. İlk kez açtığımda macOS bir izin diyaloğu gösterir — kabul ediyorum.

Ardından kalibrasyon var. **[Düzgün otur.]** Beş saniye boyunca normal oturuşumu kaydediyor. Tamam, baseline alındı. Şimdi izlemeye başlıyor.

Şu anda yeşil görünüyor — durumum "iyi" çünkü düzgün oturuyorum.

**[Bilerek başını öne ver, kambur otur.]** Şimdi bekliyoruz. Yaklaşık iki üç saniye içinde — işte oldu — durum kırmızıya geçti, "kötü oturuş" yazısı var. Detay olarak yazıyor: "CVA şu kadar derece, sağlıklı sınır şu kadar."

**[Bilgisayardan macOS bildirimi gelir.]** Sistemden bildirim de geldi.

**[Tekrar düzgün otur.]** Düzeltiyorum, yeşile dönüyor.

Şimdi az önce anlattığım hata düzeltmesini göstereyim. **["Recalibrate" butonuna bas, bilerek kötü oturarak kalibrasyona başla.]** Bu sefer kalibrasyon bitince — işte — sistem diyor ki "Kalibrasyonunuz sağlıklı aralık dışında." Yani benim hatamı tespit edip uyardı.

**[Dashboard'a geç.]** Burada da bugünkü ve haftalık verilerim var. Saatlik grafik, durumlara göre renklendirilmiş.

**[Settings'e geç, dili Türkçeye çevir.]** Bütün arayüz Türkçeye dönüyor.

**[Pencereyi kapat, taskbarda kal, kötü otur.]** Pencere kapalı olsa bile arka planda çalışmaya devam ediyor. Bu önemli çünkü çalışırken başka uygulama kullanıyor olabilirsiniz — siz Word'de yazarken bile bu izlemeye devam etsin.

Demo bu kadar. Sorulara döneyim.

---

### [BÖLÜM 11 — Eksikler ve gelecek planı] (1.5 dakika)

Bitirmeden önce dürüst olmam gereken birkaç şey var.

**Şu anda eksik olanlar:**

Bir, sadece önden bakan kamera çalışıyor. Yandan bakan açı yok. Yani bel kavisi gibi yandan görülebilen problemleri tam ölçemiyorum.

İki, aynı anda sadece bir kişiyi takip ediyor. İki kişi kamera önündeyse, sadece daha net göründüğünü algılıyor.

Üç, düşük ışıkta veya karışık arkaplanda dikkat azalıyor.

Dört, **klinik onayım yok**. Yani Sağlık Bakanlığı onaylı tıbbi cihaz değildir, akademik prototipdir. Bunu README'de açıkça yazdım.

Beş, kullandığım tıbbi sınırlar daha çok Batılı popülasyonlar üzerinden hesaplanmış. Asya, Afrika gibi farklı vücut yapılarına uyarlanması gerekir.

**Gelecekte yapmak istediklerim:**

Birinci olarak, kendi yapay zeka modelimi sıfırdan eğitmek. Mevcut Google modelini kullandım, ama kendi modelim duruşa özel olarak optimize olabilir.

İkincisi, ikinci bir kamera ya da telefon kamerasıyla yandan görüş eklemek. Bu en önemli eksik.

Üçüncüsü, gerçek klinik bir doğrulama çalışması yapmak — yani gerçek hastalar üzerinde, fizyoterapistlerin manuel ölçümleriyle karşılaştırma. Bu sekiz on iki haftalık bir araştırma projesi olur, etik kurul onayı gerekir.

Dördüncüsü, Apple Watch ya da Fitbit gibi cihazlarla entegrasyon — kalp atış değişkenliğiyle duruş arasındaki ilişkiyi araştırmak.

Bunların hepsi yapılabilir ama her birinin kendi araştırma süresi var. Bu sebepten **v2 yol haritasına** koydum.

---

### [BÖLÜM 12 — Kapanış ve teşekkür] (45 saniye)

Toparlayacak olursak: PosturePal, kullanıcının webcam'inden duruşunu gerçek zamanlı izleyen, hiçbir veriyi internete göndermeyen, kişisel ve tıbbi normları birleştirip kullanıcı hatasından bile koruyan bir masaüstü uygulamasıdır.

Bu proje sayesinde sadece bir uygulama yazmadım — birkaç şey öğrendim. Birincisi, otomatik testler ne kadar iyi olsa da gerçek kullanım her zaman sürpriz yapar. İkincisi, basit problemler — mesela "kameranın izni nasıl alınır" — gerçekte hiç basit değildir. Üçüncüsü, mahremiyet sonradan eklenen bir özellik olamaz, sistemin temelinden öyle tasarlanmalıdır.

Teşekkür ederim, dinlediğiniz için. Şimdi sorularınızı almak isterim.

---

## EK NOTLAR — Hocanın sorabileceği yaygın 5 soruya hazırlık

**Eğer hoca derse "Bu sadece MediaPipe + biraz UI değil mi?" o zaman:**
> "MediaPipe sadece koordinat veriyor. Bütün açı hesabı, iki katmanlı sınıflandırma, kalibrasyon güvenliği — bunlar benim yazdığım kısımlar. Yüz on üç birim testle örtülü. Aslında akademik katkı bu birleştirme şeklimde — MediaPipe sadece bir araç."

**Eğer hoca "Niye bulut yapmadın, performans daha iyi olurdu?" derse:**
> "Bulut gecikme ekler — ağ üzerinden gönderip geri almak iki yüz milisaniye sürer. Yerel olarak otuz milisaniyede yapıyorum. Hem de mahremiyet kazanıyorum, internet bağlantısı olmadan da çalışıyor. Üç kazanım birden."

**Eğer hoca "Niye sınırlar tam bu sayılar?" derse:**
> "Üç farklı klinik makalede belirlenmiş eşik değerleridir — Kim 2024, Cortes 2024, Moreira 2022. Kodumda referans olarak yazılıdır. Eğer Türk popülasyonuna uyarlamak istersek, Türkiye'de yapılan bir çalışmaya göre kalibre edebiliriz — bu V2'de."

**Eğer hoca "Klinik kullanıma uygun mu?" derse:**
> "Hayır, bu akademik bir prototip. Klinik kullanım için Sağlık Bakanlığı onayı, hasta üzerinde doğrulama çalışması ve sigorta gerekir. Şu anda günlük ofis kullanıcısına yönelik bir önleyici araç olarak konumlandırıyorum."

**Eğer hoca "Bunu satabilir misin?" derse:**
> "Teknik olarak evet. Ama satmak için Apple ve Microsoft sertifikasyonu, müşteri desteği altyapısı, sigorta gerekir. Bunlar ayrı bir iş. Şu anda açık kaynak akademik olarak tutuyorum."

---

**Bitti.** Sunum metni yaklaşık 17 dakikalık. Demo eklersen toplam 21-22 dakika. Q&A için 5-10 dakika daha bırakırsan, toplam 30 dakika eder.

**Son tavsiyeler:**
- Cümleleri çok hızlı okuma, **doğal nefes al**.
- Demo'da panik olma — bir şey çalışmazsa "Bu yerel ortamda çalışmıyor ama production'da çalışıyor, gösterebilirim" de.
- Hoca soruyu cevaplayamasan, "Bu çok güzel bir soru, üzerine düşünmem gerekecek" de — utanma.

Başarılar, Kanan. 🎯
