<template>
  <div class="top">
    <set-button @update:bg="onUpdateBackground" />
    <setModalButton @show:modal="modalShowHandle"></setModalButton>
  </div>
  <div><SetModal v-model:show-modal="modalShow"></SetModal></div>
  <transition name="answer-pop" appear>
    <div v-if="isAsk" class="answer-area">
      <AnswerArea @change:height="updateWrapperHeight"></AnswerArea>
    </div>
  </transition>
  <div v-if="!isAsk" class="welcome-text">今天有什么问题</div>
  <div ref="askArea" class="ask-area">
    <AskInput @submit:ask="onSubmitAsk" />
  </div>
</template>

<script setup lang="ts">
import { watch, computed, onMounted, ref } from 'vue'
import SetButton from '../components/SetButton.vue'
import SetModalButton from '../components/SetModalButton.vue'
import AskInput from '../components/AskInput.vue'
import AnswerArea from '../components/AnswerArea.vue'
import SetModal from '../components/SetModal.vue'
import { useBgStore } from '../stores/bg'
const modalShow = ref(false)
const modalShowHandle = (): void => {
  modalShow.value = true
}
const wrapper = ref<HTMLElement | null>(null)
const background = ref('#1e1e1e')
const isAsk = ref(false)
const onUpdateBackground = (newBg: string): void => {
  background.value = newBg
}
const onSubmitAsk = (): void => {
  isAsk.value = true
}
const updateWrapperHeight = (height: number): void => {
  if (wrapper.value) {
    wrapper.value.style.height = height + 'px'
  }
}
onMounted(() => {
  if (window.api) {
    window.api.backgroundAPI.onSet((bg) => {
      background.value = bg
    })
  } else {
    console.warn('window.api is undefined')
  }
})
const askArea = ref(null)
watch(isAsk, () => {
  if (askArea.value && isAsk) {
    ;(askArea.value as HTMLElement).style.top = '65%'
  }
})
const bgStyle = computed(() => {
  const isColor = /^#|^rgb/.test(background.value)
  return {
    backgroundColor: isColor ? background.value : undefined,
    backgroundImage: isColor ? undefined : `url(${background.value})`,
    backgroundRepeat: isColor ? undefined : 'no-repeat',
    backgroundPosition: isColor ? undefined : 'center center',
    backgroundAttachment: isColor ? undefined : 'fixed',
    backgroundSize: isColor ? undefined : 'cover',
    margin: 0,
    paddingLeft: '2%',
    paddingRight: '2%'
  }
})
const bgStore = useBgStore()
watch(
  bgStyle,
  (newBg) => {
    bgStore.bgStyle = newBg
  },
  { immediate: true }
)
</script>

<style scoped>
.top {
  display: flex;
  flex-direction: row-reverse;
}
.ask-area {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 30%;
  left: 20%;
  height: 30%;
  width: 60%;
  transition:
    top 0.5s ease,
    bottom 0.5s ease;
}
.welcome-text {
  position: absolute;
  top: 30%;
  left: 20%;
  width: 60%;
  text-align: center;
  font-size: 2rem;
  color: rgba(104, 98, 98, 0.9); /* 非常淡的白色 */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 增加可读性 */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  opacity: 0.9;
}
.answer-area {
  display: flex;
  width: 60%;
  position: absolute;
  left: 20%;
  justify-content: center;
  transition: height 0.3s ease;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  max-height: 65%;
}
.answer-pop-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.answer-pop-enter-to {
  opacity: 1;
  transform: scale(1);
}
.answer-pop-enter-active {
  transition: all 0.2s ease-out;
}
</style>
