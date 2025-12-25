// Modal Component - Reusable modal dialog
export class ModalComponent {
    constructor(options = {}) {
        this.id = options.id || `modal-${Date.now()}`;
        this.title = options.title || '';
        this.content = options.content || '';
        this.size = options.size || 'md'; // sm, md, lg, xl
        this.showCloseButton = options.showCloseButton !== false;
        this.showFooter = options.showFooter !== false;
        this.footerContent = options.footerContent || '';
        this.onClose = options.onClose || null;
        this.onShow = options.onShow || null;
        this.backdrop = options.backdrop !== false; // true, false, 'static'
        this.keyboard = options.keyboard !== false;
        this.focus = options.focus !== false;
        this.modalInstance = null;
    }

    render() {
        const sizeClass = this.size !== 'md' ? `modal-${this.size}` : '';
        const backdropAttr = this.backdrop === 'static' ? 'data-bs-backdrop="static"' : '';
        const keyboardAttr = !this.keyboard ? 'data-bs-keyboard="false"' : '';

        return `
            <div class="modal fade" id="${this.id}" tabindex="-1" ${backdropAttr} ${keyboardAttr} aria-labelledby="${this.id}-label" aria-hidden="true">
                <div class="modal-dialog ${sizeClass}">
                    <div class="modal-content">
                        ${this.renderHeader()}
                        ${this.renderBody()}
                        ${this.showFooter ? this.renderFooter() : ''}
                    </div>
                </div>
            </div>
        `;
    }

    renderHeader() {
        if (!this.title && !this.showCloseButton) return '';

        return `
            <div class="modal-header">
                ${this.title ? `<h5 class="modal-title" id="${this.id}-label">${this.title}</h5>` : ''}
                ${this.showCloseButton ? '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' : ''}
            </div>
        `;
    }

    renderBody() {
        return `
            <div class="modal-body">
                ${this.content}
            </div>
        `;
    }

    renderFooter() {
        if (this.footerContent) {
            return `
                <div class="modal-footer">
                    ${this.footerContent}
                </div>
            `;
        }

        // Default footer with close button
        return `
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        `;
    }

    // Show the modal
    show() {
        let modalElement = document.getElementById(this.id);
        
        // If modal doesn't exist in DOM, render and add it
        if (!modalElement) {
            const modalHTML = this.render();
            const container = document.body;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = modalHTML;
            const newModalElement = tempDiv.firstElementChild;
            container.appendChild(newModalElement);
            modalElement = newModalElement;
        }
        
        if (modalElement) {
            // Remove existing event listeners to avoid duplicates
            const clonedElement = modalElement.cloneNode(true);
            modalElement.parentNode.replaceChild(clonedElement, modalElement);
            modalElement = clonedElement;
            
            this.modalInstance = new window.bootstrap.Modal(modalElement, {
                backdrop: this.backdrop,
                keyboard: this.keyboard,
                focus: this.focus
            });

            modalElement.addEventListener('shown.bs.modal', () => {
                if (this.onShow) this.onShow();
            });

            modalElement.addEventListener('hidden.bs.modal', () => {
                if (this.onClose) this.onClose();
                // Clean up: remove modal from DOM after hiding
                setTimeout(() => {
                    if (modalElement && modalElement.parentNode) {
                        modalElement.parentNode.removeChild(modalElement);
                    }
                }, 300);
            });

            this.modalInstance.show();
        }
    }

    // Hide the modal
    hide() {
        if (this.modalInstance) {
            this.modalInstance.hide();
        }
    }

    // Update modal content
    updateContent(content) {
        this.content = content;
        const bodyElement = document.querySelector(`#${this.id} .modal-body`);
        if (bodyElement) {
            bodyElement.innerHTML = content;
        }
    }

    // Static method to create confirmation modal
    static createConfirmation(options = {}) {
        const {
            title = 'Confirm Action',
            message = 'Are you sure you want to proceed?',
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            confirmVariant = 'primary',
            onConfirm,
            onCancel
        } = options;

        const footerContent = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${cancelText}</button>
            <button type="button" class="btn btn-${confirmVariant}" id="confirm-btn">${confirmText}</button>
        `;

        const modal = new ModalComponent({
            title,
            content: `<p class="mb-0">${message}</p>`,
            footerContent,
            backdrop: 'static',
            keyboard: false,
            onShow: () => {
                const confirmBtn = document.getElementById('confirm-btn');
                if (confirmBtn) {
                    confirmBtn.addEventListener('click', () => {
                        if (onConfirm) onConfirm();
                        modal.hide();
                    });
                }
            },
            onClose: onCancel
        });

        return modal;
    }

    // Static method to create alert modal
    static createAlert(options = {}) {
        const {
            title = 'Alert',
            message = '',
            type = 'info', // info, success, warning, danger
            buttonText = 'OK',
            onClose
        } = options;

        const alertClass = `alert alert-${type}`;
        const content = `<div class="${alertClass}" role="alert">${message}</div>`;

        return new ModalComponent({
            title,
            content,
            footerContent: `<button type="button" class="btn btn-primary" data-bs-dismiss="modal">${buttonText}</button>`,
            onClose
        });
    }

    // Static method to create loading modal
    static createLoading(options = {}) {
        const {
            message = 'Loading...',
            showBackdrop = true
        } = options;

        const content = `
            <div class="text-center py-4">
                <div class="spinner-border text-primary mb-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mb-0">${message}</p>
            </div>
        `;

        return new ModalComponent({
            content,
            showCloseButton: false,
            showFooter: false,
            backdrop: showBackdrop ? 'static' : false,
            keyboard: false
        });
    }
}