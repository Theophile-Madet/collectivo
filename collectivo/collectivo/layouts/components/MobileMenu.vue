<script setup lang="ts">
import MenuItem from "./MenuItem.vue";

const menus = useCollectivoMenus();
const user = useCollectivoUser();

const mainMenuItems = Object.values(menus.value.main).sort(
  (a, b) => (a.order ?? 100) - (b.order ?? 100),
);

const publicMenuItems = Object.values(menus.value.main_public).sort(
  (a, b) => (a.order ?? 100) - (b.order ?? 100),
);
</script>

<template>
  <div class="mobile-menu">
    <div class="mobile-menu__inner space-x-2">
      <div
        v-for="(item, i) in user.isAuthenticated
          ? mainMenuItems
          : publicMenuItems"
        :key="i"
      >
        <MenuItem
          v-if="!item.hideOnMobile == true"
          :item="item"
          class="mobile-menu-item"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mobile-menu {
  @apply bg-white px-3 py-[5px] fixed bottom-0 w-full z-10 md:hidden border-t-[1px] border-gray-200;
  box-shadow: 4px 0px 48px 0px rgba(220, 226, 239, 0.5);

  &__inner {
    @apply flex items-center justify-center;
  }
}
</style>
