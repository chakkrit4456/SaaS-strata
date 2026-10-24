// Reset (or create) the platform Super Admin account's password.
//
//   pnpm admin:reset-password                       # prompts for the new password (hidden)
//   pnpm admin:reset-password --generate            # generates a strong password and prints it once
//   echo 'new-pass' | pnpm admin:reset-password --password-stdin
//   pnpm admin:reset-password --email other@example.com
//
// On a server use deploy/reset-superadmin-password.sh, which loads the production env.
// The password is never logged. Existing login cookies stay valid until they expire (stateless JWT).
import { randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline';
import { eq } from 'drizzle-orm';
import { client, db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth/session';

const DEFAULT_EMAIL = 'chakkritnb4456@gmail.com';
const SUPER_ADMIN_ROLE = 'super_admin';
const MIN_LENGTH = 12;

function argValue(name: string) {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : undefined;
}

function promptHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const rlAny = rl as unknown as { _writeToOutput: (s: string) => void; output: NodeJS.WriteStream };
    let muted = false;
    rlAny._writeToOutput = (s: string) => {
      if (!muted || s.includes(question)) rlAny.output.write(s);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
    muted = true;
  });
}

async function readStdin(): Promise<string> {
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  return data.replace(/\r?\n$/, '');
}

async function getNewPassword(): Promise<{ password: string; generated: boolean }> {
  if (process.argv.includes('--generate')) {
    return { password: randomBytes(18).toString('base64url'), generated: true };
  }
  if (process.argv.includes('--password-stdin')) {
    return { password: await readStdin(), generated: false };
  }
  if (!process.stdin.isTTY) {
    throw new Error('No terminal: use --generate or --password-stdin.');
  }
  const first = await promptHidden(`New password (min ${MIN_LENGTH} chars): `);
  const second = await promptHidden('Repeat new password: ');
  if (first !== second) throw new Error('Passwords do not match.');
  return { password: first, generated: false };
}

async function main() {
  const email = (argValue('--email') ?? DEFAULT_EMAIL).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error(`Invalid email: ${email}`);

  const { password, generated } = await getNewPassword();
  if (password.length < MIN_LENGTH) throw new Error(`Password must be at least ${MIN_LENGTH} characters.`);
  if (password.length > 72) throw new Error('Password must be at most 72 characters (bcrypt limit).');

  const passwordHash = await hashPassword(password);
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);

  if (existing) {
    await db
      .update(users)
      .set({ passwordHash, role: SUPER_ADMIN_ROLE, deletedAt: null, updatedAt: new Date() })
      .where(eq(users.id, existing.id));
    console.log(`Password reset for Super Admin ${email} (user id ${existing.id}).`);
  } else {
    const [created] = await db
      .insert(users)
      .values({ email, name: 'Super Admin', passwordHash, role: SUPER_ADMIN_ROLE })
      .returning({ id: users.id });
    console.log(`Super Admin ${email} created (user id ${created.id}).`);
  }

  if (generated) {
    console.log('\nGenerated password (shown once, store it in a password manager):');
    console.log(password);
  }
}

main()
  .then(() => client.end())
  .then(() => process.exit(0))
  .catch(async (error: Error) => {
    console.error(`Error: ${error.message}`);
    await client.end({ timeout: 1 }).catch(() => {});
    process.exit(1);
  });
