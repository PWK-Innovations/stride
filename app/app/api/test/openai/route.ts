import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai/client';

export async function GET() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: 'Say "test successful"',
        },
      ],
      max_tokens: 10,
    });

    const message = response.choices[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      message: 'OpenAI connection successful',
      response: message,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || String(error) },
      { status: 500 }
    );
  }
}
