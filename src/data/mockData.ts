export interface Message {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  text: string;
  time: string;
  type: "text" | "image" | "poll";
  pollId?: string;
  reactions?: { emoji: string; count: number }[];
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: "admin" | "moderator" | "member";
  status: "online" | "offline" | "away";
  joinedAt: string;
  banned?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  description: string;
  avatar: string;
  gradient: string;
  membersCount: number;
  lastMessage: string;
  lastTime: string;
  unread: number;
  members: Member[];
  messages: Message[];
  pinned?: boolean;
}

export interface Poll {
  id: string;
  chatId: string;
  question: string;
  options: { id: string; text: string; votes: number; voters: string[] }[];
  createdBy: string;
  createdAt: string;
  endsAt?: string;
  anonymous: boolean;
  multipleChoice: boolean;
  totalVotes: number;
  userVoted?: string[];
}

export interface MediaItem {
  id: string;
  chatId: string;
  chatName: string;
  url: string;
  type: "image" | "video";
  uploadedBy: string;
  uploadedAt: string;
  likes: number;
}

export const currentUser: Member = {
  id: "u1",
  name: "Алексей М.",
  avatar: "А",
  role: "admin",
  status: "online",
  joinedAt: "2024-01-01",
};

export const chats: Chat[] = [
  {
    id: "c1",
    name: "🚀 Команда разработки",
    description: "Обсуждаем проекты и задачи",
    avatar: "КР",
    gradient: "from-purple-500 to-cyan-400",
    membersCount: 12,
    lastMessage: "Новый деплой прошёл успешно!",
    lastTime: "14:32",
    unread: 5,
    pinned: true,
    members: [
      { id: "u1", name: "Алексей М.", avatar: "А", role: "admin", status: "online", joinedAt: "2024-01-01" },
      { id: "u2", name: "Мария К.", avatar: "М", role: "moderator", status: "online", joinedAt: "2024-01-15" },
      { id: "u3", name: "Дмитрий В.", avatar: "Д", role: "member", status: "away", joinedAt: "2024-02-01" },
      { id: "u4", name: "Анна С.", avatar: "А", role: "member", status: "offline", joinedAt: "2024-02-10" },
      { id: "u5", name: "Игорь Р.", avatar: "И", role: "member", status: "online", joinedAt: "2024-03-01" },
    ],
    messages: [
      { id: "m1", userId: "u2", userName: "Мария К.", avatar: "М", text: "Всем доброе утро! 👋", time: "09:00", type: "text", reactions: [{ emoji: "👋", count: 3 }] },
      { id: "m2", userId: "u3", userName: "Дмитрий В.", avatar: "Д", text: "Провёл ревью PR #42, всё отлично", time: "10:15", type: "text" },
      { id: "m3", userId: "u1", userName: "Алексей М.", avatar: "А", text: "Новый деплой прошёл успешно! 🎉", time: "14:32", type: "text", reactions: [{ emoji: "🎉", count: 5 }, { emoji: "🚀", count: 2 }] },
    ],
  },
  {
    id: "c2",
    name: "🎨 Дизайн & UI",
    description: "Обсуждение визуального стиля",
    avatar: "ДУ",
    gradient: "from-pink-500 to-orange-400",
    membersCount: 8,
    lastMessage: "Посмотрите новые макеты",
    lastTime: "13:10",
    unread: 2,
    members: [
      { id: "u1", name: "Алексей М.", avatar: "А", role: "admin", status: "online", joinedAt: "2024-01-01" },
      { id: "u6", name: "Светлана П.", avatar: "С", role: "moderator", status: "online", joinedAt: "2024-01-20" },
      { id: "u7", name: "Николай Ж.", avatar: "Н", role: "member", status: "online", joinedAt: "2024-02-15" },
    ],
    messages: [
      { id: "m4", userId: "u6", userName: "Светлана П.", avatar: "С", text: "Посмотрите новые макеты — добавила на доску", time: "13:10", type: "text" },
      { id: "m5", userId: "u7", userName: "Николай Ж.", avatar: "Н", text: "Очень круто! Нравится цветовая схема 🔥", time: "13:25", type: "text", reactions: [{ emoji: "🔥", count: 4 }] },
    ],
  },
  {
    id: "c3",
    name: "📊 Маркетинг",
    description: "Стратегия и продвижение",
    avatar: "МК",
    gradient: "from-green-400 to-cyan-500",
    membersCount: 15,
    lastMessage: "Отчёт за неделю готов",
    lastTime: "Вчера",
    unread: 0,
    members: [
      { id: "u1", name: "Алексей М.", avatar: "А", role: "admin", status: "online", joinedAt: "2024-01-01" },
      { id: "u8", name: "Елена Т.", avatar: "Е", role: "moderator", status: "away", joinedAt: "2024-01-10" },
      { id: "u9", name: "Павел Д.", avatar: "П", role: "member", status: "offline", joinedAt: "2024-03-05" },
      { id: "u10", name: "Ольга Н.", avatar: "О", role: "member", status: "online", joinedAt: "2024-03-10" },
    ],
    messages: [
      { id: "m6", userId: "u8", userName: "Елена Т.", avatar: "Е", text: "Отчёт за неделю готов, смотрите в папке", time: "Вчера", type: "text" },
    ],
  },
  {
    id: "c4",
    name: "🎮 Геймеры",
    description: "Игры, стримы и новости",
    avatar: "ГМ",
    gradient: "from-violet-500 to-purple-700",
    membersCount: 42,
    lastMessage: "Сегодня вечером рейд в 20:00",
    lastTime: "11:45",
    unread: 18,
    members: [
      { id: "u1", name: "Алексей М.", avatar: "А", role: "member", status: "online", joinedAt: "2024-01-01" },
      { id: "u11", name: "Кирилл С.", avatar: "К", role: "admin", status: "online", joinedAt: "2023-12-01" },
      { id: "u12", name: "Вася П.", avatar: "В", role: "moderator", status: "online", joinedAt: "2024-01-25" },
      { id: "u13", name: "Тролль123", avatar: "Т", role: "member", status: "offline", joinedAt: "2024-03-20", banned: true },
    ],
    messages: [
      { id: "m7", userId: "u11", userName: "Кирилл С.", avatar: "К", text: "Сегодня вечером рейд в 20:00 🎮", time: "11:45", type: "text", reactions: [{ emoji: "🎮", count: 8 }, { emoji: "✅", count: 12 }] },
    ],
  },
];

export const polls: Poll[] = [
  {
    id: "p1",
    chatId: "c1",
    question: "Когда проведём следующий спринт-ревью?",
    options: [
      { id: "o1", text: "Пятница 15:00", votes: 7, voters: ["u2", "u3", "u4", "u5", "u6", "u7", "u8"] },
      { id: "o2", text: "Четверг 16:00", votes: 3, voters: ["u9", "u10", "u11"] },
      { id: "o3", text: "Понедельник утром", votes: 2, voters: ["u12", "u13"] },
    ],
    createdBy: "Алексей М.",
    createdAt: "2024-03-20",
    endsAt: "2024-03-27",
    anonymous: false,
    multipleChoice: false,
    totalVotes: 12,
    userVoted: ["o1"],
  },
  {
    id: "p2",
    chatId: "c2",
    question: "Какую цветовую схему выбрать для нового проекта?",
    options: [
      { id: "o4", text: "Тёмная тема с градиентами", votes: 15, voters: [] },
      { id: "o5", text: "Светлая минималистичная", votes: 6, voters: [] },
      { id: "o6", text: "Системная (авто)", votes: 4, voters: [] },
    ],
    createdBy: "Светлана П.",
    createdAt: "2024-03-22",
    anonymous: true,
    multipleChoice: false,
    totalVotes: 25,
  },
  {
    id: "p3",
    chatId: "c3",
    question: "Какие каналы продвижения приоритетные в Q2?",
    options: [
      { id: "o7", text: "Instagram & Reels", votes: 10, voters: [] },
      { id: "o8", text: "Telegram канал", votes: 14, voters: [] },
      { id: "o9", text: "SEO и контент", votes: 8, voters: [] },
      { id: "o10", text: "Таргетированная реклама", votes: 6, voters: [] },
    ],
    createdBy: "Елена Т.",
    createdAt: "2024-03-21",
    anonymous: false,
    multipleChoice: true,
    totalVotes: 38,
    userVoted: ["o8", "o9"],
  },
  {
    id: "p4",
    chatId: "c4",
    question: "Во что будем играть в эти выходные?",
    options: [
      { id: "o11", text: "Valorant", votes: 18, voters: [] },
      { id: "o12", text: "CS2", votes: 22, voters: [] },
      { id: "o13", text: "Dota 2", votes: 9, voters: [] },
    ],
    createdBy: "Кирилл С.",
    createdAt: "2024-03-24",
    anonymous: false,
    multipleChoice: false,
    totalVotes: 49,
  },
];

export const mediaItems: MediaItem[] = [
  { id: "mi1", chatId: "c1", chatName: "Команда разработки", url: "https://picsum.photos/seed/dev1/400/300", type: "image", uploadedBy: "Мария К.", uploadedAt: "2024-03-20", likes: 5 },
  { id: "mi2", chatId: "c2", chatName: "Дизайн & UI", url: "https://picsum.photos/seed/design1/400/300", type: "image", uploadedBy: "Светлана П.", uploadedAt: "2024-03-21", likes: 12 },
  { id: "mi3", chatId: "c2", chatName: "Дизайн & UI", url: "https://picsum.photos/seed/design2/400/300", type: "image", uploadedBy: "Николай Ж.", uploadedAt: "2024-03-22", likes: 8 },
  { id: "mi4", chatId: "c3", chatName: "Маркетинг", url: "https://picsum.photos/seed/market1/400/300", type: "image", uploadedBy: "Елена Т.", uploadedAt: "2024-03-19", likes: 3 },
  { id: "mi5", chatId: "c4", chatName: "Геймеры", url: "https://picsum.photos/seed/game1/400/300", type: "image", uploadedBy: "Кирилл С.", uploadedAt: "2024-03-23", likes: 21 },
  { id: "mi6", chatId: "c4", chatName: "Геймеры", url: "https://picsum.photos/seed/game2/400/300", type: "image", uploadedBy: "Вася П.", uploadedAt: "2024-03-24", likes: 15 },
  { id: "mi7", chatId: "c1", chatName: "Команда разработки", url: "https://picsum.photos/seed/dev2/400/300", type: "image", uploadedBy: "Дмитрий В.", uploadedAt: "2024-03-18", likes: 7 },
  { id: "mi8", chatId: "c2", chatName: "Дизайн & UI", url: "https://picsum.photos/seed/design3/400/300", type: "image", uploadedBy: "Светлана П.", uploadedAt: "2024-03-20", likes: 9 },
];