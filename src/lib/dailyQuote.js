const quotes = [
  'Make room for a little wonder today.',
  'A small beginning is still a beginning.',
  'Your own pace can take you somewhere beautiful.',
  'Let curiosity be your compass today.',
  'Quiet moments can hold bright possibilities.',
  'Give good things the time they need to grow.',
  'You can start again, gently, whenever you need.',
]

const today = new Date()
const dayNumber = Math.floor(Date.UTC(
  today.getUTCFullYear(),
  today.getUTCMonth(),
  today.getUTCDate(),
) / 86_400_000)

export const quoteOfTheDay = quotes[dayNumber % quotes.length]
