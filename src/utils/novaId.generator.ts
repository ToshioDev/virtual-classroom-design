const NAME_TRANSFORMATIONS = {
  // Vowel replacements
  'a': ['4', '@', 'α'],
  'e': ['3', '€'],
  'i': ['1', '!', 'ı'],
  'o': ['0', 'ø'],
  'u': ['µ', 'ü']
};

const GAME_TITLES = [
  'Lord', 'Master', 'Captain', 'General', 'Emperor', 'Knight', 
  'Sage', 'Warrior', 'Champion', 'Titan', 'Guardian', 'Overlord'
];

const GAME_ATTRIBUTES = [
  'Fierce', 'Silent', 'Shadow', 'Mystic', 'Cosmic', 'Dark', 
  'Cyber', 'Phantom', 'Eternal', 'Rogue', 'Rebel', 'Legendary'
];

export function generateNovaId(params: {
  nombre?: string;
  email?: string;
}): string {
  const { nombre, email } = params;

  // If no name provided, use email or generate a random username
  if (!nombre && !email) {
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `user_${randomPart}`;
  }

  // Extract name parts
  const nameParts = nombre 
    ? nombre.toLowerCase().split(' ')
    : (email ? email.split('@')[0].toLowerCase().split('.') : []);

  // Ensure we have at least two parts (first and last name or email parts)
  const firstName = nameParts[0] || 'user';
  const lastName = nameParts[1] || '';

  // Create different username formats
  const formats = [
    `${firstName}${lastName}`.replace(/[^a-z0-9]/g, ''),
    `${firstName}.${lastName}`.replace(/[^a-z0-9.]/g, ''),
    `${firstName}_${lastName}`.replace(/[^a-z0-9_]/g, ''),
    `${firstName}${lastName.charAt(0)}`.replace(/[^a-z0-9]/g, '')
  ];

  // Choose a format
  const username = formats[Math.floor(Math.random() * formats.length)];

  // Add random numbers
  const randomNumbers = Math.floor(10 + Math.random() * 90);

  // Combine and truncate if too long
  const finalUsername = `${username}.${randomNumbers}`.slice(0, 30);

  return finalUsername;
}
