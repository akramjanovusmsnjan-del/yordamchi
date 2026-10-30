
"use strict";

// ===============================================
// UNIVERSAL EDU AI
// Faqat HTML + CSS + JavaScript
// Server va API talab qilinmaydi.
// ===============================================

const $ = (id) => document.getElementById(id);

let currentText = "";
let isGenerating = false;

const languageNames = {
    uz: "O‘zbek tilida",
    ru: "На русском языке",
    en: "In English"
};

function clean(value) {
    return String(value || "").trim();
}

function makeLine() {
    return "=".repeat(75);
}

function makeSection(number, title, content) {
    return `
${makeLine()}
${number}. ${title.toUpperCase()}
${makeLine()}

${content}

`;
}

function numbered(items) {
    return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function makeTasks(topic, subject) {
    const tasks = [
        `«${topic}» mavzusiga oid asosiy tushunchalarni yozing.`,
        `«${topic}» mavzusining eng muhim 5 ta jihatini izohlang.`,
        `Mavzuga oid 10 ta atama va ularning ta'rifini tuzing.`,
        `Mavzuni o‘z so‘zlaringiz bilan qisqacha tushuntiring.`,
        `Mavzu bo‘yicha jadval yoki sxema tayyorlang.`,
        `Mavzuning kundalik hayotdagi qo‘llanilishiga misollar keltiring.`,
        `Mavzuga oid 5 ta savol tuzing va javoblarini yozing.`,
        `Mavzu bo‘yicha kichik loyiha yoki taqdimot tayyorlang.`,
        `Mavzuning murakkab jihatlarini aniqlang va izohlang.`,
        `O‘rganganlaringiz asosida xulosa yozing.`
    ];

    return numbered(tasks);
}

function makeOpenQuestions(topic) {
    const questions = [
        `«${topic}» deganda nimani tushunasiz?`,
        `«${topic}» mavzusining asosiy maqsadi nimadan iborat?`,
        `Mavzuning eng muhim xususiyatlarini tushuntiring.`,
        `Ushbu mavzuga oid asosiy tushunchalarni izohlang.`,
        `Mavzuning qanday afzalliklari mavjud?`,
        `Mavzu bilan bog‘liq qanday muammolar uchrashi mumkin?`,
        `Mavzuni amaliyotda qayerda qo‘llash mumkin?`,
        `Ushbu mavzu bo‘yicha qanday misollar keltira olasiz?`,
        `Mavzu yuzasidan qanday yangi bilimlarga ega bo‘ldingiz?`,
        `«${topic}» bo‘yicha o‘z xulosangizni bayon qiling.`
    ];

    return numbered(questions);
}

function makeTests(topic) {
    const questionTypes = [
        `«${topic}» mavzusining asosiy mazmunini qaysi javob to‘g‘ri ifodalaydi?`,
        `«${topic}» mavzusini o‘rganishda birinchi navbatda nimaga e'tibor beriladi?`,
        `Mavzuga oid asosiy tushunchani aniqlash uchun qaysi manbadan foydalanish mumkin?`,
        `«${topic}» mavzusining amaliy ahamiyati nimada?`,
        `Mavzuni chuqur o‘zlashtirish uchun qaysi usul samaraliroq?`,
        `Mavzuning muhim xususiyatlarini qanday aniqlash mumkin?`,
        `«${topic}» bo‘yicha bilimni tekshirishning qaysi usuli mos?`,
        `Mavzuga oid misolni tahlil qilishda nimaga e'tibor beriladi?`,
        `Mavzu bo‘yicha xulosa chiqarishda qaysi ma'lumotlar muhim?`,
        `«${topic}»ni amaliy vaziyatda qo‘llash nimani talab qiladi?`,
        `Mavzudagi sabab va natija aloqasi qanday aniqlanadi?`,
        `Mavzuni boshqa tushunchalar bilan taqqoslash nima uchun kerak?`,
        `Mavzu bo‘yicha mustaqil izlanish qanday boshlanadi?`,
        `Mavzuga oid ma'lumotning ishonchliligi qanday tekshiriladi?`,
        `«${topic}»ni o‘rganishda qanday xatolardan saqlanish kerak?`,
        `Mavzu bo‘yicha bilimni mustahkamlashning samarali yo‘li qaysi?`,
        `Mavzuga oid nazariy bilimni amaliyotga qanday tatbiq etish mumkin?`,
        `Mavzu yuzasidan taqdimot tayyorlashda nima muhim?`,
        `Mavzuni o‘zlashtirganlikni qanday namoyish qilish mumkin?`,
        `«${topic}» bo‘yicha yakuniy xulosa qanday tuziladi?`
    ];

    const result = [];

    questionTypes.forEach((question, index) => {
        result.push(
            `${index + 1}. ${question}\n` +
            `   A) Mavzuga oid dalillar va tushunchalarni tahlil qilish\n` +
            `   B) Mavzuni o‘rganmasdan taxmin qilish\n` +
            `   C) Mavzuga aloqasiz ma'lumotlarni yozish\n` +
            `   D) Hech qanday izoh bermaslik`
        );
    });

    return result.join("\n\n");
}

function makeGames(topic) {
    const games = [
        {
            name: "Kim tez topadi?",
            goal: "Mavzuga oid tushunchalarni tez esga olish.",
            tools: "Kartochkalar, doska, marker.",
            rules: "O‘qituvchi mavzuga oid savol beradi. O‘quvchilar javobni navbat bilan aytadilar.",
            result: "To‘g‘ri va asosli javoblar uchun ball beriladi."
        },
        {
            name: "Bilimlar zanjiri",
            goal: "O‘quvchilarning ketma-ket fikrlashini rivojlantirish.",
            tools: "Savollar ro‘yxati.",
            rules: "Birinchi o‘quvchi mavzuga oid tushunchani aytadi. Keyingisi shu tushunchaga bog‘liq yangi fikr bildiradi.",
            result: "Takrorlanmagan va mantiqan bog‘langan javoblar baholanadi."
        },
        {
            name: "To‘g‘ri yoki noto‘g‘ri",
            goal: "Mavzu bo‘yicha bilimlarni tekshirish.",
            tools: "Oldindan tayyorlangan fikrlar.",
            rules: "O‘qituvchi «${topic}» mavzusiga oid fikrlarni o‘qiydi. O‘quvchilar ularning to‘g‘ri yoki noto‘g‘riligini aniqlaydilar.",
            result: "Har bir javob izoh bilan asoslanadi."
        },
        {
            name: "Sirli atama",
            goal: "Asosiy terminlarni o‘zlashtirish.",
            tools: "Atamalar yozilgan kartochkalar.",
            rules: "Bir o‘quvchi kartochkadagi atamani aytmasdan tushuntiradi. Guruh uning nomini topadi.",
            result: "Atamani aniq topgan guruhga ball beriladi."
        },
        {
            name: "Bilimlar bellashuvi",
            goal: "Jamoaviy ishlash va mavzuni mustahkamlash.",
            tools: "Savollar, doska, ball jadvali.",
            rules: "Sinf guruhlarga ajratiladi. Har bir guruh mavzu yuzasidan savollarga javob beradi.",
            result: "Eng ko‘p to‘g‘ri javob bergan guruh g‘olib bo‘ladi."
        }
    ];

    return games.map((game, index) => `
${index + 1}. ${game.name}
   Maqsad: ${game.goal}
   Vositalar: ${game.tools}
   Qoidalar: ${game.rules}
   Natija: ${game.result}
`).join("\n");
}

function makeWorksheet(topic) {
    const tasks = [
        `«${topic}» mavzusining asosiy mazmunini 5 ta gapda bayon qiling.`,
        "Mavzuga oid 5 ta asosiy atamani yozing.",
        "Har bir atamaga qisqa izoh bering.",
        "Mavzu yuzasidan 3 ta savol tuzing.",
        "Mavzuga oid jadval tayyorlang.",
        "Mavzuni hayotiy misol bilan tushuntiring.",
        "Mavzuning 3 ta muhim xususiyatini yozing.",
        "Mavzuga oid kichik rasm yoki sxema chizing.",
        "Mavzu bo‘yicha xulosa yozing.",
        "O‘zingiz uchun eng qiyin bo‘lgan savolni yozing."
    ];

    return numbered(tasks);
}

function makeCrossword(topic) {
    const words = [
        "MAVZU", "BILIM", "TA'LIM", "TAHLIL", "MISOL",
        "SAVOL", "JAVOB", "DASTUR", "FAN", "ILM"
    ];

    return `
KROSSVORD UCHUN SAVOLLAR:

${numbered([
        `${topic} mavzusining markaziy tushunchasi qanday ataladi?`,
        "O‘rganish natijasida hosil bo‘ladigan tushuncha.",
        "Bilim berish va tarbiyalash jarayoni.",
        "Ma'lumotni qismlarga ajratib o‘rganish jarayoni.",
        "Fikrni tushuntirish uchun keltiriladigan namuna.",
        "Javob talab qiladigan so‘roq gap.",
        "Savolga bildiriladigan munosabat.",
        "Oldindan belgilangan amallar ketma-ketligi.",
        "O‘rganiladigan bilim sohasi.",
        "Ilmiy bilimlar majmuasi."
    ])}

SO‘ZLAR RO‘YXATI:
${words.join(", ")}

Eslatma: bu avtomatik tuzilgan so‘zlar ro‘yxati. Haqiqiy katakli krossvord yaratish va mavzuga mos javoblarni tekshirish o‘qituvchi tomonidan bajariladi.
`;
}

function makeSlides(topic, subject) {
    const slides = [
        ["Titul slaydi", `${subject} fanidan «${topic}» mavzusi. Dars mavzusi va muallif ma'lumotlari.`],
        ["Dars maqsadi", "Darsning ta'limiy, tarbiyaviy va rivojlantiruvchi maqsadlari."],
        ["Mavzuga kirish", `«${topic}» mavzusi haqida boshlang‘ich tushuncha va muammoli savol.`],
        ["Asosiy tushunchalar", "Mavzuning muhim atamalari va ularning izohi."],
        ["Nazariy ma'lumot", "Mavzuning asosiy qoidalari, xususiyatlari va mazmuni."],
        ["Misollar", "Mavzuga oid amaliy va hayotiy misollar."],
        ["Tahlil", "Mavzu bo‘yicha sabablar, natijalar va o‘zaro bog‘liqliklar."],
        ["Amaliy mashg‘ulot", "O‘quvchilar bajaradigan topshiriqlar va muhokama."],
        ["Mustahkamlash", "Savollar, qisqa test va guruhli mashg‘ulot."],
        ["Xulosa", "Asosiy fikrlar, refleksiya va uyga vazifa."]
    ];

    return slides.map((slide, index) => `
SLAYD ${index + 1}: ${slide[0]}
Matn: ${slide[1]}
Vizual tavsiya: Mavzuga mos rasm, sxema, jadval yoki infografika.
`).join("\n");
}

function makeImages(topic, subject) {
    const ideas = [
        "Mavzuning asosiy mazmunini tushuntiruvchi infografika.",
        "Mavzudagi muhim tushunchalar o‘rtasidagi bog‘lanish diagrammasi.",
        "Mavzuga oid bosqichma-bosqich jarayon tasviri.",
        "Mavzuning amaliy qo‘llanilishini ko‘rsatuvchi illyustratsiya.",
        "Mavzuning asosiy xususiyatlarini taqqoslovchi vizual jadval."
    ];

    return ideas.map((idea, index) => `
${index + 1}. ${idea}
   Rasm yaratish prompti:
   "${subject} fanidagi ${topic} mavzusini tushuntiruvchi,
   ta'limiy maqsadga mos, aniq yozuvlar va tushunarli
   vizual elementlarga ega professional infografika yarat."
`).join("\n");
}

function makeRubric() {
    return `
| Baholash mezoni | Ball |
|---|---:|
| Mavzuni tushunish | 20 |
| Nazariy bilim | 20 |
| Amaliy topshiriqlar | 20 |
| Mustaqil fikrlash | 15 |
| Savollarga javob berish | 15 |
| Faollik va ishtirok | 10 |
| JAMI | 100 |

TAVSIYA ETILGAN BAHOLASH:
86–100 ball — a'lo
66–85 ball — yaxshi
35–65 ball — qoniqarli
0–34 ball — qoniqarsiz

Bu mezonlar namunaviy bo‘lib, o‘qituvchi ularni fan va ta'lim bosqichiga moslashtiradi.
`;
}

function makeLessonPlan() {
    return `
| Dars bosqichi | Vaqt | Faoliyat |
|---|---:|---|
| Tashkiliy qism | 3 daqiqa | Salomlashish, davomat |
| O‘tgan mavzuni takrorlash | 7 daqiqa | Savol-javob |
| Yangi mavzuga kirish | 5 daqiqa | Muammoli savol |
| Yangi mavzuni tushuntirish | 15 daqiqa | Nazariy ma'lumot |
| Amaliy mashg‘ulot | 10 daqiqa | Topshiriqlar |
| Mustahkamlash | 5 daqiqa | Test va savollar |
| Baholash va yakun | 5 daqiqa | Natijalar va xulosa |

Umumiy vaqt: 50 daqiqa.
`;
}

function makeTeacherGuide(topic, extra) {
    return `
1. Darsdan oldin mavzuga oid ishonchli manbalarni tayyorlang.
2. O‘quvchilarning avvalgi bilimlarini aniqlang.
3. Mavzuni sodda tushunchalardan boshlab izohlang.
4. Nazariy ma'lumotlarni amaliy misollar bilan bog‘lang.
5. O‘quvchilarga mustaqil fikrlash uchun vaqt bering.
6. Guruhli va yakka tartibdagi faoliyatni uyg‘unlashtiring.
7. Har bir topshiriqning bajarilish shartini tushuntiring.
8. Dars oxirida o‘quvchilardan fikr-mulohaza oling.
9. Bilimlarni faqat yodlash emas, tushunish va qo‘llash asosida baholang.
10. Keyingi dars uchun aniqlangan qiyinchiliklarni qayd eting.

QO‘SHIMCHA TALABLAR:
${extra || "Qo‘shimcha talab kiritilmagan."}

DIQQAT:
«${topic}» mavzusiga oid aniq sanalar, formulalar, ilmiy faktlar,
tarixiy ma'lumotlar va boshqa muhim dalillarni darsda ishlatishdan
oldin darslik yoki ishonchli manba orqali tekshiring.
`;
}

function buildMaterial(subject, grade, topic, extra, language) {
    const isUz = language === "uz";
    const isRu = language === "ru";

    const title = isUz ? "UNIVERSAL EDU AI — DARS MATERIALLARI"
        : isRu ? "UNIVERSAL EDU AI — УЧЕБНЫЕ МАТЕРИАЛЫ"
        : "UNIVERSAL EDU AI — LESSON MATERIALS";

    const subjectLabel = isUz ? "Fan" : isRu ? "Предмет" : "Subject";
    const gradeLabel = isUz ? "Sinf / daraja" : isRu ? "Класс / уровень" : "Grade / level";
    const topicLabel = isUz ? "Mavzu" : isRu ? "Тема" : "Topic";
    const note = isUz
        ? "ESLATMA: Ushbu to‘plam avtomatik tuzilgan metodik namuna. Aniq fan mazmuniga oid faktlar va test javoblarini darslik bilan tekshiring."
        : isRu
        ? "ПРИМЕЧАНИЕ: Это автоматически сформированный методический шаблон. Проверяйте факты и ответы по учебнику."
        : "NOTE: This is an automatically generated teaching template. Verify subject-specific facts and answers against reliable textbooks.";

    const output = [];

    output.push(title);
    output.push(makeLine());
    output.push(`${subjectLabel}: ${subject}`);
    output.push(`${gradeLabel}: ${grade || "Ko‘rsatilmagan"}`);
    output.push(`${topicLabel}: ${topic}`);
    output.push(`Til: ${languageNames[language]}`);
    output.push(note);

    output.push(makeSection(1, "Dars haqida umumiy ma'lumot", `
Fan: ${subject}
Sinf / daraja: ${grade || "Ko‘rsatilmagan"}
Mavzu: ${topic}

Darsning asosiy yo‘nalishi:
Ushbu darsda o‘quvchilar «${topic}» mavzusining mazmuni,
asosiy tushunchalari, xususiyatlari va amaliy ahamiyatini o‘rganadilar.

Qo‘shimcha talablar:
${extra || "Qo‘shimcha talab berilmagan."}
`));

    output.push(makeSection(2, "Darsning maqsadlari", `
TA'LIMIY MAQSAD:
O‘quvchilarga ${subject} fanidagi «${topic}» mavzusining mazmunini
tushuntirish, asosiy tushunchalarni o‘zlashtirish va bilimlarni
amaliy vaziyatlarda qo‘llashga yordam berish.

TARBIYAVIY MAQSAD:
O‘quvchilarda mas'uliyat, intizom, hamkorlik, hurmat va mustaqil
fikrlash madaniyatini shakllantirish.

RIVOJLANTIRUVCHI MAQSAD:
Tahlil qilish, taqqoslash, muammolarni aniqlash, xulosa chiqarish
va ijodiy yondashish ko‘nikmalarini rivojlantirish.
`));

    output.push(makeSection(3, "Kutilayotgan natijalar", `
Dars yakunida o‘quvchi:
1. «${topic}» mavzusini o‘z so‘zlari bilan tushuntira oladi.
2. Mavzuga oid asosiy tushunchalarni izohlay oladi.
3. Mavzu yuzasidan misollar keltira oladi.
4. Nazariy bilimlarni amaliy topshiriqlarda qo‘llay oladi.
5. Savollarga mustaqil javob bera oladi.
6. Mavzu yuzasidan xulosa chiqara oladi.
`));

    output.push(makeSection(4, "Nazariy ma'lumotni o‘rganish", `
MAVZUGA KIRISH

«${topic}» mavzusi ${subject} fanining o‘rganilishi kerak bo‘lgan
yo‘nalishlaridan biridir. Uni o‘rganish jarayonida mavzuning mazmuni,
asosiy tushunchalari, tarkibiy qismlari va amaliy ahamiyatiga
e'tibor qaratish lozim.

O‘RGANISH TARTIBI

1. Mavzuning nomi va asosiy mazmunini aniqlang.
2. Mavzuga oid asosiy atamalarni ajrating.
3. Har bir tushunchaning ma'nosini o‘rganing.
4. Tushunchalar o‘rtasidagi bog‘lanishni aniqlang.
5. Mavzuga oid misollarni tahlil qiling.
6. O‘rgangan bilimlarni amaliy vaziyatda qo‘llang.
7. Yakuniy xulosa tayyorlang.

MUSTAQIL TAHLIL UCHUN

- Mavzuning asosiy g‘oyasi nima?
- Qaysi tushunchalar eng muhim?
- Mavzu boshqa qaysi bilim sohalari bilan bog‘liq?
- O‘rganilgan bilimlardan qayerda foydalanish mumkin?

MUHIM:
Bu bo‘lim mavzuni o‘rganish uchun metodik yo‘nalish beradi.
Mavzuga xos aniq ilmiy yoki tarixiy mazmunni ishonchli manbadan
olib shu yerga kiritish kerak.
`));

    output.push(makeSection(5, "Asosiy atamalar", `
Quyidagi atamalarni mavzuga moslab to‘ldiring:

${numbered([
        "Asosiy tushuncha — mavzuning markaziy mazmunini ifodalovchi atama.",
        "Ta'rif — tushunchaning ma'nosini ochib beruvchi izoh.",
        "Xususiyat — predmet yoki hodisaning muhim belgisi.",
        "Tahlil — ma'lumotni qismlarga ajratib o‘rganish.",
        "Taqqoslash — o‘xshash va farqli jihatlarni aniqlash.",
        "Dalil — fikrni asoslash uchun keltiriladigan ma'lumot.",
        "Misol — tushunchani yorituvchi namuna.",
        "Natija — faoliyat yoki jarayon yakunida yuzaga keladigan holat.",
        "Amaliyot — bilimni bajarish va qo‘llash jarayoni.",
        "Xulosa — o‘rganilgan ma'lumotlardan chiqarilgan yakuniy fikr."
    ])}
`));

    output.push(makeSection(6, "Namunaviy misollar bilan ishlash", `
1-MISOL: Mavzuga oid oddiy hayotiy vaziyat tanlang.
   Vazifa: Vaziyatni «${topic}» tushunchasi bilan bog‘lang.

2-MISOL: Mavzuga oid ikki tushunchani taqqoslang.
   Vazifa: Ularning o‘xshash va farqli jihatlarini yozing.

3-MISOL: Mavzuga oid bir muammoni tanlang.
   Vazifa: Muammoning sababi va mumkin bo‘lgan yechimini tushuntiring.

4-MISOL: Mavzu bo‘yicha jadval yarating.
   Vazifa: Tushunchalar, izohlar va misollarni joylashtiring.

5-MISOL: Mavzuga oid mustaqil loyiha ishlab chiqing.
   Vazifa: Maqsad, bajarish bosqichlari va natijani ko‘rsating.
`));

    output.push(makeSection(7, "Darsning borishi", makeLessonPlan()));

    output.push(makeSection(8, "Amaliy topshiriqlar", makeTasks(topic, subject)));

    output.push(makeSection(9, "20 ta test savoli", `
Quyidagi testlar avtomatik tuzilgan metodik savol namunalaridir.
Ular mavzuga oid aniq faktlarni tekshiruvchi tayyor imtihon testi emas.
O‘qituvchi fan mazmuniga mos javoblarni tekshirib, zarur bo‘lsa
savollarni tahrirlashi kerak.

${makeTests(topic)}

JAVOBLAR KALITI:
Bu namunaviy savollarda A varianti umumiy o‘rganish metodiga mos
javob sifatida keltirilgan. Ular mavzuga oid faktik testlarning
tasdiqlangan javob kaliti hisoblanmaydi.
`));

    output.push(makeSection(10, "10 ta ochiq savol", makeOpenQuestions(topic)));

    output.push(makeSection(11, "5 ta ta'limiy o‘yin", makeGames(topic)));

    output.push(makeSection(12, "O‘quvchi ish varaqasi", `
Mavzu: ${topic}
Fan: ${subject}

TOPSHIRIQLAR:
${makeWorksheet(topic)}

O‘Z-O‘ZINI TEKSHIRISH:
1. Savollarga to‘liq javob berdimmi?
2. Atamalarni to‘g‘ri izohladimmi?
3. Misollar keltirdimmi?
4. Xulosamni dalillar bilan asosladimmi?
5. Qaysi savol ustida yana ishlashim kerak?
`));

    output.push(makeSection(13, "Krossvord uchun materiallar", makeCrossword(topic)));

    output.push(makeSection(14, "10 slaydli taqdimot", makeSlides(topic, subject)));

    output.push(makeSection(15, "Rasm va diagramma g‘oyalari", makeImages(topic, subject)));

    output.push(makeSection(16, "Uyga vazifa", `
1. «${topic}» mavzusini darslik asosida o‘rganing.
2. Mavzuga oid 10 ta asosiy atamani daftarga yozing.
3. Mavzu bo‘yicha 5 ta savol va javob tayyorlang.
4. Mavzuni tushuntiruvchi sxema yoki jadval chizing.
5. Mavzu yuzasidan 1 betlik xulosa yozing.
6. Mavzuga oid qo‘shimcha manbadan foydalanib, yangi ma'lumot toping.
`));

    output.push(makeSection(17, "Baholash mezonlari", makeRubric()));

    output.push(makeSection(18, "Dars yakuni va o‘qituvchi qo‘llanmasi", `
DARS XULOSASI:
Bugungi darsda «${topic}» mavzusining asosiy mazmuni,
tushunchalari va amaliy ahamiyatini o‘rganish ko‘zda tutiladi.

REFLEKSIYA SAVOLLARI:
1. Bugun qanday yangi bilim oldingiz?
2. Siz uchun eng qiziqarli qism qaysi bo‘ldi?
3. Qaysi topshiriq qiyin bo‘ldi?
4. Qaysi savolga yana izoh kerak?
5. O‘rgangan bilimlaringizni qayerda qo‘llaysiz?

O‘QITUVCHIGA TAVSIYALAR:
${makeTeacherGuide(topic, extra)}

DARSNI YAKUNLASH:
O‘quvchilarning faoliyatini baholang, fikr-mulohazalarini tinglang
va keyingi dars uchun tayyorgarlik vazifasini tushuntiring.
`));

    output.push("\n" + makeLine());
    output.push("UNIVERSAL EDU AI — AKRAMJANOVA JADRA MARATOVNA");
    output.push(makeLine());

    return output.join("\n");
}

// ===============================================
// TIL TANLASH
// ===============================================

function updateLanguage() {
    const language = $("language").value;

    const hints = {
        uz: "Server talab qilinmaydi. Natija shu brauzerda yaratiladi.",
        ru: "Сервер не требуется. Результат создаётся в браузере.",
        en: "No server required. The result is generated in your browser."
    };

    $("hint").textContent = hints[language] || hints.uz;
}

$("language").addEventListener("change", updateLanguage);

// ===============================================
// STATUS
// ===============================================

function showStatus(message, type = "info") {
    const status = $("status");

    status.textContent = message;
    status.dataset.type = type;
    status.classList.add("show");
}

// ===============================================
// MATERIAL YARATISH
// ===============================================

function generateAll() {
    if (isGenerating) return;

    const subject = clean($("subject").value);
    const grade = clean($("grade").value);
    const topic = clean($("topic").value);
    const extra = clean($("extra").value);
    const language = $("language").value;

    if (!subject || !topic) {
        showStatus("Iltimos, fan nomi va dars mavzusini kiriting.", "error");

        if (!subject) {
            $("subject").focus();
        } else {
            $("topic").focus();
        }

        return;
    }

    isGenerating = true;

    const button = $("generateBtn");
    const buttonText = $("generateText");

    button.disabled = true;
    buttonText.textContent = "MATERIALLAR TAYYORLANMOQDA...";

    $("resultSection").classList.remove("hidden");
    $("output").textContent = "Dars materiallari shakllantirilmoqda...";

    showStatus("18 ta bo‘limdan iborat dars to‘plami yaratilmoqda.");

    // Brauzerga yangilanishni ko‘rsatish imkonini beramiz.
    setTimeout(() => {
        try {
            currentText = buildMaterial(
                subject,
                grade,
                topic,
                extra,
                language
            );

            $("output").textContent = currentText;

            $("resultTitle").textContent = topic;
            $("resultInfo").textContent =
                subject + (grade ? " | " + grade : "");

            showStatus(
                "Dars to‘plami tayyor! Materiallarni nusxalashingiz, saqlashingiz yoki PDF qilishingiz mumkin.",
                "success"
            );

            $("resultSection").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        } catch (error) {
            console.error("Yaratish xatosi:", error);

            $("output").textContent =
                "Xatolik yuz berdi: " + error.message;

            showStatus(
                "Material yaratishda xatolik yuz berdi.",
                "error"
            );

        } finally {
            isGenerating = false;
            button.disabled = false;
            buttonText.textContent = "BARCHA MATERIALLARNI YARATISH";
        }
    }, 100);
}

// ===============================================
// NUSXALASH
// ===============================================

async function copyResult() {
    if (!currentText) {
        showStatus("Avval material yarating.", "error");
        return;
    }

    try {
        await navigator.clipboard.writeText(currentText);
        showStatus("Barcha materiallar nusxalandi!", "success");

    } catch (error) {
        const area = document.createElement("textarea");

        area.value = currentText;
        document.body.appendChild(area);
        area.select();

        const copied = document.execCommand("copy");
        area.remove();

        showStatus(
            copied ? "Materiallar nusxalandi!" : "Nusxalash amalga oshmadi.",
            copied ? "success" : "error"
        );
    }
}

// ===============================================
// TXT YUKLAB OLISH
// ===============================================

function downloadResult() {
    if (!currentText) {
        showStatus("Avval material yarating.", "error");
        return;
    }

    const blob = new Blob(
        ["\uFEFF" + currentText],
        { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "UNIVERSAL_EDU_AI_DARS_MATERIALLARI.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    showStatus("TXT fayl yuklab olindi.", "success");
}

// ===============================================
// PDF / CHOP ETISH
// ===============================================

function printResult() {
    if (!currentText) {
        showStatus("Avval material yarating.", "error");
        return;
    }

    window.print();
}

// ===============================================
// TUGMALAR
// ===============================================

$("generateBtn").addEventListener("click", generateAll);
$("copyBtn").addEventListener("click", copyResult);
$("downloadBtn").addEventListener("click", downloadResult);
$("printBtn").addEventListener("click", printResult);

// Enter bosilganda mavzu maydonida yaratish
$("topic").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        generateAll();
    }
});

console.log("UNIVERSAL EDU AI ishga tushdi!");
