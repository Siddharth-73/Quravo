export class LoginDto {
  email!: string;
  password!: string;
  clinicSlug?: string;
  turnstileToken?: string;
}
