<template>
  <div v-if="showUpdater" class="updater-component">
    <div v-if="updateAvailable" class="update-notification">
      <div class="update-header">
        <h3>🎉 Доступно обновление!</h3>
        <NButton quaternary circle size="small" @click="closeUpdater">
          <template #icon>
            <NIcon><CloseOutlined /></NIcon>
          </template>
        </NButton>
      </div>

      <div class="update-info">
        <p><strong>Новая версия:</strong> {{ availableVersion }}</p>
        <p v-if="updateBody" class="update-body">{{ updateBody }}</p>
      </div>

      <NFlex justify="space-between" class="update-actions">
        <NButton
          type="success"
          :loading="isUpdating"
          @click="handleInstallUpdate"
        >
          {{ isUpdating ? 'Установка...' : 'Установить' }}
        </NButton>

        <NButton quaternary @click="closeUpdater">
          Позже
        </NButton>
      </NFlex>

      <div v-if="isUpdating" class="update-progress">
        <NProgress
          type="line"
          :percentage="updateProgress"
          :show-indicator="false"
          status="success"
        />
        <p class="progress-text">{{ Math.round(updateProgress) }}%</p>
      </div>
    </div>

    <div v-else-if="checkingForUpdates" class="checking-updates">
      <NFlex align="center" justify="center">
        <NSpin size="small" />
        <span>Проверка обновлений...</span>
      </NFlex>
    </div>

    <div v-else class="no-updates">
      <NFlex vertical align="center">
        <p>✅ У вас установлена последняя версия</p>
        <NButton size="small" quaternary @click="closeUpdater">
          Закрыть
        </NButton>
      </NFlex>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'
import { NButton, NIcon, NFlex, NProgress, NSpin, useMessage } from 'naive-ui'
import { CloseOutlined } from '@vicons/material'

const message = useMessage()

const showUpdater = ref(false)
const updateAvailable = ref(false)
const availableVersion = ref('')
const updateBody = ref('')
const isUpdating = ref(false)
const checkingForUpdates = ref(false)
const updateProgress = ref(0)

const handleCheckUpdate = async (showResult = false) => {
  try {
    checkingForUpdates.value = true
    showUpdater.value = showResult

    const update = await check()

    if (update) {
      updateAvailable.value = true
      availableVersion.value = update.version
      updateBody.value = update.body || ''
      showUpdater.value = true

      if (!showResult) {
        message.info(`Доступно обновление до версии ${update.version}`)
      }
    } else if (showResult) {
      updateAvailable.value = false
      showUpdater.value = true
    }
  } catch (error) {
    console.error('Ошибка при проверке обновлений:', error)
    if (showResult) {
      message.error(`Ошибка проверки обновлений: ${error}`)
    }
  } finally {
    checkingForUpdates.value = false
  }
}

const handleInstallUpdate = async () => {
  try {
    isUpdating.value = true
    updateProgress.value = 0

    const update = await check()
    if (!update) {
      throw new Error('Обновление недоступно')
    }

    // Симуляция прогресса
    const progressInterval = setInterval(() => {
      if (updateProgress.value < 90) {
        updateProgress.value += Math.random() * 10
      }
    }, 200)

    await update.downloadAndInstall()

    clearInterval(progressInterval)
    updateProgress.value = 100

    message.success('Обновление установлено! Перезапуск через 2 секунды...')

    // Перезапуск через 2 секунды
    setTimeout(async () => {
      await relaunch()
    }, 2000)

  } catch (error) {
    console.error('Ошибка при установке обновления:', error)
    message.error(`Ошибка установки обновления: ${error}`)
    isUpdating.value = false
    updateProgress.value = 0
  }
}

const closeUpdater = () => {
  showUpdater.value = false
  updateAvailable.value = false
}

// Экспорт функции для вызова из других компонентов
const checkForUpdates = () => {
  handleCheckUpdate(true)
}

defineExpose({
  checkForUpdates
})

onMounted(() => {
  // Автоматическая проверка обновлений при запуске (через 5 секунд)
  setTimeout(() => {
    handleCheckUpdate(false)
  }, 5000)

  // Периодическая проверка каждые 30 минут
  setInterval(() => {
    handleCheckUpdate(false)
  }, 30 * 60 * 1000)
})
</script>

<style scoped>
.updater-component {
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 400px;
  z-index: 1000;
}

.update-notification,
.checking-updates,
.no-updates {
  background: var(--n-color);
  border: 1px solid var(--n-border-color);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--n-box-shadow);
  backdrop-filter: blur(10px);
}

.update-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.update-header h3 {
  margin: 0;
  color: var(--n-text-color);
  font-size: 18px;
}

.update-info {
  margin-bottom: 20px;
}

.update-info p {
  margin: 8px 0;
  color: var(--n-text-color);
}

.update-body {
  font-size: 14px;
  color: var(--n-text-color-2);
  background: var(--n-color-hover);
  padding: 10px;
  border-radius: 6px;
  margin-top: 10px;
}

.update-actions {
  margin-bottom: 15px;
}

.update-progress {
  margin-top: 15px;
}

.progress-text {
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
  color: var(--n-text-color-2);
}

.checking-updates,
.no-updates {
  text-align: center;
  padding: 15px;
}
</style>
