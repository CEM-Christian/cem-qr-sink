import { customAlphabet } from 'nanoid'
import { z } from 'zod'
import { OrganizationSchema } from './organization'
import { QRStyleOptionsSchema } from './qr-style'

const { slugRegex } = useAppConfig()

const slugDefaultLength = +useRuntimeConfig().public.slugDefaultLength

export const nanoid = (length: number = slugDefaultLength) => customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', length)

export const LinkSchema = z.object({
  id: z.string().trim().max(26).default(nanoid(10)),
  url: z.string().trim().url().max(2048),
  slug: z.string().trim().max(2048).regex(new RegExp(slugRegex)).default(nanoid()),
  name: z.string().trim().max(100).optional(),
  comment: z.string().trim().max(2048).optional(),
  createdAt: z.number().int().safe().default(() => Math.floor(Date.now() / 1000)),
  updatedAt: z.number().int().safe().default(() => Math.floor(Date.now() / 1000)),
  expiration: z.number().int().safe().refine(expiration => expiration > Math.floor(Date.now() / 1000), {
    message: 'expiration must be greater than current time',
    path: ['expiration'], // 这里指定错误消息关联到哪个字段
  }).optional(),
  title: z.string().trim().max(2048).optional(),
  description: z.string().trim().max(2048).optional(),
  image: z.string().trim().url().max(2048).optional(),
  utm_source: z.enum([
    'qr-code',
    'pdf',
    'google',
    'bing',
    'email',
    'website',
    'facebook',
    'instagram',
  ]).default('qr-code').optional(),
  utm_medium: z.enum([
    'flyer',
    'poster',
    'banner',
    'e-guide',
    'social',
    'email',
    'website',
  ]).optional(),
  utm_campaign: z.string().trim().max(255).optional(),
  utm_id: z.string().trim().max(255).optional(),
  organization: OrganizationSchema,
  qr_style_options: QRStyleOptionsSchema,
})

export type Link = z.infer<typeof LinkSchema>
