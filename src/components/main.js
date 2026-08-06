// src/components/main.js

export default {
  data() {
    return {
      searchQuery: '',

      products: [
        {
          id: 1,
          name: '«Рождение Венеры» Сандро Боттичелли',
          price: 1000000,
          oldPrice: 2000000,
          image: require('@/assets/img/picture1.png'),
          inCart: false,
          description:
            'Знаменитая картина эпохи Возрождения. Богиня любви выходит из морской пены на раковине.',
          images: [
            require('@/assets/img/picture1.png'),
            require('@/assets/img/picture1.png'),
            require('@/assets/img/picture1.png')
          ]
        },
        {
          id: 2,
          name: '«Тайная вечеря» Леонардо да Винчи',
          price: 3000000,
          oldPrice: null,
          image: require('@/assets/img/picture2.png'),
          inCart: false,
          description:
            'Монументальная фреска, изображающая последнюю трапезу Иисуса Христа с учениками.',
          images: [
            require('@/assets/img/picture2.png'),
            require('@/assets/img/picture2.png'),
            require('@/assets/img/picture2.png')
          ]
        },
        {
          id: 3,
          name: '«Сотворение Адама» Микеланджело',
          price: 5000000,
          oldPrice: 6000000,
          image: require('@/assets/img/picture3.png'),
          inCart: false,
          description:
            'Фреска в Сикстинской капелле. Момент, когда Бог передает жизнь Адаму через прикосновение.',
          images: [
            require('@/assets/img/picture3.png'),
            require('@/assets/img/picture3.png'),
            require('@/assets/img/picture3.png')
          ]
        },
        {
          id: 4,
          name: '«Урок анатомии» Рембрандт',
          price: null,
          oldPrice: null,
          image: require('@/assets/img/picture4.png'),
          inCart: false,
          description:
            "Продана на аукционе Sotheby's в 2024 году за рекордную сумму.",
          images: [
            require('@/assets/img/picture4.png'),
            require('@/assets/img/picture4.png'),
            require('@/assets/img/picture4.png')
          ],
          isSold: true
        }
      ],

      modalVisible: false,
      selectedProduct: null,
      processingItems: {},
      currentSlideIndex: 0,
      slideDirection: 'next', // 👈 Направление анимации
      isAnimating: false      // 👈 Блокировка во время анимации
    }
  },

  computed: {
    filteredProducts() {
      if (!this.searchQuery.trim()) {
        return this.products
      }

      const query = this.searchQuery.toLowerCase().trim()
      return this.products.filter(product => {
        return product.name.toLowerCase().includes(query)
      })
    }
  },

  methods: {
    // Поиск
    handleSearch(e) {
      e.preventDefault()

      if (this.searchQuery.trim()) {
        console.log('🔍 Поиск:', this.searchQuery)

        this.$nextTick(() => {
          const results = document.querySelector('.picture_list')
          if (results) {
            results.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        })
      }
    },

    // Очистка поиска
    clearSearch() {
      this.searchQuery = ''
      this.$refs.searchInput?.focus()
    },

    // Форматирование цены
    formatPrice(price) {
      if (!price) return ''
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    },

    // Кнопка "Купить" с тремя состояниями
    addToCart(product) {
      if (product.isSold) return
      if (product.inCart) return

      this.$set(this.processingItems, product.id, true)

      setTimeout(() => {
        this.$set(this.processingItems, product.id, false)
        this.$set(product, 'inCart', true)
        this.saveToLocalStorage()
      }, 2000)
    },

    saveToLocalStorage() {
      const cartData = this.products.map(p => ({
        id: p.id,
        inCart: p.inCart
      }))
      localStorage.setItem('cartState', JSON.stringify(cartData))
    },

    loadFromLocalStorage() {
      const saved = localStorage.getItem('cartState')
      if (saved) {
        try {
          const cartData = JSON.parse(saved)
          cartData.forEach(savedItem => {
            const product = this.products.find(p => p.id === savedItem.id)
            if (product) {
              product.inCart = savedItem.inCart
            }
          })
        } catch (e) {
          console.error('Ошибка загрузки корзины:', e)
        }
      }
    },

    // 👇 ОТКРЫТИЕ МОДАЛЬНОГО ОКНА
    openModal(product) {
      this.selectedProduct = product
      this.currentSlideIndex = 0
      this.slideDirection = 'next'
      this.isAnimating = false
      this.modalVisible = true
      document.body.style.overflow = 'hidden'
    },

    // 👇 ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА
    closeModal() {
      this.modalVisible = false
      this.selectedProduct = null
      this.currentSlideIndex = 0
      this.isAnimating = false
      document.body.style.overflow = 'auto'
    },

    // 👇 МЕТОДЫ ДЛЯ СЛАЙДЕРА С АНИМАЦИЕЙ
    prevSlide() {
      if (this.isAnimating || !this.selectedProduct || !this.selectedProduct.images) return
      
      this.isAnimating = true
      this.slideDirection = 'prev'
      
      this.currentSlideIndex =
        (this.currentSlideIndex - 1 + this.selectedProduct.images.length) %
        this.selectedProduct.images.length
      
      setTimeout(() => {
        this.isAnimating = false
      }, 400)
    },

    nextSlide() {
      if (this.isAnimating || !this.selectedProduct || !this.selectedProduct.images) return
      
      this.isAnimating = true
      this.slideDirection = 'next'
      
      this.currentSlideIndex =
        (this.currentSlideIndex + 1) % this.selectedProduct.images.length
      
      setTimeout(() => {
        this.isAnimating = false
      }, 400)
    },

    goToSlide(index) {
      if (this.isAnimating || index === this.currentSlideIndex) return
      if (!this.selectedProduct || !this.selectedProduct.images) return
      
      this.isAnimating = true
      this.slideDirection = index > this.currentSlideIndex ? 'next' : 'prev'
      
      this.currentSlideIndex = index
      
      setTimeout(() => {
        this.isAnimating = false
      }, 400)
    },

    // Обработчик ошибки загрузки изображения
    handleImageError(e) {
      console.error('Ошибка загрузки изображения:', e.target.src)
      e.target.src = 'https://via.placeholder.com/400x300/CCCCCC/333333?text=Изображение+не+доступно'
    },

    // 🔥 ГОРЯЧИЕ КЛАВИШИ
    handleKeydown(e) {
      // Ctrl+F или Cmd+F — фокус на поиск
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        this.$refs.searchInput?.focus()
      }
      // / — фокус на поиск (как в YouTube)
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement
        if (
          activeElement?.tagName !== 'INPUT' &&
          activeElement?.tagName !== 'TEXTAREA'
        ) {
          e.preventDefault()
          this.$refs.searchInput?.focus()
        }
      }
      // Escape — очистить поиск
      if (e.key === 'Escape' && this.searchQuery) {
        this.clearSearch()
        this.$refs.searchInput?.blur()
      }
      // Escape — закрыть модальное окно
      if (e.key === 'Escape' && this.modalVisible) {
        this.closeModal()
      }
      // Стрелка влево — предыдущий слайд
      if (e.key === 'ArrowLeft' && this.modalVisible && this.selectedProduct) {
        e.preventDefault()
        this.prevSlide()
      }
      // Стрелка вправо — следующий слайд
      if (e.key === 'ArrowRight' && this.modalVisible && this.selectedProduct) {
        e.preventDefault()
        this.nextSlide()
      }
    }
  },

  mounted() {
    this.loadFromLocalStorage()
    document.addEventListener('keydown', this.handleKeydown)
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeydown)
  }
}