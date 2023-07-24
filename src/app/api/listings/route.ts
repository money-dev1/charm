import { NextResponse } from 'next/server'

import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/getCurrentUser'

export async function POST(request: Request) {
  const currentUser = await getCurrentUser()
  console.log('currentUser', currentUser)
  if (!currentUser) {
    return NextResponse.error()
  }

  const body = await request.json()
  const { title, description, imageSrc, category, tag } = body

  console.log(`userId ${currentUser.id}`)

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      userId: currentUser.id,
      category,
      tag,
    },
  })

  return NextResponse.json(listing)
}
