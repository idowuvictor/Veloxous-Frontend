import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'

// A real app would use a session management library like NextAuth.js or Clerk.
// This is a placeholder for checking if the user is authenticated.
async function getAuthenticatedUser() {
  // In a real app, you'd get this from the request headers/cookies.
  // e.g., const session = await getServerSession(authOptions)
  // For this example, we'll assume a user is logged in.
  const user = { id: 'user-123', authenticated: true }
  if (!user || !user.authenticated) {
    return null
  }
  return user
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE_MB = 5
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { filename, contentType, fileSize } = await request.json()

    if (!filename || !contentType || !fileSize) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!ALLOWED_FILE_TYPES.includes(contentType)) {
      return NextResponse.json({ error: `Invalid file type. Only ${ALLOWED_FILE_TYPES.join(', ')} are allowed.` }, { status: 400 })
    }

    if (fileSize > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: `File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.` }, { status: 400 })
    }

    const uniqueKey = `${user.id}/${randomUUID()}-${filename}`

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: uniqueKey,
      ContentType: contentType,
      ContentLength: fileSize,
      Metadata: {
        userId: user.id,
      },
    })

    // The presigned URL will be valid for 10 minutes.
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 })

    // The final URL of the object after it's uploaded.
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`

    return NextResponse.json({
      presignedUrl,
      fileUrl,
      s3Key: uniqueKey,
    })
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return NextResponse.json(
      {
        error: 'An internal server error occurred. Please try again.',
      },
      { status: 500 }
    )
  }
}
