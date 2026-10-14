function generateRandomLetters(count: number): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < count; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
}

function generateRandomNumbers(count: number): string {
  let result = "";
  for (let i = 0; i < count; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

export async function generateJobId(): Promise<string> {
  const letters = generateRandomLetters(3);
  const numbers = generateRandomNumbers(5);
  return `${letters}-${numbers}`;
}
