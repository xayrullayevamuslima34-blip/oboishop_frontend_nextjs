# OboiShop - Next.js loyihasi

## Ishga tushirish

### 1. Node.js o'rnating
https://nodejs.org dan Node.js 18+ yuklab oling

### 2. Loyihani oching
```bash
cd oboishop
npm install
npm run dev
```

### 3. Brauzerda oching
http://localhost:3000

---

## Sahifalar

| Sahifa | URL |
|--------|-----|
| Bosh sahifa | `/` |
| Katalog | `/katalog` |
| Uyda sinab ko'ring | `/virtual` |
| Sevimlilar | `/sevimlilar` |
| Kontaktlar | `/kontaktlar` |

---

## O'zgartirish kerak bo'lgan joylar

### 1. Oboi ma'lumotlari
`lib/data.ts` faylida oboilar ro'yxati bor. Har bir oboi uchun:
- `name` — nomi
- `asos` — matosi (Vintil, Flizelin va h.k.)
- `olcham` — o'lchami
- `fabrika` — fabrika nomi
- `colors` — 2 ta rang (CSS rang kodi)

### 2. Telegram bot
Hamma joylarda `https://t.me/oboishop_bot` o'rniga o'z bot manzilingizni yozing.

### 3. Kontaktlar
`app/kontaktlar/page.tsx` da telefon, manzil, ish vaqtini o'zgartiring.

### 4. Xarita
`app/kontaktlar/page.tsx` da Google Maps embed linkini aniq manzilingiz bilan almashtiring.

### 5. Oboi rasmlari
Hozir placeholder ranglar bor. Real rasmlar qo'shish uchun:
- Rasmlarni `public/oboilar/` papkasiga joylashtiring
- `OboyCard.tsx` da `<img>` tag qo'shing

---

## Hosting (Vercel)

1. https://vercel.com ga kiring
2. GitHub ga yuklang va Vercel bilan bog'lang
3. Avtomatik deploy bo'ladi

Yoki:
```bash
npm run build
```
# oboishop_frontend_nextjs
