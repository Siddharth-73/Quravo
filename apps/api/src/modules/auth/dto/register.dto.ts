export class RegisterDto {
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  clinicName!: string;
  clinicSlug!: string;
  turnstileToken?: string;
}
