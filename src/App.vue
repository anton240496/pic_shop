<template>
  <div class="app">
    <!-- Шапка -->
    <header class="header">
      <div class="container">
        <div class="header_inner">
          <nav class="menu">
            <ul class="menu_list">
              <li class="menu_item"><a class="menu_link" href="">Каталог</a></li>
              <li class="menu_item"><a class="menu_link" href="">Доставка</a></li>
              <li class="menu_item"><a class="menu_link" href="">Оплата</a></li>
              <li class="menu_item"><a class="menu_link" href="">Контакты</a></li>
              <li class="menu_item"><a class="menu_link" href="">О компании</a></li>
            </ul>
          </nav>

          <form class="header_form" @submit.prevent="handleSearch">
            <input 
              type="text" 
              name="search" 
              v-model="searchQuery" 
              placeholder="Поиск по названию картины"
              ref="searchInput"
            >
            <button class="button header_button" type="submit" :disabled="!searchQuery.trim()">
              <span v-if="searchQuery.trim() && filteredProducts.length === 0">
                🔍 Ничего не найдено
              </span>
              <span v-else-if="searchQuery.trim()">
                🔍 Найти ({{ filteredProducts.length }})
              </span>
              <span v-else>🔍 Найти</span>
            </button>

            <button 
              v-if="searchQuery.trim()" 
              type="button" 
              class="clear-btn" 
              @click="clearSearch" 
              title="Очистить"
            >
              ✕
            </button>
          </form>
        </div>
      </div>
    </header>

    <!-- Основной контент -->
    <main>
      <section class="picture">
        <div class="container">
          <div class="picture_inner">
            <h1 class="picture_title">Картины эпохи Возрождения</h1>

            <ul class="picture_list">
              <li class="picture_item" v-for="product in filteredProducts" :key="product.id">
                <!-- Клик по карточке открывает модальное окно -->
                <div class="picture_link" @click="openModal(product)">
                  <img :src="product.image" :alt="product.name">
                  <div class="picture_content">
                    <h2 class="picture_item_title">{{ product.name }}</h2>
                    <div class="picture_buy">
                      <div class="picture_price">
                        <p class="picture_price_old" v-if="product.oldPrice">
                          {{ formatPrice(product.oldPrice) }} $
                        </p>

                        <p class="picture_price_new" v-if="product.price && !product.isSold">
                          {{ formatPrice(product.price) }} $
                        </p>

                        <p class="picture_price_akc" v-if="product.isSold">
                          Продана на аукционе
                        </p>
                      </div>

                      <!-- Кнопка "Купить" с тремя состояниями -->
                      <button 
                        v-if="!product.isSold" 
                        class="picture_button button" 
                        :class="{ btn_kor: product.inCart }"
                        @click.stop="addToCart(product)" 
                        :disabled="processingItems[product.id]"
                      >
                        <span style="font-size: 12px;" v-if="processingItems[product.id]">⏳ Обрабатывается...</span>
                        <div class="pic_kor" v-else-if="product.inCart">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_23075_35)">
                              <path d="M16.5315 4.80937L7.63341 14.237L3.34814 10.1924" stroke="#F4F6F9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                              <clipPath id="clip0_23075_35">
                                <rect width="20" height="20" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <p>В корзине</p>
                        </div>
                        <span v-else>Купить</span>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <p v-if="filteredProducts.length === 0" class="no-results">
              По вашему запросу ничего не найдено
            </p>
          </div>
        </div>
      </section>
    </main>

    <!-- Футер -->
    <footer class="footer">
      <div class="container">
        <div class="footer_inner">
          <nav class="menu">
            <ul class="menu_list">
              <li class="menu_item"><a class="menu_link" href="">Каталог</a></li>
              <li class="menu_item"><a class="menu_link" href="">Доставка</a></li>
              <li class="menu_item"><a class="menu_link" href="">Оплата</a></li>
              <li class="menu_item"><a class="menu_link" href="">Контакты</a></li>
              <li class="menu_item"><a class="menu_link" href="">О компании</a></li>
            </ul>
          </nav>
          <a class="contact" href="tel:+78125555555">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.6861 12.0733L12.5241 9.9061C12.0934 9.47621 11.3803 9.48927 10.9346 9.9361L9.84534 11.0276C9.77652 10.9896 9.70529 10.9499 9.6304 10.9077C8.94254 10.5257 8.00109 10.0022 7.0104 9.00851C6.01678 8.01276 5.49391 7.06772 5.11161 6.37786C5.07127 6.30478 5.03261 6.23431 4.99445 6.16739L5.7255 5.43577L6.08492 5.07509C6.53125 4.62763 6.54356 3.91305 6.11392 3.48192L3.95184 1.31445C3.52219 0.883917 2.80871 0.896979 2.36238 1.34444L1.75303 1.95868L1.76968 1.97525C1.56536 2.23655 1.39462 2.53793 1.26756 2.86292C1.15044 3.17228 1.07752 3.46748 1.04418 3.76329C0.758688 6.13542 1.84023 8.30337 4.7754 11.2452C8.8327 15.3114 12.1023 15.0043 12.2434 14.9893C12.5506 14.9525 12.845 14.8789 13.1442 14.7624C13.4657 14.6366 13.7662 14.4657 14.0267 14.2613L14.04 14.2732L14.6573 13.6673C15.1028 13.22 15.1156 12.5051 14.6861 12.0733Z" fill="#555555" />
            </svg>
            <p>+7 (812) 555-55-55</p>
          </a>
          <a class="contact" href="https://yandex.ru/maps/-/CTG4BM7s">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.07028 1C5.27451 1 3 3.27451 3 6.07025C3 9.53985 7.5374 14.6334 7.73058 14.8486C7.91204 15.0507 8.22884 15.0503 8.40997 14.8486C8.60315 14.6334 13.1406 9.53985 13.1406 6.07025C13.1405 3.27451 10.866 1 8.07028 1ZM8.07028 8.62123C6.66366 8.62123 5.51932 7.47687 5.51932 6.07025C5.51932 4.66363 6.66368 3.51929 8.07028 3.51929C9.47687 3.51929 10.6212 4.66366 10.6212 6.07028C10.6212 7.47689 9.47687 8.62123 8.07028 8.62123Z" fill="#555555" />
            </svg>
            <p>г. Санкт-Петербург, ул. Ефимова, 3</p>
          </a>
        </div>
      </div>
    </footer>

    <!-- МОДАЛЬНОЕ ОКНО -->
    <div class="modal-overlay" v-if="modalVisible" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">✕</button>

        <div v-if="selectedProduct" class="modal-body">
          <h2 class="modal-title">{{ selectedProduct.name }}</h2>

          <!-- Слайдер с анимацией -->
          <div class="modal-slider">
            <div class="slider-container">
              <div 
                class="slider-track"
                :class="{
                  'slide-next': slideDirection === 'next' && isAnimating,
                  'slide-prev': slideDirection === 'prev' && isAnimating
                }"
              >
                <img 
                  :src="selectedProduct.images[currentSlideIndex]" 
                  :alt="selectedProduct.name"
                  class="slider-image"
                  @error="handleImageError"
                >
              </div>
            </div>

            <button 
              v-if="selectedProduct.images.length > 1" 
              class="slider-btn slider-prev" 
              @click="prevSlide"
              :disabled="isAnimating"
            >
              ‹
            </button>
            <button 
              v-if="selectedProduct.images.length > 1" 
              class="slider-btn slider-next" 
              @click="nextSlide"
              :disabled="isAnimating"
            >
              ›
            </button>
          </div>

          <!-- Индикаторы (точки) -->
          <div class="slider-dots" v-if="selectedProduct.images && selectedProduct.images.length > 1">
            <span 
              v-for="(image, index) in selectedProduct.images" 
              :key="index" 
              class="slider-dot"
              :class="{ active: index === currentSlideIndex }" 
              @click="goToSlide(index)"
            ></span>
          </div>

          <!-- Цена -->
          <div class="modal-price-wrapper">
            <p class="modal-price-old" v-if="selectedProduct.oldPrice">
              {{ formatPrice(selectedProduct.oldPrice) }} $
            </p>
            <p class="modal-price" v-if="selectedProduct.price && !selectedProduct.isSold">
              {{ formatPrice(selectedProduct.price) }} $
            </p>
            <p class="modal-price-sold" v-else-if="selectedProduct.isSold">
              ❌ Продана на аукционе
            </p>
          </div>

          <p class="modal-description">{{ selectedProduct.description }}</p>

          <!-- Кнопка в модалке -->
          <button 
            v-if="!selectedProduct.isSold" 
            class="modal-cart-btn button" 
            :class="{ btn_kor: selectedProduct.inCart }"
            @click="addToCart(selectedProduct)"
          >
            <span v-if="processingItems[selectedProduct.id]">⏳ Обрабатывается...</span>
            <div class="pic_kor" v-else-if="selectedProduct.inCart">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_23075_35)">
                  <path d="M16.5315 4.80937L7.63341 14.237L3.34814 10.1924" stroke="#F4F6F9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_23075_35">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p>В корзине</p>
            </div>
            <span v-else>Купить</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppLogic from './components/main.js'

export default AppLogic
</script>