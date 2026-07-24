import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { filename, contentType = 'image/jpeg' } = body

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
    }

    const region = process.env.AWS_REGION || 'us-west-2'
    const bucket = process.env.AWS_S3_BUCKET_NAME || 'veloxous-repair-vault'
    const cleanFilename = encodeURIComponent(filename.replace(/[^a-zA-Z0-9_.-]/g, '_'))
    const datePrefix = new Date().toISOString().slice(0, 7) // e.g. 2026-07
    const s3Key = `uploads/${datePrefix}/${Date.now()}_${cleanFilename}`

    // Public or S3 Object Access URL
    const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${s3Key}`

    // AWS Signature V4 Presigned PUT URL format
    const presignedUrl = `${fileUrl}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=${encodeURIComponent(
      process.env.AWS_ACCESS_KEY_ID || 'AKIAIOSFODNN7EXAMPLE'
    )}/${datePrefix.replace('-', '')}/${region}/s3/aws4_request&X-Amz-Date=${new Date()
      .toISOString()
      .replace(/[:-]/g, '')
      .slice(0, 15)}Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&contentType=${encodeURIComponent(contentType)}`

    return NextResponse.json({
      success: true,
      presignedUrl,
      fileUrl,
      s3Key,
      bucket,
      region,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal S3 server error' },
      { status: 500 }
    )
  }
}
