export interface GiftData {
  senderName: string;
  receiverName: string;
  envelopeImage: string;
  cardMessage: string;
  birthdayImage: string;
  birthdayTitle: string;
  birthdayText: string;
  balloonImage: string;
  birthdayWishesTitle: string;
  birthdayWishesMessage: string;
  thingsWeWannaDo: string[];
  loveLetterTitle?: string;
  loveLetterSubtitle?: string;
  loveLetterParagraphs?: string[];
  musicCoverImage: string;
  musicUrl: string;
  songTitle: string;
}

const defaultThings: string[] = [
  "Get engaged & build a beautiful life together 💍",
  "Sit on the beach in winter and hug each other tightly 🌊",
  "Travel together to all our dream destinations ✈️",
  "Walk in the rain holding hands and never let go 🌧️",
  "Grow old together, loving you more every single day 🤍",
];

export const defaultLoveLetterParagraphs: string[] = [
  "To my Ahmed, loving you is the easiest and most beautiful thing I've ever done.",
  "You are my safe place, my warmth, and the only person I can be truly myself with.",
  "I love the man you are—your gentle heart, your reassuring voice, and your sweet smile.",
  "I choose you through the easy days and the hard ones, today and for all our years ahead.",
  "Happy 20th birthday to my forever favorite person, my heart, and my future.",
  "Always and forever, your favorite lady. 🤍",
];

const ahmedGift: GiftData = {
  senderName: "layla",
  receiverName: "Ahmed",
  envelopeImage: "/images/envelope-placeholder.png",
  cardMessage: "Check out these awesome surprises made just for you, Ahmed! ✨",
  birthdayImage: "/images/kid-placeholder.jpg",
  birthdayTitle: "To my favorite person,",
  birthdayText:
    "Our first movie together... I fell so deeply in love with the most handsome and precious man in my life. 🤍",
  balloonImage: "/images/cat.png",
  birthdayWishesTitle: "Happy 20th Birthday, Ahmed! 🎂✨",
  birthdayWishesMessage:
    "Happy 20th birthday to my favorite person and best future Dr! You make my whole world brighter with your laughter, warmth, and handsome smile. I’m so lucky to have you, and I can't wait to be by your side forever. Wishing you endless happiness, peace, and love. Happy birthday, Ahmed! 🤍✨",
  thingsWeWannaDo: defaultThings,
  loveLetterTitle: "The little things I love about you",
  loveLetterSubtitle: "To My Ahmed, With All My Love <3",
  loveLetterParagraphs: defaultLoveLetterParagraphs,
  musicCoverImage: "/images/song-cover.jpg",
  musicUrl: "/music/our-song.mp3",
  songTitle: "Our Special Track",
};

const giftData: Record<string, GiftData> = {
  ahmed: ahmedGift,
  amir: ahmedGift,
  aya: {
    ...ahmedGift,
    senderName: "Aya",
    cardMessage: "Check out these awesome surprises for YOU!",
  },
};

export default giftData;