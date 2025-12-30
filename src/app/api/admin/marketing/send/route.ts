import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongodb'
import User from '@/models/User'
import EmailTemplate from '@/models/EmailTemplate'
import { sendBulkEmails } from '@/lib/email'
import { MarketingSendSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Zod Validation
    const validation = MarketingSendSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 })
    }

    const { userIds, subject, body: customBody, templateId } = validation.data

    await dbConnect()

    let finalSubject = subject
    let finalBody = customBody

    if (templateId && templateId !== 'custom') {
      const template = await EmailTemplate.findById(templateId)
      if (template) {
        finalSubject = template.subject
        finalBody = template.body
      }
    }

    if (!finalSubject || !finalBody) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    // Fetch users to get their names and emails
    const recipients = await User.find({ _id: { $in: userIds } })
    
    // Fetch company settings for companyName
    const Settings = (await import('@/models/Settings')).default
    const settings = await Settings.findOne()
    const companyName = settings?.companyName || 'Sara Jewelers'

    const emailTasks = recipients.map(user => {
      let personalizedSubject = finalSubject
      let personalizedBody = finalBody
      
      // Replace user-specific placeholders
      const replacers: Record<string, string> = {
        '{{name}}': user.name || 'Valued Customer',
        '{{companyName}}': companyName,
        // Add any other user-specific data here
      }
      
      // Apply all replacements
      Object.entries(replacers).forEach(([placeholder, value]) => {
        personalizedSubject = personalizedSubject.replace(new RegExp(placeholder, 'g'), value)
        personalizedBody = personalizedBody.replace(new RegExp(placeholder, 'g'), value)
      })
      
      return {
        to: user.email,
        subject: personalizedSubject,
        body: personalizedBody
      }
    })

    console.log(`[Marketing] Sending ${emailTasks.length} emails to persistent database queue...`)
    
    // We don't await the whole process here to avoid timeouts
    sendBulkEmails(emailTasks, 3000).catch(err => {
      console.error('[Marketing Queue Error]:', err)
    })

    return NextResponse.json({ 
      success: true, 
      message: `Bulk sending initiated for ${recipients.length} users with a 3s delay between messages.`,
      recipientCount: recipients.length 
    })
  } catch (error) {
    console.error('Marketing Send Error:', error)
    return NextResponse.json({ error: 'Failed to initiate bulk email' }, { status: 500 })
  }
}
