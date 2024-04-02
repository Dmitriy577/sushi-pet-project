<template>
  <div class="catalog">
    <div class="catalog__header">
      <div class="catalog__header-container">
        <BaseHeading variant="h2">Catalog</BaseHeading>
		<div class="catalog__search">
			<input @input="onChangeSearchInput" class="catalog__search-input" type="text" placeholder="Search ..." name="" id="">
			<img class="catalog__search-icon" src="../assets/search.svg" alt="">
		</div>
        <CategoryTabs
          :items="allCategories"
          @onCategoryClick="setActiveCategory"
          v-if="isProducts"
        />
      </div>
      <BaseDivider />
    </div>

    <FadeTransition>
      <FailedHttpRequest
        :errorCode="error.errorCode"
        :errorMessage="error.message"
        :timeout="error.timeout"
        :serverIsDown="serverStatus.isDown"
        :serverErrorMessage="serverStatus.message"
        v-if="error?.isError && !isLoading"
      />
    </FadeTransition>

    <div class="catalog__loader">
      <FadeTransition>
        <Loader v-if="isLoading" />
      </FadeTransition>
    </div>

    <ProductList :products="productList" />
  </div>
</template>

<script setup>
import BaseHeading from "./UI/BaseHeading.vue";
import CategoryTabs from "./CategoryTabs.vue";
import ProductList from "./ProductList.vue";
import FailedHttpRequest from "./FailedHttpRequest.vue";
import Loader from "./UI/Loader.vue";
import FadeTransition from "./UI/FadeTransition.vue";
import BaseDivider from '@/components/UI/BaseDivider.vue'
import { ref, watch } from "vue";
import { computed } from "@vue/runtime-core";
import { useProductStore } from "@/store/useProductStore";
import { storeToRefs } from "pinia";
import axios from "axios";

const searchQuery = ref('');

const onChangeSearchInput = (event) => {
	searchQuery.value = event.target.value
}

const productStore = useProductStore();
const {
  products,
  isProducts,
  allCategories,
  isLoading,
  error,
  serverStatus,
} = storeToRefs(productStore);

const activeCategory = ref("all");

const setActiveCategory = (selectedCategory) => {
  activeCategory.value = selectedCategory;
};

const productList = computed(() => {
  if (activeCategory.value === "all") return products.value;
  return products.value.filter(
    (product) => product.category === activeCategory.value
  );
});

watch(searchQuery, async() => {
  try {
	const {data} = await axios.get(`https://c61db6ccb97445c0.mokky.dev/product?title=*${searchQuery.value}*`)
	products.value = data
	console.log(data)
  } catch (error) {
	console.log(error)
  }
});
</script>

<style scoped>
.catalog {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 0;
}

.catalog__header {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
}

.catalog__header-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.catalog__loader {
  position: relative;
}

.catalog__search {
  position: relative;
}

.catalog__search-input{
	font-family: "Open Sans", Helvetica, Arial, sans-serif;
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #E4E4E4;
  padding: 0 16px;
}

.catalog__search-icon{
  position: absolute;
  top: 50%;
  right: 0px;
  transform: translateY(-50%);
}

@media screen and (min-width: 1024px) {
  .catalog__header-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
