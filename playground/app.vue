<template>
  <div>
    <SApp>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <ClientOnly>
        <SToast />
      </ClientOnly>
    </SApp>
  </div>
</template>
