// Star Rating Component - Reusable star rating display and input
export class StarRatingComponent {
    constructor(options = {}) {
        this.rating = options.rating || 0;
        this.maxRating = options.maxRating || 5;
        this.readOnly = options.readOnly || true;
        this.size = options.size || 'md'; // sm, md, lg
        this.showValue = options.showValue !== false;
        this.onChange = options.onChange || null;
        this.interactive = !this.readOnly;
        this.hoveredRating = 0;
    }

    render() {
        const sizeClass = this.size === 'sm' ? 'small' : this.size === 'lg' ? 'large' : '';
        const starSize = this.size === 'sm' ? '1rem' : this.size === 'lg' ? '1.5rem' : '1.25rem';

        let html = `<div class="star-rating ${this.interactive ? 'interactive' : ''}" data-rating="${this.rating}">`;

        for (let i = 1; i <= this.maxRating; i++) {
            const isActive = i <= this.rating;
            const isHovered = this.interactive && i <= this.hoveredRating;
            const starClass = isHovered || (!this.interactive && isActive) ? 'active' : '';

            html += `
                <span
                    class="star ${starClass} ${sizeClass}"
                    data-value="${i}"
                    style="font-size: ${starSize}; cursor: ${this.interactive ? 'pointer' : 'default'};"
                    ${this.interactive ? `onmouseover="this.parentElement.starComponent.hoverStar(${i})"` : ''}
                    ${this.interactive ? `onmouseout="this.parentElement.starComponent.unhoverStar()"` : ''}
                    ${this.interactive ? `onclick="this.parentElement.starComponent.selectStar(${i})"` : ''}
                >
                    ${isHovered || (!this.interactive && isActive) ? '★' : '☆'}
                </span>
            `;
        }

        if (this.showValue) {
            html += `<span class="rating-value ms-2">${this.rating.toFixed(1)}</span>`;
        }

        html += '</div>';

        return html;
    }

    hoverStar(rating) {
        this.hoveredRating = rating;
        this.updateDisplay();
    }

    unhoverStar() {
        this.hoveredRating = 0;
        this.updateDisplay();
    }

    selectStar(rating) {
        if (!this.interactive) return;

        this.rating = rating;
        this.hoveredRating = 0;

        if (this.onChange) {
            this.onChange(rating);
        }

        this.updateDisplay();
    }

    updateDisplay() {
        const container = this.container;
        if (container) {
            // Store reference to this component
            container.starComponent = this;
            container.innerHTML = this.render();
        }
    }

    setRating(rating) {
        this.rating = Math.max(0, Math.min(this.maxRating, rating));
        this.updateDisplay();
    }

    getRating() {
        return this.rating;
    }

    // Static method to create a read-only rating display
    static display(rating, options = {}) {
        return new StarRatingComponent({
            rating,
            readOnly: true,
            ...options
        });
    }

    // Static method to create an interactive rating input
    static input(options = {}) {
        return new StarRatingComponent({
            readOnly: false,
            ...options
        });
    }

    // Mount the component to a container
    mount(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            this.container = container;
            container.starComponent = this;
            container.innerHTML = this.render();
        }
        return this;
    }
}