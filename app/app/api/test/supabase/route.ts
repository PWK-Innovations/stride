import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('api:test:supabase');

export async function GET() {
  try {
    const supabase = await createClient();

    // Test connection by querying the tasks table
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      data,
    });
  } catch (error: unknown) {
    logger.error('Supabase test failed', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
