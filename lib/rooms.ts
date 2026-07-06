export interface Room {
  id: number
  // Xona surati: devor qismi shaffof qilib kesilgan PNG (public/rooms/ papkasida)
  image: string
  nom: { uz: string; ru: string; en: string }
}

// Yangi xona qo'shish uchun: public/rooms/ papkasiga cutout PNG tashlang va
// shu ro'yxatga bitta qator qo'shing — boshqa hech narsani o'zgartirish shart emas.
export const ROOMS: Room[] = [
  { id: 1, image: '/rooms/room1.png', nom: { uz: 'Mehmonxona 1', ru: 'Гостиная 1', en: 'Living Room 1' } },
  { id: 2, image: '/rooms/living-cutout.png', nom: { uz: 'Mehmonxona 2', ru: 'Гостиная 2', en: 'Living Room 2' } },
  { id: 3, image: '/rooms/bedroom-cutout.png', nom: { uz: 'Yotoqxona', ru: 'Спальня', en: 'Bedroom' } },
  { id: 4, image: '/rooms/kids-cutout.png', nom: { uz: 'Bolalar xonasi', ru: 'Детская', en: "Kid's Room" } },
  { id: 5, image: '/rooms/dining-cutout.png', nom: { uz: 'Oshxona', ru: 'Кухня', en: 'Kitchen' } },
]
