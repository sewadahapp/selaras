export default defineAppConfig({
  selaras: {
    locale: 'id-ID',
    messages: {
      stepper: 'Progres',
      stepperProgress: (step: number, total: number) => `Langkah ${step} dari ${total}`,
    },
  },
})
