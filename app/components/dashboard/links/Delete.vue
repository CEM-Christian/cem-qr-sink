<script setup>
import { toast } from 'vue-sonner'

const props = defineProps({
  link: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:link'])

const { t } = useI18n()

async function deleteLink() {
  await useAPI('/api/link/delete', {
    method: 'POST',
    body: {
      slug: props.link.slug,
    },
  })
  emit('update:link', props.link, 'delete')
  toast(t('links.messages.delete_success'))
}
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <slot />
    </AlertDialogTrigger>
    <AlertDialogContent class="max-w-[95svw] max-h-[95svh] md:max-w-lg grid-rows-[auto_minmax(0,1fr)_auto]">
      <AlertDialogHeader>
        <AlertDialogTitle>{{ $t('links.messages.delete_confirm_title') }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ $t('links.messages.delete_confirm_desc') }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{{ $t('common.cancel') }}</AlertDialogCancel>
        <AlertDialogAction @click="deleteLink">
          {{ $t('common.continue') }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
