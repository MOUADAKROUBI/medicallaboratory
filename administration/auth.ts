import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { createClient } from './utils/supabase/server';
import { Database } from './utils/supabase/types';
 

async function getUser(email: string): Promise<(Database['public']['Tables']['utilisateur']['Row'] & {password: string}) | undefined> {
  const supabase = await createClient();
  try {
    const { data, error: userError } = await supabase.from('utilisateur').select('*').eq('email', email);
    if (userError) {
      console.error('Supabase error:', userError.message);
      throw new Error('Failed to fetch user.');
    }
    if (data.length === 0) {
      console.log('No user found with email:', email);
      return undefined;
    }

    const { data: admin, error: error1 } = await supabase.from('administration')
    .select('password')
    .eq('utilisateur_id', data[0].id)
    .single();

    if (error1) {
      console.error('Supabase error:', error1.message);
      throw new Error('Failed to fetch user.');
    }

    if(admin.password) {
      return {
        ...data[0],
        password: admin.password
      };
    } else {
      const { data: securite, error: error2 } = await supabase.from('securite')
      .select('password')
      .eq('utilisateur_id', data[0].id)
      .single();

      if (error2) {
        console.error('Supabase error:', error2.message);
        throw new Error('Failed to fetch user.');
      }

      if(securite.password) {
        return {
          ...data[0],
          password: securite.password
        };

      }
      return undefined;
    }
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    async authorize(credentials) {
      const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string().min(6) })
        .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
 
          if (password == user.password) return user;
        }

        console.log('Invalid credentials');
        return null;
    },
  })],
});