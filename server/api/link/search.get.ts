interface Link {
  slug: string
  url: string
  name?: string
  comment?: string
  organization?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_id?: string
}

export default eventHandler(async (event) => {
  const { cloudflare } = event.context
  const { KV } = cloudflare.env
  const list: Link[] = []
  let finalCursor: string | undefined

  try {
    while (true) {
      const { keys, list_complete, cursor } = await KV.list({
        prefix: `link:`,
        limit: 1000,
        cursor: finalCursor,
      })

      finalCursor = cursor

      if (Array.isArray(keys)) {
        for (const key of keys) {
          try {
            if (key.metadata?.url) {
              list.push({
                slug: key.name.replace('link:', ''),
                url: key.metadata.url,
                name: key.metadata.name,
                comment: key.metadata.comment,
                organization: key.metadata.organization,
                utm_source: key.metadata.utm_source,
                utm_medium: key.metadata.utm_medium,
                utm_campaign: key.metadata.utm_campaign,
                utm_id: key.metadata.utm_id,
              })
            }
            else {
              // Forward compatible with links without metadata
              const { metadata, value: link } = await KV.getWithMetadata(key.name, { type: 'json' })
              if (link) {
                list.push({
                  slug: key.name.replace('link:', ''),
                  url: link.url,
                  name: link.name,
                  comment: link.comment,
                  organization: link.organization,
                  utm_source: link.utm_source,
                  utm_medium: link.utm_medium,
                  utm_campaign: link.utm_campaign,
                  utm_id: link.utm_id,
                })
                await KV.put(key.name, JSON.stringify(link), {
                  expiration: metadata?.expiration,
                  metadata: {
                    ...metadata,
                    url: link.url,
                    name: link.name,
                    comment: link.comment,
                    organization: link.organization,
                    utm_source: link.utm_source,
                    utm_medium: link.utm_medium,
                    utm_campaign: link.utm_campaign,
                    utm_id: link.utm_id,
                  },
                })
              }
            }
          }
          catch (err) {
            console.error(`Error processing key ${key.name}:`, err)
            continue // Skip this key and continue with the next one
          }
        }
      }

      if (!keys || list_complete) {
        break
      }
    }
    return list
  }
  catch (err) {
    console.error('Error fetching link list:', err)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch link list',
    })
  }
})
