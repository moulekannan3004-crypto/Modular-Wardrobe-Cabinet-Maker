/**
 * Modular Wardrobe & Cabinet Maker - Core JavaScript Engine
 */

function bootModularisApp() {
    initToastSystem();
    initTheme();
    initDirection();
    initMobileNav();
    initNavDropdowns();
    initImageFallback();
    initFAQAccordions();
    initGalleryFilter();
    initProductFilter();
    initCostCalculator();
    initDashboardTabs();
    initMaterialSwatches();
    init3DViewerModal();
    initCountdownTimer();
    initFormSubmissions();
    initNameValidation();
    initEmailValidation();
    initPhoneValidation();
    initGenericButtonHandlers();
    
    initServiceDetailsDynamic();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootModularisApp);
} else {
    bootModularisApp();
}

/* -------------------------------------------------------------------------- */
/* 0.1 Image Error Fallback Handler                                           */
/* -------------------------------------------------------------------------- */
function initImageFallback() {
    document.addEventListener('error', (e) => {
        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'img') {
            const img = e.target;
            if (img.dataset.hasFallback) return;
            img.dataset.hasFallback = 'true';

            const title = img.alt || 'MODULARIS Wardrobe';
            const encodedTitle = encodeURIComponent(title);
            img.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%231c1917"/><g transform="translate(400,260)" text-anchor="middle"><circle r="48" fill="%23c59b27" opacity="0.2"/><path d="M-15 -15 h30 v30 h-30 z" fill="none" stroke="%23d4af37" stroke-width="3"/><text y="60" fill="%23d4af37" font-family="sans-serif" font-size="18" font-weight="bold">${encodedTitle}</text><text y="85" fill="%23a8a29e" font-family="sans-serif" font-size="12">MODULARIS Architectural Joinery</text></g></svg>`;
        }
    }, true);
}

/* -------------------------------------------------------------------------- */
/* 0. Toast Notification System                                                */
/* -------------------------------------------------------------------------- */
let toastContainer = null;

function initToastSystem() {
    if (!document.getElementById('toast-container')) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed bottom-6 right-6 z-[9999] flex flex-col space-y-3 pointer-events-none max-w-sm w-full px-4';
        document.body.appendChild(toastContainer);
    } else {
        toastContainer = document.getElementById('toast-container');
    }
}

function showToast(title, message, icon = 'fa-circle-check', duration = 4000) {
    if (!toastContainer) initToastSystem();

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto bg-stone-900/95 dark:bg-stone-800/95 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border border-amber-500/30 flex items-start space-x-3 rtl:space-x-reverse transform translate-y-8 opacity-0 transition-all duration-300';
    
    const iconClass = (icon.includes('fa-brands') || icon.includes('fa-regular') || icon.includes('fa-solid')) ? icon : `fa-solid ${icon}`;

    toast.innerHTML = `
        <div class="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <i class="${iconClass} text-base"></i>
        </div>
        <div class="flex-1">
            <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider">${title}</h4>
            <p class="text-xs text-stone-300 mt-0.5 leading-relaxed">${message}</p>
        </div>
        <button class="text-stone-400 hover:text-white transition focus:outline-none text-xs ml-2" onclick="this.parentElement.remove()">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-8', 'opacity-0');
    });

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, 300);
    }, duration);
}

/* -------------------------------------------------------------------------- */
/* 1. Theme Management (Light / Dark Mode)                                    */
/* -------------------------------------------------------------------------- */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        updateThemeIcons('dark');
    } else {
        document.documentElement.classList.remove('dark');
        updateThemeIcons('light');
    }

    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcons(isDark ? 'dark' : 'light');
            showToast('Theme Changed', isDark ? 'Switched to Luxury Dark Mode' : 'Switched to Crisp Light Mode', 'fa-moon');
        });
    });
}

function updateThemeIcons(mode) {
    const icons = document.querySelectorAll('.theme-toggle-icon');
    icons.forEach(icon => {
        if (mode === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

/* -------------------------------------------------------------------------- */
/* 2. Direction Management (LTR / RTL Support)                                */
/* -------------------------------------------------------------------------- */
function initDirection() {
    const savedDir = localStorage.getItem('direction') || 'ltr';
    setDirection(savedDir, false);

    const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
    rtlToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            setDirection(newDir, true);
        });
    });
}

function setDirection(dir, notify = true) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('direction', dir);

    const toggleBtns = document.querySelectorAll('.rtl-toggle-btn');
    toggleBtns.forEach(btn => {
        const ltrLabel = btn.querySelector('.ltr-label');
        const rtlLabel = btn.querySelector('.rtl-label');
        const simpleLabel = btn.querySelector('.rtl-toggle-label');

        if (ltrLabel && rtlLabel) {
            if (dir === 'rtl') {
                ltrLabel.className = 'ltr-label text-stone-400 dark:text-stone-500 opacity-60 font-semibold leading-none';
                rtlLabel.className = 'rtl-label font-extrabold text-amber-600 dark:text-amber-400 leading-none';
            } else {
                ltrLabel.className = 'ltr-label font-extrabold text-amber-600 dark:text-amber-400 leading-none';
                rtlLabel.className = 'rtl-label text-stone-400 dark:text-stone-500 opacity-60 font-semibold leading-none';
            }
        } else if (simpleLabel) {
            simpleLabel.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        }


    });

    if (notify) {
        showToast('Layout Direction', dir === 'rtl' ? 'Switched layout to Right-To-Left (RTL)' : 'Switched layout to Left-To-Right (LTR)', 'fa-globe');
    }
}

/* -------------------------------------------------------------------------- */
/* 3. Mobile Navigation Menu                                                   */
/* -------------------------------------------------------------------------- */
function initMobileNav() {
    const navToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

/* -------------------------------------------------------------------------- */
/* 3.1 Desktop Navigation Dropdowns Controller (Hover & Click Toggle)         */
/* -------------------------------------------------------------------------- */
function initNavDropdowns() {
    const dropdownContainers = document.querySelectorAll('.nav-dropdown');

    dropdownContainers.forEach(container => {
        const trigger = container.querySelector('.nav-dropdown-trigger') || container.querySelector('a, button');
        const menu = container.querySelector('.nav-dropdown-menu') || container.querySelector('.absolute');
        const icon = trigger ? trigger.querySelector('.fa-chevron-down') : null;

        if (!trigger || !menu) return;

        trigger.setAttribute('aria-haspopup', 'true');
        trigger.setAttribute('aria-expanded', 'false');

        // Toggle on Click (vital for touchscreens, touchpads, and click navigation)
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const isAlreadyOpen = menu.classList.contains('show-dropdown');

            // Close other dropdowns
            document.querySelectorAll('.nav-dropdown-menu.show-dropdown').forEach(m => {
                if (m !== menu) {
                    m.classList.remove('show-dropdown');
                    m.classList.add('hidden');
                    const otherTrig = m.closest('.nav-dropdown')?.querySelector('.nav-dropdown-trigger, a, button');
                    if (otherTrig) otherTrig.setAttribute('aria-expanded', 'false');
                    const otherIcon = otherTrig?.querySelector('.fa-chevron-down');
                    if (otherIcon) otherIcon.style.transform = '';
                }
            });

            if (isAlreadyOpen) {
                menu.classList.remove('show-dropdown');
                menu.classList.add('hidden');
                trigger.setAttribute('aria-expanded', 'false');
                if (icon) icon.style.transform = '';
            } else {
                menu.classList.add('show-dropdown');
                menu.classList.remove('hidden');
                trigger.setAttribute('aria-expanded', 'true');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });

        // Hover support
        container.addEventListener('mouseenter', () => {
            menu.classList.remove('hidden');
            if (icon) icon.style.transform = 'rotate(180deg)';
        });

        container.addEventListener('mouseleave', () => {
            if (!menu.classList.contains('show-dropdown')) {
                menu.classList.add('hidden');
                if (icon) icon.style.transform = '';
            }
        });
    });

    // Close when clicking anywhere outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown-menu.show-dropdown').forEach(menu => {
                menu.classList.remove('show-dropdown');
                menu.classList.add('hidden');
                const trigger = menu.closest('.nav-dropdown')?.querySelector('.nav-dropdown-trigger, a, button');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
                const icon = trigger?.querySelector('.fa-chevron-down');
                if (icon) icon.style.transform = '';
            });
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.nav-dropdown-menu.show-dropdown').forEach(menu => {
                menu.classList.remove('show-dropdown');
                menu.classList.add('hidden');
                const trigger = menu.closest('.nav-dropdown')?.querySelector('.nav-dropdown-trigger, a, button');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
                const icon = trigger?.querySelector('.fa-chevron-down');
                if (icon) icon.style.transform = '';
            });
        }
    });
}

/* -------------------------------------------------------------------------- */
/* 4. FAQ Accordions                                                          */
/* -------------------------------------------------------------------------- */
function initFAQAccordions() {
    const accordionHeaders = document.querySelectorAll('.faq-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', (e) => {
            e.preventDefault();
            const body = header.nextElementSibling;
            const icon = header.querySelector('.faq-icon');

            if (body && body.classList.contains('hidden')) {
                body.classList.remove('hidden');
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else if (body) {
                body.classList.add('hidden');
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

/* -------------------------------------------------------------------------- */
/* 5. Gallery Category Filter                                                 */
/* -------------------------------------------------------------------------- */
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const category = btn.getAttribute('data-filter');

            filterBtns.forEach(b => {
                b.classList.remove('bg-amber-600', 'text-white');
                b.classList.add('bg-gray-200', 'dark:bg-amber-900/30', 'text-gray-700', 'dark:text-gray-300');
            });
            btn.classList.remove('bg-gray-200', 'dark:bg-amber-900/30', 'text-gray-700', 'dark:text-gray-300');
            btn.classList.add('bg-amber-600', 'text-white');

            galleryItems.forEach(item => {
                const itemCat = item.getAttribute('data-category');
                if (category === 'all' || itemCat === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            showToast('Filter Applied', `Displaying ${category === 'all' ? 'All Portfolio Renders' : category} designs`, 'fa-filter');
        });
    });
}

/* -------------------------------------------------------------------------- */
/* 6. Product Filter (Style & Material)                                       */
/* -------------------------------------------------------------------------- */
function initProductFilter() {
    const catalogFilter = document.getElementById('catalog-filter');
    const styleFilter = document.getElementById('filter-style');
    const materialFilter = document.getElementById('filter-material');
    const catalogCount = document.getElementById('catalog-count');
    const productGrid = document.getElementById('product-grid');

    if (!catalogFilter && (!styleFilter || !materialFilter)) return;

    // Create or locate no-results message element
    let noResultsMsg = document.getElementById('no-results-msg');
    if (!noResultsMsg && productGrid) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'no-results-msg';
        noResultsMsg.className = 'col-span-full hidden text-center py-12 bg-white dark:bg-stone-900 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 p-8 shadow-sm';
        noResultsMsg.innerHTML = `
            <div class="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                <i class="fa-solid fa-filter-circle-xmark"></i>
            </div>
            <h3 class="font-bold text-stone-900 dark:text-white text-lg mb-2">No Matching Wardrobes Found</h3>
            <p class="text-stone-500 dark:text-stone-400 text-xs max-w-md mx-auto mb-6">No collections match the currently selected filter. Try resetting your filter preferences.</p>
            <button id="reset-filters-btn" class="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition shadow-md">
                Reset All Filters
            </button>
        `;
        productGrid.appendChild(noResultsMsg);

        document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
            if (catalogFilter) catalogFilter.value = 'all';
            if (styleFilter) styleFilter.value = 'all';
            if (materialFilter) materialFilter.value = 'all';
            applyProductFilters();
            showToast('Filters Reset', 'Showing all wardrobe collections', 'fa-rotate-left');
        });
    }

    function applyProductFilters() {
        const productCards = document.querySelectorAll('.product-card, .product-item');
        let visibleCount = 0;

        if (catalogFilter) {
            const filterVal = catalogFilter.value;
            productCards.forEach(item => {
                const itemStyle = item.getAttribute('data-style');
                const itemMaterial = item.getAttribute('data-material');

                if (itemStyle || itemMaterial) {
                    const match = (filterVal === 'all' || itemStyle === filterVal || itemMaterial === filterVal);

                    if (match) {
                        item.style.display = 'flex';
                        item.classList.remove('hidden');
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        } else if (styleFilter && materialFilter) {
            const style = styleFilter.value;
            const material = materialFilter.value;

            productCards.forEach(item => {
                const itemStyle = item.getAttribute('data-style');
                const itemMaterial = item.getAttribute('data-material');

                if (itemStyle || itemMaterial) {
                    const matchStyle = (style === 'all' || itemStyle === style);
                    const matchMaterial = (material === 'all' || itemMaterial === material);

                    if (matchStyle && matchMaterial) {
                        item.style.display = 'flex';
                        item.classList.remove('hidden');
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        }

        if (catalogCount) {
            catalogCount.textContent = visibleCount;
        }

        if (noResultsMsg) {
            if (visibleCount === 0) {
                noResultsMsg.classList.remove('hidden');
            } else {
                noResultsMsg.classList.add('hidden');
            }
        }
    }

    catalogFilter?.addEventListener('change', () => {
        applyProductFilters();
        showToast('Catalog Filtered', 'Updated product selection', 'fa-sliders');
    });

    styleFilter?.addEventListener('change', () => {
        applyProductFilters();
        showToast('Catalog Filtered', 'Updated product selection', 'fa-sliders');
    });

    materialFilter?.addEventListener('change', () => {
        applyProductFilters();
        showToast('Catalog Filtered', 'Updated product selection', 'fa-sliders');
    });
}

/* -------------------------------------------------------------------------- */
/* 7. Interactive Instant Cost Estimator Calculator                           */
/* -------------------------------------------------------------------------- */
function initCostCalculator() {
    const calcForm = document.getElementById('cost-estimator-form');
    if (!calcForm) return;

    const lengthInput = document.getElementById('calc-length');
    const lengthVal = document.getElementById('calc-length-val');
    const doorTypeSelect = document.getElementById('calc-door');
    const finishSelect = document.getElementById('calc-finish');
    const accessoriesCheckboxes = document.querySelectorAll('.calc-acc');
    const outputPrice = document.getElementById('calc-total-price');

    function calculateCost() {
        const feet = parseFloat(lengthInput ? lengthInput.value : 8) || 8;
        if (lengthVal) lengthVal.textContent = feet + ' ft';

        let baseRate = 220;

        const doorType = doorTypeSelect ? doorTypeSelect.value : 'hinged';
        if (doorType === 'sliding') baseRate += 45;
        if (doorType === 'walkin') baseRate += 85;

        const finish = finishSelect ? finishSelect.value : 'laminate';
        if (finish === 'acrylic') baseRate += 60;
        if (finish === 'pu-lacquer') baseRate += 90;
        if (finish === 'veneer') baseRate += 120;

        let total = feet * baseRate;

        accessoriesCheckboxes.forEach(acc => {
            if (acc.checked) {
                total += parseFloat(acc.value) || 0;
            }
        });

        if (outputPrice) {
            outputPrice.textContent = '$' + total.toLocaleString('en-US');
        }
    }

    if (lengthInput) lengthInput.addEventListener('input', calculateCost);
    if (doorTypeSelect) doorTypeSelect.addEventListener('change', calculateCost);
    if (finishSelect) finishSelect.addEventListener('change', calculateCost);
    accessoriesCheckboxes.forEach(cb => cb.addEventListener('change', calculateCost));

    calculateCost();
}

/* -------------------------------------------------------------------------- */
/* 8. Dashboard Tabs (Client & Admin)                                         */
/* -------------------------------------------------------------------------- */
function initDashboardTabs() {
    const tabBtns = document.querySelectorAll('.dashboard-tab-btn');
    const tabPanes = document.querySelectorAll('.dashboard-tab-pane');

    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-tab');

            tabBtns.forEach(b => {
                b.classList.remove('bg-amber-600', 'text-white', 'dark:bg-amber-600');
                b.classList.add('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-100', 'dark:hover:bg-amber-900/20');
            });

            btn.classList.remove('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-100', 'dark:hover:bg-amber-900/20');
            btn.classList.add('bg-amber-600', 'text-white', 'dark:bg-amber-600');

            tabPanes.forEach(pane => {
                if (pane.id === targetId) {
                    pane.classList.remove('hidden');
                } else {
                    pane.classList.add('hidden');
                }
            });
        });
    });
}

/* -------------------------------------------------------------------------- */
/* 9. Material Swatches Selector (Home Niche)                                 */
/* -------------------------------------------------------------------------- */
function initMaterialSwatches() {
    const swatchBtns = document.querySelectorAll('.swatch-select-btn');
    const previewImg = document.getElementById('swatch-preview-img');
    const previewTitle = document.getElementById('swatch-preview-title');
    const previewDesc = document.getElementById('swatch-preview-desc');

    if (!swatchBtns.length) return;

    swatchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            swatchBtns.forEach(b => b.classList.remove('ring-4', 'ring-amber-500'));
            btn.classList.add('ring-4', 'ring-amber-500');

            const img = btn.getAttribute('data-img');
            const title = btn.getAttribute('data-title');
            const desc = btn.getAttribute('data-desc');

            if (previewImg && img) previewImg.src = img;
            if (previewTitle && title) previewTitle.textContent = title;
            if (previewDesc && desc) previewDesc.textContent = desc;

            showToast('Swatch Selected', `Selected finish: ${title || 'Custom Material'}`, 'fa-palette');
        });
    });
}

/* -------------------------------------------------------------------------- */
/* 10. 3D Model / Image Modal Popup                                           */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* 10. 3D Model / Image / Product Specification Modal Popup                   */
/* -------------------------------------------------------------------------- */
function init3DViewerModal() {
    const modal = document.getElementById('global-modal');
    if (!modal) return;

    // Delegate click handler for opening modals from triggers, [data-product-modal] buttons, or product cards
    document.addEventListener('click', (e) => {
        // Check for direct [data-product-modal] button click (View Specifications buttons)
        const specBtn = e.target.closest('[data-product-modal]');
        if (specBtn) {
            e.preventDefault();
            const title = specBtn.dataset.productModal || 'Modular Cabinetry System';
            const card = specBtn.closest('.product-card, .product-item');
            const cardImage = card?.querySelector('img')?.src;
            const imgSrc = cardImage || specBtn.dataset.productImg || 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800&auto=format&fit=crop';
            const price = specBtn.dataset.productPrice || 'From $2,800';
            const descP = specBtn.dataset.productDesc || 'Bespoke modular joinery layout engineered with precision hardware and soft-close dampers.';

            // Pull tags from parent card spans
            let tag1 = 'Modular System';
            let tag2 = 'Premium Spec';
            if (card) {
                const spans = Array.from(card.querySelectorAll('span'));
                spans.forEach(s => {
                    const txt = s.innerText.trim();
                    if (txt && !txt.includes('$') && !txt.includes('/') && txt.length < 35) {
                        if (tag1 === 'Modular System') tag1 = txt;
                        else if (tag2 === 'Premium Spec') tag2 = txt;
                    }
                });
            }

            openProductModal(modal, title, imgSrc, title, tag1, tag2, '', descP, price);
            return;
        }

        const trigger = e.target.closest('.open-modal-trigger');
        const cardTarget = e.target.closest('.product-card img, .product-card h3, .gallery-item img, .gallery-item h4');
        
        if (trigger || cardTarget) {
            const targetEl = trigger || cardTarget;
            if (targetEl.tagName === 'A' || targetEl.tagName === 'BUTTON' || cardTarget) {
                e.preventDefault();
            }

            // 1. If inside a product card (with pricing & product specs)
            const productCard = targetEl.closest('.product-card, .product-item');
            if (productCard) {
                const title = productCard.querySelector('h3')?.innerText.trim() || 'Modular Cabinetry System';
                const imgEl = productCard.querySelector('img');
                const imgSrc = imgEl?.src || 'assets/custom-wardrobes.png';
                const imgAlt = imgEl?.alt || title;

                const spans = Array.from(productCard.querySelectorAll('span'));
                let tag1 = 'Modern Minimalist';
                let tag2 = 'Premium Spec';
                spans.forEach(s => {
                    const txt = s.innerText.trim();
                    if (txt && !txt.includes('From') && !txt.includes('$') && !txt.includes('SPEC') && txt.length < 35) {
                        if (tag1 === 'Modern Minimalist') tag1 = txt;
                        else if (tag2 === 'Premium Spec') tag2 = txt;
                    }
                });

                const subtext = productCard.querySelector('.text-amber-600')?.innerText.trim() || '';
                const descP = Array.from(productCard.querySelectorAll('p')).find(p => !p.classList.contains('text-amber-600'))?.innerText.trim() || 'Bespoke modular joinery layout engineered with precision hardware and soft-close dampers.';
                const price = productCard.querySelector('strong')?.innerText.trim() || '$2,800';

                openProductModal(modal, title, imgSrc, imgAlt, tag1, tag2, subtext, descP, price);
                return;
            }

            // 2. If inside a gallery item (gallery.html)
            const galleryCard = targetEl.closest('.gallery-item');
            if (galleryCard) {
                const title = galleryCard.querySelector('h4, h3')?.innerText.trim() || 'Showroom Project';
                const imgEl = galleryCard.querySelector('img');
                const imgSrc = imgEl?.src || 'assets/custom-wardrobes.png';
                const imgAlt = imgEl?.alt || title;
                const desc = galleryCard.querySelector('p')?.innerText.trim() || 'High precision German CNC execution completed for private residence.';
                const category = galleryCard.querySelector('span')?.innerText.trim() || 'Showroom Gallery';

                open3DViewerModal(modal, title, imgSrc, imgAlt, desc, category);
                return;
            }

            // 3. For Architectural CAD showcase frame or any other image container
            const container = targetEl.closest('.open-modal-trigger') || targetEl;
            const imgEl = container.querySelector('img') || targetEl.querySelector('img') || (targetEl.tagName === 'IMG' ? targetEl : null);
            
            // Prefer currentSrc or src on img element; fallback to container data attribute or architectural frame
            let imgSrc = '';
            if (imgEl) {
                imgSrc = imgEl.currentSrc || imgEl.src || imgEl.getAttribute('src');
            }
            if (!imgSrc) {
                imgSrc = container.dataset.modalImg || 'assets/architectural-design-precision-frame.png';
            }

            const imgAlt = imgEl?.alt || container.dataset.modalTitle || '3D Architectural CAD Walkthrough';
            const title = container.dataset.modalTitle || container.querySelector('h3, h4')?.innerText.trim() || '3D Architectural CAD Walkthrough';
            const desc = container.dataset.modalDesc || container.querySelector('p')?.innerText.trim() || 'Parametric 3D CAD modeling, multi-axis CNC joinery walkthrough, and factory quality control ensuring micron-grade dimensional accuracy.';
            const badge = container.dataset.modalBadge || '3D Architectural CAD Walkthrough';

            open3DViewerModal(modal, title, imgSrc, imgAlt, desc, badge);
        }
    });

    // Handle close modal events (close button, backdrop click, or ESC key)
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.close-modal-btn')) {
            e.preventDefault();
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    });
}

/* Shared helper: renders 3D interactive viewer / CAD walkthrough / gallery lightbox into modal overlay */
function open3DViewerModal(modal, title, imgSrc, imgAlt, desc, badge) {
    if (!modal) return;
    const displayTitle = title || '3D Architectural CAD Walkthrough';
    const displayImg = imgSrc || 'assets/architectural-design-precision-frame.png';
    const displayAlt = imgAlt || displayTitle;
    const displayBadge = badge || '3D Architectural CAD Walkthrough';
    const displayDesc = desc || 'Interactive CAD layout walkthrough displaying micron-grade joinery tolerances and architectural precision.';

    modal.innerHTML = `
        <div class="modal-content bg-white dark:bg-stone-900 max-w-4xl w-full rounded-2xl p-6 md:p-8 relative border border-stone-700 shadow-2xl max-h-[92vh] overflow-y-auto">
            <button class="close-modal-btn absolute top-4 right-4 text-stone-400 hover:text-white text-xl w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center transition z-20">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="mb-4 pr-10">
                <span class="text-[10px] font-extrabold uppercase tracking-widest text-amber-500 block mb-1">Photorealistic CAD Walkthrough</span>
                <h3 class="text-xl sm:text-2xl font-bold font-heading text-stone-900 dark:text-white">${displayTitle}</h3>
            </div>

            <div class="relative w-full aspect-video bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl group">
                <img src="${displayImg}" alt="${displayAlt}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                
                <!-- Center Interactive Tag -->
                <div class="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                    <span class="bg-stone-900/90 text-amber-400 border border-amber-500/40 text-xs font-bold px-4 py-2 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2">
                        <i class="fa-solid fa-cube text-amber-400"></i> High-Resolution CAD Model Walkthrough
                    </span>
                </div>

                <!-- Top Left Badge -->
                <div class="absolute top-3.5 left-3.5 bg-stone-900/90 text-amber-400 text-[10px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-stone-700/80 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>${displayBadge}</span>
                </div>

                <!-- Bottom Right Badge -->
                <div class="absolute bottom-3.5 right-3.5 bg-stone-900/90 text-stone-300 text-[10px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-stone-700/80">
                    Precision Tolerances &lt; 0.5mm
                </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5 pt-4 border-t border-stone-200 dark:border-stone-800">
                <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl">${displayDesc}</p>
                <a href="contact.html" class="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl shadow-lg shadow-amber-600/30 transition transform hover:scale-105 whitespace-nowrap">
                    Consult Engineering Team <i class="fa-solid fa-arrow-right ml-2 text-xs"></i>
                </a>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    showToast('3D Interactive Viewer', `Loaded CAD view for ${displayTitle}`, 'fa-cube');
}

/* Shared helper: renders product spec content into modal overlay */
function openProductModal(modal, title, imgSrc, imgAlt, tag1, tag2, subtext, descP, price) {
    modal.innerHTML = `
        <div class="modal-content bg-white dark:bg-stone-900 max-w-3xl w-full rounded-2xl p-6 md:p-8 relative border border-stone-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button class="close-modal-btn absolute top-4 right-4 text-stone-400 hover:text-white text-xl w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center transition z-10">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div class="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-inner group">
                    <img src="${imgSrc}" alt="${imgAlt}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <div class="absolute top-3 left-3 flex flex-wrap gap-2">
                        <span class="bg-stone-900/90 text-amber-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full backdrop-blur-md border border-stone-700">
                            ${tag1}
                        </span>
                        ${tag2 && tag2 !== tag1 ? `<span class="bg-amber-600/90 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full backdrop-blur-md">${tag2}</span>` : ''}
                    </div>
                    <div class="absolute bottom-3 left-3 bg-black/70 text-stone-200 text-[10px] font-semibold px-3 py-1.5 rounded-lg backdrop-blur-md flex items-center border border-white/10">
                        <i class="fa-solid fa-cube text-amber-400 mr-1.5"></i> Interactive 3D Specs Ready
                    </div>
                </div>

                <div class="flex flex-col justify-between space-y-4">
                    <div>
                        ${subtext ? `<span class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">${subtext}</span>` : ''}
                        <h3 class="text-2xl font-bold font-heading text-stone-900 dark:text-white mb-2">${title}</h3>
                        <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">${descP}</p>

                        <div class="bg-stone-50 dark:bg-stone-800/70 p-4 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2 text-xs text-stone-700 dark:text-stone-300">
                            <div class="flex justify-between border-b border-stone-200 dark:border-stone-700/60 pb-1.5">
                                <span class="text-stone-500 font-medium">Core Board:</span>
                                <span class="font-semibold text-stone-900 dark:text-white">CARB Phase 2 Moisture Resistant HD</span>
                            </div>
                            <div class="flex justify-between border-b border-stone-200 dark:border-stone-700/60 pb-1.5">
                                <span class="text-stone-500 font-medium">Hinges &amp; Slides:</span>
                                <span class="font-semibold text-stone-900 dark:text-white">Blum Motion Soft-Close (110°)</span>
                            </div>
                            <div class="flex justify-between border-b border-stone-200 dark:border-stone-700/60 pb-1.5">
                                <span class="text-stone-500 font-medium">Illumination:</span>
                                <span class="font-semibold text-stone-900 dark:text-white">Warm 3000K Motion Sensor Strip</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-stone-500 font-medium">Warranty:</span>
                                <span class="font-semibold text-amber-600 dark:text-amber-400">10-Year Comprehensive</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                        <div>
                            <span class="block text-[10px] uppercase text-stone-500 font-bold tracking-wider">Starting Price</span>
                            <span class="text-xl font-extrabold text-stone-900 dark:text-white">${price}</span>
                        </div>
                        <a href="contact.html" class="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl shadow-lg shadow-amber-600/30 transition transform hover:scale-105 flex items-center">
                            Request Custom Quote <i class="fa-solid fa-arrow-right ml-2 text-xs"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    showToast('Product Specifications', `Loaded specs for ${title}`, 'fa-info-circle');
}

/* -------------------------------------------------------------------------- */
/* 11. Coming Soon Countdown Timer                                             */
/* -------------------------------------------------------------------------- */
function initCountdownTimer() {
    const daysEl = document.getElementById('timer-days');
    if (!daysEl) return;

    const targetDate = new Date().getTime() + (45 * 24 * 60 * 60 * 1000);

    setInterval(() => {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff < 0) return;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        const hoursEl = document.getElementById('timer-hours');
        const minsEl = document.getElementById('timer-mins');
        const secsEl = document.getElementById('timer-secs');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
        if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
    }, 1000);
}

/* -------------------------------------------------------------------------- */
/* 11.5 Name Field Validation Engine                                          */
/* -------------------------------------------------------------------------- */
function validateNameField(input, showErrorToast = false) {
    if (!input) return true;
    const rawVal = input.value;
    const value = rawVal.trim();
    
    // Check if required and empty
    if (!value) {
        if (input.hasAttribute('required')) {
            const errorMsg = 'Please enter your full name.';
            input.setCustomValidity(errorMsg);
            if (showErrorToast) showToast('Missing Name', errorMsg, 'fa-circle-exclamation');
            return false;
        }
        input.setCustomValidity('');
        return true;
    }
    
    // 1. Strictly block numbers
    if (/\d/.test(value)) {
        const errorMsg = 'Name cannot contain numbers. Only letters (A-Z, a-z) and spaces are allowed.';
        input.setCustomValidity(errorMsg);
        if (showErrorToast) showToast('Invalid Name', errorMsg, 'fa-triangle-exclamation');
        return false;
    }

    // 2. Strictly block special characters, accents, and symbols
    if (/[^A-Za-z\s]/.test(value)) {
        const errorMsg = 'Special characters and symbols are not allowed. Please enter letters and spaces only.';
        input.setCustomValidity(errorMsg);
        if (showErrorToast) showToast('Invalid Name', errorMsg, 'fa-triangle-exclamation');
        return false;
    }
    
    // 3. Check minimum length (must be at least 2 characters)
    if (value.length < 2) {
        const errorMsg = 'Name must be at least 2 letters long.';
        input.setCustomValidity(errorMsg);
        if (showErrorToast) showToast('Invalid Name', errorMsg, 'fa-triangle-exclamation');
        return false;
    }
    
    // 4. Check that it contains at least 2 alphabetic characters
    const letterCount = (value.match(/[A-Za-z]/g) || []).length;
    if (letterCount < 2) {
        const errorMsg = 'Name must contain at least 2 letters.';
        input.setCustomValidity(errorMsg);
        if (showErrorToast) showToast('Invalid Name', errorMsg, 'fa-triangle-exclamation');
        return false;
    }

    // 5. Check proper format (letters with single spaces between names)
    const nameRegex = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;
    if (!nameRegex.test(value)) {
        const errorMsg = 'Please enter a valid name using letters and spaces only.';
        input.setCustomValidity(errorMsg);
        if (showErrorToast) showToast('Invalid Name', errorMsg, 'fa-triangle-exclamation');
        return false;
    }
    
    input.setCustomValidity('');
    return true;
}

function setupNameFieldController(input) {
    if (!input || input.dataset.nameValidated === 'true') return;
    input.dataset.nameValidated = 'true';

    if (!input.getAttribute('minlength')) input.setAttribute('minlength', '2');
    if (!input.getAttribute('maxlength')) input.setAttribute('maxlength', '50');
    input.setAttribute('pattern', '^[A-Za-z\\s]{2,50}$');
    input.setAttribute('title', 'Please enter letters and spaces only (A-Z, a-z, no numbers or special characters)');
    input.setAttribute('autocomplete', 'name');
    
    const allowedNavKeys = new Set([
        'Backspace', 'Tab', 'Enter', 'Delete', 'Escape',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End'
    ]);

    let promptTimeout = null;
    function showNamePrompt(msg = 'Numbers and special characters are not allowed. Please enter letters and spaces only.') {
        input.setCustomValidity(msg);
        input.reportValidity();
        if (typeof showToast === 'function') {
            showToast('Letters Only', msg, 'fa-triangle-exclamation', 3000);
        }
        clearTimeout(promptTimeout);
        promptTimeout = setTimeout(() => {
            if (!input.value || input.value.trim().length === 0) {
                input.setCustomValidity(input.hasAttribute('required') ? 'Please enter your full name.' : '');
            } else {
                validateNameField(input, false);
            }
        }, 2500);
    }

    // 1. Block numbers, symbols, and special characters on keydown (desktop & hardware keyboards)
    input.addEventListener('keydown', (e) => {
        if (allowedNavKeys.has(e.key) || e.ctrlKey || e.metaKey || e.altKey) {
            return;
        }

        // Space validation: prevent leading space or consecutive spaces
        if (e.key === ' ') {
            if (!input.value || input.selectionStart === 0) {
                e.preventDefault();
                showNamePrompt('Name cannot start with a space. Please enter letters only.');
                return;
            }
            const pos = input.selectionStart;
            if (pos !== null && input.value[pos - 1] === ' ') {
                e.preventDefault();
                showNamePrompt('Consecutive spaces are not allowed. Please enter a single space between names.');
                return;
            }
            input.setCustomValidity('');
            return;
        }

        // Single printable character: allow only A-Z and a-z
        if (e.key.length === 1) {
            const isLetter = /^[A-Za-z]$/.test(e.key);
            if (!isLetter) {
                e.preventDefault();
                showNamePrompt('Numbers and special characters are not allowed. Please enter letters (A-Z, a-z) and spaces only.');
            } else {
                input.setCustomValidity('');
            }
        }
    });

    // 2. Block invalid characters before insertion (mobile virtual keyboards)
    input.addEventListener('beforeinput', (e) => {
        if (!e.data) return;

        // Disallow numbers or special characters
        if (/[^A-Za-z\s]/.test(e.data)) {
            e.preventDefault();
            showNamePrompt('Numbers and special characters are not allowed. Please enter letters (A-Z, a-z) and spaces only.');
            return;
        }

        // Disallow leading or consecutive spaces
        if (e.data === ' ') {
            if (!input.value || input.selectionStart === 0) {
                e.preventDefault();
                showNamePrompt('Name cannot start with a space. Please enter letters only.');
                return;
            }
            const pos = input.selectionStart;
            if (pos !== null && input.value[pos - 1] === ' ') {
                e.preventDefault();
                showNamePrompt('Consecutive spaces are not allowed.');
                return;
            }
        }
    });

    // 3. Fallback for legacy keypress
    input.addEventListener('keypress', (e) => {
        const char = String.fromCharCode(e.which || e.keyCode);
        if (!/^[A-Za-z\s]$/.test(char)) {
            e.preventDefault();
            showNamePrompt('Numbers and special characters are not allowed. Please enter letters only.');
        }
    });

    // 4. Automatically strip numbers and special characters on paste
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text') || '';
        const cleanLetters = pastedText.replace(/[^A-Za-z\s]/g, '').replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
        if (cleanLetters.length !== pastedText.length) {
            showNamePrompt('Numbers and special characters were automatically removed. Only letters and spaces are allowed.');
        }
        if (!cleanLetters) return;

        const start = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? input.value.length;
        const current = input.value;
        const maxLen = parseInt(input.getAttribute('maxlength') || '50', 10);
        const nextVal = (current.substring(0, start) + cleanLetters + current.substring(end)).slice(0, maxLen);
        input.value = nextVal;
        const nextPos = Math.min(start + cleanLetters.length, nextVal.length);
        input.setSelectionRange(nextPos, nextPos);
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // 5. Automatically strip invalid characters on drag-and-drop
    input.addEventListener('drop', (e) => {
        e.preventDefault();
        const dropText = (e.dataTransfer && e.dataTransfer.getData('text')) || '';
        const cleanLetters = dropText.replace(/[^A-Za-z\s]/g, '').replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
        if (cleanLetters.length !== dropText.length) {
            showNamePrompt('Numbers and special characters were automatically removed. Only letters and spaces are allowed.');
        }
        if (!cleanLetters) return;

        const start = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? input.value.length;
        const current = input.value;
        const maxLen = parseInt(input.getAttribute('maxlength') || '50', 10);
        const nextVal = (current.substring(0, start) + cleanLetters + current.substring(end)).slice(0, maxLen);
        input.value = nextVal;
        const nextPos = Math.min(start + cleanLetters.length, nextVal.length);
        input.setSelectionRange(nextPos, nextPos);
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // 6. Real-time input sanitization & validation (catches IME, autocorrect, autofill)
    input.addEventListener('input', () => {
        const raw = input.value;
        const maxLen = parseInt(input.getAttribute('maxlength') || '50', 10);
        const clean = raw.replace(/[^A-Za-z\s]/g, '').replace(/^\s+/, '').replace(/\s{2,}/g, ' ').slice(0, maxLen);
        if (raw !== clean) {
            const start = input.selectionStart;
            input.value = clean;
            if (start !== null) {
                const nextPos = Math.min(start, clean.length);
                input.setSelectionRange(nextPos, nextPos);
            }
            showNamePrompt('Numbers and special characters were automatically removed. Only letters and spaces are allowed.');
        } else {
            validateNameField(input, false);
        }
    });
    
    // 7. On blur, trim whitespace and validate
    input.addEventListener('blur', () => {
        input.value = input.value.trim();
        validateNameField(input, false);
        if (!input.checkValidity() && input.value.length > 0) {
            input.reportValidity();
        }
    });
}

function initNameValidation() {
    const nameSelectors = [
        'input[name="fullName"]',
        'input[name="name"]',
        'input[id*="name"]',
        'input[placeholder*="Name"]',
        'input[placeholder*="Vance"]',
        'input[placeholder*="Doe"]',
        'input[placeholder*="Mitchell"]'
    ];
    
    const nameInputs = document.querySelectorAll(nameSelectors.join(','));
    nameInputs.forEach(input => {
        setupNameFieldController(input);
    });
}

/* -------------------------------------------------------------------------- */
/* 11.6 Email Field Validation Engine                                         */
/* -------------------------------------------------------------------------- */
function validateEmailField(input, showErrorToast = false) {
    if (!input) return true;
    const rawVal = input.value;
    const value = rawVal.trim();
    
    // Check if required and empty
    if (!value) {
        if (input.hasAttribute('required')) {
            const errorMsg = 'Please enter your email address.';
            input.setCustomValidity(errorMsg);
            if (showErrorToast) showToast('Missing Email', errorMsg, 'fa-circle-exclamation');
            return false;
        }
        input.setCustomValidity('');
        return true;
    }
    
    // Check for spaces
    if (/\s/.test(value)) {
        const errorMsg = 'Email address cannot contain spaces.';
        input.setCustomValidity(errorMsg);
        if (showErrorToast) showToast('Invalid Email', errorMsg, 'fa-triangle-exclamation');
        return false;
    }
    
    // Check for @ symbol
    if (!value.includes('@')) {
        const errorMsg = 'Email address must include an "@" symbol.';
        input.setCustomValidity(errorMsg);
        if (showErrorToast) showToast('Invalid Email', errorMsg, 'fa-triangle-exclamation');
        return false;
    }
    
    // Strict RFC 5322 compatible regex with mandatory valid domain and TLD of at least 2 chars
    // Rejects ice@g, user@domain, user@.com, user@domain..com
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value) || value.includes('..') || value.includes('@.') || value.startsWith('.')) {
        const errorMsg = 'Please enter a valid email address with a domain (e.g. name@domain.com).';
        input.setCustomValidity(errorMsg);
        if (showErrorToast) showToast('Invalid Email', errorMsg, 'fa-triangle-exclamation');
        return false;
    }
    
    input.setCustomValidity('');
    return true;
}

function initEmailValidation() {
    const emailInputs = document.querySelectorAll('input[type="email"], input[name*="email"], input[id*="email"]');
    emailInputs.forEach(input => {
        if (!input.getAttribute('pattern')) {
            input.setAttribute('pattern', '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
        }
        input.setAttribute('title', 'Please enter a valid email address (e.g. name@domain.com)');
        
        input.addEventListener('input', () => {
            validateEmailField(input, false);
        });
        
        input.addEventListener('blur', () => {
            validateEmailField(input, false);
            if (!input.checkValidity() && input.value.trim().length > 0) {
                input.reportValidity();
            }
        });
    });
}

/* -------------------------------------------------------------------------- */
/* 11.7 Phone Number Field Validation Engine                                  */
/* -------------------------------------------------------------------------- */
function validatePhoneField(input, showErrorToast = false) {
    if (!input) return true;
    const rawVal = input.value;
    const value = rawVal.trim();
    
    // Check if required and empty
    if (!value) {
        if (input.hasAttribute('required')) {
            const errorMsg = 'Please enter your phone number.';
            input.setCustomValidity(errorMsg);
            if (showErrorToast) showToast('Missing Phone Number', errorMsg, 'fa-circle-exclamation');
            return false;
        }
        input.setCustomValidity('');
        return true;
    }
    
    // 1. Explicitly check for alphabetic characters
    if (/[a-zA-Z]/.test(value)) {
        const errorMsg = 'Phone number cannot contain letters or alphabetic characters.';
        input.setCustomValidity(errorMsg);
        if (showErrorToast) showToast('Invalid Phone Number', errorMsg, 'fa-triangle-exclamation');
        return false;
    }
    
    // 2. Check for disallowed special characters (only digits, +, -, (, ), ., and spaces allowed)
    if (/[^0-9+\s\-\(\)\.]/.test(value)) {
        const errorMsg = 'Phone number can only contain numbers and valid symbols (+, -, (, )).';
        input.setCustomValidity(errorMsg);
        if (showErrorToast) showToast('Invalid Phone Number', errorMsg, 'fa-triangle-exclamation');
        return false;
    }
    
    // 3. Country code '+' can only appear once at the beginning
    if (value.includes('+')) {
        if (!value.startsWith('+') || (value.match(/\+/g) || []).length > 1) {
            const errorMsg = 'Country code "+" can only appear once at the beginning of the phone number.';
            input.setCustomValidity(errorMsg);
            if (showErrorToast) showToast('Invalid Phone Number', errorMsg, 'fa-triangle-exclamation');
            return false;
        }
    }
    
    // 4. Count total digits (standard phone numbers require between 7 and 15 digits)
    const digits = value.replace(/\D/g, '');
    if (digits.length < 7) {
        const errorMsg = 'Please enter a valid phone number with at least 7 digits.';
        input.setCustomValidity(errorMsg);
        if (showErrorToast) showToast('Invalid Phone Number', errorMsg, 'fa-triangle-exclamation');
        return false;
    }
    if (digits.length > 15) {
        const errorMsg = 'Phone number cannot exceed 15 digits.';
        input.setCustomValidity(errorMsg);
        if (showErrorToast) showToast('Invalid Phone Number', errorMsg, 'fa-triangle-exclamation');
        return false;
    }
    
    input.setCustomValidity('');
    return true;
}

function initPhoneValidation() {
    const phoneSelectors = [
        'input[type="tel"]',
        'input[name*="phone"]',
        'input[name*="tel"]',
        'input[id*="phone"]',
        'input[placeholder*="000-0000"]',
        'input[placeholder*="555"]'
    ];
    
    const phoneInputs = document.querySelectorAll(phoneSelectors.join(','));
    phoneInputs.forEach(input => {
        if (!input.getAttribute('pattern')) {
            input.setAttribute('pattern', '^[+]?[0-9\\s\\-\\(\\)\\.]{7,20}$');
        }
        if (!input.getAttribute('title')) {
            input.setAttribute('title', 'Please enter a valid phone number with 7 to 15 digits (numbers only, no letters)');
        }
        if (!input.getAttribute('inputmode')) {
            input.setAttribute('inputmode', 'tel');
        }
        
        // Block typing alphabetic characters on keydown
        input.addEventListener('keydown', (e) => {
            const allowedKeys = ['Backspace', 'Tab', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Escape'];
            if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey || e.altKey) {
                return;
            }
            if (/^[a-zA-Z]$/.test(e.key)) {
                e.preventDefault();
                input.setCustomValidity('Phone number cannot contain letters or alphabetic characters.');
                input.reportValidity();
            }
        });
        
        input.addEventListener('input', () => {
            validatePhoneField(input, false);
        });
        
        input.addEventListener('blur', () => {
            validatePhoneField(input, false);
            if (!input.checkValidity() && input.value.trim().length > 0) {
                input.reportValidity();
            }
        });
    });
}

/* -------------------------------------------------------------------------- */
/* 12. Form Submissions Engine                                                */
/* -------------------------------------------------------------------------- */
function initFormSubmissions() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check native HTML5 form validity
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            // Validate all name fields in this form
            const nameInputs = form.querySelectorAll('input[name="fullName"], input[name="name"], input[id*="name"], input[placeholder*="Name"], input[placeholder*="Vance"], input[placeholder*="Doe"], input[placeholder*="Mitchell"]');
            for (const nameInput of nameInputs) {
                if (!validateNameField(nameInput, true)) {
                    nameInput.reportValidity();
                    nameInput.focus();
                    return;
                }
            }
            
            // Validate all email fields in this form
            const emailInputs = form.querySelectorAll('input[type="email"], input[name*="email"], input[id*="email"]');
            for (const emailInput of emailInputs) {
                if (!validateEmailField(emailInput, true)) {
                    emailInput.reportValidity();
                    emailInput.focus();
                    return;
                }
            }
            
            // Validate all phone fields in this form
            const phoneInputs = form.querySelectorAll('input[type="tel"], input[name*="phone"], input[name*="tel"], input[id*="phone"]');
            for (const phoneInput of phoneInputs) {
                if (!validatePhoneField(phoneInput, true)) {
                    phoneInput.reportValidity();
                    phoneInput.focus();
                    return;
                }
            }
            
            const formId = form.id || 'general';
            
            if (formId === 'cost-estimator-form') {
                showToast('Estimate Saved', 'Your wardrobe configuration has been calculated and sent to your client manager.', 'fa-calculator');
            } else if (formId.includes('contact') || formId.includes('inquiry')) {
                showToast('Message Sent', 'Thank you! A senior designer will contact you within 24 hours.', 'fa-paper-plane');
            } else if (formId.includes('newsletter') || formId.includes('subscribe')) {
                showToast('Subscribed!', 'You have successfully subscribed to the MODULARIS luxury design journal.', 'fa-envelope-open-text');
            } else if (formId.includes('login')) {
                const targetUrl = form.getAttribute('action') || (form.action && form.action.includes('admin') ? 'admin-dashboard.html' : 'client-dashboard.html');
                const isAdmin = targetUrl.includes('admin');
                showToast('Authenticating', isAdmin ? 'Logging into Admin Command Center...' : 'Logging into your Client Portal Dashboard...', isAdmin ? 'fa-shield-halved' : 'fa-user-check');
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 1000);
            } else if (formId.includes('register')) {
                showToast('Account Created', 'Welcome to MODULARIS! Redirecting to your project dashboard...', 'fa-user-plus');
                setTimeout(() => window.location.href = 'client-dashboard.html', 1200);
            } else {
                showToast('Request Received', 'Your consultation request has been logged successfully.', 'fa-circle-check');
            }

            form.reset();
        });
    });
}

/* -------------------------------------------------------------------------- */
/* 13. Generic Link & Button Click Handler                                   */
/* -------------------------------------------------------------------------- */
function initGenericButtonHandlers() {
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');

        if (anchor && anchor.getAttribute('href') === '#') {
            e.preventDefault();
            
            if (anchor.querySelector('.fa-instagram') || anchor.querySelector('.fa-pinterest') || anchor.querySelector('.fa-houzz') || anchor.querySelector('.fa-facebook') || anchor.querySelector('.fa-twitter') || anchor.querySelector('.fa-linkedin')) {
                showToast('Social Media Link', 'Opening official MODULARIS social channel...', 'fa-share-nodes');
                return;
            }

            const text = anchor.textContent.trim().toLowerCase();
            if (text.includes('privacy') || text.includes('terms') || text.includes('warranty')) {
                showToast('Legal Terms', `Opening ${anchor.textContent.trim()} section...`, 'fa-shield-halved');
                return;
            }

            showToast('Interactive Demo', 'Action triggered! Exploring bespoke cabinet customization options.', 'fa-wand-magic-sparkles');
        }
    });
}

/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* 15. Dynamic Service Details Page Renderer                                  */
/* -------------------------------------------------------------------------- */
function initServiceDetailsDynamic() {
    const bannerTitle = document.getElementById('service-banner-title');
    const bannerDesc = document.getElementById('service-banner-desc');
    const mainImg = document.getElementById('service-main-img');
    const mainHeading = document.getElementById('service-main-heading');
    const mainText = document.getElementById('service-main-text');
    const featuresGrid = document.getElementById('service-features-grid');
    const specsTitle = document.getElementById('service-specs-title');
    const specsDesc = document.getElementById('service-specs-desc');
    const specsGrid = document.getElementById('service-specs-grid');
    const packagesHeading = document.getElementById('service-packages-heading');
    const packagesTbody = document.getElementById('service-packages-tbody');

    if (!bannerTitle && !mainImg) return;

    const servicesData = {
        'wardrobes': {
            title: 'Modular Wardrobes (Hinged, Sliding & Walk-In)',
            subtitle: 'Tailor-made luxury wardrobe solutions configured precisely to your wardrobe inventory and bedroom layout.',
            heading: 'Factory-Manufactured Modular Wardrobe Solutions',
            text: 'Direct-from-factory bespoke wardrobe systems engineered with computerized 5-axis CNC accuracy. We eliminate messy carpentry with pre-drilled 32mm system carcasses, 18mm HDHMR core panels, and zero-joint PUR edge-banding that protects against seasonal warping and humidity. Fully personalized with German soft-close running hardware, pull-out organizers, and integrated 3000K warm LED illumination.',
            img: 'assets/custom-wardrobes.png',
            features: [
                { icon: 'fa-lightbulb', title: 'Smart Motion Lighting', desc: 'Concealed warm 3000K LED aluminum profiles with motion sensor triggers.' },
                { icon: 'fa-gem', title: 'Custom Accessory Trays', desc: 'Italian velvet-lined drawers for watches, sunglasses, and jewelry.' },
                { icon: 'fa-arrows-up-to-line', title: 'Hydraulic Lift Rods', desc: 'Easily lower high hanging suits without needing step stools.' },
                { icon: 'fa-shield', title: '10-Year Warranty', desc: 'Full structural coverage on all frames, hinges, and sliding tracks.' }
            ],
            specsTitle: 'Ergonomic Compartment Sizing Guidelines',
            specsDesc: 'Our wardrobe architects design internal layouts based on standardized clothing hanging standards:',
            specs: [
                { val: '160 cm (63")', label: 'Long Coats & Gowns' },
                { val: '110 cm (43")', label: 'Suit Jackets & Shirts' },
                { val: '90 cm (35")', label: 'Trouser Pull-outs' },
                { val: '35 cm (14")', label: 'Folded Sweater Shelves' }
            ],
            packages: [
                { tier: 'Essential Modular', size: '6 ft - 8 ft Width', hardware: 'CARB-2 Melamine, 110° Soft-Close Hinges', price: '$180 / ft' },
                { tier: 'Signature Custom', size: '8 ft - 12 ft Width', hardware: '18mm HDHMR, Blumotion Hinges, LED Trays', price: '$280 / ft' },
                { tier: 'Royal Walk-In Luxury', size: 'Full Master Suite', hardware: 'Glass Vitrines, Island Chest, Velvet Trays', price: '$420 / ft' }
            ]
        },
        'kitchen': {
            title: 'Modular Kitchen Cabinetry',
            subtitle: 'High-performance modular kitchen cabinetry engineered to withstand water, steam, and heavy culinary wear.',
            heading: 'Ergonomic Factory-Engineered Modular Kitchens',
            text: 'High-performance modular kitchen cabinetry manufactured to endure heavy heat, oil, and continuous water exposure. Our base sink units are built from 100% Boiling Water Proof (BWP) Marine Grade 710 Plywood sealed with industrial PUR hot-melt banding. Complete with ergonomic Blum Tandembox drawers, Aventos bi-fold lift-up wall cabinets, and high-capacity pull-out pantry larders.',
            img: 'assets/ergonomic-modular-kitchen.png',
            features: [
                { icon: 'fa-droplet-slash', title: '100% Waterproof Base', desc: 'BWP Marine 710 plywood sink carcass with PUR zero-joint edge sealing.' },
                { icon: 'fa-box-archive', title: 'Blum Tandembox Drawers', desc: '50kg dynamic load capacity with smooth synchronized Blumotion gliding.' },
                { icon: 'fa-angles-up', title: 'Aventos Bi-Fold Lifts', desc: 'Effortless overhead cabinet access stopping at any desired height.' },
                { icon: 'fa-shield-halved', title: 'Heat & Stain Resistant', desc: 'Anti-scratch acrylic and PU lacquer surfaces built for high-heat cooking.' }
            ],
            specsTitle: 'Kitchen Ergonomics & Work Triangle Standards',
            specsDesc: 'Engineered according to the golden culinary workflow triangle (Sink, Cooktop, Refrigerator):',
            specs: [
                { val: '850-900 mm', label: 'Countertop Working Height' },
                { val: '600 mm (24")', label: 'Base Cabinet Depth' },
                { val: '350 mm (14")', label: 'Wall Cabinet Depth' },
                { val: '600 mm (24")', label: 'Counter to Wall Clearance' }
            ],
            packages: [
                { tier: 'Straight / Parallel', size: 'Compact & Galley Layouts', hardware: 'Anti-Scratch Acrylic, Soft-Close Tandem Drawers', price: '$220 / ft' },
                { tier: 'L-Shaped Luxury', size: 'Medium Open-Plan Kitchens', hardware: '100% BWP Marine Base, Blum Tandembox & Trays', price: '$320 / ft' },
                { tier: 'Gourmet Island Suite', size: 'Full Luxury Kitchen + Island', hardware: 'PU Lacquer, Aventos Bi-Fold Lifts, Tall Larder', price: '$480 / ft' }
            ]
        },
        'tv': {
            title: 'TV Showcase & Media Units',
            subtitle: 'Floating consoles, fluted acoustic timber backdrops, and concealed audiovisual cable infrastructure.',
            heading: 'Architectural Media Consoles & Living Joinery',
            text: 'Modern living room entertainment architecture engineered for seamless audiovisual integration. Featuring wall-hung floating credenzas with heavy-duty hidden brackets, CNC-fluted acoustic wooden wall slats, and tempered tinted glass display vitrines. Internal cable management chases keep power bricks, HDMI lines, and gaming consoles completely hidden.',
            img: 'assets/tv-showcase-media-unit.jpg',
            features: [
                { icon: 'fa-anchor', title: '100kg Heavy Cleat Wall', desc: 'Concealed steel bracket suspension engineered for ultra-heavy floating units.' },
                { icon: 'fa-bars-staggered', title: 'CNC Fluted Feature Slats', desc: 'Acoustic sound-dampening fluted timber panels in natural oak and walnut.' },
                { icon: 'fa-network-wired', title: 'Concealed Cable Infras', desc: 'Internal raceways for HDMI, optical cables, power bricks & gaming consoles.' },
                { icon: 'fa-gem', title: 'Smoked Glass Vitrines', desc: 'Integrated 3000K warm LED channels and tinted bronze display cabinets.' }
            ],
            specsTitle: 'Entertainment Center Engineering Standards',
            specsDesc: 'Optimized viewing geometry and AV equipment thermal ventilation:',
            specs: [
                { val: '450 mm (18")', label: 'Floating Console Depth' },
                { val: '105 cm (42")', label: 'Screen Center Eye Level' },
                { val: '25 mm Pitch', label: 'Acoustic Wood Slats' },
                { val: '60 mm Chase', label: 'Concealed Wire Conduit' }
            ],
            packages: [
                { tier: 'Floating Credenza', size: '6 ft Wall-Hung Unit', hardware: 'Push-to-open doors, concealed heavy cleats, cable duct', price: '$850' },
                { tier: 'Fluted Feature Wall', size: '8 ft x 8 ft Feature Wall', hardware: 'CNC acoustic timber slats + 7ft floating console', price: '$1,650' },
                { tier: 'Full Media Suite', size: 'Full Wall Architecture', hardware: 'Fluted wall, smoked vitrines, LED conduits, shelf bays', price: '$2,800' }
            ]
        },
        'living': {
            title: 'Living Room Solutions & Partitions',
            subtitle: 'Double-sided partition room dividers, display vitrines, decorative accent wall panelling, and entryway consoles.',
            heading: 'Living Room Joinery & Architectural Divider Solutions',
            text: 'Harmonious living room joinery that defines spaces without obstructing natural light. We manufacture bespoke double-sided partition divider units, floating display bookcases, integrated entrance foyer consoles with shoe storage, and architectural wall panelling with concealed push-to-open doors.',
            img: 'assets/living-consoles-vanities-storage.png',
            features: [
                { icon: 'fa-arrows-split-up-and-left', title: 'Dual-Sided Dividers', desc: 'Open-shelved partitions that zone spaces while allowing sunlight to flow.' },
                { icon: 'fa-book-open', title: 'Vitrine Bookcases', desc: 'Anodized aluminum glass vitrines with warm recessed LED illumination.' },
                { icon: 'fa-door-open', title: 'Flush Hidden Doors', desc: 'Concealed magnetic latch doors blending smoothly into timber wall cladding.' },
                { icon: 'fa-shoe-prints', title: 'Foyer Shoe Consoles', desc: 'Ventilated entry consoles with hidden key niches and brass coat hooks.' }
            ],
            specsTitle: 'Living Room Joinery & Spatial Standards',
            specsDesc: 'Precision architectural joinery designed for flow, acoustics, and elegance:',
            specs: [
                { val: '300-400 mm', label: 'Divider Partition Depth' },
                { val: '2.4 - 2.8 m', label: 'Ceiling Partition Height' },
                { val: '350 mm (14")', label: 'Vitrine Bookcase Spacing' },
                { val: '150 mm Toe', label: 'Floating Base Kick Niche' }
            ],
            packages: [
                { tier: 'Foyer Entry Console', size: '4 ft - 5 ft Entryway', hardware: 'Key niche, mirror backing, soft-close shoe drawers', price: '$750' },
                { tier: 'Divider Partition', size: '6 ft - 8 ft Room Screen', hardware: 'Dual-sided open display shelves with timber slats', price: '$1,450' },
                { tier: 'Vitrine Bookcase', size: 'Full Living Wall Unit', hardware: 'Aluminum glass display, integrated sensor warm LEDs', price: '$2,400' }
            ]
        },
        'dining': {
            title: 'Dining Room Cabinetry & Bar Units',
            subtitle: 'Crockery display vitrines with warm LED lighting, buffet sideboards with quartz serving tops, and stemware bar counters.',
            heading: 'Custom Dining Room Joinery & Crockery Vitrines',
            text: 'Factory-finished dining room joinery designed to elevate dinner gatherings and everyday dining. Custom-built crockery units feature tempered glass doors, warm internal downlighting, and velvet-padded cutlery organizers. Complementary buffet credenzas provide heat-resistant quartz stone tops for hot serving dishes.',
            img: 'assets/dining-room-solutions.png',
            features: [
                { icon: 'fa-wine-glass', title: 'Stemware & Wine Rack', desc: 'Suspended brass stemware hangers and temperature-stable bottle cradles.' },
                { icon: 'fa-shield', title: 'Heat-Proof Quartz Top', desc: 'Durable 20mm quartz stone serving countertops for warm dinner platters.' },
                { icon: 'fa-gem', title: 'Tempered Glass Vitrines', desc: '3000K warm downlights accentuating fine china and crystal glassware.' },
                { icon: 'fa-feather', title: 'Velvet Cutlery Inserts', desc: 'Custom divider compartments lined with soft scratch-free felt lining.' }
            ],
            specsTitle: 'Dining Cabinetry & Service Dimensions',
            specsDesc: 'Ergonomically dimensioned for comfortable serving and entertaining:',
            specs: [
                { val: '900 mm (36")', label: 'Buffet Sideboard Height' },
                { val: '450 mm (18")', label: 'Sideboard Serving Depth' },
                { val: '380 mm (15")', label: 'Crockery Vitrine Depth' },
                { val: '20 mm Quartz', label: 'Heat-Resistant Top Edge' }
            ],
            packages: [
                { tier: 'Buffet Sideboard', size: '5 ft - 6 ft Sideboard', hardware: '4-door storage + heat-proof quartz serving top', price: '$950' },
                { tier: 'Crockery Vitrine', size: '4 ft x 7 ft Display', hardware: 'Fluted glass doors, 3000K warm LEDs, felt drawers', price: '$1,650' },
                { tier: 'Integrated Bar Suite', size: '6 ft - 8 ft Bar Unit', hardware: 'Wine rack, stemware hangers, mirrored bar niche, drawers', price: '$2,600' }
            ]
        },
        'bedroom': {
            title: 'Bedroom Storage & Hydraulic Beds',
            subtitle: 'Gas-lift hydraulic storage beds, acoustic fluted headboard panels, floating nightstands, and vanity dressers.',
            heading: 'Master Bedroom Storage & Ergonomic Bedding Joinery',
            text: 'Comprehensive bedroom furniture engineered with concealed storage to maintain a serene, clutter-free sanctuary. We manufacture heavy-duty hydraulic gas-lift storage beds that lift effortlessly to reveal under-bed storage for extra bedding, custom acoustic upholstered headboards, and matching floating bedside nightstands.',
            img: 'assets/bedroom-storage.png',
            features: [
                { icon: 'fa-arrows-up-to-line', title: '120N German Gas Struts', desc: 'Effortless fingertip mattress lifting with soft hydraulic damping.' },
                { icon: 'fa-bed', title: 'Acoustic Headboard Wall', desc: 'Sound-dampening fluted timber panels and padded velvet headboards.' },
                { icon: 'fa-bolt', title: 'Wireless Nightstands', desc: 'Floating bedside units with integrated wireless Qi phone chargers.' },
                { icon: 'fa-box-open', title: '1000L Hidden Bed Storage', desc: 'Massive dust-free storage volume for seasonal duvets, pillows, and luggage.' }
            ],
            specsTitle: 'Bedroom Furniture & Storage Dimensions',
            specsDesc: 'Designed for seamless room ergonomics and sleeping comfort:',
            specs: [
                { val: '120N German', label: 'Gas Spring Rating' },
                { val: '350 mm (14")', label: 'Under-Bed Depth Clearance' },
                { val: '120-150 cm', label: 'Headboard Wall Height' },
                { val: '450-500 mm', label: 'Nightstand Level Height' }
            ],
            packages: [
                { tier: 'Queen Hydraulic Bed', size: '60" x 78" Queen Frame', hardware: 'Steel frame, 120N gas springs, underbed storage box', price: '$1,200' },
                { tier: 'King Bed + Headboard', size: '72" x 78" King Suite', hardware: 'Acoustic fluted headboard + hydraulic bed chassis', price: '$2,100' },
                { tier: 'Master Bed Suite', size: 'Complete Bedroom Fit-Out', hardware: 'King bed, fluted wall, 2 floating nightstands & vanity', price: '$3,200' }
            ]
        },
        'pooja': {
            title: 'Pooja Room & Mandir Cabinetry',
            subtitle: 'CNC laser-cut jali lattices, teak/HDHMR units, pull-out bhog trays, and backlit sacred altars.',
            heading: 'Sacred Sanctum Joinery: Factory-Precision Mandir Architecture',
            text: 'Sacred mandir cabinetry harmonizing sacred motifs with CNC industrial accuracy. Built using fire-retardant Corian or HDHMR, intricate laser-cut jali lattices, brass bell inlays, heavy-duty pull-out prasad/bhog trays, and odor-sealed incense drawer compartments with built-in smoke ventilation channels.',
            img: 'assets/pooja-room-mandir.jpg',
            features: [
                { icon: 'fa-om', title: 'Laser-Cut CNC Jali', desc: 'Intricate spiritual lattices cut into Corian or teakwood panels.' },
                { icon: 'fa-fire-extinguisher', title: 'Fire-Safe Materials', desc: 'Heat-resistant Corian altar tops and smoke-vented incense drawers.' },
                { icon: 'fa-sun', title: '2700K Warm Aura LEDs', desc: 'Dimmable holy aura backlighting behind sacred deities.' },
                { icon: 'fa-hands-holding', title: 'Pull-Out Bhog Tray', desc: 'Heavy-duty 40kg telescopic shelf for prasad and diya placement.' }
            ],
            specsTitle: 'Sacred Mandir Vastu & Spatial Standards',
            specsDesc: 'Harmonious proportions compliant with Vastu architectural principles:',
            specs: [
                { val: '800-900 mm', label: 'Altar Platform Height' },
                { val: '450 mm (18")', label: 'Pull-Out Bhog Tray Reach' },
                { val: '12 mm Corian', label: 'CNC Jali Lattice Screen' },
                { val: '2700K Warm', label: 'Spiritual Backlit Aura' }
            ],
            packages: [
                { tier: 'Compact Wall-Hung', size: '3 ft x 4 ft Wall Niche', hardware: 'CNC jali shutter, pull-out bhog tray, warm LED aura', price: '$650' },
                { tier: 'Floor-Standing Mandir', size: '4 ft x 6 ft Mandir Unit', hardware: 'Burma teak veneer, incense drawers, solid brass bells', price: '$1,400' },
                { tier: 'Grand Sacred Sanctum', size: 'Full Room Architecture', hardware: 'Corian CNC backdrop, multi-tier altar, carved pillars', price: '$2,400' }
            ]
        },
        'ceiling': {
            title: 'False Ceiling Designs & Lighting',
            subtitle: 'Saint-Gobain Gyproc false ceilings, decorative wooden rafters, diffused cove LED lighting, and magnetic tracks.',
            heading: 'Architectural False Ceilings & Lighting Integration',
            text: 'Complete architectural false ceiling design and fabrication that elevates ambient interior lighting and thermal comfort. We engineer moisture-resistant Saint-Gobain Gyproc false ceilings, decorative CNC wooden rafter beams, seamless indirect cove LED lighting troughs, and recessed magnetic track light channels.',
            img: 'assets/false-ceiling-designs.png',
            features: [
                { icon: 'fa-lightbulb', title: 'Perimeter Cove LED', desc: 'Diffused shadowless indirect warm lighting around ceiling perimeter.' },
                { icon: 'fa-lines-leaning', title: 'Timber Ceiling Rafters', desc: 'Factory-veneered lightweight hollow beams in natural walnut and oak.' },
                { icon: 'fa-magnet', title: 'Magnetic Track Channels', desc: 'Low-voltage 48V magnetic rails with freely repositionable spotlights.' },
                { icon: 'fa-volume-xmark', title: 'Acoustic Soundproofing', desc: 'High-density mineral wool insulation reducing floor-to-floor noise.' }
            ],
            specsTitle: 'Ceiling Architecture & Lighting Clearances',
            specsDesc: 'Calculated depths ensuring maximum room headroom and thermal insulation:',
            specs: [
                { val: '125-150 mm', label: 'Cove Light Recess Drop' },
                { val: '75 x 50 mm', label: 'Wooden Rafter Cross Section' },
                { val: '48V Low-Volt', label: 'Magnetic Track Channel' },
                { val: '12.5 mm Board', label: 'Saint-Gobain Gyproc Sheet' }
            ],
            packages: [
                { tier: 'Perimeter Cove LED', size: 'Indirect Ambient Coves', hardware: 'Saint-Gobain Gyproc + LED aluminum profile channels', price: '$95 / sq.ft' },
                { tier: 'Wooden Rafter Ceiling', size: 'Linear Timber Beams', hardware: 'Factory-veneered timber rafters with concealed fasteners', price: '$145 / sq.ft' },
                { tier: 'Magnetic Track System', size: 'Architectural Spotlighting', hardware: '48V recessed magnetic track rails + movable fixtures', price: '$190 / sq.ft' }
            ]
        },
        'kids': {
            title: 'Kids Room Solutions & Youth Ergonomics',
            subtitle: 'Storage bunk beds, ergonomic study desks, rounded safety wardrobes, and non-toxic materials.',
            heading: 'Youth Ergonomics: Safe & Playful Modular Kids Rooms',
            text: 'Playful yet durable modular furniture specifically engineered for growing children and teenagers. Built with zero-VOC, non-toxic water-based paints, rounded corner radius edges to prevent playtime injuries, and anti-pinch soft-closing hinges. Includes bunk beds with built-in pull-out trundle drawers, ergonomic study stations, and customizable toy cubbies.',
            img: 'assets/kids-room-solutions.jpg',
            features: [
                { icon: 'fa-shield-heart', title: 'Rounded Safety Edges', desc: '15mm radius smoothed corners eliminating sharp impacts during play.' },
                { icon: 'fa-leaf', title: 'Zero-VOC Certified Paint', desc: 'Non-toxic, odorless water-based lacquers safe for curious toddlers.' },
                { icon: 'fa-stairs', title: 'Staircase Toy Drawers', desc: 'Integrated pull-out storage drawers built into every bunk bed step.' },
                { icon: 'fa-hand', title: 'Anti-Pinch Hinges', desc: 'Blum soft-closing dampers protecting little fingers from sudden slams.' }
            ],
            specsTitle: 'Youth Ergonomics & Safety Dimensions',
            specsDesc: 'Child development ergonomic dimensions for comfort and safety:',
            specs: [
                { val: '65-72 cm', label: 'Study Station Desk Height' },
                { val: '900 mm (36")', label: 'Bunk Bed Safety Clearance' },
                { val: '15 mm Radius', label: 'Impact-Safe Rounded Corners' },
                { val: '110° Soft-Close', label: 'Anti-Pinch Blum Hinges' }
            ],
            packages: [
                { tier: 'Study Station', size: '4 ft - 5 ft Study Desk', hardware: 'Ergonomic desk, cable ports, pinboard, bookshelf', price: '$850' },
                { tier: 'Bunk Bed + Staircase', size: 'Twin over Twin Bunk', hardware: 'Solid frame, staircase toy drawers, guard rails', price: '$1,950' },
                { tier: 'Complete Youth Suite', size: 'Full Bedroom Architecture', hardware: 'Bunk bed, study station, rounded corner wardrobe, cubby', price: '$3,800' }
            ]
        },
        'other': {
            title: 'Other Interior Solutions & Utility Joinery',
            subtitle: 'Foyer shoe consoles, concealed laundry cabinetry, moisture-proof floating bathroom vanities, and commercial casework.',
            heading: 'Comprehensive Utility & Architectural Interior Joinery',
            text: 'Specialized custom joinery catering to entryway foyers, utility spaces, bathroom vanities, and commercial interior fit-outs. We manufacture ventilated shoe consoles with deodorizing louvers, stacked laundry cabinetry concealing washers and dryers, quartz-topped moisture-proof bathroom vanities, and commercial hotel/office reception casework.',
            img: 'assets/commercial-hotel-joinery.jpg',
            features: [
                { icon: 'fa-wind', title: 'Louvered Ventilation', desc: 'Concealed airflow louvers for odor-free shoe and laundry storage.' },
                { icon: 'fa-bath', title: 'Steam-Proof Vanities', desc: '100% BWP Marine plywood carcasses sealed against bathroom moisture.' },
                { icon: 'fa-shirt', title: 'Concealed Laundry', desc: 'Stacked cabinetry enclosing washers, dryers, and iron board pullouts.' },
                { icon: 'fa-building', title: 'Heavy-Duty Commercial', desc: 'High-traffic casework for hotel suites, retail display, and offices.' }
            ],
            specsTitle: 'Utility Joinery & Commercial Standards',
            specsDesc: 'High-durability engineered joinery for residential utility and hospitality:',
            specs: [
                { val: '380 mm (15")', label: 'Shoe Console Shelf Depth' },
                { val: '700 mm (28")', label: 'Concealed Washer Depth' },
                { val: '850 mm (34")', label: 'Bathroom Vanity Height' },
                { val: '60 kg Heavy', label: 'Commercial Glide Rating' }
            ],
            packages: [
                { tier: 'Foyer Shoe Console', size: '4 ft - 5 ft Entry Console', hardware: 'Louvered vents, 40+ pair capacity, key niche', price: '$650' },
                { tier: 'Concealed Laundry Unit', size: 'Tall Utility Cabinet', hardware: 'Moisture-proof BWP ply, damper hinges, laundry bins', price: '$1,350' },
                { tier: 'Commercial Joinery', size: 'Retail / Hotel Fit-Out', hardware: 'Executive desks, reception counter, display casework', price: '$2,800+' }
            ]
        },
        'walkin': {
            title: 'Walk-In Dressing Suites & Island Storage',
            subtitle: 'Central accessory islands with velvet-lined watch and ring trays, glass vitrines, and sensor LEDs.',
            heading: 'Bespoke Master Walk-In Dressing Suites',
            text: 'Designed as personal luxury boutiques, our walk-in wardrobe suites integrate central accessory islands with velvet-lined watch and ring trays, anodized bronze aluminum glass vitrines, motion-triggered warm 3000K LED hanging bays, and concealed security safes.',
            img: 'assets/master-walk-in-dressing-suite.jpg',
            features: [
                { icon: 'fa-gem', title: 'Central Jewelry Island', desc: 'Glass-top accessory chest with velvet watch cushions and ring rolls.' },
                { icon: 'fa-door-open', title: 'Smoked Glass Vitrines', desc: 'Anodized bronze aluminum frames with soft 3000K internal vertical illumination.' },
                { icon: 'fa-fingerprint', title: 'Biometric Safe Niche', desc: 'Concealed fingerprint-activated steel lockboxes hidden in lower drawers.' },
                { icon: 'fa-shoe-prints', title: 'Angled Shoe Gallery', desc: 'Integrated 45-degree angled shoe shelves with LED shelf highlight lines.' }
            ],
            specsTitle: 'Walk-In Dressing Suite Sizing Standards',
            specsDesc: 'Architectural proportions for master walk-in wardrobe dressing rooms:',
            specs: [
                { val: '900 mm (36")', label: 'Walkway Clearance Width' },
                { val: '900 x 1200 mm', label: 'Central Island Footprint' },
                { val: '600 mm (24")', label: 'Hanging Wardrobe Depth' },
                { val: '45° Angled', label: 'Boutique Shoe Showcase' }
            ],
            packages: [
                { tier: 'Boutique Walk-In', size: '8 ft x 8 ft Room', hardware: 'Smoked glass vitrines, LED lighting, drawer chests', price: '$4,200' },
                { tier: 'Master Dressing Suite', size: '10 ft x 12 ft Room', hardware: 'Central island chest, velvet jewelry trays, shoe gallery', price: '$7,800' },
                { tier: 'Royal Penthouse Suite', size: 'Full Dressing Wing', hardware: 'Biometric safes, leather linings, bronze vitrines, islands', price: '$12,500+' }
            ]
        },
        'accessory-jewelry': {
            title: 'Italian Velvet Jewelry Trays',
            subtitle: 'Integrated biometric fingerprint locks, soft velvet lining, and watch pillow organizers.',
            heading: 'Biometric Velvet Jewelry & Watch Trays',
            text: 'Engineered with Italian anti-tarnish velvet lining, customizable compartment dividers, and built-in biometric fingerprint security locks. Perfect for luxury watches, rings, necklaces, and delicate accessories.',
            img: 'assets/italian-velvet-jewelry-trays.jpg',
            features: [
                { icon: 'fa-fingerprint', title: 'Biometric Locking', desc: '0.2s ultra-fast fingerprint sensor hidden seamlessly within drawer face.' },
                { icon: 'fa-gem', title: 'Anti-Tarnish Velvet', desc: 'Microfiber Italian velvet preventing oxidation of precious metals.' },
                { icon: 'fa-clock', title: 'Watch Pillows', desc: 'Padded removable watch cushions accommodating timepieces up to 48mm.' },
                { icon: 'fa-shield', title: 'Concealed Installation', desc: 'Hidden undermount drawer slides with smooth soft-close action.' }
            ],
            specsTitle: 'Jewelry Tray Specifications',
            specsDesc: 'Precision engineered dimensions for internal wardrobe drawers:',
            specs: [
                { val: '600-900 mm', label: 'Standard Drawer Width' },
                { val: '75 mm (3")', label: 'Slim Profile Depth' },
                { val: '12 Slots', label: 'Watch Compartments' },
                { val: 'Anti-Tarnish', label: 'Italian Velvet Lining' }
            ],
            packages: [
                { tier: 'Single Layer Tray', size: 'Standard Drawer Insert', hardware: 'Anti-tarnish velvet, 8 watch pillows, ring rows', price: '$350' },
                { tier: 'Biometric Lock Suite', size: 'Security Drawer', hardware: 'Optical fingerprint sensor, motorized latch, velvet tray', price: '$750' },
                { tier: 'Double-Decker Vitrine', size: 'Glass Top Island Drawer', hardware: 'Sliding top tray, lower vault, LED perimeter aura', price: '$1,200' }
            ]
        },
        'accessory-hydraulic': {
            title: 'Hydraulic Pull-Down Hanging Rods',
            subtitle: 'Smooth gas-lift hanging rods bringing upper wardrobe suits down to comfortable arm height.',
            heading: 'Ergonomic Gas-Lift Wardrobe Pull-Down Rods',
            text: 'Maximize high vertical storage space without needing step stools. Heavy-duty 15kg load capacity with soft-close return damping and ergonomic pull handle.',
            img: 'assets/hydraulic-pull-down-rods.jpg',
            features: [
                { icon: 'fa-arrows-up-to-line', title: '15kg Lift Rating', desc: 'Heavy-duty dual gas struts supporting heavy winter overcoats and suits.' },
                { icon: 'fa-hand', title: 'Ergonomic Pull Arm', desc: 'Reinforced center reach rod bringing top rail smoothly down to chest level.' },
                { icon: 'fa-shield-halved', title: 'Dual Damped Motion', desc: 'Controlled speed during pull-down and cushioned hydraulic return.' },
                { icon: 'fa-arrows-left-right', title: 'Width Adjustable', desc: 'Telescopic crossbar expanding from 750mm to 1150mm wardrobe bays.' }
            ],
            specsTitle: 'Pull-Down Mechanism Technical Specs',
            specsDesc: 'Factory tolerances and vertical reach clearances:',
            specs: [
                { val: '15 kg (33 lbs)', label: 'Maximum Load Rating' },
                { val: '750-1150 mm', label: 'Telescopic Width Range' },
                { val: '85 cm (33")', label: 'Pull-Down Arc Stroke' },
                { val: 'German Damped', label: 'Hydraulic Gas Springs' }
            ],
            packages: [
                { tier: 'Standard Gas-Lift', size: '800mm Bay', hardware: '10kg load rating, ergonomic center pull handle', price: '$180' },
                { tier: 'Heavy-Duty Pro', size: '1000mm Bay', hardware: '15kg load rating, dual hydraulic dampers, chrome rail', price: '$260' },
                { tier: 'Motorized Electric', size: '1200mm Master Bay', hardware: 'Push-button motorized lowering, wireless remote, LEDs', price: '$650' }
            ]
        },
        'accessory-shoes': {
            title: 'Sliding Angled Shoe Display Islands',
            subtitle: 'Sliding shoe shelves with heel-stop barriers and warm 3000K LED perimeter illumination.',
            heading: 'Bespoke Boutique Shoe Gallery Islands',
            text: 'Showcase up to 60 pairs of shoes in gallery style. Features 45-degree angled sliding shelves, non-slip aluminum heel stops, and integrated motion-sensor LED lighting.',
            img: 'assets/sliding-angled-shoe-islands.jpg',
            features: [
                { icon: 'fa-shoe-prints', title: '45° Angled Slant', desc: 'Optimal viewing tilt showcasing footwear silhouettes and luxury heels.' },
                { icon: 'fa-grip-lines', title: 'Aluminum Heel Stops', desc: 'Anodized brushed bronze edge bars preventing shoes from sliding forward.' },
                { icon: 'fa-lightbulb', title: 'Integrated LED Line', desc: 'Concealed 3000K warm LED strips highlighting each individual row.' },
                { icon: 'fa-box-archive', title: 'Full Extension Glides', desc: 'Undermount concealed slides bringing back pairs smoothly into view.' }
            ],
            specsTitle: 'Shoe Display Dimension Standards',
            specsDesc: 'Engineered for luxury sneakers, stilettos, boots, and dress shoes:',
            specs: [
                { val: '45° Tilt Angle', label: 'Display Shelf Slope' },
                { val: '25 mm Stop Bar', label: 'Anodized Heel Rest' },
                { val: '220 mm Spacing', label: 'Shoe Shelf Height' },
                { val: '50-60 Pairs', label: 'Master Suite Capacity' }
            ],
            packages: [
                { tier: '4-Tier Pull-Out', size: '3ft Wardrobe Column', hardware: 'Undermount slides, angled oak shelves, aluminum stops', price: '$450' },
                { tier: '6-Tier Illuminated', size: '4ft Wardrobe Column', hardware: 'Integrated 3000K LEDs, bronze heel rails, soft-close', price: '$780' },
                { tier: 'Island Gallery Island', size: 'Central Walk-In Unit', hardware: 'Dual-sided angled display, tempered glass top, 60 pairs', price: '$1,850' }
            ]
        },
        '3d-modeling': {
            title: '3D Laser Survey & CAD Space Modeling',
            subtitle: 'Interactive photorealistic 3D visualization and virtual reality walkthroughs before manufacturing.',
            heading: 'Precision 3D CAD & VR Space Modeling',
            text: 'Visualize your modular joinery in millimeter-exact photorealistic 3D before a single panel is cut. Rotate materials, test lighting configurations, and explore layout variations interactively.',
            img: 'assets/architectural-design-precision-frame.png',
            features: [
                { icon: 'fa-cube', title: 'Photorealistic VR', desc: '360-degree immersive virtual reality walk-through of your custom space.' },
                { icon: 'fa-ruler-combined', title: '0.1mm Laser Accuracy', desc: 'Direct digital translation of on-site laser measurements to CAD blueprints.' },
                { icon: 'fa-palette', title: 'Instant Swatch Swap', desc: 'Test over 100+ lacquer finishes, veneers, and glass tints dynamically.' },
                { icon: 'fa-file-code', title: 'Direct CNC CAM Export', desc: 'Eliminates translation errors directly generating machine cutting files.' }
            ],
            specsTitle: 'Virtual Reality & CAD Modeling Standards',
            specsDesc: 'Sub-millimeter design audit protocols prior to factory cutting:',
            specs: [
                { val: '4K Ultra-HD', label: '3D Render Resolution' },
                { val: '0.1 mm', label: 'CAD Laser Tolerance' },
                { val: '100+ Textures', label: 'Material Library Swatches' },
                { val: '24-48 Hours', label: 'Initial Design Turnaround' }
            ],
            packages: [
                { tier: 'Single Room CAD', size: '1 Wardrobe / Kitchen', hardware: 'Photorealistic 3D perspectives, elevation plans', price: '$250' },
                { tier: 'Full Apartment VR', size: '2-3 Rooms Interior', hardware: 'Complete 3D model, interactive VR walkthrough link', price: '$600' },
                { tier: 'Villa Bespoke CAD', size: 'Entire Residence', hardware: 'Full architectural BIM/CAD drawings, 4K video render', price: '$1,200' }
            ]
        }
    };

    // Aliases
    servicesData['entertainment'] = servicesData['tv'];
    servicesData['mandir'] = servicesData['pooja'];
    servicesData['false-ceiling'] = servicesData['ceiling'];
    servicesData['kids-room'] = servicesData['kids'];
    servicesData['commercial'] = servicesData['other'];
    servicesData['sliding'] = servicesData['wardrobes'];
    servicesData['alcove'] = servicesData['wardrobes'];
    servicesData['vanity'] = servicesData['living'];
    servicesData['study'] = servicesData['other'];

    const urlParams = new URLSearchParams(window.location.search);
    const serviceKey = (urlParams.get('service') || 'wardrobes').toLowerCase().trim();

    const data = servicesData[serviceKey] || servicesData['wardrobes'];

    document.title = `${data.title} | Technical Specs | MODULARIS`;
    if (bannerTitle) bannerTitle.textContent = data.title;
    if (bannerDesc) bannerDesc.textContent = data.subtitle;
    if (mainHeading) mainHeading.textContent = data.heading;
    if (mainText) mainText.textContent = data.text;
    if (mainImg) {
        mainImg.src = data.img;
        mainImg.alt = data.title;
    }

    if (featuresGrid && Array.isArray(data.features)) {
        featuresGrid.innerHTML = data.features.map(f => `
            <div class="p-5 rounded-xl bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700">
                <i class="fa-solid ${f.icon} text-amber-600 text-xl mb-2"></i>
                <h4 class="font-bold text-stone-900 dark:text-white text-sm">${f.title}</h4>
                <p class="text-xs text-stone-500 dark:text-stone-400 mt-1">${f.desc}</p>
            </div>
        `).join('');
    }

    if (specsTitle && data.specsTitle) specsTitle.textContent = data.specsTitle;
    if (specsDesc && data.specsDesc) specsDesc.textContent = data.specsDesc;
    if (specsGrid && Array.isArray(data.specs)) {
        specsGrid.innerHTML = data.specs.map(s => `
            <div class="bg-white dark:bg-stone-900 p-3 rounded-xl border border-gray-200 dark:border-stone-700">
                <strong class="text-amber-600 block text-sm">${s.val}</strong>
                <span class="text-stone-500">${s.label}</span>
            </div>
        `).join('');
    }

    if (packagesHeading && data.title) {
        packagesHeading.textContent = `${data.title} - Rates & Packages`;
    }
    if (packagesTbody && Array.isArray(data.packages)) {
        packagesTbody.innerHTML = data.packages.map(p => `
            <tr class="border-b border-gray-200 dark:border-stone-800">
                <td class="p-3 font-bold">${p.tier}</td>
                <td class="p-3">${p.size}</td>
                <td class="p-3">${p.hardware}</td>
                <td class="p-3 text-amber-600 font-bold">${p.price}</td>
            </tr>
        `).join('');
    }
}


