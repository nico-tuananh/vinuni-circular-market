// About Page Component
export class AboutPage {
    constructor() {
        this.container = document.getElementById('main-content');
    }

    get isAuthenticated() {
        const { globalState } = window;
        return globalState && !!globalState.get('user');
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <!-- Header Section -->
                        <div class="text-center mb-5">
                            <h1 class="display-4 fw-bold mb-3">About CampusCircle</h1>
                            <p class="lead text-muted">
                                A sustainable marketplace by VinUnians, for VinUnians
                            </p>
                        </div>

                        <!-- Mission Section -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h3 mb-4">
                                    <i class="bi bi-bullseye text-primary me-2"></i>Our Mission
                                </h2>
                                <p class="mb-3">
                                    CampusCircle is dedicated to creating a sustainable, circular economy within the VinUni community. 
                                    We empower students to buy, sell, lend, and share resources, reducing waste and fostering 
                                    connections among fellow students.
                                </p>
                                <p class="mb-0">
                                    By promoting reuse and sharing, we're building a more sustainable campus while helping students 
                                    save money and build meaningful connections.
                                </p>
                            </div>
                        </div>

                        <!-- Features Section -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h3 mb-4">
                                    <i class="bi bi-star-fill text-primary me-2"></i>What We Offer
                                </h2>
                                <div class="row g-4">
                                    <div class="col-md-6">
                                        <div class="d-flex">
                                            <div class="flex-shrink-0">
                                                <i class="bi bi-cart-check fs-3 text-primary"></i>
                                            </div>
                                            <div class="flex-grow-1 ms-3">
                                                <h5 class="mb-2">Buy & Sell</h5>
                                                <p class="text-muted mb-0">
                                                    List items you no longer need or find great deals on textbooks, 
                                                    electronics, furniture, and more from fellow students.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="d-flex">
                                            <div class="flex-shrink-0">
                                                <i class="bi bi-arrow-left-right fs-3 text-primary"></i>
                                            </div>
                                            <div class="flex-grow-1 ms-3">
                                                <h5 class="mb-2">Lend & Borrow</h5>
                                                <p class="text-muted mb-0">
                                                    Share resources temporarily with other students. Perfect for items 
                                                    you only need occasionally or want to help others access.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="d-flex">
                                            <div class="flex-shrink-0">
                                                <i class="bi bi-shield-check fs-3 text-primary"></i>
                                            </div>
                                            <div class="flex-grow-1 ms-3">
                                                <h5 class="mb-2">Secure & Verified</h5>
                                                <p class="text-muted mb-0">
                                                    All users are verified VinUni students, ensuring a safe and 
                                                    trustworthy marketplace environment.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="d-flex">
                                            <div class="flex-shrink-0">
                                                <i class="bi bi-heart-fill fs-3 text-primary"></i>
                                            </div>
                                            <div class="flex-grow-1 ms-3">
                                                <h5 class="mb-2">Community Driven</h5>
                                                <p class="text-muted mb-0">
                                                    Built by students, for students. Connect with your peers, 
                                                    share resources, and contribute to a sustainable campus.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Values Section -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h3 mb-4">
                                    <i class="bi bi-lightbulb text-primary me-2"></i>Our Values
                                </h2>
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <div class="text-center p-3">
                                            <i class="bi bi-recycle fs-1 text-success mb-3"></i>
                                            <h5>Sustainability</h5>
                                            <p class="text-muted small mb-0">
                                                Promoting circular economy principles
                                            </p>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="text-center p-3">
                                            <i class="bi bi-people fs-1 text-primary mb-3"></i>
                                            <h5>Community</h5>
                                            <p class="text-muted small mb-0">
                                                Building connections among students
                                            </p>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="text-center p-3">
                                            <i class="bi bi-shield-check fs-1 text-info mb-3"></i>
                                            <h5>Trust</h5>
                                            <p class="text-muted small mb-0">
                                                Ensuring verified and secure transactions
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Contact Section -->
                        <div class="card shadow-custom">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h3 mb-4">
                                    <i class="bi bi-envelope text-primary me-2"></i>Get in Touch
                                </h2>
                                <p class="mb-3">
                                    Have questions, suggestions, or feedback? We'd love to hear from you!
                                </p>
                                <div class="mb-3">
                                    <strong>Email:</strong>
                                    <a href="mailto:campuscircle@vinuni.edu.vn">
                                        campuscircle@vinuni.edu.vn
                                    </a>
                                </div>
                                <div class="mb-0">
                                    <strong>Address:</strong>
                                        VinUniversity, Vinhomes Ocean Park, Gia Lam Ward, Hanoi, Vietnam
                                </div>
                            </div>
                        </div>

                        <!-- Call to Action -->
                        ${!this.isAuthenticated ? `
                        <div class="text-center mt-5">
                            <h3 class="mb-3">Ready to Get Started?</h3>
                            <p class="text-muted mb-4">
                                Join the CampusCircle community today and start buying, selling, and sharing!
                            </p>
                            <div class="d-flex gap-3 justify-content-center">
                                <a href="#" onclick="window.App.router.navigate('/register')" class="btn btn-primary btn-lg">
                                    <i class="bi bi-person-plus me-2"></i>Create Account
                                </a>
                                <a href="#" onclick="window.App.router.navigate('/listings')" class="btn btn-outline-primary btn-lg">
                                    <i class="bi bi-search me-2"></i>Browse Listings
                                </a>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
}