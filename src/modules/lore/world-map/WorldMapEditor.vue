<script lang="ts" setup>
import { ref, onMounted } from 'vue';
// import { Stage, Layer, Image as KonvaImage } from 'vue-konva';

const stageWidth = ref(800);
const stageHeight = ref(600);
const scale = ref(1);
const image = ref<HTMLImageElement | null>(null);

// Загрузка изображения карты
const loadImage = () => {
  const img = new window.Image();
  img.src = '/path/to/your/map.jpg'; // Путь к вашему изображению карты
  img.onload = () => {
    image.value = img;
  };
};

// Масштабирование
const handleWheel = (e: WheelEvent) => {
  e.preventDefault();

  // const scaleBy = 1.1;
  // const oldScale = scale.value;

  // const pointer = e.target?.getStage().getPointerPosition();
  // const mousePointTo = {
  //   x: (pointer.x - e.target?.getStage().x()) / oldScale,
  //   y: (pointer.y - e.target?.getStage().y()) / oldScale,
  // };

  // const newScale = e.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
  // scale.value = newScale;

  // const newPos = {
  //   x: pointer.x - mousePointTo.x * newScale,
  //   y: pointer.y - mousePointTo.y * newScale,
  // };

  // e?.target?.getStage()?.position(newPos);
};

onMounted(() => {
  loadImage();
});
</script>

<template>
  <div class="world-map-editor">
    <v-stage
      :config="{
        width: stageWidth,
        height: stageHeight,
      }"
      @wheel="handleWheel"
    >
      <v-layer>
        <v-image
          v-if="image"
          :config="{
            image: image,
            width: stageWidth,
            height: stageHeight,
            scaleX: scale,
            scaleY: scale,
          }"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<style scoped>
.world-map-editor {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}
</style>
