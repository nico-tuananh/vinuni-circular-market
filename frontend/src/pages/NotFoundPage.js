// Not Found Page Component
export class NotFoundPage {
    constructor() {
        this.container = document.getElementById('main-content');
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-md-6 text-center">
                        <div class="mb-4">
                            <span style="font-size: 6rem;">😵</span>
                        </div>
                        <h1 class="display-1 fw-bold">404</h1>
                        <h2 class="mb-4">Page Not Found</h2>
                        <p class="lead text-muted mb-4">
                            The page you're looking for doesn't exist or has been moved.
                        </p>
                        <button class="btn btn-primary btn-lg" onclick="window.App.router.navigate('/')">
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}