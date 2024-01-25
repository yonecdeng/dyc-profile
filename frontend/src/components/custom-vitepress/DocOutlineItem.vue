<script setup lang="ts">
import { reactive } from "vue";

defineProps<{
  headers: any[];
  root?: boolean;
}>();

function onClick({ target: el }: Event) {
  const id = (el as HTMLAnchorElement).href!.split("#")[1];
  const heading = document?.getElementById(decodeURIComponent(id));
  heading?.focus({ preventScroll: true });
}

const active = reactive<boolean[] | undefined[]>([]);
function toggleExpand(index: number) {
  active[index] = !active[index];
}
</script>

<template>
  <ul :class="root ? 'root' : 'nested'">
    <li
      class="VPDocOutlineItem"
      v-for="({ children, link, title }, index) in headers"
    >
      <span
        v-if="children?.length"
        :class="['arrow-right', { down: active[index] }]"
        @click="toggleExpand(index)"
      ></span>
      <a class="outline-link" :href="link" @click="onClick" :title="title">{{
        title
      }}</a>
      <template v-if="children?.length">
        <DocOutlineItem :headers="children" v-show="active[index]" />
      </template>
    </li>
  </ul>
</template>

<style scoped>
.VPDocOutlineItem {
  position: relative;
}
.arrow-right {
  position: absolute;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid black;
  cursor: pointer;
  top: 10px;
  left: -10px;
}

.arrow-right.down {
  transform: rotate(90deg);
}
.root {
  position: relative;
  z-index: 1;
}

.nested {
  padding-right: 16px;
  padding-left: 16px;
}

.outline-link {
  display: block;
  line-height: 32px;
  font-size: 14px;
  font-weight: 400;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.5s;
}

.outline-link:hover,
.outline-link.active {
  color: var(--vp-c-brand-1);
  transition: color 0.25s;
}

.outline-link.nested {
  padding-left: 13px;
}
</style>
