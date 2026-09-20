/**
 * Modular Wardrobe & Cabinet Maker - Core JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initToastSystem();
    initTheme();
    initDirection();
    initMobileNav();
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
});

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
    
    toast.innerHTML = `
        <div class="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <i class="fa-solid ${icon} text-base"></i>
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
                ltrLabel.className = 'ltr-label text-stone-400 dark:text-stone-500 opacity-60 font-semibold';
                rtlLabel.className = 'rtl-label font-extrabold text-amber-600 dark:text-amber-400';
            } else {
                ltrLabel.className = 'ltr-label font-extrabold text-amber-600 dark:text-amber-400';
                rtlLabel.className = 'rtl-label text-stone-400 dark:text-stone-500 opacity-60 font-semibold';
            }
        } else if (simpleLabel) {
            simpleLabel.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        }

        // Update directional icon representation (arrow points Left for RTL, Right for LTR)
        const dirIcon = btn.querySelector('.rtl-dir-icon');
        if (dirIcon) {
            const arrow = dirIcon.querySelector('.dir-arrow');
            if (arrow) {
                arrow.setAttribute('d', dir === 'rtl' ? 'M5 19h14m-10-4-4 4 4 4' : 'M5 19h14m-4-4 4 4-4 4');
            }
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
        const cardTarget = e.target.closest('.product-card img, .product-card h3');
        
        if (trigger || cardTarget) {
            const targetEl = trigger || cardTarget;
            if (targetEl.tagName === 'A' || targetEl.tagName === 'BUTTON' || cardTarget) {
                e.preventDefault();
            }

            const card = targetEl.closest('.product-card, .product-item');
            if (card) {
                const title = card.querySelector('h3')?.innerText.trim() || 'Modular Cabinetry System';
                const imgEl = card.querySelector('img');
                const imgSrc = imgEl?.src || 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800&auto=format&fit=crop';
                const imgAlt = imgEl?.alt || title;

                const spans = Array.from(card.querySelectorAll('span'));
                let tag1 = 'Modern Minimalist';
                let tag2 = 'Premium Spec';
                spans.forEach(s => {
                    const txt = s.innerText.trim();
                    if (txt && !txt.includes('From') && !txt.includes('$') && !txt.includes('SPEC') && txt.length < 35) {
                        if (tag1 === 'Modern Minimalist') tag1 = txt;
                        else if (tag2 === 'Premium Spec') tag2 = txt;
                    }
                });

                const subtext = card.querySelector('.text-amber-600')?.innerText.trim() || '';
                const descP = Array.from(card.querySelectorAll('p')).find(p => !p.classList.contains('text-amber-600'))?.innerText.trim() || 'Bespoke modular joinery layout engineered with precision hardware and soft-close dampers.';
                const price = card.querySelector('strong')?.innerText.trim() || '$2,800';

                openProductModal(modal, title, imgSrc, imgAlt, tag1, tag2, subtext, descP, price);
            } else {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                showToast('3D Interactive Viewer', 'Loaded photorealistic 3D layout model', 'fa-cube');
            }
        }
    });

    // Handle close modal events (close button or backdrop click)
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.close-modal-btn')) {
            e.preventDefault();
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    });
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
    
    // Check for numbers
    if (/\d/.test(value)) {
        const errorMsg = 'Name cannot contain numbers. Please enter letters only.';
        input.setCustomValidity(errorMsg);
        if (showErrorToast) showToast('Invalid Name', errorMsg, 'fa-triangle-exclamation');
        return false;
    }
    
    // Check minimum length (must be at least 2 characters)
    if (value.length < 2) {
        const errorMsg = 'Name must be at least 2 letters long.';
        input.setCustomValidity(errorMsg);
        if (showErrorToast) showToast('Invalid Name', errorMsg, 'fa-triangle-exclamation');
        return false;
    }
    
    // Check for allowed characters only (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[A-Za-zÀ-ÿ\s'-]{2,60}$/;
    if (!nameRegex.test(value)) {
        const errorMsg = 'Name can only contain letters, spaces, hyphens, and apostrophes.';
        input.setCustomValidity(errorMsg);
        if (showErrorToast) showToast('Invalid Name', errorMsg, 'fa-triangle-exclamation');
        return false;
    }
    
    // Check that it contains at least 2 alphabetic characters
    const letterCount = (value.match(/[A-Za-zÀ-ÿ]/g) || []).length;
    if (letterCount < 2) {
        const errorMsg = 'Name must contain at least 2 letters.';
        input.setCustomValidity(errorMsg);
        if (showErrorToast) showToast('Invalid Name', errorMsg, 'fa-triangle-exclamation');
        return false;
    }
    
    input.setCustomValidity('');
    return true;
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
        if (!input.getAttribute('minlength')) input.setAttribute('minlength', '2');
        if (!input.getAttribute('pattern')) input.setAttribute('pattern', "^[A-Za-zÀ-ÿ\\s'-]{2,60}$");
        input.setAttribute('title', 'Please enter a valid name (at least 2 letters, no numbers)');
        
        input.addEventListener('input', () => {
            validateNameField(input, false);
        });
        
        input.addEventListener('blur', () => {
            validateNameField(input, false);
            if (!input.checkValidity() && input.value.trim().length > 0) {
                input.reportValidity();
            }
        });
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
        input.setAttribute('title', 'Please enter a valid phone number with 7 to 15 digits (numbers only, no letters)');
        input.setAttribute('inputmode', 'tel');
        
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
/* 15. Dynamic Service Details Page Renderer                                  */
/* -------------------------------------------------------------------------- */
function initServiceDetailsDynamic() {
    const bannerTitle = document.getElementById('service-banner-title');
    const bannerDesc = document.getElementById('service-banner-desc');
    const mainImg = document.getElementById('service-main-img');
    const mainHeading = document.getElementById('service-main-heading');
    const mainText = document.getElementById('service-main-text');

    if (!bannerTitle) return;

    const servicesData = {
        'wardrobes': {
            title: 'Bespoke Custom Wardrobes',
            subtitle: 'Tailor-made luxury wardrobe solutions configured precisely to your wardrobe inventory and bedroom layout.',
            heading: 'Next-Generation Wardrobe Architecture',
            text: 'Our modular wardrobe design service combines high-end European aesthetics with practical storage organization. Whether you require sliding frosted glass doors for compact apartments or floor-to-ceiling walk-in suites, every module is engineered for maximum space efficiency.',
            img: 'assets/custom-wardrobes.png'
        },
        'bedroom': {
            title: 'Integrated Bedroom Storage',
            subtitle: 'Custom bed backrests, floating nightstands, headboard shelving, and integrated vanity tables.',
            heading: 'Seamless Bedroom Joinery Integration',
            text: 'Transform your master bedroom with custom joinery that merges sleeping space with concealed storage. From floating nightstands with built-in wireless charging to upholstered backrest storage compartments, we craft elegant unified bedroom environments.',
            img: 'assets/bedroom-storage.png'
        },
        'kitchen': {
            title: 'Precision Kitchen Cabinetry',
            subtitle: 'High-capacity tall pull-out pantries, spice drawers, waterproof under-sink storage, and quartz countertops.',
            heading: 'Architectural Kitchen Cabinet Engineering',
            text: 'Designed for culinary enthusiasts and modern homes. Our kitchen cabinetry features soft-close Blum hardware, waterproof marine plywood carcases, and scratch-resistant acrylic lacquered fronts for flawless daily functionality.',
            img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop'
        },
        'walkin': {
            title: 'Luxury Walk-In Closet Suites',
            subtitle: 'Floor-to-ceiling walk-in closets with center island drawers, glass display doors, and velvet watch displays.',
            heading: 'Bespoke Boutique Wardrobe Suites',
            text: 'Experience the ultimate luxury of a private boutique dressing room. Features smoked glass display cases, integrated LED illumination, island jewelry displays, and dedicated shoe galleries.',
            img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1000&auto=format&fit=crop'
        },
        '3d-modeling': {
            title: '3D VR Space Modeling',
            subtitle: 'Interactive photorealistic 3D visualization and virtual reality walkthroughs before manufacturing.',
            heading: 'Precision 3D CAD & VR Rendering',
            text: 'Visualize your wardrobe or kitchen in millimeter-exact photorealistic 3D before a single panel is cut. Rotate materials, test lighting configurations, and explore layout variations interactively.',
            img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop'
        },
        'commercial': {
            title: 'Commercial Luxury Joinery',
            subtitle: 'Custom cabinetry for high-end boutique retail stores, executive offices, and luxury hospitality suites.',
            heading: 'Enterprise Architectural Joinery',
            text: 'High-durability commercial joinery engineered for heavy footfall environments. Includes luxury hotel wardrobe suites, executive boardrooms, retail display cases, and reception desks.',
            img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop'
        },
        'accessory-jewelry': {
            title: 'Italian Velvet Jewelry Trays',
            subtitle: 'Integrated biometric fingerprint locks, soft velvet lining, and watch pillow organizers.',
            heading: 'Biometric Velvet Jewelry & Watch Trays',
            text: 'Engineered with Italian anti-tarnish velvet lining, customizable compartment dividers, and built-in biometric fingerprint security locks. Perfect for luxury watches, rings, necklaces, and delicate accessories.',
            img: 'assets/italian-velvet-jewelry-trays.jpg'
        },
        'accessory-hydraulic': {
            title: 'Hydraulic Pull-Down Hanging Rods',
            subtitle: 'Smooth gas-lift hanging rods bringing upper wardrobe suits down to comfortable arm height.',
            heading: 'Ergonomic Gas-Lift Wardrobe Pull-Down Rods',
            text: 'Maximize high vertical storage space without needing step stools. Heavy-duty 15kg load capacity with soft-close return damping and ergonomic pull handle.',
            img: 'assets/hydraulic-pull-down-rods.png'
        },
        'accessory-shoes': {
            title: 'Sliding Angled Shoe Display Islands',
            subtitle: 'Sliding shoe shelves with heel-stop barriers and warm 3000K LED perimeter illumination.',
            heading: 'Bespoke Boutique Shoe Gallery Islands',
            text: 'Showcase up to 60 pairs of shoes in gallery style. Features 45-degree angled sliding shelves, non-slip aluminum heel stops, and integrated motion-sensor LED lighting.',
            img: 'assets/sliding-angled-shoe-islands.png'
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const serviceKey = urlParams.get('service') || 'wardrobes';

    const data = servicesData[serviceKey] || servicesData['wardrobes'];

    document.title = `${data.title} | Service Details | MODULARIS`;
    if (bannerTitle) bannerTitle.textContent = data.title;
    if (bannerDesc) bannerDesc.textContent = data.subtitle;
    if (mainHeading) mainHeading.textContent = data.heading;
    if (mainText) mainText.textContent = data.text;
    if (mainImg) mainImg.src = data.img;
}


