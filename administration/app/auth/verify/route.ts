import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('redirect_to') ?? '/';

  if (token_hash && type) {

    const { data: { user }, error } = await supabase.auth.verifyOtp({
      type,
      token_hash
    });

    if (!error) {
      // redirect user to specified redirect URL or root of app
      return NextResponse.redirect(`${next}/auth/signup?id=${user?.id}&email=${user?.email}`);
    }
  }

  // redirect the user to an error page with some instructions
  return NextResponse.redirect('/error');
}