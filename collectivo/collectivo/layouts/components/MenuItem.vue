<script setup lang="ts">
const { t } = useI18n();

const props = defineProps({
  item: {
    type: Object as PropType<CollectivoMenuItem>,
    required: true,
  },
});

const visible = ref(false);
filterItem(props.item);

async function filterItem(item: CollectivoMenuItem) {
  if (item.filter) {
    visible.value = await item.filter(item);
    return;
  }

  visible.value = true;
}
</script>

<template>
  <div v-if="visible">
    <div v-if="item.click">
      <a class="item" @click="item.click()">
        <slot name="icon">
          <UIcon v-if="item.icon" :name="item.icon" class="item__icon" />
        </slot>
        <span class="item__title">{{ t(item.label) }}</span>
      </a>
    </div>
    <div v-else-if="item.external">
      <a :href="item.to" :target="item.target ?? '_blank'" class="item">
        <slot name="icon">
          <UIcon v-if="item.icon" :name="item.icon" class="item__icon" />
        </slot>

        <span class="item__title">{{ t(item.label) }}</span>
      </a>
    </div>
    <div v-else>
      <NuxtLink :to="item.to" class="item">
        <slot name="icon">
          <UIcon v-if="item.icon" :name="item.icon" class="item__icon" />
        </slot>

        <span class="item__title">{{ t(item.label) }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.item {
  // Use flex-row to align icon and title horizontally
  @apply flex flex-col gap-2 items-center px-3 py-4 mb-2 rounded-xl transition-all cursor-pointer;
  &__icon {
    @apply h-6 w-6 mb-0;
  }

  &__title {
    @apply text-sm font-semibold;
    letter-spacing: 0.28px;
  }

  &:hover,
  &.router-link-exact-active {
    @apply bg-primary-50 text-primary-900;
  }
}

.mobile-menu-item {
  @apply p-0 mb-0;

  .item {
    @apply pt-2.5 pb-2 px-2.5 mb-0 mx-0 min-w-16;

    &__icon {
      @apply mb-1;
    }

    &__title {
      @apply text-xs;
      letter-spacing: 0.24px;
    }
  }

  &.router-link-exact-active {
    &.mobile-menu-item {
      .item__icon {
        @apply relative z-10;
        &::after {
          @apply content-[''] bg-purple-500 w-11 h-[34px] rounded-lg absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10;
        }
      }
    }
  }

  &:hover {
    @apply bg-transparent;
    .item__title {
      @apply text-primary-900;
    }

    .item__icon {
      .link-icon {
        @apply text-primary-900;
      }
    }
  }
}
</style>
