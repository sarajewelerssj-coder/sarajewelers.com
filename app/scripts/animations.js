// Animation script to be loaded in the app
document.addEventListener("DOMContentLoaded", () => {
  // Scroll animation observer
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.visibility = "visible"
          entry.target.classList.add("is-visible")
        }
      })
    },
    { threshold: 0.1 },
  )

  document.querySelectorAll(".scroll-observer").forEach((item) => {
    scrollObserver.observe(item)
  })

  // Product hover effects
  const productCards = document.querySelectorAll(".product-card")
  productCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("shadow-elegant")
      card.style.transform = "translateY(-5px)"
    })

    card.addEventListener("mouseleave", () => {
      card.classList.remove("shadow-elegant")
      card.style.transform = "translateY(0)"
    })
  })
})

