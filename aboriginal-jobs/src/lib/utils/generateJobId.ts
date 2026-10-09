import { Job } from "@/lib/models/Job";

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
  let isUnique = false;
  let jobId = "";

  while (!isUnique) {
    const letters = generateRandomLetters(3); // 3 alphabets
    const numbers = generateRandomNumbers(5); // 5 numbers
    jobId = `${letters}-${numbers}`; // Format: ABC-12345

    // Check if already exists
    const existingJob = await Job.findOne({ jobId });
    if (!existingJob) {
      isUnique = true;
    }
  }

  return jobId;
}
