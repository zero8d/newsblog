export function generateRandomCode(exclusions: Array<string> = []): string {
  let randomNumber: string;
  do {
    randomNumber = String(Math.floor(Math.random() * 900000) + 100000); // Generate a 6-digit number
  } while (!passesExclusions(randomNumber, exclusions)); // Check if the number passes exclusions
  return randomNumber;
}

function passesExclusions(number: string, exclusions: Array<string>) {
  return !exclusions.some((exclusion) => String(number).includes(exclusion));
}
