<script setup>
const slug = useRoute().query.slug

const link = ref({})
const id = computed(() => link.value.id)

provide('id', id)

async function getLink() {
  const data = await useAPI('/api/link/query', {
    query: {
      slug,
    },
  })
  // data.id = 'y1c4fhirl5'
  link.value = data
}

function updateLink(newLink, type) {
  if (type === 'delete') {
    navigateTo('/dashboard/links', {
      replace: true,
    })
  }
  else if (type === 'edit') {
    // Update the local link object with the edited data
    link.value = newLink
  }
}

onMounted(() => {
  getLink()
})
</script>

<template>
  <main class="space-y-6">
    <DashboardBreadcrumb title="Link" />
    <DashboardLinksLink
      v-if="link.id"
      :link="link"
      qr-element-type="svg"
      @update:link="updateLink"
    />
    <DashboardAnalysis
      v-if="link.id"
      :link="link"
    />
  </main>
</template>
